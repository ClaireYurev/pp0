import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, title, approach, timeline, deliverables, pricingStrategy, totalAmount } = await req.json()
    const proposal = await prisma.proposal.create({
      data: {
        projectId: Number.parseInt(projectId),
        freelancerId: Number.parseInt(session.user.id),
        title,
        approach,
        timeline,
        deliverables,
        pricingStrategy,
        totalAmount: Number.parseFloat(totalAmount),
      },
    })
    return NextResponse.json(proposal)
  } catch (error) {
    console.error("Proposal creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")

    const proposals = await prisma.proposal.findMany({
      where: {
        projectId: projectId ? Number.parseInt(projectId) : undefined,
        freelancerId: Number.parseInt(session.user.id),
      },
      include: {
        project: true,
      },
    })
    return NextResponse.json(proposals)
  } catch (error) {
    console.error("Proposal retrieval error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

