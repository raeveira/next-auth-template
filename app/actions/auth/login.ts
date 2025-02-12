'use server'
import {redirect} from "next/navigation";
import {signIn} from "@/auth";
import {DEFAULT_LOGIN_REDIRECT} from "@/lib/routes";

export const login = async (data: { email: string, password: string }) => {

    try {
        const response = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        });

        if (response.ok) {
            redirect(DEFAULT_LOGIN_REDIRECT);
        } else {
            return ({error: {message: "Invalid credentials", code: 401, errorType: 'UNAUTHORIZED'}});
        }

    } catch (e) {
        console.error(e);
        return ({error: {message: "An error occurred", code: 500, errorType: 'INTERNAL_SERVER_ERROR'}});
    }

}