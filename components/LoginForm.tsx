'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {LoginFormSchema} from "@/lib/schemas"
import {z} from "zod";
import {Eye, EyeClosed} from 'lucide-react'
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
import {Providers} from "@/components/Providers";

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
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" type={'email'} {...field}
                                           className={'bg-[#101010] hover:bg-[#202020] text-white hover:text-white'}/>
                                </FormControl>
                                <FormDescription>
                                    This is the email address you used when you signed up.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className={'relative'}>
                                        <Input placeholder="password"
                                               type={showPassword ? 'text' : 'password'} {...field}
                                               className={'bg-[#101010] hover:bg-[#202020] text-white hover:text-white'}/>
                                        <Button variant={'ghost'}
                                                className={'absolute top-0 right-0 hover:bg-transparent hover:text-[#ffffff80]'}
                                                type={'button'}
                                                onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? (<Eye/>) : (<EyeClosed/>)}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    This is your private password.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant={'outline'}
                            className={'w-full bg-[#101010] hover:bg-[#202020] text-white hover:text-white'}>Submit</Button>
                </form>
            </Form>
            <Providers/>
        </>
    );
}