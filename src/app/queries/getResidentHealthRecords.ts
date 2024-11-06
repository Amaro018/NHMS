import db from "db"

export default async function getResidentHealthRecords() {
  return await db.healthRecord.findMany({
    orderBy: { createdAt: "desc" },
  })
}
