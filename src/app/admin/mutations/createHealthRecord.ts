// createHealthRecord.ts
import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

const CreateHealthRecord = z.object({
  residentId: z.number().int().positive(),
  dateOfCheckup: z.date(),
  weight: z.number().int().positive(),
  height: z.number().int().positive(),
  bmi: z.number().positive(),
  healthStatus: z.string(),
  systolic: z.number().nullable(),
  diastolic: z.number().nullable(),
  bloodPressureStatus: z.string(),
})

export default resolver.pipe(resolver.zod(CreateHealthRecord), async (input) => {
  const healthRecord = await db.healthRecord.create({ data: input })
  return healthRecord
})
