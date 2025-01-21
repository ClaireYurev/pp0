import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { z } from "zod"

const addressSchema = z.object({
  line1: z.string().min(1, "Address line 1 is required"),
  line2: z.string().optional(),
  line3: z.string().optional(),
  city: z.string().min(1, "City is required"),
  zipOrPostcode: z.string().min(1, "Zip/Postcode is required"),
  stateProvinceCounty: z.string().optional(),
  countryId: z.string().min(1, "Country is required"),
  otherAddressDetails: z.string().optional(),
})

const settingsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  defaultCurrency: z.string().length(3, "Currency must be a 3-letter code"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
  taxId: z.string().optional(),
  company: z.string().optional(),
  companyTaxId: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  fax: z.string().optional(),
  businessEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().optional(),
  preferredLanguage: z.string().optional(),
  timeZone: z.string().optional(),
  profilePicture: z.string().optional(),
  mainAddress: addressSchema,
  billingAddress: addressSchema.optional(),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = settingsSchema.parse(json)

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        defaultCurrency: body.defaultCurrency,
        taxRate: body.taxRate,
        taxId: body.taxId,
        company: body.company,
        companyTaxId: body.companyTaxId,
        website: body.website,
        fax: body.fax,
        businessEmail: body.businessEmail,
        phone: body.phone,
        preferredLanguage: body.preferredLanguage,
        timeZone: body.timeZone,
        profilePicture: body.profilePicture,
        mainAddress: {
          upsert: {
            create: body.mainAddress,
            update: body.mainAddress,
          },
        },
        billingAddress: body.billingAddress
          ? {
              upsert: {
                create: body.billingAddress,
                update: body.billingAddress,
              },
            }
          : undefined,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse(null, { status: 500 })
  }
}

