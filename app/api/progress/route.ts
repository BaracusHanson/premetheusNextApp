import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { QUESTS } from "@/lib/quests";
import { BADGES } from "@/lib/badges";
import { getXPProgress } from "@/lib/xp";

export async function GET() {
  try {
    const user = await getCurrentUserProfile();
    
    const userQuests = await prisma.userQuest.findMany({
      where: { userId: user.id, status: "COMPLETED" },
    });
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: user.id },
    });

    const xpProgress = getXPProgress(user.totalXP);
    
    // Calculate percentage
    const percentage = Math.min(100, Math.floor((xpProgress.current / xpProgress.needed) * 100));

    return NextResponse.json({
      questsCompleted: userQuests.length,
      questsTotal: QUESTS.length,
      badgesUnlocked: userBadges.length,
      badgesTotal: BADGES.length,
      xp: user.totalXP,
      level: user.level,
      levelProgress: {
        current: xpProgress.current,
        needed: xpProgress.needed,
        percentage,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
