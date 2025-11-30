import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const questId = 'quest_work_first';
  console.log(`Checking quest: ${questId}`);
  
  const quest = await prisma.quest.findUnique({
    where: { id: questId }
  });

  if (quest) {
    console.log('✅ Quest found in DB:', quest);
  } else {
    console.log('❌ Quest NOT found in DB.');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
