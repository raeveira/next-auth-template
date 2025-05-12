"use client"
import {useSession} from "next-auth/react"
import React, {useEffect, useRef, useState} from "react"
import {Message} from "@/components/Message"
import type {messageType} from "@/lib/interfaces"
import {getServerSession} from "@/app/actions/auth/getServerSession"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {ArrowLeft, Camera, Loader2} from "lucide-react"
import Link from "next/link"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {ProfileFormSchema, type ProfileFormValues} from "@/lib/schemas"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {User} from "@prisma/client";
import {getUser} from "@/app/actions/getUser";
import {updateUser} from "@/app/actions/updateUser";

/**
 * Edit Profile page component.
 * Allows users to update their profile information.
 *
 * @returns JSX.Element
 */
const EditProfilePage = () => {
    const [message, setMessage] = React.useState<messageType>({message: "", type: ""})
    const {data: session, status, update} = useSession()
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [user, setUser] = useState<Partial<User>| null>(null)

    console.log(session)

    // Initialize the form
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            name: "",
            username: "",
            bio: "",
            image: undefined,
        },
    })

    // Update form default values when session is loaded
    useEffect(() => {
        if (!user) return
        if (!session) return

        if (session?.user) {
            form.reset({
                name: session.user.name || "",
                username: session.user.username || "",
                bio: user.bio || "",
            })
            setImagePreview(session.user.image || null)
        }
    }, [session, form, user])

    useEffect(() => {
        const retrieveUser = async () => {
            if (!session) return
            const response = await getUser(session.user.id)

            setUser(response)
        }

        if (session) retrieveUser()
    }, [session]);

    /**
     * Fetch the user's session from the server.
     *
     * This function is used to fetch the user's session from the server.
     *
     * @returns void
     */
    useEffect(() => {
        const fetchServerSession = async () => {
            await update(await getServerSession())
        }

        if (status === "unauthenticated") {
            fetchServerSession()
        }
    }, [status, update])

    /**
     * Handle image change
     *
     * @param e ChangeEvent<HTMLInputElement>
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Update form value
            form.setValue("image", file)

            // Create preview URL
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    /**
     * Handle form submission
     *
     * @param values ProfileFormValues
     */
    const onSubmit = async (values: ProfileFormValues) => {
        console.log("Form submitted with values:", values, imagePreview)
        if (!user) return
        if (!session) return
        if (!user.name) return
        if (!user.image) return

        await updateUser(session.user.id, {
            image: user.image,
            bio: user.bio || null,
            name: user.name,
            username: user.username || null
        }, {
            image: imagePreview,
            username: values.username,
            bio: values.bio || null,
            name: values.name,
        }).then(async (response) => {
            if (response.data) {
                console.log("UPDATED SESSION: ", {...session, user: response.data.user})
                await update({
                    ...session,
                    user: {...session.user, ...response.data.user}
                });
                setMessage({message: response.data.message || '', type: 'success'})
            } else {
                setMessage({message: response.error?.message || '', type: 'error'})
            }
        })
    }

    /**
     * Clear the message.
     *
     * This function is used to clear the message state.
     *
     * @returns void
     */
    const clearMessage = () => {
        setMessage({message: "", type: ""})
    }

    if (status === "loading") {
        return (
            <div className="flex items-center justify-center w-full h-screen flex-col gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground">Loading... If this takes too long, please try refreshing the
                    page.</p>
            </div>
        )
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex items-center justify-center w-full h-screen flex-col gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                <p className="text-muted-foreground">
                    Checking authentication... If this takes too long, please try refreshing the page.
                </p>
            </div>
        )
    }

    return (
        <div className="container max-w-2xl mx-auto py-8 px-4">
            <Message message={message.message} type={message.type} onCloseAction={clearMessage}/>

            {status === "authenticated" && (
                <div className="space-y-8">
                    <div className="flex items-center gap-2">
                        <Link href="/">
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-5 w-5"/>
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Edit Profile</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your profile details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Profile Image Section */}
                                    <div className="flex flex-col items-center gap-4 pb-6 border-b">
                                        <div className="relative group">
                                            <Avatar className="h-32 w-32 cursor-pointer">
                                                <AvatarImage src={imagePreview || ""}
                                                             alt={session.user.name || "Profile"}/>
                                                <AvatarFallback className="text-4xl">
                                                    {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                                                </AvatarFallback>
                                                <div
                                                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    <Camera className="h-8 w-8 text-white"/>
                                                </div>
                                            </Avatar>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        <Button type="button" variant="outline" size="sm"
                                                onClick={() => fileInputRef.current?.click()}>
                                            Change Profile Picture
                                        </Button>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your name" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Username</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Your username" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your public display name. It can only contain letters,
                                                    numbers, and underscores.
                                                </FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="bio"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Bio</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Write a short bio about yourself"
                                                        className="min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>Write a short bio about yourself. Maximum 160
                                                    characters.</FormDescription>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end gap-2">
                                        <Link href="/">
                                            <Button type="button" variant="outline">
                                                Cancel
                                            </Button>
                                        </Link>
                                        <Button type="submit">Save Changes</Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default EditProfilePage

