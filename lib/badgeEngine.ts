import { prisma } from "@/lib/db";
import { addXP } from "@/lib/xpEngine";

export async function checkBadges(userId: string) {
  const user = await prisma.userProfile.findUnique({
    where: { id: userId },
    include: { 
        badges: true, 
        quests: true,
        formAnswers: true
    },
  });

  if (!user) return [];

  // Fetch all badges from DB
  const allBadges = await prisma.badge.findMany();
  const unlockedBadgeIds = new Set(user.badges.map((b) => b.badgeId));
  const newBadges = [];

  for (const badge of allBadges) {
    if (unlockedBadgeIds.has(badge.id)) continue;

    // Check condition stored in JSON
    const condition = badge.condition as any;
    let isUnlocked = false;

    if (!condition) continue; // No condition, manual unlock?

    if (condition.type === 'quest.completed') {
        isUnlocked = user.quests.some(q => q.questId === condition.questId && q.status === 'COMPLETED');
    } else if (condition.type === 'form.value') {
        // Need to parse form answers. This is expensive if JSON structure varies.
        // Simplified check:
        // Flatten answers?
        // For now, assume we check specific known fields or we rely on formTriggers to trigger specific checks.
        // But generic check:
        // We need to load answers.
    } else if (condition.type === 'multi_section_completed') {
        // Check logic
    }

    // For the demo, we rely mainly on explicit triggers from autoProgress for performance, 
    // or simple Quest completion checks here.
    
    if (isUnlocked) {
      newBadges.push(badge);
      
      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });
      
      if (badge.xp > 0) {
        await addXP(userId, badge.xp, `BADGE_UNLOCK:${badge.id}`);
      }
    }
  }

  return newBadges;
}
