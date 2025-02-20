'use server'
import {auth} from "@/auth";

export const getServerSession = async () => {
    return auth();
}
