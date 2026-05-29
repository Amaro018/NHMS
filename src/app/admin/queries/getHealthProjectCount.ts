import db from "db"

export default async function getHealthProjectCount() {
  return await db.healthProject.count()
}
