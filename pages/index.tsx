import { useSession } from "next-auth/react"
import Layout from "../components/Layout"

export default function Home() {
  const { data: session } = useSession()

  return (
    <Layout>
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              {session ? `Welcome, ${session.user.name}!` : "Welcome to Palette Pal"}
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {session ? (
              <div className="px-4 py-8 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                  {/* Add dashboard content here */}
                </div>
              </div>
            ) : (
              <div className="px-4 py-8 sm:px-0">
                <p className="text-xl text-gray-700">
                  Palette Pal is the ultimate tool for freelance designers. Sign in to get started!
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  )
}

