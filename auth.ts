import NextAuth from "next-auth"
import {prisma, retrieveUser, retrieveUserById} from "@/prisma/script";
import {PrismaAdapter} from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import {LoginFormSchema} from "@/lib/schemas";
import bcrypt from "bcrypt-edge";
import {SignInError} from "@auth/core/errors";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Passkey from "next-auth/providers/passkey";

export const {auth, handlers, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    providers: [
        Credentials({
            async authorize(credentials) {
                if (credentials === null) return null;

                try {
                    const parsedCredentials = LoginFormSchema.parse(credentials);

                    const user = await retrieveUser(parsedCredentials.email);

                    if (user && user.password) {
                        const isMatch = bcrypt.compareSync(parsedCredentials.password, user.password);
                        if (isMatch) {
                            return {
                                ...user
                            };
                        } else {
                            return null
                        }
                    } else {
                        console.log("User not found:", parsedCredentials.email);
                        // You could throw a custom error here
                        throw new SignInError({message: 'Invalid credentials', cause: 'User not found'})
                    }
                } catch (error) {
                    throw error
                }
            }
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        Passkey
    ],
    callbacks: {
        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.permission !== undefined) {
                session.user.permission = typeof token.permission === 'number' ? token.permission : undefined;
            }

            if (token.name) {
                session.user.name = token.name;
            }

            if (token.username) {
                session.user.username = typeof token.username === 'string' ? token.username : "";
            }

            if (token.image) {
                session.user.image = typeof token.image === 'string' ? token.image : "";
            }

            return session;
        },

        async jwt({token, trigger, session}) {
            if (!token.sub) return token;

            const user = await retrieveUserById(token.sub);

            if (user) {
                token.name = user.name || undefined;
                token.permission = user.permission;
                token.username = user.username || undefined;
                token.image = user.image || undefined;
            }

            if (trigger === "update") {
                return { ...token, ...session.user }
            }

            return token;
        },
    },
    pages: {
        signIn: "/auth",
    },
    trustHost: true,
    experimental: {enableWebAuthn: true},
})
