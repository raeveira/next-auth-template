'use server'
import {retrieveProvider, unlinkProvider} from "@/prisma/script";

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