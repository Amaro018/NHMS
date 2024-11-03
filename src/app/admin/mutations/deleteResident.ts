import db from "db"

export default async function deleteResident(input: { id: number }) {
  return await db.$transaction(async (prisma) => {
    // Delete all health records associated with the resident
    await prisma.healthRecord.deleteMany({
      where: { residentId: input.id },
    })

    // Delete the resident
    return await prisma.resident.delete({
      where: { id: input.id },
    })
  })
}
