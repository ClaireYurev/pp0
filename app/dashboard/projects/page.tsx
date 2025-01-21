import { getServerSession } from "next-auth/next"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { ProjectList, type Project } from "@/components/ProjectList"

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  const mockProjects: Project[] = [
    { id: "1", name: "Website Redesign", status: "In Progress" },
    { id: "2", name: "Mobile App Development", status: "Planning" },
    { id: "3", name: "Brand Identity", status: "Completed" },
    { id: "4", name: "E-commerce Platform", status: "In Progress" },
    { id: "5", name: "SEO Optimization", status: "Planning" },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Projects</h1>
      <ProjectList projects={mockProjects} />
    </div>
  )
}

