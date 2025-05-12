import { PrismaClient } from '@prisma/client'

/*
* Prisma client.
* */
export const prisma = new PrismaClient()

/*
* Retrieve user.
*
* This function is used to retrieve a user by their email.
*
* @param email - string The user's email.
*
* @returns The user or null.
* */
export const retrieveUser = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email
        }
    })
}

/*
* Retrieve user by ID.
*
* This function is used to retrieve a user by their ID.
*
* @param id - string The user's ID.
*
* @returns The user or null.
* */
export const retrieveUserById = async (id: string) => {
    return prisma.user.findUnique({
        where: {
            id
        }
    })
};

/*
* Create user.
*
* This function is used to create a user.
*
* @param email - string The user's email.
* @param name - string The user's name.
* @param gravatarURL - string The user's Gravatar URL.
* @param password - string The user's password.
*
* @returns The user or an error.
* */
export const createUser = async (email: string, name: string, username: string, gravatarURL: string, password: string) => {
    try {
        const user = prisma.user.create({
            data: {
                email,
                name,
                username,
                image: gravatarURL,
                password
            }
        });

        if (user) {
            return user;
        }

        return {error: "Failed to create user"};
    } catch (error) {
        console.error("ERROR CREATING USER: ", error)
        return {error: "An error occurred while creating the user"};
    }
};

/*
* Retrieve all connected providers.
*
* This function is used to retrieve all connected providers from said user.
*
* @param userId - string The user's ID.
*
* @returns The user's connected providers or an error.
* */
export const retrieveAllConnectedProviders = async (userId: string) => {
    return prisma.account.findMany({
        where: {
            userId
        }
    })
};

/*
* Retrieve provider.
*
* This function is used to retrieve a provider by their provider and providerAccountId.
*
* @param provider - string The provider.
* @param userId - string The user's ID.
*
* @returns The provider or null.
* */
export const retrieveProvider = async (provider: string, userId: string) => {
    return prisma.account.findFirst({
        where: {
            AND: {
                provider,
                userId
            }
        }
    })
};

/*
* Unlink provider.
*
* This function is used to unlink a provider from a user.
*
* @param provider - string The provider.
* @param providerAccountId - string The provider account ID.
*
* @returns The provider unlinked or an error.
* */
export const unlinkProvider = async (provider: string, providerAccountId: string) => {
    return prisma.account.delete({
        where: {
            provider_providerAccountId: {
                provider,
                providerAccountId,
            },
        },
    });
};

export const retrieveAllConnectedAuthenticators = async (userId: string) => {
    return prisma.authenticator.findMany({
        where: {
            userId
        }
    })
}

export const updateUserInDatabase = async (userId: string, data: { [key: string]: string | null; }) => {
    return prisma.user.update({
        where: {
            id: userId
        },
        data
    })
}