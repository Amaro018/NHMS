import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

const CreateHealthRecord = z.object({
  residentId: z.number().int().positive(),
  dateOfCheckup: z.date().max(new Date(), { message: "Checkup date cannot be in the future." }),
  weight: z.number().positive(),
  height: z.number().positive(),
  bmi: z.number().positive(),
  healthStatus: z.string(),
  systolic: z.number().nullable(),
  diastolic: z.number().nullable(),
  bloodPressureStatus: z.string(),
})

export default resolver.pipe(resolver.zod(CreateHealthRecord), async (input) => {
  return await db.healthRecord.create({ data: input })
})
