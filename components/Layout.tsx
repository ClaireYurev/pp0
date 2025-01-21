import type React from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                Palette Pal
              </Link>
            </div>
            <div className="flex items-center">
              {session ? (
                <>
                  <img
                    src={session.user.image || "/default-avatar.png"}
                    alt={session.user.name || "User"}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">{session.user.name}</span>
                  <button
                    onClick={() => signOut()}
                    className="ml-4 text-sm font-medium text-gray-700 hover:text-gray-500"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <Link href="/auth/signin" className="text-sm font-medium text-gray-700 hover:text-gray-500">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

export default Layout

