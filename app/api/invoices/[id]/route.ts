import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invoiceId = Number.parseInt(params.id)
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        project: true,
        lineItems: true,
        versions: {
          orderBy: {
            versionNumber: "desc",
          },
        },
      },
    })

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    if (
      invoice.project.freelancerId !== Number.parseInt(session.user.id) &&
      invoice.clientId !== Number.parseInt(session.user.id)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("Invoice retrieval error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invoiceId = Number.parseInt(params.id)
    const { paymentStatus, amountPaid, lineItems } = await req.json()

    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { project: true, lineItems: true, versions: true },
    })

    if (!existingInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    if (existingInvoice.project.freelancerId !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Calculate new totals
    const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0)
    const taxRate = 0.1 // Assuming a 10% tax rate, you might want to make this configurable
    const taxAmount = subtotal * taxRate
    const totalAmountDue = subtotal + taxAmount

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paymentStatus,
        amountPaid: Number.parseFloat(amountPaid),
        subtotal,
        taxAmount,
        totalAmountDue,
        lineItems: {
          deleteMany: {},
          create: lineItems,
        },
        versions: {
          create: {
            versionNumber: existingInvoice.versions.length + 1,
            paymentStatus: existingInvoice.paymentStatus,
            amountPaid: existingInvoice.amountPaid,
            subtotal: existingInvoice.subtotal,
            taxAmount: existingInvoice.taxAmount,
            totalAmountDue: existingInvoice.totalAmountDue,
            lineItems: {
              create: existingInvoice.lineItems,
            },
          },
        },
      },
      include: {
        lineItems: true,
        versions: {
          include: {
            lineItems: true,
          },
        },
      },
    })

    return NextResponse.json(updatedInvoice)
  } catch (error) {
    console.error("Invoice update error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

