// queries/getResidentCount.js

import db from "db"

export default async function getResidentCount() {
  return await db.resident.count()
}
