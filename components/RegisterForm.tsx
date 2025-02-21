'use client'
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {RegisterFormSchema} from "@/lib/schemas"
import {z} from "zod";
import {Eye, EyeClosed} from 'lucide-react'

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
import {register} from "@/app/actions/auth/register";
import {Message} from "@/components/Message";
import {messageType} from "@/lib/interfaces";
import {Providers} from "@/components/Providers";

/*
* Register form component.
*
* It allows the user to register using their email and password.
*
* @returns JSX.Element
* */
export const RegisterForm = () => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
    const [message, setMessage] = React.useState<messageType>({message: "", type: ""});

    const form = useForm<z.infer<typeof RegisterFormSchema>>({
        resolver: zodResolver(RegisterFormSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: ""
        },
    });

    async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
        await register(values).then((response) => {

            if (response.data) {
                setMessage({message: response.data.message, type: 'success'})
                form.reset()
            }

            if (response.error) {
                setMessage({message: response.error.message, type: 'error'})
            }

        }).finally(() => {
            setInterval(() => {
                setMessage({message: "", type: ""})
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
                                    Your email address.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="name" type={'text'} {...field} />
                                </FormControl>
                                <FormDescription>
                                    Your full name.
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
                                    Your password must be at least 8 characters long.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Confirm password</FormLabel>
                                <FormControl>
                                    <div className={'relative'}>
                                        <Input placeholder="Confirm Password"
                                               type={showConfirmPassword ? 'text' : 'password'} {...field} />
                                        <Button variant={'ghost'} className={'absolute top-0 right-0'} type={'button'}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? (<Eye/>) : (<EyeClosed/>)}
                                        </Button>
                                    </div>
                                </FormControl>
                                <FormDescription>
                                    Please confirm your password.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" variant={'default'} className={'w-full'}>Submit</Button>
                </form>
            </Form>
            <Providers/>
        </>
    );
}