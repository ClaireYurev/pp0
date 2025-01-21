import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import CreateBriefForm from "@/components/CreateBriefForm"
import CreateProposalForm from "@/components/CreateProposalForm"
import CreateEstimateForm from "@/components/CreateEstimateForm"
import CreateContractForm from "@/components/CreateContractForm"
import CreateInvoiceForm from "@/components/CreateInvoiceForm"
import InvoiceStatusManager from "@/components/InvoiceStatusManager"
import ReceiptList from "@/components/ReceiptList"

export default async function ProjectDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const projectId = Number.parseInt(params.id)
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      briefs: true,
      proposals: true,
      estimates: true,
      contracts: true,
      invoices: true,
    },
  })

  if (!project) {
    return <div>Project not found</div>
  }

  const isFreelancer = project.freelancerId === Number.parseInt(session.user.id)

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{project.projectName}</h1>
          <p className="mt-4 text-lg text-gray-500">{project.projectDescription}</p>

          {/* Briefs section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">Briefs</h2>
            {project.briefs.map((brief) => (
              <div key={brief.id} className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{brief.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">{brief.content}</p>
                </div>
              </div>
            ))}
            {!isFreelancer && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Brief</h3>
                <CreateBriefForm projectId={projectId} />
              </div>
            )}
          </div>

          {/* Proposals section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">Proposals</h2>
            {project.proposals.map((proposal) => (
              <div key={proposal.id} className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{proposal.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Total Amount: ${proposal.totalAmount}</p>
                </div>
              </div>
            ))}
            {isFreelancer && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Proposal</h3>
                <CreateProposalForm projectId={projectId} />
              </div>
            )}
          </div>

          {/* Estimates section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">Estimates</h2>
            {project.estimates.map((estimate) => (
              <div key={estimate.id} className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{estimate.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Total Amount: ${estimate.totalAmount}</p>
                </div>
              </div>
            ))}
            {isFreelancer && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Estimate</h3>
                <CreateEstimateForm projectId={projectId} />
              </div>
            )}
          </div>

          {/* Contracts section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">Contracts</h2>
            {project.contracts.map((contract) => (
              <div key={contract.id} className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{contract.title}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Status: {contract.status}</p>
                </div>
              </div>
            ))}
            {isFreelancer && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Contract</h3>
                <CreateContractForm projectId={projectId} />
              </div>
            )}
          </div>

          {/* Invoices section */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-900">Invoices</h2>
            {project.invoices.map((invoice) => (
              <div key={invoice.id} className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Invoice #{invoice.invoiceNumber}</h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Total Amount Due: ${invoice.totalAmountDue}</p>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Status: {invoice.paymentStatus}</p>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">Amount Paid: ${invoice.amountPaid}</p>
                  {isFreelancer && (
                    <InvoiceStatusManager
                      invoiceId={invoice.id}
                      currentStatus={invoice.paymentStatus}
                      currentAmountPaid={invoice.amountPaid}
                      totalAmountDue={invoice.totalAmountDue}
                    />
                  )}
                  <ReceiptList invoiceId={invoice.id} />
                </div>
              </div>
            ))}
            {isFreelancer && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-gray-900">Create New Invoice</h3>
                <CreateInvoiceForm projectId={projectId} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

