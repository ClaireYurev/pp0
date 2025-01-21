import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const invoiceSchema = z.object({
  clientEmail: z.string().email(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  description: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()

    // Check if it's a quick invoice or a detailed invoice
    if (json.clientEmail) {
      // Quick invoice creation
      const body = invoiceSchema.parse(json)
      const invoice = await prisma.invoice.create({
        data: {
          clientEmail: body.clientEmail,
          totalAmountDue: Number.parseFloat(body.amount),
          description: body.description,
          freelancer: { connect: { id: session.user.id } },
          client: { connect: { id: session.user.id } }, // Temporary: set client as self for demo
          paymentStatus: "UNPAID",
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Due in 30 days
          subtotal: Number.parseFloat(body.amount),
          taxAmount: 0,
          invoiceNumber: `INV-${Date.now()}`, // Generate a unique invoice number
        },
      })
      return NextResponse.json(invoice)
    } else {
      // Detailed invoice creation (existing logic)
      const { projectId, contractId, estimateId, invoiceNumber, issueDate, dueDate, lineItems } = json

      const project = await prisma.project.findUnique({
        where: { id: projectId },
      })

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 })
      }

      if (project.freelancerId !== session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }

      const subtotal = lineItems.reduce((sum: number, item: any) => sum + item.quantity * item.unitPrice, 0)
      const taxRate = 0.1 // Assuming a 10% tax rate, you might want to make this configurable
      const taxAmount = subtotal * taxRate
      const totalAmountDue = subtotal + taxAmount

      const invoice = await prisma.invoice.create({
        data: {
          project: { connect: { id: projectId } },
          contract: contractId ? { connect: { id: contractId } } : undefined,
          estimate: estimateId ? { connect: { id: estimateId } } : undefined,
          client: { connect: { id: project.clientId } },
          freelancer: { connect: { id: session.user.id } },
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
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: JSON.stringify(error.issues) }, { status: 422 })
    }
    console.error("Invoice creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

