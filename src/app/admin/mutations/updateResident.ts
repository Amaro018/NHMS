// mutations/updateResident.js
import db from "db"

export default async function updateResident({ id, ...data }) {
  try {
    const resident = await db.resident.update({
      where: { id },
      data,
    })
    return resident
  } catch (error) {
    console.error("Failed to update resident:", error)
    throw error
  }
}
