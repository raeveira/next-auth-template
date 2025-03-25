'use client'
import {useSession} from "next-auth/react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {linkGithub} from "@/app/actions/auth/linkProviders";
import React, {useEffect, useState} from "react";
import {retrieveProviders} from "@/app/actions/auth/retrieveProviders";
import {unlinkProviders} from "@/app/actions/auth/unlinkProviders";
import {Account} from '@prisma/client'
import {Message} from "@/components/Message";
import {messageType} from "@/lib/interfaces";
import {getServerSession} from "@/app/actions/auth/getServerSession";
import {SignOutButton} from "@/components/auth/SignOutButton";

/*
* This is the home page component.
* It displays the user's information and allows them to link/unlink their Github account.
*
* @returns JSX.Element
* */
const Home = () => {
    const [message, setMessage] = React.useState<messageType>({message: "", type: ""});
    const {data: session, status, update} = useSession();
    const [providers, setProviders] = useState<Account[]>([]);

    /*
    * Fetch the user's connected providers.
    *
    * This function is used to fetch the user's connected providers.
    *
    * @returns void
    * */
    useEffect(() => {
        const fetchProviders = async () => {
            if (session?.user.id) {
                const response = await retrieveProviders(session.user.id);
                if ('error' in response) {
                    console.error(response.error);
                } else {
                    setProviders(response);
                }
            }
        }
        fetchProviders();
    }, [session]);

    /*
    * Fetch the user's session from the server.
    *
    * This function is used to fetch the user's session from the server.
    *
    * @returns void
    * */
    useEffect(() => {
        const fetchServerSession = async () => {
            await update(await getServerSession())
        }

        if (status === "unauthenticated") {
            fetchServerSession()
        }
    }, [status, update]);

    /*
    * Unlink the user's provider.
    *
    * This function is used to unlink the user's provider.
    *
    * @param provider - string The provider to unlink.
    * @param userId - string The user's ID.
    *
    * @returns void
    * */
    const unlink = async (provider: string, userId: string) => {
        const response = await unlinkProviders(provider, userId)
        if (response.code !== 200) {
            console.error(response.error);
        } else {
            setProviders(providers.filter(p => p.provider !== provider));
            setMessage({message: response.data.message, type: 'success'});
        }
    }

    /*
    * Link the user's provider.
    *
    * This function is used to link the user's provider.
    *
    * @param provider - string The provider to link.
    *
    * @returns void
    * */
    const link = async (provider: string) => {
        localStorage.setItem('selectedProvider', provider);

        switch (provider) {
            case 'github':
                await linkGithub();
                break;
            default:
                console.error(`Provider ${provider} not found`);
        }
    }

    /*
    * Check if the user has successfully linked a provider.
    *
    * This function is used to check if the user has successfully linked a provider.
    *
    * @returns void
    * */
    useEffect(() => {
        if (session && providers.length > 0) {
            setTimeout(() => {
                const storedProvider = localStorage.getItem('selectedProvider');
                if (storedProvider) {
                    const providerExists = providers.find(p => p.provider === storedProvider);
                    if (providerExists) {
                        setMessage({message: `Successfully linked ${storedProvider}`, type: 'success'});
                    }
                    localStorage.removeItem('selectedProvider');
                }
            }, 500);
        }
    }, [session, providers]);

    /*
    * Clear the message.
    *
    * This function is used to clear the message state.
    *
    * @returns void
    * */
    const clearMessage = () => {
        setMessage({message: "", type: ""})
    }

    return (
        <div>
            <Message message={message.message} type={message.type} onCloseAction={clearMessage}/>
            {status === "loading" && (
                <div className={'flex items-center justify-center w-full h-screen flex-col'}>
                    Loading... If this takes too long, please try refreshing the page.
                </div>

            )}
            {status === "unauthenticated" && (
                <div className={'flex items-center justify-center w-full h-screen flex-col'}>
                    Checking authentication... If this takes too long, please try refreshing the page.
                </div>
            )}
            {status === "authenticated" && (
                <>
                    <p>Access Granted</p>
                    <p>Welcome, {session.user.email}</p>
                    <Image src={session.user.image || '/default'} alt={session.user.name} width={100} height={100}
                    />
                    {providers.find(provider => provider.provider === 'github') ?
                        <Button onClick={() => unlink('github', session?.user.id)}>Unlink Github</Button> :
                        <Button onClick={() => link('github')}>Link Github</Button>}

                    <SignOutButton/>
                </>
            )}
        </div>
    );
}

export default Home;