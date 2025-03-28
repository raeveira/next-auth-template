import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {linkGithub, linkGoogle} from "@/app/actions/auth/linkProviders";
import {GithubIcon, KeyIcon} from "lucide-react";
import GoogleIcon from '@/public/google.png'
import React from "react";
import Image from "next/image";
import {signIn} from "next-auth/webauthn";

/*
* Providers component.
*
* This component is used to display the providers that the user can use to sign in.
*
* @returns JSX.Element
* */
export const Providers = () => {
    const passkeyLogin = async () => {
        await signIn('passkey')
    }

    return (
        <>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <Separator/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#101010] px-2 text-white">Or continue with</span>
                </div>
            </div>

            <div className={'space-y-3'}>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-[#101010] hover:bg-[#202020] text-white hover:text-white"
                    onClick={async () => {
                        await linkGithub()
                    }}
                >
                    <GithubIcon className="mr-2 h-4 w-4"/>
                    Continue with GitHub
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-[#101010] hover:bg-[#202020] text-white hover:text-white"
                    onClick={async () => {
                        await linkGoogle()
                    }}
                >
                    <Image src={GoogleIcon} alt={'Google Icon'} height={16} width={16} className={'mr-2'}/>
                    Continue with Google
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-[#101010] hover:bg-[#202020] text-white hover:text-white"
                    onClick={async () => {
                        await passkeyLogin()
                    }}
                >
                    <KeyIcon className="mr-2 h-4 w-4"/>
                    Continue with Passkey
                </Button>
            </div>

        </>
    )
}