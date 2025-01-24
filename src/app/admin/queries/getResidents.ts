import db from "db"

export default async function getResidents() {
  const residents = await db.resident.findMany({
    orderBy: { createdAt: "desc" },
    include: { HealthRecord: true },
  })
  console.log("Fetched Residents:", residents)
  return residents
}
