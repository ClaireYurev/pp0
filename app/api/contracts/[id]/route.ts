import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contractId = Number.parseInt(params.id)
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        project: true,
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    })

    if (!contract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    if (
      contract.freelancerId !== Number.parseInt(session.user.id) &&
      contract.clientId !== Number.parseInt(session.user.id)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error("Contract retrieval error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contractId = Number.parseInt(params.id)
    const { title, scopeOfWork, paymentTerms, timeline, intellectualProperty, totalContractValue } = await req.json()

    const existingContract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: { versions: true },
    })

    if (!existingContract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    if (existingContract.freelancerId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updatedContract = await prisma.contract.update({
      where: { id: contractId },
      data: {
        title,
        scopeOfWork,
        paymentTerms,
        timeline,
        intellectualProperty,
        totalContractValue: Number.parseFloat(totalContractValue),
        versions: {
          create: {
            versionNumber: existingContract.versions.length + 1,
            scopeOfWork: existingContract.scopeOfWork,
            paymentTerms: existingContract.paymentTerms,
            timeline: existingContract.timeline,
            intellectualProperty: existingContract.intellectualProperty,
            totalContractValue: existingContract.totalContractValue,
          },
        },
      },
      include: {
        versions: true,
      },
    })

    return NextResponse.json(updatedContract)
  } catch (error) {
    console.error("Contract update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contractId = Number.parseInt(params.id)

    const existingContract = await prisma.contract.findUnique({
      where: { id: contractId },
    })

    if (!existingContract) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 })
    }

    if (existingContract.freelancerId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.contract.delete({
      where: { id: contractId },
    })

    return NextResponse.json({ message: "Contract deleted successfully" })
  } catch (error) {
    console.error("Contract deletion error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

