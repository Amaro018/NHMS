import db from "db"

export default async function deleteRecord(input: { healthRecordId: number; residentId: number }) {
  return await db.$transaction(async (prisma) => {
    // Delete the specific health record by id
    await prisma.healthRecord.delete({
      where: { id: input.healthRecordId },
    })

    return { message: "Health record deleted successfully" }
  })
}
