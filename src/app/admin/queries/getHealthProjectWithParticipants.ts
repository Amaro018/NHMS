import { resolver } from "@blitzjs/rpc"
import db from "db"
import { z } from "zod"

export default resolver.pipe(
  resolver.zod(z.object({ id: z.number() })),
  resolver.authorize(),
  async ({ id }) => {
    const project = await db.healthProject.findUnique({
      where: { id },
      include: { healthStatuses: true },
    })

    if (!project) return null

    const targetStatuses = project.healthStatuses.map((s) => s.statusName)
    const allResidents = targetStatuses.includes("All Residents")

    const residents = await db.resident.findMany({
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      include: {
        HealthRecord: {
          orderBy: { dateOfCheckup: "desc" },
          take: 1,
        },
      },
    })

    const participants = allResidents
      ? residents
      : residents.filter((r) => {
          const latest = r.HealthRecord[0]
          if (!latest) return false
          return (
            targetStatuses.includes(latest.healthStatus) ||
            targetStatuses.includes(latest.bloodPressureStatus)
          )
        })

    return { project, participants }
  }
)
