const project = await prisma.healthProject.findUnique({
where: { id: 1 },
include: { healthStatuses: true },
});
