'use server'

import {createUser, retrieveUser} from "@/prisma/script";
import bcrypt from "bcryptjs";
import {generateGravatarURL} from "@/app/actions/generatedGravatarURL";

export const register = async (data: { email: string, name: string, password: string, confirmPassword: string }) => {
    try {
        const existingUser = await retrieveUser(data.email);
        if (existingUser) {
            return { error: {message: "Email already exists", code: 409, errorType: 'Conflict'} };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        console.log("hashedPassword", hashedPassword);

        const gravatarURL = await generateGravatarURL(data.email);

        const response = await createUser(data.email, data.name, gravatarURL, hashedPassword);

        console.log("response", response);

        if (response) {
            return ({data: {message: "User Created Successfully", code: 200, errorType: ''}});
        } else {
            return ({error: {message: "Invalid credentials", code: 401, errorType: 'UNAUTHORIZED'}});
        }

    } catch (e) {
        console.error("REGISTER ERROR: ", e);
        return ({error: {message: "An error occurred", code: 500, errorType: 'INTERNAL_SERVER_ERROR'}});
    }
}