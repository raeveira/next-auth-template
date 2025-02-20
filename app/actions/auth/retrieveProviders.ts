'use server'
import {retrieveAllConnectedProviders} from "@/prisma/script";
import {Account} from '@prisma/client'

export const retrieveProviders = async (userId: string): Promise<Account[] | {error: {message: string, code: number, errorType: string}}> => {
    const providers = await retrieveAllConnectedProviders(userId);

    if (providers) {
        return providers;
    }

    return {error: {message: "No providers found", code: 404, errorType: 'NOT_FOUND'}};
}