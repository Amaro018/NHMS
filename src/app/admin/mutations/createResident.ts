import db from "db"
import { AuthenticationError } from "blitz"

export default async function createResident(input: {
  firstName: string
  middleName?: string
  lastName: string
  birthDate: Date
  gender: string
  address: string
  contactNumber?: string
}) {
  const duplicate = await db.resident.findFirst({
    where: {
      firstName: { equals: input.firstName, mode: "insensitive" },
      lastName: { equals: input.lastName, mode: "insensitive" },
      birthDate: input.birthDate,
    },
  })
  if (duplicate) throw new Error("A resident with the same name and birth date already exists.")

  return await db.resident.create({ data: input })
}
