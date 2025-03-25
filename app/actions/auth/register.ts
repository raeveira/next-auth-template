'use server'

import {createUser, retrieveUser} from "@/prisma/script";
import bcrypt from "bcryptjs";
import {generateGravatarURL} from "@/app/actions/generatedGravatarURL";

/*
* Register a new user.
*
* This function is used to register a new user.
*
* @param data - object The user's registration data.
* @innerparam data.email - string The user's email.
* @innerparam data.name - string The user's name.
* @innerparam data.password - string The user's password.
*
* @returns The user session or an error.
* */
export const register = async (data: { email: string, name: string, password: string, confirmPassword: string }) => {
    try {
        const existingUser = await retrieveUser(data.email);
        if (existingUser) {
            return { error: {message: "Email already exists", code: 409, errorType: 'Conflict'} };
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const gravatarURL = await generateGravatarURL(data.email);

        const response = await createUser(data.email, data.name, gravatarURL, hashedPassword);

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