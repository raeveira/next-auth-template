'use server'
import {retrieveUserById} from "@/prisma/script";

export const getUser = async (userId: string) => {
    const response = await retrieveUserById(userId);

    if (!response) {
        return { error: { message: "User not found", code: 404, errorType: 'NOT_FOUND' } };
    }

    return { image: response.image, bio: response.bio, name: response.name, website: response.website, username: response.username };
}