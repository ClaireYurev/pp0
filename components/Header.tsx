"use client"

import type { User } from "next-auth"
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export function Header({ user }: { user: User }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center">
          <span className="text-gray-700 mr-4">{user.name}</span>
          <Button onClick={() => signOut({ callbackUrl: "/" })} variant="outline">
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}

