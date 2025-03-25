'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {LoginFormSchema} from "@/lib/schemas"
import {z} from "zod";
import { Eye, EyeOff } from 'lucide-react'
import {DEFAULT_LOGIN_REDIRECT} from "@/lib/routes";
import {useSearchParams, useRouter} from "next/navigation";

import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import React, {useEffect} from "react";
import {credentialLogin} from "@/app/actions/auth/login";
import {Message} from "@/components/Message";
import {messageType} from "@/lib/interfaces";
import {Providers} from "@/components/auth/Providers";

/*
* This is the login form component.
*
* It allows the user to log in using their email and password.
* Or they can continue with a provider account.
*
* @returns JSX.Element
* */
export const LoginForm = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [showPassword, setShowPassword] = React.useState(false)
    const [message, setMessage] = React.useState<messageType>({message: "", type: ""});

    /*
    * Retrieve the error message from the URL.
    *
    * This function is used to retrieve the error message from the URL.
    *
    * @returns void
    * */
    useEffect(() => {
        if (searchParams.has('error') && searchParams.get('error') === 'OAuthAccountNotLinked') {
            setMessage({message: 'Another account already exists with the same email address.', type: 'error'});
        } else if (searchParams.has('error')) {
            setMessage({message: 'An error occurred while logging in.', type: 'error'});
        }
    }, [searchParams])

    /*
    * Create a form instance.
    *
    * This function is used to create a form instance.
    *
    * @returns void
    * */
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    /*
    * Handle the form submission.
    *
    * This function is used to handle the form submission.
    *
    * @param values - object The form values.
    * @innerparam values.email - string The user's email.
    * @innerparam values.password - string The user's password.
    *
    * @returns void
    * */
    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
        await credentialLogin(values).then((response) => {
            if (response.code === 200) {
                setMessage({message: response.data.message, type: 'success'})
                router.push(DEFAULT_LOGIN_REDIRECT);
            } else {
                setMessage({message: response.error?.message || '', type: 'error'})
            }
        }).finally(() => {
            setInterval(() => {
                clearMessage()
            }, 5000)
        })
    }

    /*
    * Clear the message.
    *
    * This function is used to clear the message.
    *
    * @returns void
    * */
    const clearMessage = () => {
        setMessage({message: "", type: ""})
    }

    return (
        <>
            <Form {...form}>
                <Message message={message.message} type={message.type} onCloseAction={clearMessage}/>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-slate-300">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        type={'email'}
                                        {...field}
                                        className="bg-[#0f1219] border-slate-700 text-white"
                                    />
                                </FormControl>
                                <FormDescription className="text-slate-400">
                                    This is the email address you used when you signed up.
                                </FormDescription>
                                <FormMessage className="text-red-400"/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-slate-300">Password</FormLabel>
                                <FormControl>
                                    <div className={'relative'}>
                                        <Input
                                            placeholder="Enter your password"
                                            type={showPassword ? 'text' : 'password'}
                                            {...field}
                                            className="bg-[#0f1219] border-slate-700 text-white pr-10"
                                        />
                                        <Button
                                            variant={'ghost'}
                                            className={'absolute top-0 right-0 text-slate-400 hover:text-white !bg-transparent'}
                                            type={'button'}
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {!showPassword ? (<EyeOff className="h-4 w-4" />) : (<Eye className="h-4 w-4" />)}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription className="text-slate-400">
                                    This is your private password.
                                </FormDescription>
                                <FormMessage className="text-red-400"/>
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className={'w-full bg-blue-600 hover:bg-blue-700 text-white'}
                    >
                        Sign In
                    </Button>
                </form>
            </Form>
            <Providers/>
        </>
    );
}
