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
      company?: string
      companyTaxId?: string
      website?: string
      fax?: string
      businessEmail?: string
      phone?: string
      preferredLanguage?: string
      timeZone?: string
      profilePicture?: string
      mainAddress?: {
        line1: string
        line2?: string
        line3?: string
        city: string
        zipOrPostcode: string
        stateProvinceCounty?: string
        countryId: string
        otherAddressDetails?: string
      }
      billingAddress?: {
        line1: string
        line2?: string
        line3?: string
        city: string
        zipOrPostcode: string
        stateProvinceCounty?: string
        countryId: string
        otherAddressDetails?: string
      }
    }
  }
}

