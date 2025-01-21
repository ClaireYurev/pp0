import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../../auth/[...nextauth]/route"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().optional(),
  status: z.enum(["PLANNING", "IN_PROGRESS", "COMPLETED"]),
  currency: z.string().length(3),
})

export async function GET(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const project = await prisma.project.findFirst({
      where: {
        id: params.projectId,
        OR: [{ freelancerId: session.user.id }, { clientId: session.user.id }],
      },
    })

    if (!project) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error fetching project:", error)
    return new NextResponse(null, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = projectSchema.parse(json)

    const project = await prisma.project.updateMany({
      where: {
        id: params.projectId,
        OR: [{ freelancerId: session.user.id }, { clientId: session.user.id }],
      },
      data: body,
    })

    if (project.count === 0) {
      return new NextResponse("Not Found", { status: 404 })
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id: params.projectId },
    })

    return NextResponse.json(updatedProject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    console.error("Error updating project:", error)
    return new NextResponse(null, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { projectId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const project = await prisma.project.deleteMany({
      where: {
        id: params.projectId,
        OR: [{ freelancerId: session.user.id }, { clientId: session.user.id }],
      },
    })

    if (project.count === 0) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting project:", error)
    return new NextResponse(null, { status: 500 })
  }
}

