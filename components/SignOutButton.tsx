"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from 'lucide-react'

/**
 * Sign out button component.
 *
 * This component is used to sign out the user.
 *
 * @returns JSX.Element
 */
export function SignOutButton() {
  return (
    <Button
      variant="destructive"
      onClick={() => signOut()}
      className="flex items-center gap-2"
    >
      <LogOut size={16} />
      Sign Out
    </Button>
  )
}
