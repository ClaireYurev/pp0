import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { ProjectForm } from "@/components/ProjectForm"

interface EditProjectPageProps {
  params: {
    projectId: string
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return notFound()

  const project = await prisma.project.findUnique({
    where: {
      id: params.projectId,
      freelancerId: session.user.id,
    },
  })

  if (!project) return notFound()

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Project</h1>
      <ProjectForm
        initialData={{
          projectName: project.projectName,
          projectDescription: project.projectDescription || "",
          status: project.status,
          currency: project.currency,
        }}
        projectId={project.id}
      />
    </div>
  )
}

