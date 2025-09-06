import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create demo user
  const user = await prisma.user.upsert({
    where: { id: "demo-user" },
    update: {},
    create: {
      id: "demo-user",
      displayName: "Demo User",
    },
  });

  // Create some sample entries
  await prisma.entry.createMany({
    data: [
      {
        userId: user.id,
        type: "JOURNAL",
        content: "Started the day with meditation and felt more centered. Planning to tackle the project I've been putting off.",
        createdAt: new Date(Date.now() - 86400000), // Yesterday
      },
      {
        userId: user.id,
        type: "GRATITUDE",
        content: "The warm coffee that started my morning perfectly",
        createdAt: new Date(),
      },
      {
        userId: user.id,
        type: "GRATITUDE", 
        content: "My friend who listened when I needed to talk",
        createdAt: new Date(Date.now() - 86400000), // Yesterday
      },
    ],
  });

  // Create sample checkin
  await prisma.checkin.create({
    data: {
      userId: user.id,
      energy: 7,
      rest: 6,
      focus: 8,
      connection: 5,
      note: "Feeling balanced today",
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
