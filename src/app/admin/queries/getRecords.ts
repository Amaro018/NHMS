import db from "db"

export default async function getRecords() {
  return await db.healthRecord.findMany({
    orderBy: { createdAt: "desc" },
  })
}
