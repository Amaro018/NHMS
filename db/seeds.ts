import db from "./index"

const seed = async () => {
  // hashed password = password123
  const hashedPassword =
    "JGFyZ29uMmlkJHY9MTkkbT02NTUzNix0PTIscD0xJCtCUmJlbXpWTnhRTCtnVUxwZThHNnckaHkySU15OGlVOHp4WEl4VXphbjZRR2JLSUhVNDI1eTQ3azc1WEhxSDE4SQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="

  const existingUser = await db.user.findFirst({
    where: {
      email: "admin@admin.com",
    },
  })

  if (!existingUser) {
    await db.user.create({
      data: {
        name: "Administrator",
        email: "admin@admin.com",
        role: "ADMIN",
        hashedPassword,
      },
    })
  }

  // Seed 10 residents
  const residents = [
    {
      firstName: "John",
      middleName: "Smith",
      lastName: "Doe",
      birthDate: new Date("1990-01-01"),
      gender: "Male",
      address: "Purok 1",
      contactNumber: "1234567890",
    },
    {
      firstName: "Jane",
      middleName: "Doe",
      lastName: "Smith",
      birthDate: new Date("1985-02-15"),
      gender: "Female",
      address: "Purok 2",
      contactNumber: "2345678901",
    },
    {
      firstName: "Alice",
      middleName: "Johnson",
      lastName: "Johnson",
      birthDate: new Date("1992-03-10"),
      gender: "Female",
      address: "Purok 3",
      contactNumber: "3456789012",
    },
    {
      firstName: "Bob",
      middleName: "Williams",
      lastName: "Brown",
      birthDate: new Date("1988-04-20"),
      gender: "Male",
      address: "Purok 4",
      contactNumber: "4567890123",
    },
    {
      firstName: "Charlie",
      middleName: "Davis",
      lastName: "Davis",
      birthDate: new Date("1995-05-25"),
      gender: "Male",
      address: "Purok 1",
      contactNumber: "5678901234",
    },
    {
      firstName: "Eve",
      middleName: "Miller",
      lastName: "Wilson",
      birthDate: new Date("1991-06-30"),
      gender: "Female",
      address: "Purok 2",
      contactNumber: "6789012345",
    },
    {
      firstName: "Frank",
      middleName: "Moore",
      lastName: "Taylor",
      birthDate: new Date("1986-07-04"),
      gender: "Male",
      address: "Purok 3",
      contactNumber: "7890123456",
    },
    {
      firstName: "Grace",
      middleName: "Anderson",
      lastName: "Martinez",
      birthDate: new Date("1993-08-18"),
      gender: "Female",
      address: "Purok 4",
      contactNumber: "8901234567",
    },
    {
      firstName: "Hank",
      middleName: "Thomas",
      lastName: "Anderson",
      birthDate: new Date("1989-09-12"),
      gender: "Male",
      address: "Purok 1",
      contactNumber: "9012345678",
    },
    {
      firstName: "Ivy",
      middleName: "Jackson",
      lastName: "Thomas",
      birthDate: new Date("1994-10-22"),
      gender: "Female",
      address: "Purok 2",
      contactNumber: "0123456789",
    },
    {
      firstName: "Jax",
      middleName: "White",
      lastName: "Brown",
      birthDate: new Date("1987-11-12"),
      gender: "Male",
      address: "Purok 3",
      contactNumber: "1112345678",
    },
    {
      firstName: "Kevin",
      middleName: "Miller",
      lastName: "Harris",
      birthDate: new Date("1990-12-15"),
      gender: "Male",
      address: "Purok 4",
      contactNumber: "1223456789",
    },
    {
      firstName: "Lily",
      middleName: "Parker",
      lastName: "Lewis",
      birthDate: new Date("1991-01-20"),
      gender: "Female",
      address: "Purok 1",
      contactNumber: "1334567890",
    },
    {
      firstName: "Mike",
      middleName: "Brown",
      lastName: "Walker",
      birthDate: new Date("1988-02-10"),
      gender: "Male",
      address: "Purok 2",
      contactNumber: "1445678901",
    },
    {
      firstName: "Nina",
      middleName: "Rodriguez",
      lastName: "Martinez",
      birthDate: new Date("1993-03-15"),
      gender: "Female",
      address: "Purok 3",
      contactNumber: "1556789012",
    },
    {
      firstName: "Oliver",
      middleName: "Smith",
      lastName: "Johnson",
      birthDate: new Date("1994-04-20"),
      gender: "Male",
      address: "Purok 4",
      contactNumber: "1667890123",
    },
  ]

  for (const resident of residents) {
    const existingResident = await db.resident.findFirst({
      where: { firstName: resident.firstName, lastName: resident.lastName },
    })

    if (!existingResident) {
      await db.resident.create({
        data: resident,
      })
    }
  }

  const healthStatuses = [
    { statusName: "Normal" },
    { statusName: "Hypotension" },
    { statusName: "Underweight" },
    { statusName: "Elevated" },
    { statusName: "Overweight" },
    { statusName: "Hypertension Stage 1" },
    { statusName: "Class I Obese" },
    { statusName: "Hypertension Stage 2" },
    { statusName: "Class II Obese" },
    { statusName: "Hypertensive Crisis" },
    { statusName: "Class III Obese" },
    { statusName: "All Residents" },
  ]

  await db.healthStatus.createMany({
    data: healthStatuses,
    skipDuplicates: true, // Prevents errors if records already exist
  })

  console.log("Seed completed!")
}

export default seed
