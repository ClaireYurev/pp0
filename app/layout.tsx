import { Inter } from "next/font/google"
import AuthProvider from "@/components/AuthProvider"
import Layout from "@/components/Layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Palette Pal - Freelance Designer Tools",
  description: "Manage your freelance design business with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>{children}</Layout>
        </AuthProvider>
      </body>
    </html>
  )
}

