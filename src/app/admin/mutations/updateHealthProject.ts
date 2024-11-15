// mutations/updateHealthProject.ts

import db from "db"
import { resolver } from "@blitzjs/rpc"
import { z } from "zod"

// Define the input validation schema
const UpdateHealthProject = z.object({
  id: z.number(),
  projectName: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  targetHealthStatuses: z.array(z.string()),
})

// Define the mutation
export default resolver.pipe(
  resolver.zod(UpdateHealthProject),
  resolver.authorize(),
  async ({ id, projectName, description, startDate, endDate, targetHealthStatuses }) => {
    // Update the health project in the database
    const updatedProject = await db.healthProject.update({
      where: { id },
      data: {
        projectName,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        healthStatuses: {
          // Update the relationship with health statuses
          set: [], // First, clear existing statuses
          connect: targetHealthStatuses.map((statusName) => ({
            statusName,
          })),
        },
      },
      include: {
        healthStatuses: true, // Fetch related health statuses
      },
    })

    return updatedProject
  }
)
