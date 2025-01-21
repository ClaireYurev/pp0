import Link from "next/link"
import { PlusCircle, FileText, Send } from "lucide-react"

export default function QuickActions() {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
        <div className="mt-5 space-y-4">
          <Link
            href="/projects/new"
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create New Project
          </Link>
          <Link
            href="/invoices/new"
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <FileText className="mr-2 h-5 w-5" />
            Create New Invoice
          </Link>
          <Link
            href="/messages"
            className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            <Send className="mr-2 h-5 w-5" />
            Send Message
          </Link>
        </div>
      </div>
    </div>
  )
}

