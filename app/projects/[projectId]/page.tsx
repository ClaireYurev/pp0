import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CreateBriefForm from "@/components/CreateBriefForm"
import type { Project } from "@prisma/client"

export default async function ProjectDetail({ params }: { params: { projectId: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const projectId = params.projectId // Use params.projectId directly as a string
  const project = (await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      briefs: true,
      proposals: true,
    },
  })) as Project | null

  if (!project) {
    redirect("/projects")
  }

  return (
    <div>
      <h1>{project.projectName}</h1>
      <CreateBriefForm projectId={projectId} />
    </div>
  )
}

