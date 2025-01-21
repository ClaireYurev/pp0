import { Suspense } from "react"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { ProjectList, type Project } from "@/components/ProjectList"
import { ProjectFilters } from "@/components/ProjectFilters"
import type { Prisma } from "@prisma/client"

interface ProjectsPageProps {
  searchParams: {
    status?: string
    search?: string
    sort?: string
  }
}

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const where: Prisma.ProjectWhereInput = {
    OR: [{ freelancerId: session.user.id }, { clientId: session.user.id }],
    ...(searchParams.status && ["PLANNING", "IN_PROGRESS", "COMPLETED"].includes(searchParams.status)
      ? { status: searchParams.status as "PLANNING" | "IN_PROGRESS" | "COMPLETED" }
      : {}),
    ...(searchParams.search ? { projectName: { contains: searchParams.search, mode: "insensitive" } } : {}),
  }

  const orderBy: Prisma.ProjectOrderByWithRelationInput =
    searchParams.sort === "name" ? { projectName: "asc" } : { createdAt: "desc" }

  const projects = (await prisma.project.findMany({
    where,
    orderBy,
  })) as unknown as Project[]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <Button asChild>
          <Link href="/dashboard/projects/new">Create Project</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading filters...</div>}>
        <ProjectFilters />
      </Suspense>
      <ProjectList projects={projects} />
    </div>
  )
}

