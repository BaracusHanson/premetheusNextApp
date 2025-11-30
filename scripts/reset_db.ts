import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Clearing all data from database...');

  // Delete in order of dependencies (child first)
  // Dependent tables
  await prisma.userJourney.deleteMany(); // Added missing table
  await prisma.userQuest.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.userFormAnswers.deleteMany();
  await prisma.xPEvent.deleteMany();
  await prisma.lifeEvent.deleteMany();
  await prisma.skillEdge.deleteMany();
  
  // Independent tables (mostly)
  await prisma.skillNode.deleteMany();
  await prisma.journey.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.badge.deleteMany();
  
  // Users
  await prisma.userProfile.deleteMany();

  console.log('✅ All tables are empty.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
