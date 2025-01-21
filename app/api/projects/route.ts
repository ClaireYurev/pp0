import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "../auth/[...nextauth]/route"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const projectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectDescription: z.string().optional(),
  status: z.enum(["PLANNING", "IN_PROGRESS", "COMPLETED"]),
  currency: z.string().length(3),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = projectSchema.parse(json)

    const project = await prisma.project.create({
      data: {
        ...body,
        freelancerId: session.user.id,
        clientId: session.user.id, // Temporary: set client as self for demo
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse(null, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort")

    const where: Prisma.ProjectWhereInput = {
      OR: [{ freelancerId: session.user.id }, { clientId: session.user.id }],
      ...(status ? { status: status as "PLANNING" | "IN_PROGRESS" | "COMPLETED" } : {}),
      ...(search
        ? {
            projectName: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {}),
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput =
      sort === "name" ? { projectName: "asc" } : { createdAt: "desc" }

    const projects = await prisma.project.findMany({
      where,
      orderBy,
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return new NextResponse(null, { status: 500 })
  }
}

