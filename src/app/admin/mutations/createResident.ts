import db from "db"

export default async function createResident(input: {
  firstName: string
  middleName?: string
  lastName: string
  birthDate: Date
  gender: string
  address: string
  contactNumber?: string
}) {
  const resident = await db.resident.create({ data: input })
  return resident
}
