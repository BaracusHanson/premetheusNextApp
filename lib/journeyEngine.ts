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
             
             // Create UserJourney if not exists
             const existingJourney = await prisma.userJourney.findUnique({
                 where: { userId_journeyId: { userId, journeyId: journey.id } }
             });
             
             if (!existingJourney) {
                 await prisma.userJourney.create({
                     data: {
                         userId,
                         journeyId: journey.id,
                         status: 'IN_PROGRESS',
                         startedAt: new Date()
                     }
                 });
             }

             console.log(`Journey ${journey.title} started for user ${userId}`);
        }
    }
}

export async function checkJourneyCompletion(userId: string) {
    const user = await prisma.userProfile.findUnique({
        where: { id: userId },
        include: { quests: true, journeys: true }
    });

    if (!user) return [];

    const completedQuestIds = new Set(
        user.quests.filter(q => q.status === 'COMPLETED').map(q => q.questId)
    );

    const allJourneys = await prisma.journey.findMany();
    const newBadges = [];

    for (const journey of allJourneys) {
        if (journey.steps.length === 0) continue;

        const isComplete = journey.steps.every(stepId => completedQuestIds.has(stepId));
        const userJourney = user.journeys.find(uj => uj.journeyId === journey.id);

        if (isComplete) {
            let justCompleted = false;

            if (!userJourney) {
                // Create as completed
                 await prisma.userJourney.create({
                    data: {
                        userId,
                        journeyId: journey.id,
                        status: 'COMPLETED',
                        completedAt: new Date(),
                        startedAt: new Date()
                    }
                });
                justCompleted = true;
            } else if (userJourney.status !== 'COMPLETED') {
                // Update to completed
                await prisma.userJourney.update({
                    where: { id: userJourney.id },
                    data: {
                        status: 'COMPLETED',
                        completedAt: new Date()
                    }
                });
                justCompleted = true;
            }

            if (justCompleted) {
                // Award Reward XP
                if (journey.rewardXp > 0) {
                    await addXP(userId, journey.rewardXp, `JOURNEY_COMPLETE:${journey.id}`);
                }
                // Award Badges
                if (journey.rewardBadges && Array.isArray(journey.rewardBadges)) {
                    for (const badgeId of journey.rewardBadges) {
                        const hasBadge = await prisma.userBadge.findUnique({ where: { userId_badgeId: { userId, badgeId: badgeId as string } } });
                        if (!hasBadge) {
                            await prisma.userBadge.create({ data: { userId, badgeId: badgeId as string, unlockedAt: new Date() } });
                            
                            // Fetch badge details for return
                            const badgeDetails = await prisma.badge.findUnique({ where: { id: badgeId as string } });
                            if (badgeDetails) newBadges.push(badgeDetails);
                        }
                    }
                }
            }
        } else {
            // Check if it should be IN_PROGRESS
            // ... (rest of logic untouched) ...
            const hasProgress = journey.steps.some(stepId => completedQuestIds.has(stepId));
             
             if (hasProgress) {
                 if (!userJourney) {
                     await prisma.userJourney.create({
                        data: {
                            userId,
                            journeyId: journey.id,
                            status: 'IN_PROGRESS',
                            startedAt: new Date()
                        }
                    });
                 } else if (userJourney.status === 'NOT_STARTED') {
                      await prisma.userJourney.update({
                        where: { id: userJourney.id },
                        data: { status: 'IN_PROGRESS' }
                    });
                 }
             }
        }
    }

    return newBadges;
}
