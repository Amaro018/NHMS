import db from "db"

export default async function getHealthRecordCount() {
  return await db.healthRecord.count()
}
