import Credentials from "@auth/core/providers/credentials";
import Github from "@auth/core/providers/github";
import {NextAuthConfig} from "next-auth";
import {LoginFormSchema} from "@/lib/schemas";
import {retrieveUser} from "@/prisma/script";
import bcrypt from "bcryptjs";
import {SignInError} from "@auth/core/errors";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                if (credentials === null) return null;

                try {
                    const parsedCredentials = LoginFormSchema.parse(credentials);

                    const user = await retrieveUser(parsedCredentials.email);

                    if (user && user.password) {
                        const isMatch = await bcrypt.compare(parsedCredentials.password, user.password);
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
        })
    ],
    pages: {
        signIn: "/",
    },
    trustHost: true,
} satisfies NextAuthConfig