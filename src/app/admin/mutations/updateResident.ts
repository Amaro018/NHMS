// mutations/updateResident.js
import db from "db"

export default async function updateResident({ id, ...data }) {
  const resident = await db.resident.update({
    where: { id },
    data,
  })
  return resident
}
