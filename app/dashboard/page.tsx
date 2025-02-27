import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { IncomeChart } from "@/components/IncomeChart"
import { ProjectList, type Project } from "@/components/ProjectList"
import { QuickActionFAB } from "@/components/QuickActionFAB"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Temporary mock data
  const mockIncomeData = [
    { issueDate: new Date("2024-01-01"), amount: 1000 },
    { issueDate: new Date("2024-01-15"), amount: 1500 },
    { issueDate: new Date("2024-02-01"), amount: 2000 },
  ]

  const mockProjects: Project[] = [
    {
      id: "1",
      projectName: "Website Redesign",
      status: "IN_PROGRESS",
      currency: "USD",
      freelancerId: session.user.id,
      clientId: session.user.id,
      createdAt: new Date(),
      projectDescription: null,
    },
    {
      id: "2",
      projectName: "Mobile App Development",
      status: "PLANNING",
      currency: "USD",
      freelancerId: session.user.id,
      clientId: session.user.id,
      createdAt: new Date(),
      projectDescription: null,
    },
    {
      id: "3",
      projectName: "Brand Identity",
      status: "COMPLETED",
      currency: "USD",
      freelancerId: session.user.id,
      clientId: session.user.id,
      createdAt: new Date(),
      projectDescription: null,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="col-span-1 md:col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Income Overview</h2>
        <IncomeChart data={mockIncomeData} />
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Projects</h2>
        <ProjectList projects={mockProjects} />
      </div>
      <QuickActionFAB />
    </div>
  )
}

