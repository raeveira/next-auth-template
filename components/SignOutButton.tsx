"use client"
import { signOut } from "next-auth/react"
import {Button} from "@/components/ui/button";

/*
* Sign out button component.
*
* This component is used to sign out the user.
*
* @returns JSX.Element
* */
export function SignOutButton() {
  return <Button onClick={() => signOut()}>Sign Out</Button>
}