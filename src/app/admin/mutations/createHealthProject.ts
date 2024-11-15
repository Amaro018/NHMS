import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

const CreateHealthProject = z.object({
  projectName: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  targetHealthStatuses: z.array(z.string()), // Array of health status names
})

export default resolver.pipe(
  resolver.zod(CreateHealthProject),
  resolver.authorize(),
  async ({ projectName, description, startDate, endDate, targetHealthStatuses }) => {
    const healthProject = await db.healthProject.create({
      data: {
        projectName,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        healthStatuses: {
          connect: targetHealthStatuses.map((statusName) => ({
            statusName, // Connect to HealthStatus by name
          })),
        },
      },
      include: {
        healthStatuses: true,
      },
    })

    return healthProject
  }
)
