"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface CreateProposalFormProps {
  projectId: number
}

export default function CreateProposalForm({ projectId }: CreateProposalFormProps) {
  const [title, setTitle] = useState("")
  const [approach, setApproach] = useState("")
  const [timeline, setTimeline] = useState("")
  const [deliverables, setDeliverables] = useState("")
  const [pricingStrategy, setPricingStrategy] = useState("Fixed Fee")
  const [totalAmount, setTotalAmount] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, title, approach, timeline, deliverables, pricingStrategy, totalAmount }),
      })
      if (response.ok) {
        router.refresh()
        router.push(`/projects/${projectId}`)
      } else {
        console.error("Failed to create proposal")
      }
    } catch (error) {
      console.error("Error creating proposal:", error)
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
        <label htmlFor="approach" className="block text-sm font-medium text-gray-700">
          Approach
        </label>
        <textarea
          id="approach"
          value={approach}
          onChange={(e) => setApproach(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
          Timeline
        </label>
        <input
          type="text"
          id="timeline"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="deliverables" className="block text-sm font-medium text-gray-700">
          Deliverables
        </label>
        <textarea
          id="deliverables"
          value={deliverables}
          onChange={(e) => setDeliverables(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="pricingStrategy" className="block text-sm font-medium text-gray-700">
          Pricing Strategy
        </label>
        <select
          id="pricingStrategy"
          value={pricingStrategy}
          onChange={(e) => setPricingStrategy(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option>Fixed Fee</option>
          <option>Hourly</option>
        </select>
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Proposal
        </button>
      </div>
    </form>
  )
}

