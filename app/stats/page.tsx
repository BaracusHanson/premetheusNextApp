import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import StatsPageClient from "@/components/StatsPageClient";

export default async function StatsPage() {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      quests: { include: { quest: true } },
      xpEvents: true
    }
  });

  if (!user) redirect("/auth/sign-in");

  // --- Data Processing ---

  // 1. Global Stats
  const totalAvailableQuests = await prisma.quest.count();
  const completedQuestsCount = user.quests.filter(q => q.status === 'COMPLETED').length;
  const completionRate = totalAvailableQuests > 0 
    ? Math.round((completedQuestsCount / totalAvailableQuests) * 100) 
    : 0;
  
  // Average Daily XP (Last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentXpEvents = user.xpEvents.filter(e => e.createdAt >= thirtyDaysAgo);
  const totalRecentXp = recentXpEvents.reduce((acc, curr) => acc + curr.amount, 0);
  const averageDailyXp = Math.round(totalRecentXp / 30);

  // 2. XP History (Cumulative)
  // Sort events by date asc
  const sortedEvents = [...user.xpEvents].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  
  let runningTotal = 0;
  const xpHistoryMap = new Map<string, number>();

  // Initialize a simple map for daily totals if we want cumulative curve
  // But to make it look like a "growth" chart, we just map cumulative over time.
  // To prevent too many points, we can aggregate by day.
  sortedEvents.forEach(e => {
    const dateKey = e.createdAt.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    runningTotal += e.amount;
    xpHistoryMap.set(dateKey, runningTotal);
  });

  // Convert map to array
  const xpHistory = Array.from(xpHistoryMap.entries()).map(([date, xp]) => ({ date, xp }));

  // If empty, add start point
  if (xpHistory.length === 0) {
      xpHistory.push({ date: new Date().toLocaleDateString('fr-FR'), xp: user.totalXP });
  }

  // 3. Theme Data (Radar Chart)
  const themeMap = new Map<string, number>();
  
  user.quests.forEach(uq => {
    if (uq.status === 'COMPLETED') {
      const theme = uq.quest.theme || 'Divers';
      const currentXp = themeMap.get(theme) || 0;
      themeMap.set(theme, currentXp + uq.quest.xp);
    }
  });

  const themeData = Array.from(themeMap.entries()).map(([subject, xp]) => ({
    subject,
    A: xp,
    fullMark: 1000 // arbitrary max for radar scale normalization if needed, or let recharts handle auto
  }));

  // 4. Activity Data (Last 7 Days)
  const activityData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('fr-FR', { weekday: 'short' });
    
    // Count events on this day
    const count = user.xpEvents.filter(e => 
        e.createdAt.getDate() === d.getDate() && 
        e.createdAt.getMonth() === d.getMonth() && 
        e.createdAt.getFullYear() === d.getFullYear()
    ).length;

    activityData.push({ day: dateStr, count });
  }

  return (
    <StatsPageClient 
      xpHistory={xpHistory}
      themeData={themeData}
      activityData={activityData}
      globalStats={{
        totalQuests: totalAvailableQuests,
        completedQuests: completedQuestsCount,
        completionRate,
        averageDailyXp
      }}
    />
  );
}
