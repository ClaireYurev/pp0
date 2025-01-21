import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import EstimateForm from "@/components/EstimateForm"

export default async function EstimateDetail({ params }: { params: { id: string } }) {
  const session = await getServerSession()

  if (!session) {
    redirect("/auth/signin")
  }

  const estimateId = Number.parseInt(params.id)
  const estimate = await prisma.estimate.findUnique({
    where: { id: estimateId },
    include: {
      project: true,
      brief: true,
      proposal: true,
    },
  })

  if (!estimate) {
    return <div>Estimate not found</div>
  }

  const isFreelancer = estimate.freelancerId === Number.parseInt(session.user.id)

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{estimate.title}</h1>
          <p className="mt-4 text-lg text-gray-500">Project: {estimate.project.projectName}</p>

          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Estimate Details</h3>
              <div className="mt-5 border-t border-gray-200">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{estimate.description}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">${estimate.totalAmount}</dd>
                  </div>
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">Payment Terms</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{estimate.paymentTerms}</dd>
                  </div>
                  {estimate.brief && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Associated Brief</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{estimate.brief.title}</dd>
                    </div>
                  )}
                  {estimate.proposal && (
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Associated Proposal</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{estimate.proposal.title}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {isFreelancer && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-gray-900">Edit Estimate</h2>
              <EstimateForm estimate={estimate} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

