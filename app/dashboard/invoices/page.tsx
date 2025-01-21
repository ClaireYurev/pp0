import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { InvoiceList } from "@/components/InvoiceList"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch invoices from the database
  // This is a placeholder and should be replaced with actual data fetching
  const invoices = [
    { id: "1", invoiceNumber: "INV-001", clientName: "Client A", amount: 1000, status: "Paid", dueDate: "2023-07-01" },
    {
      id: "2",
      invoiceNumber: "INV-002",
      clientName: "Client B",
      amount: 1500,
      status: "Pending",
      dueDate: "2023-07-15",
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      clientName: "Client C",
      amount: 2000,
      status: "Overdue",
      dueDate: "2023-06-30",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button asChild>
          <Link href="/dashboard/invoices/new">Create New Invoice</Link>
        </Button>
      </div>
      <InvoiceList invoices={invoices} />
    </div>
  )
}

