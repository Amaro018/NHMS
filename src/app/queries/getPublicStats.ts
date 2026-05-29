import db from "db"

export default async function getPublicStats() {
  const [residentCount, recordCount, projects] = await Promise.all([
    db.resident.count(),
    db.healthRecord.count(),
    db.healthProject.findMany({
      include: { healthStatuses: true },
      orderBy: { startDate: "asc" },
    }),
  ])
  return { residentCount, recordCount, projects }
}
