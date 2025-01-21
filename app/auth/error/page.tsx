import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const error = searchParams?.error || "An error occurred"

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
        <p className="text-gray-600 mb-6">
          {error === "OAuthCallback"
            ? "There was a problem with the authentication callback. Please try again."
            : error === "OAuthCreateAccount"
              ? "There was a problem creating your account. Please try again."
              : "An unexpected authentication error occurred. Please try again."}
        </p>
        <Button asChild>
          <Link href="/auth/signin">Try Again</Link>
        </Button>
      </div>
    </div>
  )
}

