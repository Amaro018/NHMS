import db from "db"

export default async function getRecords() {
  return await db.healthRecord.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      resident: true, // Include health records for each resident
    },
  })
}
