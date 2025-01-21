import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"

// Create a new project
export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { projectName, projectDescription, currency } = await req.json()
    const project = await prisma.project.create({
      data: {
        projectName,
        projectDescription,
        currency,
        freelancerId: Number.parseInt(session.user.id),
        clientId: 0, // Placeholder, update when client is assigned
        status: "active",
      },
    })
    return NextResponse.json(project)
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Get all projects for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession()
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: {
        OR: [{ freelancerId: Number.parseInt(session.user.id) }, { clientId: Number.parseInt(session.user.id) }],
      },
    })
    return NextResponse.json(projects)
  } catch (error) {
    console.error("Project retrieval error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

