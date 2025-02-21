import crypto from 'crypto';

/*
* Generate a Gravatar URL for a given email address
*
* This function is used to generate a Gravatar URL for a given email address.
*
* @param email - string The email address to generate the Gravatar URL for.
*
* @returns The Gravatar URL.
* */
export async function generateGravatarURL(email: string) {
    // Trim and lowercase the email
    const trimmedEmail = email.trim().toLowerCase();

    // Hash the email with SHA-256
    const hashedEmail = crypto.createHash('sha256').update(trimmedEmail).digest('hex');

    // Construct Gravatar URL
    const gravatarURL = `https://www.gravatar.com/avatar/${hashedEmail}?d=identicon`;

    return gravatarURL;
}
