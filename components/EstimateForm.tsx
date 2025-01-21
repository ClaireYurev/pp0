"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Estimate {
  id: number
  title: string
  description: string
  totalAmount: number
  paymentTerms: string
}

interface EstimateFormProps {
  estimate: Estimate
}

export default function EstimateForm({ estimate }: EstimateFormProps) {
  const [title, setTitle] = useState(estimate.title)
  const [description, setDescription] = useState(estimate.description)
  const [totalAmount, setTotalAmount] = useState(estimate.totalAmount.toString())
  const [paymentTerms, setPaymentTerms] = useState(estimate.paymentTerms)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/estimates/${estimate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, totalAmount, paymentTerms }),
      })
      if (response.ok) {
        router.refresh()
      } else {
        console.error("Failed to update estimate")
      }
    } catch (error) {
      console.error("Error updating estimate:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="totalAmount" className="block text-sm font-medium text-gray-700">
          Total Amount
        </label>
        <input
          type="number"
          id="totalAmount"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700">
          Payment Terms
        </label>
        <textarea
          id="paymentTerms"
          value={paymentTerms}
          onChange={(e) => setPaymentTerms(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Estimate
        </button>
      </div>
    </form>
  )
}

