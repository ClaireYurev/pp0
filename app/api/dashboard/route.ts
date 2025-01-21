import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)

    const projects = await prisma.project.findMany({
      where: {
        OR: [{ freelancerId: userId }, { clientId: userId }],
      },
      include: {
        invoices: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    })

    const invoices = await prisma.invoice.findMany({
      where: {
        OR: [{ project: { freelancerId: userId } }, { clientId: userId }],
      },
      orderBy: {
        dueDate: "asc",
      },
      take: 5,
    })

    const recentActivity = await prisma.activity.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    })

    const incomeData = await prisma.invoice.groupBy({
      by: ["issueDate"],
      where: {
        project: { freelancerId: userId },
        paymentStatus: "PAID",
      },
      _sum: {
        amountPaid: true,
      },
      orderBy: {
        issueDate: "asc",
      },
      take: 12,
    })

    return NextResponse.json({ projects, invoices, recentActivity, incomeData })
  } catch (error) {
    console.error("Dashboard data fetch error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

