"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { RegisterFormSchema } from "@/lib/schemas"
import type { z } from "zod"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import { register } from "@/app/actions/auth/register"
import { Message } from "@/components/Message"
import type { messageType } from "@/lib/interfaces"
import { Providers } from "@/components/auth/Providers"

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
  const [message, setMessage] = React.useState<messageType>({ message: "", type: "" })

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    await register(values)
      .then((response) => {
        if (response.data) {
          setMessage({ message: response.data.message, type: "success" })
          form.reset()
        }

        if (response.error) {
          setMessage({ message: response.error.message, type: "error" })
        }
      })
      .finally(() => {
        setInterval(() => {
          setMessage({ message: "", type: "" })
        }, 5000)
      })
  }

  const clearMessage = () => {
    setMessage({ message: "", type: "" })
  }

  return (
    <>
      <Form {...form}>
        <Message message={message.message} type={message.type} onCloseAction={clearMessage} />
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type={"email"}
                    {...field}
                    className="bg-[#0f1219] border-slate-700 text-white"
                  />
                </FormControl>
                <FormDescription className="text-slate-400">Your email address.</FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your full name"
                    type={"text"}
                    {...field}
                    className="bg-[#0f1219] border-slate-700 text-white"
                  />
                </FormControl>
                <FormDescription className="text-slate-400">Your full name.</FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Password</FormLabel>
                <FormControl>
                  <div className={"relative"}>
                    <Input
                      placeholder="Create a password"
                      type={showPassword ? "text" : "password"}
                      {...field}
                      className="bg-[#0f1219] border-slate-700 text-white pr-10"
                    />
                    <Button
                      variant={"ghost"}
                      className={"absolute top-0 right-0 text-slate-400 hover:text-white !bg-transparent"}
                      type={"button"}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {!showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription className="text-slate-400">
                  Your password must be at least 8 characters long.
                </FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Confirm password</FormLabel>
                <FormControl>
                  <div className={"relative"}>
                    <Input
                      placeholder="Confirm your password"
                      type={showConfirmPassword ? "text" : "password"}
                      {...field}
                      className="bg-[#0f1219] border-slate-700 text-white pr-10"
                    />
                    <Button
                      variant={"ghost"}
                      className={"absolute top-0 right-0 text-slate-400 hover:text-white !bg-transparent"}
                      type={"button"}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {!showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormDescription className="text-slate-400">Please confirm your password.</FormDescription>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />
          <Button type="submit" className={"w-full bg-blue-600 hover:bg-blue-700 text-white"}>
            Create Account
          </Button>
        </form>
      </Form>
      <Providers />
    </>
  )
}

