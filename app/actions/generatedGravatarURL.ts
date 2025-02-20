import crypto from 'crypto';

// Function to generate Gravatar URL
export async function generateGravatarURL(email: string) {
    // Trim and lowercase the email
    const trimmedEmail = email.trim().toLowerCase();

    // Hash the email with SHA-256
    const hashedEmail = crypto.createHash('sha256').update(trimmedEmail).digest('hex');

    // Construct Gravatar URL
    const gravatarURL = `https://www.gravatar.com/avatar/${hashedEmail}?d=identicon`;

    return gravatarURL;
}
