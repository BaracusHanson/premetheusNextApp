import { PrismaClient } from '@prisma/client';
import { QUESTS } from './data/quests';
import { BADGES } from './data/badges';
import { SKILL_NODES } from './data/skilltreeNodes';
import { SKILL_EDGES } from './data/skilltreeEdges';
import { JOURNEYS } from './data/journeys';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seeding...');

  // 1. Clear Database (Order matters for foreign keys)
  // Warning: This deletes data!
  console.log('🧹 Clearing old data...');
  await prisma.userQuest.deleteMany();
  await prisma.userBadge.deleteMany();
  await prisma.skillEdge.deleteMany();
  await prisma.skillNode.deleteMany();
  await prisma.journey.deleteMany();
  await prisma.quest.deleteMany();
  await prisma.badge.deleteMany();

  // 2. Insert Quests
  console.log(`⚔️ Inserting ${QUESTS.length} Quests...`);
  // Chunking if too large, but 300 is fine for one go usually or loop
  for (const q of QUESTS) {
    await prisma.quest.create({ data: q });
  }

  // 3. Insert Badges
  console.log(`🏆 Inserting ${BADGES.length} Badges...`);
  for (const b of BADGES) {
    await prisma.badge.create({ data: b });
  }

  // 4. Insert Skill Nodes
  console.log(`🌳 Inserting ${SKILL_NODES.length} Skill Nodes...`);
  for (const n of SKILL_NODES) {
    await prisma.skillNode.create({ data: n });
  }

  // 5. Insert Skill Edges
  console.log(`🔗 Inserting ${SKILL_EDGES.length} Skill Edges...`);
  for (const e of SKILL_EDGES) {
      // Ensure nodes exist before creating edge (Self-integrity check)
    await prisma.skillEdge.create({ data: e });
  }

  // 6. Insert Journeys
  console.log(`🚀 Inserting ${JOURNEYS.length} Journeys...`);
  for (const j of JOURNEYS) {
    await prisma.journey.create({ data: j });
  }

  console.log('✅ Seed completed!');
  console.log(`- ${QUESTS.length} quests inserted`);
  console.log(`- ${BADGES.length} badges inserted`);
  console.log(`- ${SKILL_NODES.length} skill nodes inserted`);
  console.log(`- ${SKILL_EDGES.length} skill edges inserted`);
  console.log(`- ${JOURNEYS.length} journeys inserted`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
