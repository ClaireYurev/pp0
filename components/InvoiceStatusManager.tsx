"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface InvoiceStatusManagerProps {
  invoiceId: number
  currentStatus: string
  currentAmountPaid: number
  totalAmountDue: number
}

export default function InvoiceStatusManager({
  invoiceId,
  currentStatus,
  currentAmountPaid,
  totalAmountDue,
}: InvoiceStatusManagerProps) {
  const [paymentStatus, setPaymentStatus] = useState(currentStatus)
  const [amountPaid, setAmountPaid] = useState(currentAmountPaid.toString())
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus, amountPaid }),
      })
      if (response.ok) {
        router.refresh()
      } else {
        console.error("Failed to update invoice status")
      }
    } catch (error) {
      console.error("Error updating invoice status:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div>
        <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
          Payment Status
        </label>
        <select
          id="paymentStatus"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="UNPAID">Unpaid</option>
          <option value="PARTIALLY_PAID">Partially Paid</option>
          <option value="PAID">Paid</option>
        </select>
      </div>
      <div>
        <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700">
          Amount Paid
        </label>
        <input
          type="number"
          id="amountPaid"
          value={amountPaid}
          onChange={(e) => setAmountPaid(e.target.value)}
          min="0"
          max={totalAmountDue}
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Invoice Status
        </button>
      </div>
    </form>
  )
}

