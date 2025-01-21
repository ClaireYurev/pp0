import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName } = await req.json()
    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        userType: "freelancer", // You might want to allow users to choose their type
      },
    })

    return NextResponse.json({ message: "User created successfully" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

