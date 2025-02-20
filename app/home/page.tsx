'use client'
import {useSession} from "next-auth/react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {linkGithub} from "@/app/actions/auth/linkProviders";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {retrieveProviders} from "@/app/actions/auth/retrieveProviders";
import {unlinkProviders} from "@/app/actions/auth/unlinkProviders";
import {Account} from '@prisma/client'
import {Message} from "@/components/Message";
import {messageType} from "@/lib/interfaces";

const Dashboard = () => {
    const [message, setMessage] = React.useState<messageType>({message: "", type: ""});
    const {data: session, status} = useSession();
    const router = useRouter();
    const [providers, setProviders] = useState<Account[]>([]);

    useEffect(() => {
        const fetchProviders = async () => {
            if (session?.user) {
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

    const unlink = async (provider: string, userId: string) => {
        const response = await unlinkProviders(provider, userId)
        if (response.code !== 200) {
            console.error(response.error);
        } else {
            setProviders(providers.filter(p => p.provider !== provider));
            setMessage({message: response.data.message, type: 'success'});
        }
    }

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

    const clearMessage = () => {
        setMessage({message: "", type: ""})
    }

    return (
        <div>
            <Message message={message.message} type={message.type} onCloseAction={clearMessage}/>
            {status === "loading" && <p>Loading...</p>}
            {status === "unauthenticated" && <p>Access Denied</p>}
            {status === "authenticated" && (
                <>
                    <p>Access Granted</p>
                    <p>Welcome, {session.user.email}</p>
                    <Image src={session.user.image || '/default'} alt={session.user.name} width={100} height={100}
                    />
                    {providers.find(provider => provider.provider === 'github') ?
                        <Button onClick={() => unlink('github', session?.user.id)}>Unlink Github</Button> :
                        <Button onClick={() => link('github')}>Link Github</Button>}

                    <Button onClick={() => router.push('/logout')}>Sign Out</Button>
                </>
            )}
        </div>
    );
}

export default Dashboard;