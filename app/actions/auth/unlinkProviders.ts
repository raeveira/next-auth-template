'use server'
import {retrieveProvider, unlinkProvider} from "@/prisma/script";

/*
* Unlink the user's provider.
*
* This function is used to unlink the user's provider.
*
* @param provider - string The provider to unlink.
* @param userId - string The user's ID.
*
* @returns The provider unlinked or an error.
* */
export const unlinkProviders = async (provider: string, userId: string) => {
    const account = await retrieveProvider(provider, userId);

    if (!account) {
        return {error: {message: "Provider not found", code: 404, errorType: 'NOT_FOUND'}};
    }

    const response = await unlinkProvider(provider, account.providerAccountId);

    if (response) {
        return {data: {message: "Provider unlinked successfully"}, code: 200, errorType: ''};
    } else {
        return {error: {message: "An error occurred while unlinking provider", code: 500, errorType: 'INTERNAL_SERVER_ERROR'}};
    }
};