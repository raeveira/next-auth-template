"use client"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import React, { useEffect } from "react"
import { Message } from "@/components/Message"
import type { messageType } from "@/lib/interfaces"
import { getServerSession } from "@/app/actions/auth/getServerSession"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Settings, Edit } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {User} from "@prisma/client";
import {getUser} from "@/app/actions/getUser";
import {cn} from "@/lib/utils";

/**
 * This is the home page component.
 * It displays the user's profile in a social media style layout.
 *
 * @returns JSX.Element
 */
const Home = () => {
  const [message, setMessage] = React.useState<messageType>({ message: "", type: "" })
  const { data: session, status, update } = useSession()
  const [user, setUser] = React.useState<Partial<User> | null>()

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

  useEffect(() => {
    const fetchUser = async () => {
      if(session) {
        const response = await getUser(session.user.id)
        setUser(response)
      }
    }

    fetchUser()
  }, [session]);

  /**
   * Clear the message.
   *
   * This function is used to clear the message state.
   *
   * @returns void
   */
  const clearMessage = () => {
    setMessage({ message: "", type: "" })
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading... If this takes too long, please try refreshing the page.</p>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center w-full h-screen flex-col gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          Checking authentication... If this takes too long, please try refreshing the page.
        </p>
      </div>
    )
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Message message={message.message} type={message.type} onCloseAction={clearMessage} />

      {status === "authenticated" && (
        <div className="space-y-8">
          {/* Header with settings button */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Profile</h1>
            <div className="flex gap-2">
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Profile header */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-2 border-background shadow-md select-none pointer-events-none">
              <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
              <AvatarFallback className="text-3xl">
                {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h2 className="text-xl font-semibold">{session.user.name || "User"}</h2>
                  <Link href="/edit/profile">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="h-3 w-3" />
                      Edit Profile
                    </Button>
                  </Link>
                </div>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>

              <p className={'text-sm tracking-tighter monospace'}>{user?.website || ""}</p>
              <p className={cn("text-sm", !user?.bio && "italic")}>{user?.bio || "No bio yet. Edit your profile to add one."}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home

