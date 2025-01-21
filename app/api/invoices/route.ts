import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectId, contractId, estimateId, invoiceNumber, issueDate, dueDate, lineItems } = await req.json()

    const project = await prisma.project.findUnique({
      where: { id: Number.parseInt(projectId) },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.freelancerId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0)
    const taxRate = 0.1 // Assuming a 10% tax rate, you might want to make this configurable
    const taxAmount = subtotal * taxRate
    const totalAmountDue = subtotal + taxAmount

    const invoice = await prisma.invoice.create({
      data: {
        projectId: Number.parseInt(projectId),
        contractId: contractId ? Number.parseInt(contractId) : undefined,
        estimateId: estimateId ? Number.parseInt(estimateId) : undefined,
        clientId: project.clientId,
        invoiceNumber,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        subtotal,
        taxAmount,
        totalAmountDue,
        amountPaid: 0,
        paymentStatus: "UNPAID",
        lineItems: {
          create: lineItems,
        },
      },
      include: {
        lineItems: true,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Invoice creation error:", error)
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

    const invoices = await prisma.invoice.findMany({
      where: {
        projectId: projectId ? Number.parseInt(projectId) : undefined,
        OR: [
          { project: { freelancerId: Number.parseInt(session.user.id) } },
          { clientId: Number.parseInt(session.user.id) },
        ],
      },
      include: {
        project: true,
        lineItems: true,
      },
    })

    return NextResponse.json(invoices)
  } catch (error) {
    console.error("Invoice retrieval error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

