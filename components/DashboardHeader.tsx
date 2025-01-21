"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome, {session?.user?.name}
          </h2>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-500 hover:text-gray-700">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/invoices" className="text-gray-500 hover:text-gray-700">
                  Invoices
                </Link>
              </li>
              <li>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-gray-500 hover:text-gray-700">
                  Sign Out
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

