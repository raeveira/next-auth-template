import Credentials from "@auth/core/providers/credentials";
import {NextAuthConfig} from "next-auth";
import {LoginFormSchema} from "@/lib/schemas";
import {retrieveUser} from "@/prisma/script";
import bcrypt from "bcryptjs";

export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                if (credentials === null) return null;

                try {
                    const parsedCredentials = LoginFormSchema.parse(credentials);

                    const user = await retrieveUser(parsedCredentials.email);

                    if(user) {
                        const isMatch = await bcrypt.compare(parsedCredentials.password, user.password);
                        if(isMatch) {
                            return {
                                ...user
                            };
                        } else {
                            return null;
                        }
                    } else {
                        return null;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    return null
                }
            }
        })
    ],
    trustHost: true,
} satisfies NextAuthConfig