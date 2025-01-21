"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Contract {
  id: number
  title: string
  scopeOfWork: string
  paymentTerms: string
  timeline: string
  intellectualProperty: string
  totalContractValue: number
}

interface ContractFormProps {
  contract: Contract
}

export default function ContractForm({ contract }: ContractFormProps) {
  const [title, setTitle] = useState(contract.title)
  const [scopeOfWork, setScopeOfWork] = useState(contract.scopeOfWork)
  const [paymentTerms, setPaymentTerms] = useState(contract.paymentTerms)
  const [timeline, setTimeline] = useState(contract.timeline)
  const [intellectualProperty, setIntellectualProperty] = useState(contract.intellectualProperty)
  const [totalContractValue, setTotalContractValue] = useState(contract.totalContractValue.toString())
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/contracts/${contract.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, scopeOfWork, paymentTerms, timeline, intellectualProperty, totalContractValue }),
      })
      if (response.ok) {
        router.refresh()
      } else {
        console.error("Failed to update contract")
      }
    } catch (error) {
      console.error("Error updating contract:", error)
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
        <label htmlFor="scopeOfWork" className="block text-sm font-medium text-gray-700">
          Scope of Work
        </label>
        <textarea
          id="scopeOfWork"
          value={scopeOfWork}
          onChange={(e) => setScopeOfWork(e.target.value)}
          required
          rows={3}
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
        <label htmlFor="intellectualProperty" className="block text-sm font-medium text-gray-700">
          Intellectual Property
        </label>
        <textarea
          id="intellectualProperty"
          value={intellectualProperty}
          onChange={(e) => setIntellectualProperty(e.target.value)}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="totalContractValue" className="block text-sm font-medium text-gray-700">
          Total Contract Value
        </label>
        <input
          type="number"
          id="totalContractValue"
          value={totalContractValue}
          onChange={(e) => setTotalContractValue(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Update Contract
        </button>
      </div>
    </form>
  )
}

