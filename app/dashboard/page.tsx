import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import dynamic from "next/dynamic"
import { authOptions } from "../api/auth/[...nextauth]/route"

const IncomeChartDynamic = dynamic(() => import("@/components/IncomeChart"), {
  loading: () => <p>Loading chart...</p>,
})

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  // Temporary mock data for the chart
  const mockData = [
    { issueDate: new Date("2024-01-01"), amount: 1000 },
    { issueDate: new Date("2024-01-15"), amount: 1500 },
    { issueDate: new Date("2024-02-01"), amount: 2000 },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-6">
        <IncomeChartDynamic data={mockData} />
      </div>
    </div>
  )
}

