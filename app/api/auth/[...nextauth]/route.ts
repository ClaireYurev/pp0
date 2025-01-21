import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (existingUser) {
          // Link Google account to existing user
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              googleId: profile?.sub,
              googleEmail: profile?.email,
              googleAvatarUrl: profile?.picture,
            },
          })
        } else {
          // Create new user with Google information
          await prisma.user.create({
            data: {
              userType: "freelancer", // Default to freelancer, can be changed later
              firstName: profile?.given_name,
              lastName: profile?.family_name,
              email: profile?.email!,
              googleId: profile?.sub,
              googleEmail: profile?.email,
              googleAvatarUrl: profile?.picture,
            },
          })
        }
      }
      return true
    },
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
        session.user.userType = user.userType
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }

