import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    permission: number | undefined;
    name: string;
    username: string;
    id: string;
    image: string;
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}

declare module "@auth/core/jwt" {
    interface JWT {
        permission?: number;
        name?: string;
        username?: string;
        image?: string;
    }
}