import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import BriefForm from "@/components/BriefForm"

export default async function BriefDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const briefId = Number.parseInt(params.id)
  const brief = await prisma.brief.findUnique({
    where: { id: briefId },
    include: {
      project: true,
    },
  })

  if (!brief) {
    return <div>Brief not found</div>
  }

  const isClient = brief.clientId === Number.parseInt(session.user.id)

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{brief.title}</h1>
          <p className="mt-4 text-lg text-gray-500">Project: {brief.project.projectName}</p>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Brief Details</h3>
              <div className="mt-5 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Content</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{brief.content}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Created At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(brief.createdAt).toLocaleString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          {isClient && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">Edit Brief</h2>
              <BriefForm brief={brief} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

