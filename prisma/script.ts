import {PrismaClient} from '@prisma/client'

export const prisma = new PrismaClient()

export const retrieveUser = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email
        }
    })
}

export const retrieveUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
};

export const createUser = async (email: string, name: string, gravatarURL: string, password: string) => {
    try {
        const user = prisma.user.create({
            data: {
                email,
                name,
                image: gravatarURL,
                password
            }
        });

        if(user) {
            return user;
        }

        return {error: "Failed to create user"};
    } catch (error) {
        console.error("ERROR CREATING USER: ", error)
        return { error: "An error occurred while creating the user" };
    }

};