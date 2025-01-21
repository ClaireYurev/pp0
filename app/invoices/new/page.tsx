import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CreateInvoiceForm from "@/components/CreateInvoiceForm"

export default async function NewInvoicePage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const userId = Number.parseInt(session.user.id)
  const projects = await prisma.project.findMany({
    where: {
      freelancerId: userId,
    },
    select: {
      id: true,
      projectName: true,
    },
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Invoice</h1>
          <CreateInvoiceForm projects={projects} />
        </div>
      </main>
    </div>
  )
}

