
import { PrismaClient } from '@prisma/client';
import { QUESTS } from '../prisma/data/quests';
import { JOURNEYS } from '../prisma/data/journeys';

const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Updating definitions (Quests & Journeys)...');

    // 1. Upsert Quests
    console.log(`⚔️ Upserting ${QUESTS.length} Quests...`);
    for (const q of QUESTS) {
        // Remove fields that might not be in the schema or handle safely
        // Assuming QUESTS data matches schema exactly or close enough
        const { trigger, ...data } = q; // trigger is Json? which is fine
        await prisma.quest.upsert({
            where: { id: q.id },
            update: { ...q },
            create: { ...q }
        });
    }

    // 2. Upsert Journeys
    console.log(`🚀 Upserting ${JOURNEYS.length} Journeys...`);
    for (const j of JOURNEYS) {
        await prisma.journey.upsert({
            where: { id: j.id },
            update: { ...j },
            create: { ...j }
        });
    }

    console.log('✅ Definitions updated!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
