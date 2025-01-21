import type { UserType } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      image?: string | null
      userType: UserType
    }
  }
}

