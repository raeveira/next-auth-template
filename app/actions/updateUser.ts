'use server'

import {updateUserInDatabase} from "@/prisma/script";
import path from "node:path";
import * as fs from "node:fs";

export const updateUser = async (userId: string, oldUser: {
    name: string,
    username: string | null,
    bio: string | null,
    website: string | null,
    image: string | null;
}, newUser: {
    name: string,
    username: string | null,
    bio: string | null,
    website: string | null,
    image: string | null;
}) => {

    if (typeof newUser.image === 'string' && newUser.image.startsWith('data:image')) {
        console.log("Saving image to file system");

        const publicDir = path.join(process.cwd(), 'public');
        const userDir = path.join(publicDir, 'users', userId, 'images');
        const timestamp = Date.now();
        const uniqueId = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const fileName = `${timestamp}-${uniqueId}.png`;
        const filePath = path.join(userDir, fileName);

        // Ensure the directory exists
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, {recursive: true});
        }

        // If the old user had an image, delete it
        if (oldUser.image) {
            const oldImagePath = path.join(publicDir, oldUser.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Extract the base64 data from the string
        const base64Data = newUser.image.split(',')[1];
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Save image to file system
        fs.writeFileSync(filePath, imageBuffer);

        // Store relative path in newUser.image
        newUser.image = `/users/${userId}/images/${fileName}`;
    }

    // Check which fields have changed
    const updatedFields: { [key: string]: string | null } = {};

    if (oldUser.name !== newUser.name) {
        updatedFields.name = newUser.name;
    }

    if (oldUser.username !== newUser.username) {
        updatedFields.username = newUser.username;
    }

    if (oldUser.bio !== newUser.bio) {
        updatedFields.bio = newUser.bio;
    }

    if (oldUser.website !== newUser.website) {
        updatedFields.website = newUser.website;
    }

    if (oldUser.image !== newUser.image) {
        updatedFields.image = newUser.image;
    }

    console.log(updatedFields);

    // Update user
    const response = await updateUserInDatabase(userId, updatedFields);

    if (response) {
        return {data: {message: "User updated successfully", code: 200, errorType: '', user: { ...oldUser, ...updatedFields }}};
    }

    return {error: {message: "An error occurred while updating user", code: 500, errorType: 'INTERNAL_SERVER_ERROR'}};
}
