import db from "db"
export default async function getUniqueYearsRecords() {
  return await db.healthRecord.findMany({
    select: {
      dateOfCheckup: true,
    },
    distinct: ["dateOfCheckup"],
  })
}
