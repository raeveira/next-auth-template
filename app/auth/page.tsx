"use client"
import React, {Suspense} from "react"
import {LoginForm} from "@/components/auth/LoginForm"
import {RegisterForm} from "@/components/auth/RegisterForm"
import {Button} from "@/components/ui/button"
import Image from "next/image"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/Logo"

/*
* This is root page component.
*
* @returns JSX.Element
* */
export default function AuthPage() {
    const [login, setLogin] = React.useState(true)

    return (
        <main className="min-h-screen flex flex-col lg:flex-row bg-[#0a0d14]">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute top-4 left-4 z-10"
            >
              <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </motion.div>

            <div className="w-full lg:w-1/2 relative max-lg:hidden">
                <Image
                    width={1920}
                    height={1080}
                    src="/home-bg.png"
                    alt="Background"
                    priority
                    className={'object-cover w-full h-full'}
                />
                <div className="absolute inset-0 bg-[#0a0d14] bg-opacity-70 flex items-center justify-center">
                    <div className="text-white text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Welcome to FlowMail</h1>
                        <p className="text-xl sm:text-2xl text-slate-300">Experience a new way to manage your communications</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-screen lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full max-w-md border border-slate-800 px-6 py-8 rounded-xl bg-[#131620]"
                >
                    <div className={'w-full mb-8 flex items-center justify-center'}>
                        <Logo size="lg" />
                    </div>
                    <div className="w-full flex mb-6 space-x-2">
                        <Button
                            onClick={() => setLogin(true)}
                            variant="ghost"
                            className={`flex-1 text-white hover:text-white hover:bg-slate-800 ${login ? "bg-slate-800" : "bg-transparent"}`}
                        >
                            Login
                        </Button>
                        <Button
                            onClick={() => setLogin(false)}
                            variant="ghost"
                            className={`flex-1 text-white hover:text-white hover:bg-slate-800 ${!login ? "bg-slate-800" : "bg-transparent"}`}
                        >
                            Register
                        </Button>
                    </div>
                    <Suspense fallback={<div className="text-center py-4 text-slate-300">Loading...</div>}>
                        {login ? <LoginForm/> : <RegisterForm/>}
                    </Suspense>
                </motion.div>
            </div>
        </main>
    )
}
