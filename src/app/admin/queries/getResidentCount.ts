// queries/getResidentCount.js

import db from "db"

export default async function getResidentCount() {
  const residents = await db.resident.findMany()
  return residents.length
}
