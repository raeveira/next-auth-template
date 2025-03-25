'use server'
import {signIn} from "@/auth";

/*
* Log the user in using their credentials.
*
* This function is used to log the user in using their credentials.
*
* @param data - object The user's credentials.
* @innerparam data.email - string The user's email.
* @innerparam data.password - string The user's password.
* @returns The user session or an error.
* */
export const credentialLogin = async (data: { email: string, password: string }) => {
    try {
        const response = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });
        
        if (response) {
            return ({data: {message: "Logged in successfully"}, code: 200, errorType: ''});
        } else {
            return ({error: {message: "Invalid credentials", code: 401, errorType: 'UNAUTHORIZED'}});
        }

    } catch (e: unknown) {
        const stringifiedError = JSON.stringify(e, null, 2)
        const parsedError = JSON.parse(stringifiedError)
        console.error(parsedError.type)

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