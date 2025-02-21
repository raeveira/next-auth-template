'use server'
import {auth} from "@/auth";

/* Get the user session from the server.
*
* This function is used to get the user session from the server.
*
* @returns The user session or null.
*/
export const getServerSession = async () => {
    return auth();
}
