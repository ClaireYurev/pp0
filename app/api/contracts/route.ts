import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const {
      projectId,
      proposalId,
      title,
      scopeOfWork,
      paymentTerms,
      timeline,
      intellectualProperty,
      totalContractValue,
    } = await req.json()
    const contract = await prisma.contract.create({
      data: {
        projectId: Number.parseInt(projectId),
        freelancerId: Number.parseInt(session.user.id),
        clientId: 0, // This should be updated when the client accepts the contract
        proposalId: proposalId ? Number.parseInt(proposalId) : undefined,
        title,
        scopeOfWork,
        paymentTerms,
        timeline,
        intellectualProperty,
        totalContractValue: Number.parseFloat(totalContractValue),
        status: "pending_signature",
      },
    })
    return NextResponse.json(contract)
  } catch (error) {
    console.error("Contract creation error:", error)
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

    const contracts = await prisma.contract.findMany({
      where: {
        projectId: projectId ? Number.parseInt(projectId) : undefined,
        OR: [{ freelancerId: Number.parseInt(session.user.id) }, { clientId: Number.parseInt(session.user.id) }],
      },
      include: {
        project: true,
        proposal: true,
      },
    })
    return NextResponse.json(contracts)
  } catch (error) {
    console.error("Contract retrieval error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

