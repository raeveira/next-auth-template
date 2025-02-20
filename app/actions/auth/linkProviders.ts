'use server'

import {signIn} from "@/auth";

export const linkGithub = async () => {
    await signIn('github', {callbackUrl: '/api/auth/callback/github'})
}