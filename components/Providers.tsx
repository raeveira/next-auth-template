import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {linkGithub} from "@/app/actions/auth/linkProviders";
import {GithubIcon} from "lucide-react";
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
                    <Separator/>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-black">Or continue with</span>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full"
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