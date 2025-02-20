'use client'
import {useSession} from "next-auth/react";
import Image from "next/image";


const Dashboard = () => {
    const {data: session, status} = useSession();

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
                </>
            )}
        </div>
    );
}

export default Dashboard;