import db from "db"

export default async function getResidents() {
  return await db.resident.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      HealthRecord: true, // Include health records for each resident
    },
  })
}
