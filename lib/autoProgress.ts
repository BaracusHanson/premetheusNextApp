import { checkBadges } from "./badgeEngine";
import { checkQuests, completeQuest } from "./questEngine";
import { checkJourneys, checkJourneyCompletion } from "./journeyEngine";
import { formTriggers } from "@/prisma/data/formTriggers";

export async function checkFormProgress(userId: string, stepId: string, currentAnswers: any) {
    // 1. Iterate over answers to find triggers
    // In a real efficient system, we'd pass only changed fields.
    // Here we iterate all current step answers or all answers.
    // Let's assume 'currentAnswers' contains the latest updates.
    
    const newQuests = [];
    const newJourneys = [];

    for (const [field, value] of Object.entries(currentAnswers)) {
        // @ts-ignore - formTriggers typing
        const trigger = formTriggers[field];
        if (trigger) {
            console.log(`Trigger ACTIVATED for field: ${field}`, trigger);

            // Check specific value condition if present
            if (trigger.value && trigger.value !== value) {
                console.log(`Trigger value mismatch for ${field}. Expected ${trigger.value}, got ${value}`);
                continue;
            }

            // Handle Quests
            let questsToProcess = trigger.quests || [];

            // Handle Value Mapping (e.g. degreeLevel: bachelor -> quest 1, master -> quest 2)
            if (trigger.valueMapping && trigger.valueMapping[value]) {
                questsToProcess = [...questsToProcess, ...trigger.valueMapping[value]];
            }

            if (questsToProcess.length > 0) {
                for (const qId of questsToProcess) {
                    console.log(`Checking quest trigger: ${qId}`);
                    const completed = await completeQuest(userId, qId); 
                    if (completed) {
                        console.log(`Quest ${qId} COMPLETED successfully.`);
                        newQuests.push(completed);
                    } else {
                        console.log(`Quest ${qId} completion returned null.`);
                    }
                }
            }
            
            // Handle Badges
            // Badges are usually checked via checkBadges() generic loop, 
            // but we can optimize by checking specific candidates
            // For now, checkBadges(userId) covers it generally.
            
            // Handle Journeys
            if (trigger.journeys) {
                // We handle this in journeyEngine more generically or here directly
                for (const jId of trigger.journeys) {
                    await checkJourneys(userId, field, value);
                }
            }
        }
        
        // Also run generic journey check
        await checkJourneys(userId, field, value);
    }

    // 2. Check generic badges (DB scan)
    const genericBadges = await checkBadges(userId);

    // 3. Check Journey Completion (Retroactive & Real-time)
    const journeyBadges = await checkJourneyCompletion(userId);
    
    const newBadges = [...genericBadges, ...journeyBadges];

    return { newQuests, newBadges };
}
