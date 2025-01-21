import Link from "next/link"

interface Invoice {
  id: number
  invoiceNumber: string
  dueDate: Date
  totalAmountDue: number
  paymentStatus: string
}

export default function InvoicesOverview({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Pending Invoices</h3>
        <div className="mt-5 space-y-4">
          {invoices.map((invoice) => (
            <Link key={invoice.id} href={`/invoices/${invoice.id}`} className="block">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">#{invoice.invoiceNumber}</span>
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.paymentStatus === "PAID" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {invoice.paymentStatus}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-sm text-gray-500">
                <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                <span>${invoice.totalAmountDue.toFixed(2)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link href="/invoices" className="font-medium text-indigo-600 hover:text-indigo-500">
            View all invoices
          </Link>
        </div>
      </div>
    </div>
  )
}

