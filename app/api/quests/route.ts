import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { QUESTS, getQuestById } from "@/lib/quests";
import { addXP } from "@/lib/userProgress";
import { z } from "zod";
import { checkJourneyCompletion } from "@/lib/journeyEngine";

export async function GET() {
  try {
    const user = await getCurrentUserProfile();
    
    const userQuests = await prisma.userQuest.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      availableQuests: QUESTS,
      userProgress: userQuests,
    });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

const questActionSchema = z.object({
  questId: z.string(),
  action: z.enum(["start", "complete"]),
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUserProfile();
    const body = await req.json();
    
    const result = questActionSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { questId, action } = result.data;
    const questDef = getQuestById(questId);

    if (!questDef) {
      return NextResponse.json({ error: "Quest not found" }, { status: 404 });
    }

    let userQuest = await prisma.userQuest.findFirst({
      where: { userId: user.id, questId },
    });

    if (action === "start") {
      if (userQuest) {
        return NextResponse.json({ error: "Quest already started" }, { status: 400 });
      }
      userQuest = await prisma.userQuest.create({
        data: {
          userId: user.id,
          questId,
          status: "IN_PROGRESS",
        },
      });
    } else if (action === "complete") {
      if (!userQuest || userQuest.status !== "IN_PROGRESS") {
        // Allow completing if it was implicitly started or just allow idempotent completion?
        // Strict mode: must be in progress.
        // Let's allow creating it as completed if not started for simple one-off events.
        if (!userQuest) {
             userQuest = await prisma.userQuest.create({
                data: {
                  userId: user.id,
                  questId,
                  status: "COMPLETED",
                  completedAt: new Date(),
                },
              });
        } else {
            userQuest = await prisma.userQuest.update({
                where: { id: userQuest.id },
                data: {
                  status: "COMPLETED",
                  completedAt: new Date(),
                },
              });
        }
      } else {
         userQuest = await prisma.userQuest.update({
            where: { id: userQuest.id },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
            },
          });
      }

      // Award XP
      await addXP(user.id, questDef.xp, `QUEST_COMPLETE:${questId}`);

      // Check and update Journey progress
      await checkJourneyCompletion(user.id);
    }

    return NextResponse.json(userQuest);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
