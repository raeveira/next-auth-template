'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {LoginFormSchema} from "@/lib/schemas"
import {z} from "zod";
import {Eye, EyeClosed} from 'lucide-react'
import {DEFAULT_LOGIN_REDIRECT} from "@/lib/routes";

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
import React from "react";
import {login} from "@/app/actions/auth/login";
import {Message} from "@/components/Message";

interface messageType {
    message: string;
    type: 'success' | 'error' | '';
}

export const LoginForm = () => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [message, setMessage] = React.useState<messageType>({message: "", type: ""});

    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
        await login(values).then((response) => {
            if(response.code === 200) {
                setMessage({message: response.data.message, type: 'success'})
                setTimeout(() => {
                    window.location.href = DEFAULT_LOGIN_REDIRECT
                }, 2000)
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
        <Form {...form}>
            <Message message={message.message} type={message.type} onClose={clearMessage}/>
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
    );
}