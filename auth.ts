import NextAuth from "next-auth"
import authConfig from "@/auth.config";
import {prisma, retrieveUserById} from "@/prisma/script";
import {PrismaAdapter} from "@auth/prisma-adapter";

export const {auth, handlers, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt"},
    ...authConfig,
    callbacks: {
        async session({token, session}) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.permission !== undefined) {
                session.user.permission = token.permission;
            }

            if (token.name) {
                session.user.name = token.name;
            }

            return session;
        },

        async jwt({token}) {
            if (!token.sub) return token;

            const user = await retrieveUserById(token.sub);

            if (user) {
                token.name = user.name || undefined;
                token.permission = user.permission;
            }

            return token;
        }
    },
})
