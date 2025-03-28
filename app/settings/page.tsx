"use client"
import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { retrieveAuthenticators, retrieveProviders } from "@/app/actions/auth/retrieveProviders"
import { unlinkProviders } from "@/app/actions/auth/unlinkProviders"
import type { Account, Authenticator } from "@prisma/client"
import { Message } from "@/components/Message"
import type { messageType } from "@/lib/interfaces"
import { getServerSession } from "@/app/actions/auth/getServerSession"
import { SignOutButton } from "@/components/SignOutButton"
import { linkGithub, linkGoogle } from "@/app/actions/auth/linkProviders"
import { signIn } from "next-auth/webauthn"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Github, ChromeIcon as Google, KeyRound, Loader2, Plus } from "lucide-react"
import Link from "next/link"

/**
 * Settings page component.
 * Contains account settings, security options, and connected accounts.
 *
 * @returns JSX.Element
 */
const SettingsPage = () => {
  const [message, setMessage] = React.useState<messageType>({ message: "", type: "" })
  const { data: session, status, update } = useSession()
  const [providers, setProviders] = useState<Account[]>([])
  const [authenticators, setAuthenticators] = useState<Authenticator[]>([])
  const [activeTab, setActiveTab] = useState("accounts")

  /**
   * Fetch the user's connected providers.
   *
   * This function is used to fetch the user's connected providers.
   *
   * @returns void
   */
  useEffect(() => {
    const fetchProviders = async () => {
      if (session?.user.id) {
        const response = await retrieveProviders(session.user.id)
        if ("error" in response) {
          console.error(response.error)
        } else {
          setProviders(response)
        }
      }
    }
    fetchProviders()
  }, [session])

  useEffect(() => {
    const fetchPassKey = async () => {
      if (session?.user.id) {
        const response = await retrieveAuthenticators(session.user.id)
        if ("error" in response) {
          console.error(response.error)
        } else {
          setAuthenticators(response)
        }
      }
    }

    fetchPassKey()
  }, [session])

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
   * Link a passkey to the user's profile.
   *
   * This function is used to link a passkey to the user's profile.
   *
   * @returns void.
   */
  const linkPassKey = async () => {
    await signIn("passkey", { action: "register" })
  }

  /**
   * Unlink the user's provider.
   *
   * This function is used to unlink the user's provider.
   *
   * @param provider - string The provider to unlink.
   * @param userId - string The user's ID.
   *
   * @returns void
   */
  const unlink = async (provider: string, userId: string) => {
    const response = await unlinkProviders(provider, userId)
    if (response.code !== 200) {
      console.error(response.error)
    } else {
      setProviders(providers.filter((p) => p.provider !== provider))
      setMessage({ message: response.data.message, type: "success" })
    }
  }

  /**
   * Link the user's provider.
   *
   * This function is used to link the user's provider.
   *
   * @param provider - string The provider to link.
   *
   * @returns void
   */
  const link = async (provider: string) => {
    localStorage.setItem("selectedProvider", provider)

    switch (provider) {
      case "github":
        await linkGithub()
        break
      case "google":
        await linkGoogle()
        break
      case "passkey":
        await linkPassKey()
        break
      default:
        console.error(`Provider ${provider} not found`)
    }
  }

  /**
   * Check if the user has successfully linked a provider.
   *
   * This function is used to check if the user has successfully linked a provider.
   *
   * @returns void
   */
  useEffect(() => {
    if (session && providers.length > 0) {
      setTimeout(() => {
        const storedProvider = localStorage.getItem("selectedProvider")
        if (storedProvider) {
          const providerExists = providers.find((p) => p.provider === storedProvider)
          if (providerExists) {
            setMessage({ message: `Successfully linked ${storedProvider}`, type: "success" })
          }
          localStorage.removeItem("selectedProvider")
        }
      }, 500)
    }
  }, [session, providers])

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
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Message message={message.message} type={message.type} onCloseAction={clearMessage} />

      {status === "authenticated" && (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            <SignOutButton />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="accounts" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Manage your connected social accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* GitHub Provider */}
                    <Card className="border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Github className="h-4 w-4" />
                          GitHub
                        </CardTitle>
                        <Badge
                          variant={providers.find((provider) => provider.provider === "github") ? "default" : "outline"}
                        >
                          {providers.find((provider) => provider.provider === "github") ? "Connected" : "Not Connected"}
                        </Badge>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        {providers.find((provider) => provider.provider === "github") ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => unlink("github", session?.user.id)}
                          >
                            Unlink GitHub
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full" onClick={() => link("github")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Link GitHub
                          </Button>
                        )}
                      </CardFooter>
                    </Card>

                    {/* Google Provider */}
                    <Card className="border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Google className="h-4 w-4" />
                          Google
                        </CardTitle>
                        <Badge
                          variant={providers.find((provider) => provider.provider === "google") ? "default" : "outline"}
                        >
                          {providers.find((provider) => provider.provider === "google") ? "Connected" : "Not Connected"}
                        </Badge>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        {providers.find((provider) => provider.provider === "google") ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full"
                            onClick={() => unlink("google", session?.user.id)}
                          >
                            Unlink Google
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="w-full" onClick={() => link("google")}>
                            <Plus className="mr-2 h-4 w-4" />
                            Link Google
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Passkeys</CardTitle>
                  <CardDescription>Manage your passkeys for passwordless authentication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={() => link("passkey")} className="w-full md:w-auto">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Register New Passkey
                  </Button>

                  {authenticators.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      <h3 className="text-sm font-medium">Your Passkeys ({authenticators.length})</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {authenticators.map((auth, index) => (
                          <Card key={index} className="border">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <KeyRound className="h-4 w-4" />
                                Passkey {auth.credentialDeviceType}
                              </CardTitle>
                              <Badge variant={auth.credentialBackedUp ? "default" : "outline"}>
                                {auth.credentialBackedUp ? "Backed Up" : "Not Backed Up"}
                              </Badge>
                            </CardHeader>
                            <CardContent className="pt-2 space-y-2">
                              <p className="text-xs text-muted-foreground">
                                ID: {auth.credentialID.substring(0, 8)}...
                              </p>
                              <p className="text-xs text-muted-foreground">Device Type: {auth.credentialDeviceType}</p>
                              {auth.transports && (
                                <p className="text-xs text-muted-foreground">Transports: {auth.transports}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-4">
                      You don&#39;t have any passkeys registered yet. Register a passkey for passwordless login.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}

export default SettingsPage

