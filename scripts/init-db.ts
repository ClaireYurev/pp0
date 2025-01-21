import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    await prisma.$connect()
    console.log("Connected to database successfully")

    // Test the connection by creating a verification token
    await prisma.verificationToken.create({
      data: {
        identifier: "test",
        token: "test-token",
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })
    console.log("Database initialization successful")

    await prisma.verificationToken.delete({
      where: {
        token: "test-token",
      },
    })
  } catch (error) {
    console.error("Database initialization failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

