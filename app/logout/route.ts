'use server'

import {signOut} from "@/auth";
import {redirect} from "next/navigation";

export const GET = async () => {
    await signOut({
        redirect: false
    }).then(() => {
        redirect('/')
    });
}