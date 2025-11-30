
import { prisma } from "../lib/db";
import { formTriggers } from "../prisma/data/formTriggers";
import { completeQuest } from "../lib/questEngine";

async function main() {
    console.log("Starting Quest Sync...");

    const users = await prisma.userProfile.findMany({
        include: {
            formAnswers: true
        }
    });

    for (const user of users) {
        console.log(`Checking user ${user.displayName || user.id}...`);
        
        // Reconstruct flattened answers
        const answers: Record<string, any> = {};
        user.formAnswers.forEach(record => {
            if (record.data && typeof record.data === 'object') {
                Object.entries(record.data as Record<string, any>).forEach(([key, value]) => {
                    answers[key] = value;
                });
            }
        });

        // Check triggers
        for (const [field, value] of Object.entries(answers)) {
            // @ts-ignore
            const trigger = formTriggers[field];
            if (trigger) {
                // Check specific value condition
                if (trigger.value && trigger.value !== value) {
                    continue;
                }

                // Quests
                let questsToProcess = trigger.quests || [];
                if (trigger.valueMapping && trigger.valueMapping[value]) {
                    questsToProcess = [...questsToProcess, ...trigger.valueMapping[value]];
                }

                for (const qId of questsToProcess) {
                    await completeQuest(user.id, qId);
                }
            }
        }
    }

    console.log("Sync complete.");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
