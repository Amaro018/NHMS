import { resolver } from "@blitzjs/rpc"
import db from "db"

const getHealthProjects = resolver.pipe(
  resolver.authorize(), // Ensures the user is authenticated
  async () => {
    const healthProjects = await db.healthProject.findMany({
      include: {
        healthStatuses: true, // Includes related health statuses in the query
      },
    })

    return healthProjects
  }
)

export default getHealthProjects
