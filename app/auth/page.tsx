"use client"
import React, {Suspense} from "react"
import {LoginForm} from "@/components/LoginForm"
import {RegisterForm} from "@/components/RegisterForm"
import {Button} from "@/components/ui/button"
import Image from "next/image"

/*
* This is root page component.
*
* @returns JSX.Element
* */
export default function RootPage() {
    const [login, setLogin] = React.useState(true)

    return (
        <main className="min-h-screen flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 relative max-lg:hidden">
                <Image
                    width={1920}
                    height={1080}
                    src="/home-bg.png"
                    alt="Background"
                    priority
                    className={'object-cover w-full h-full'}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-white text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome</h1>
                        <p className="text-xl sm:text-2xl">Please login or register to continue</p>
                    </div>
                </div>
            </div>
            <div
                className="w-full h-screen lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-[#101010] text-white">
                <div
                    className="w-full max-w-md border-2 px-4 py-6 rounded-xl bg-[#101010] border-neutral-300 max-h-[80%] overflow-y-auto">
                    <div className={'w-full mb-8 flex items-center justify-center'}>
                        <Image src={'/logo-nbg.ico'} alt={'Logo Icon'} height={64} width={64}/>
                    </div>
                    <div className="w-full flex mb-6 space-x-2">
                        <Button
                            onClick={() => setLogin(true)}
                            variant="outline"
                            className={`flex-1 bg-[#101010] hover:bg-[#202020] text-white hover:text-white ${login ? "bg-[#202020]" : ""}`}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => setLogin(false)}
                            variant="outline"
                            className={`flex-1 bg-[#101010] hover:bg-[#202020] text-white hover:text-white ${!login ? "bg-[#202020]" : ""}`}
                        >
                            Register
                        </Button>
                    </div>
                    <Suspense fallback={<div>Loading...</div>}>
                        {login ? <LoginForm/> : <RegisterForm/>}
                    </Suspense>
                </div>
            </div>
        </main>
    )
}

