import { prisma } from "@/lib/db";
import { addXP } from "@/lib/xpEngine";

export async function checkJourneys(userId: string, fieldName: string, value: any) {
    // 1. Find journeys that trigger on this field
    // In a real app with huge data, we'd query DB.
    // Here we can fetch all journeys with triggers or use the static map if we trust it.
    // Let's query DB for journeys with matching triggers in JSON
    
    // JSON query in Prisma is tricky for arrays of objects.
    // We'll assume we fetch potential journeys or use the hardcoded triggers if we moved them to lib.
    // But since data is in DB now, we should use DB.
    
    // Fetch all journeys (caching recommended in production)
    const journeys = await prisma.journey.findMany();
    
    for (const journey of journeys) {
        const triggers = journey.triggers as any[];
        if (!triggers || triggers.length === 0) continue;
        
        // Check if any trigger matches
        const match = triggers.some(t => t.field === fieldName && (t.value === 'any' || t.value === value));
        
        if (match) {
             // Unlock journey? 
             // Journeys might be "unlocked" or just "started".
             // We don't have a UserJourney model in schema yet?
             // The prompt didn't explicitly ask for UserJourney model, but "journeys adaptés".
             // Maybe we just notify or give XP/Badge immediately if it's a "completion" journey?
             // Or maybe we assign Quests?
             
             // "steps: questIds". So we probably assign these quests to the user?
             
             // Let's assign the quests in the journey to the user if not present
             for (const stepId of journey.steps) {
                 // Verify quest exists to avoid FK error
                 const questExists = await prisma.quest.findUnique({ where: { id: stepId } });
                 if (!questExists) {
                     console.warn(`Journey step ${stepId} not found in Quests table. Skipping.`);
                     continue;
                 }

                 const existing = await prisma.userQuest.findFirst({ where: { userId, questId: stepId } });
                 if (!existing) {
                     await prisma.userQuest.create({
                         data: { userId, questId: stepId, status: 'IN_PROGRESS' } // Unlock them
                     });
                 }
             }
             
             // Maybe notify user?
             console.log(`Journey ${journey.title} started for user ${userId}`);
        }
    }
}
