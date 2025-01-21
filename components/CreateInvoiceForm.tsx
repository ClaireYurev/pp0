"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface CreateInvoiceFormProps {
  projectId: number
}

interface Estimate {
  id: number
  title: string
  totalAmount: number
}

interface Contract {
  id: number
  title: string
  totalContractValue: number
}

export default function CreateInvoiceForm({ projectId }: CreateInvoiceFormProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [lineItems, setLineItems] = useState([{ description: "", quantity: 1, unitPrice: 0 }])
  const [estimates, setEstimates] = useState<Estimate[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [selectedEstimateId, setSelectedEstimateId] = useState("")
  const [selectedContractId, setSelectedContractId] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchEstimatesAndContracts = async () => {
      const estimatesResponse = await fetch(`/api/estimates?projectId=${projectId}`)
      const contractsResponse = await fetch(`/api/contracts?projectId=${projectId}`)

      if (estimatesResponse.ok) {
        const estimatesData = await estimatesResponse.json()
        setEstimates(estimatesData)
      }

      if (contractsResponse.ok) {
        const contractsData = await contractsResponse.json()
        setContracts(contractsData)
      }
    }

    fetchEstimatesAndContracts()
  }, [projectId])

  const handleAddLineItem = () => {
    setLineItems([...lineItems, { description: "", quantity: 1, unitPrice: 0 }])
  }

  const handleLineItemChange = (index: number, field: string, value: string | number) => {
    const newLineItems = [...lineItems]
    newLineItems[index] = { ...newLineItems[index], [field]: value }
    setLineItems(newLineItems)
  }

  const handleEstimateSelect = (estimateId: string) => {
    setSelectedEstimateId(estimateId)
    setSelectedContractId("")
    const selectedEstimate = estimates.find((e) => e.id === Number.parseInt(estimateId))
    if (selectedEstimate) {
      setLineItems([{ description: selectedEstimate.title, quantity: 1, unitPrice: selectedEstimate.totalAmount }])
    }
  }

  const handleContractSelect = (contractId: string) => {
    setSelectedContractId(contractId)
    setSelectedEstimateId("")
    const selectedContract = contracts.find((c) => c.id === Number.parseInt(contractId))
    if (selectedContract) {
      setLineItems([
        { description: selectedContract.title, quantity: 1, unitPrice: selectedContract.totalContractValue },
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          estimateId: selectedEstimateId ? Number.parseInt(selectedEstimateId) : undefined,
          contractId: selectedContractId ? Number.parseInt(selectedContractId) : undefined,
          invoiceNumber,
          issueDate,
          dueDate,
          lineItems,
        }),
      })
      if (response.ok) {
        router.refresh()
        router.push(`/projects/${projectId}`)
      } else {
        console.error("Failed to create invoice")
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">
          Invoice Number
        </label>
        <input
          type="text"
          id="invoiceNumber"
          value={invoiceNumber}
          onChange={(e) => setInvoiceNumber(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700">
          Issue Date
        </label>
        <input
          type="date"
          id="issueDate"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="estimate" className="block text-sm font-medium text-gray-700">
          Create from Estimate
        </label>
        <select
          id="estimate"
          value={selectedEstimateId}
          onChange={(e) => handleEstimateSelect(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an estimate</option>
          {estimates.map((estimate) => (
            <option key={estimate.id} value={estimate.id}>
              {estimate.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="contract" className="block text-sm font-medium text-gray-700">
          Create from Contract
        </label>
        <select
          id="contract"
          value={selectedContractId}
          onChange={(e) => handleContractSelect(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select a contract</option>
          {contracts.map((contract) => (
            <option key={contract.id} value={contract.id}>
              {contract.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
        {lineItems.map((item, index) => (
          <div key={index} className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <input
                type="text"
                id={`description-${index}`}
                value={item.description}
                onChange={(e) => handleLineItemChange(index, "description", e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor={`quantity-${index}`} className="block text-sm font-medium text-gray-700">
                Quantity
              </label>
              <input
                type="number"
                id={`quantity-${index}`}
                value={item.quantity}
                onChange={(e) => handleLineItemChange(index, "quantity", Number.parseInt(e.target.value))}
                required
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor={`unitPrice-${index}`} className="block text-sm font-medium text-gray-700">
                Unit Price
              </label>
              <input
                type="number"
                id={`unitPrice-${index}`}
                value={item.unitPrice}
                onChange={(e) => handleLineItemChange(index, "unitPrice", Number.parseFloat(e.target.value))}
                required
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddLineItem}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add Line Item
        </button>
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Create Invoice
        </button>
      </div>
    </form>
  )
}

