import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import CreateProjectForm from "@/components/CreateProjectForm"

export default async function NewProjectPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Project</h1>
          <CreateProjectForm />
        </div>
      </main>
    </div>
  )
}

