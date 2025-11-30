import { prisma } from "@/lib/db";
import { addXP } from "@/lib/xpEngine";

export async function checkQuests(userId: string) {
    // Placeholder for auto-check logic
}

export async function completeQuest(userId: string, questId: string) {
    console.log(`Attempting to complete quest ${questId} for user ${userId}`);
    // Fetch quest from DB to get XP
    const quest = await prisma.quest.findUnique({ where: { id: questId } });
    if (!quest) {
        console.error(`Quest ${questId} not found in DB`);
        return null;
    }

    const existing = await prisma.userQuest.findFirst({
        where: { userId, questId }
    });

    if (existing && existing.status === 'COMPLETED') {
        console.log(`Quest ${questId} already completed`);
        return null; // Already done
    }

    console.log(`Completing quest ${questId}...`);
    if (existing) {
        await prisma.userQuest.update({
            where: { id: existing.id },
            data: { status: 'COMPLETED', completedAt: new Date() }
        });
    } else {
        await prisma.userQuest.create({
            data: {
                userId,
                questId,
                status: 'COMPLETED',
                completedAt: new Date()
            }
        });
    }

    if (quest.xp > 0) {
        await addXP(userId, quest.xp, `QUEST_COMPLETE:${questId}`);
    }

    return quest; // Return the quest object to indicate success
}
