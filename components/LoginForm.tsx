'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {LoginFormSchema} from "@/lib/schemas"
import {z} from "zod";
import {Eye, EyeClosed, GithubIcon} from 'lucide-react'
import {DEFAULT_LOGIN_REDIRECT} from "@/lib/routes";
import {useSearchParams} from "next/navigation";

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
import {githubLogin, credentialLogin} from "@/app/actions/auth/login";
import {Message} from "@/components/Message";
import {Separator} from "@/components/ui/separator";

interface messageType {
    message: string;
    type: 'success' | 'error' | '';
}

export const LoginForm = () => {
    const searchParams = useSearchParams()
    const [showPassword, setShowPassword] = React.useState(false)
    const [message, setMessage] = React.useState<messageType>({message: "", type: ""});

    useEffect(() => {
        if (searchParams.has('error') && searchParams.get('error') === 'OAuthAccountNotLinked') {
            setMessage({message: 'Another account already exists with the same email address.', type: 'error'});
        } else if(searchParams.has('error')) {
            setMessage({message: 'An error occurred while logging in.', type: 'error'});
        }
    }, [searchParams])

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
        await credentialLogin(values).then((response) => {
            if (response.code === 200) {
                setMessage({message: response.data.message, type: 'success'})
                setTimeout(() => {
                    window.location.href = DEFAULT_LOGIN_REDIRECT
                }, 2000)
            } else {
                setMessage({message: response.error?.message || '', type: 'error'})
            }
        }).finally(() => {
            setInterval(() => {
                clearMessage()
            }, 5000)
        })
    }

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
                                    <Input placeholder="email" type={'email'} {...field} />
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
                                               type={showPassword ? 'text' : 'password'} {...field} />
                                        <Button variant={'ghost'} className={'absolute top-0 right-0'} type={'button'}
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
                    <Button type="submit" variant={'default'} className={'w-full'}>Submit</Button>
                </form>
            </Form>
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
                    await githubLogin()
                }}
            >
                <GithubIcon className="mr-2 h-4 w-4"/>
                Continue with GitHub
            </Button>
        </>
    );
}