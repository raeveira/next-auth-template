'use server'

import {signIn} from "@/auth";

/*
* Link the user's GitHub account to their profile.
*
* This function is used to link the user's GitHub account to their profile.
*
* @returns void.
* */
export const linkGithub = async () => {
    await signIn('github', {callbackUrl: '/api/auth/callback/github'})
}

/*
* Link the user's Google account to their profile.
*
* This function is used to link the user's Google account to their profile.
*
* @returns void.
* */
export const linkGoogle = async () => {
    await signIn('google', {callbackUrl: '/api/auth/callback/google'})
}