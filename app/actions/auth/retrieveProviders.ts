'use server'
import {retrieveAllConnectedProviders} from "@/prisma/script";
import {Account} from '@prisma/client'


/*
* Retrieve all connected providers.
*
* This function is used to retrieve all connected providers from said user.
*
* @param userId - string The user's ID.
*
* @returns The user's connected providers or an error.
* */
export const retrieveProviders = async (userId: string): Promise<Account[] | {error: {message: string, code: number, errorType: string}}> => {
    const providers = await retrieveAllConnectedProviders(userId);

    if (providers) {
        return providers;
    }

    return {error: {message: "No providers found", code: 404, errorType: 'NOT_FOUND'}};
}