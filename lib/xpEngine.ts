import { prisma } from "@/lib/db";
import { calculateLevel } from "@/lib/xp";
import { isSameDay, subDays, startOfDay } from "date-fns";

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

  return { newTotalXP, newLevel };
}

export async function calculateStreak(userId: string) {
  const events = await prisma.xPEvent.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true }
  });

  if (events.length === 0) return 0;

  // Get unique days (normalized to start of day)
  const uniqueDays = Array.from(new Set(
      events.map(e => startOfDay(e.createdAt).toISOString())
  )).map(iso => new Date(iso)); // Sorted desc implicitly if events were sorted? Not guaranteed after Set.
  
  // Sort desc
  uniqueDays.sort((a, b) => b.getTime() - a.getTime());

  if (uniqueDays.length === 0) return 0;

  const today = startOfDay(new Date());
  const yesterday = startOfDay(subDays(new Date(), 1));
  const lastActivity = uniqueDays[0];

  // Streak is active if last activity was today or yesterday
  if (!isSameDay(lastActivity, today) && !isSameDay(lastActivity, yesterday)) {
      return 0;
  }

  let streak = 1;
  let current = lastActivity;

  for (let i = 1; i < uniqueDays.length; i++) {
      const prevDate = uniqueDays[i];
      const expectedPrev = subDays(current, 1);
      
      if (isSameDay(prevDate, expectedPrev)) {
          streak++;
          current = prevDate;
      } else {
          break;
      }
  }

  return streak;
}
