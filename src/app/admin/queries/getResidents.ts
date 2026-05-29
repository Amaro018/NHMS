import db from "db"

export default async function getResidents() {
  const residents = await db.resident.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { HealthRecord: true },
  })
  return residents
}
