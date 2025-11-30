import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { formTriggers } from "@/prisma/data/formTriggers";

export async function GET() {
    try {
        // 1. Check Quest in DB
        const questId = "quest_work_first";
        const quest = await prisma.quest.findUnique({ where: { id: questId } });

        // 2. Check Trigger definition
        // @ts-ignore
        const trigger = formTriggers["firstJob"];

        return NextResponse.json({
            questId,
            foundInDb: !!quest,
            questData: quest,
            triggerDefinition: trigger,
            triggerField: "firstJob"
        });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message });
    }
}
