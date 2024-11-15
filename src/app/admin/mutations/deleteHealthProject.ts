import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

// Define the input schema for validation
const DeleteHealthProject = z.object({
  id: z.number(),
})

const deleteHealthProject = resolver.pipe(
  resolver.authorize(), // Authorization check
  async ({ id }) => {
    // Delete the HealthProject by ID
    const deletedProject = await db.healthProject.delete({
      where: { id },
    })

    return deletedProject
  }
)

export default deleteHealthProject
