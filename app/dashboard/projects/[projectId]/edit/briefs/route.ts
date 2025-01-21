import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

const createBrief = async (body: any, params: any, session: any) => {
  const brief = await prisma.brief.create({
    data: {
      ...body,
      projectId: params.projectId,
      createdBy: { connect: { id: session.user.id } },
    },
  })
  return brief
}

export default createBrief

