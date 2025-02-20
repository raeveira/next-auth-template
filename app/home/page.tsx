'use client'
import {useSession} from "next-auth/react";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {linkGithub} from "@/app/actions/auth/linkProviders";
import {useRouter} from "next/navigation";


const Dashboard = () => {
    const {data: session, status} = useSession();
    const router = useRouter();

    return (
        <div>
            {status === "loading" && <p>Loading...</p>}
            {status === "unauthenticated" && <p>Access Denied</p>}
            {status === "authenticated" && (
                <>
                    <p>Access Granted</p>
                    <p>Welcome, {session.user.email}</p>
                    <Image src={session.user.image || '/default'} alt={session.user.name} width={100} height={100}
                    />
                    <Button onClick={() => linkGithub()}>Link Github</Button>
                    <Button onClick={() => router.push('/logout')}>Sign Out</Button>
                </>
            )}
        </div>
    );
}

export default Dashboard;