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
    const crypto = globalThis.crypto;

    // Trim and lowercase the email
    const trimmedEmail = email.trim().toLowerCase();

    // Convert the email to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(trimmedEmail);

    // Hash the email with SHA-256 using Web Crypto API
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashedEmail = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Construct Gravatar URL
    return `https://www.gravatar.com/avatar/${hashedEmail}?d=identicon`;
}