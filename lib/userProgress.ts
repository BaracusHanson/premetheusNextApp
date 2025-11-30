import { prisma } from "@/lib/db";
import { BADGES } from "@/lib/badges";
import { calculateLevel, getXPProgress } from "@/lib/xp";

export async function addXP(userId: string, amount: number, source: string) {
  const user = await prisma.userProfile.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const newTotalXP = user.totalXP + amount;
  const newLevel = calculateLevel(newTotalXP);

  await prisma.userProfile.update({
    where: { id: userId },
    data: {
      totalXP: newTotalXP,
      level: newLevel,
    },
  });

  await prisma.xPEvent.create({
    data: {
      userId,
      type: source,
      amount,
    },
  });

  // Trigger badge check after XP update
  await checkBadges(userId);
  
  return { newTotalXP, newLevel };
}

export async function checkBadges(userId: string) {
  const user = await prisma.userProfile.findUnique({
    where: { id: userId },
    include: { badges: true },
  });

  if (!user) return;

  const unlockedBadgeIds = new Set(user.badges.map((b) => b.badgeId));
  const newBadges = [];

  for (const badgeDef of BADGES) {
    if (unlockedBadgeIds.has(badgeDef.id)) continue;

    if (badgeDef.condition(user)) {
      newBadges.push(badgeDef);
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badgeDef.id,
        },
      });
      
      // Badge XP reward
      if (badgeDef.xp > 0) {
        await addXP(userId, badgeDef.xp, `BADGE_UNLOCK:${badgeDef.id}`);
      }
    }
  }

  return newBadges;
}
