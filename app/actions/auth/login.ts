'use server'
import {signIn} from "@/auth";

export const login = async (data: { email: string, password: string }) => {

    try {
        const response = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });

        console.log(response);

        if (response.ok) {
            return ({data: {message: "Logged in successfully"}, code: 200, errorType: ''});
        } else {
            return ({error: {message: "Invalid credentials", code: 401, errorType: 'UNAUTHORIZED'}});
        }

    } catch (e) {
        console.error(e);
        return ({error: {message: "An error occurred", code: 500, errorType: 'INTERNAL_SERVER_ERROR'}});
    }

}