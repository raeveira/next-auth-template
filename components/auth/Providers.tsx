import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {linkGithub} from "@/app/actions/auth/linkProviders";
import { GithubIcon } from 'lucide-react';
import React from "react";

/*
* Providers component.
*
* This component is used to display the providers that the user can use to sign in.
*
* @returns JSX.Element
* */
export const Providers = () => {
    return (
        <>
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <Separator className="bg-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-[#131620] px-2 text-slate-400">Or continue with</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full border-slate-700 text-white bg-slate-800 hover:bg-slate-900 hover:text-white"
                onClick={async () => {
                    await linkGithub()
                }}
            >
                <GithubIcon className="mr-2 h-4 w-4"/>
                Continue with GitHub
            </Button>
        </>
    )
}
