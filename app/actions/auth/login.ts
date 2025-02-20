'use server'
import {signIn} from "@/auth";
import {AuthError} from "next-auth";

export const credentialLogin = async (data: { email: string, password: string }) => {

    try {
        const response = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });

        console.log("response", response);

        if (response) {
            return ({data: {message: "Logged in successfully"}, code: 200, errorType: ''});
        } else {
            return ({error: {message: "Invalid credentials", code: 401, errorType: 'UNAUTHORIZED'}});
        }

    } catch (e: unknown) {
        const stringifiedError = JSON.stringify(e, null, 2)
        const parsedError = JSON.parse(stringifiedError)
        console.log(parsedError.type)

        if (parsedError.type === "AuthError") {
            return ({error: {message: "Invalid credentials", code: 401, errorType: 'UNAUTHORIZED'}})
        } else {
            return ({
                error: {
                    message: "An error occurred while logging in",
                    code: 500,
                    errorType: 'INTERNAL_SERVER_ERROR'
                }
            })
        }
    }
}

export const githubLogin = async () => {
    await signIn('github', {callbackUrl: '/api/auth/callback/github'})
}