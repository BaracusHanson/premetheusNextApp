import { prisma } from "@/lib/db";

export async function getUserRadarStats(userId: string) {
  const user = await prisma.userProfile.findUnique({
    where: { id: userId },
    include: {
      quests: {
        where: { status: 'COMPLETED' },
        include: { quest: true }
      }
    }
  });

  if (!user) return [];

  // Initialize categories map with V2 Themes
  // 10 points base value so chart isn't empty
  const statsMap: Record<string, number> = {
    "Identity": 10,
    "Knowledge": 10,
    "Career": 10,
    "Lifestyle": 10,
    "Growth": 10
  };

  // Map V2 Quest Themes to Radar Keys
  const themeMapping: Record<string, string> = {
    "Identité & Origines": "Identity",
    "Savoir & Formation": "Knowledge",
    "Carrière & Impact": "Career",
    "Style de Vie": "Lifestyle",
    "Croissance & Futur": "Growth",
    
    // Fallbacks for older data or English keys
    "Identity": "Identity",
    "Knowledge": "Knowledge", 
    "School": "Knowledge",
    "Work": "Career",
    "Career": "Career",
    "Adulting": "Lifestyle",
    "Lifestyle": "Lifestyle",
    "Growth": "Growth",
    "Resilience": "Growth",
    "Vision": "Growth"
  };

  user.quests.forEach(uq => {
    // Use mapping or fallback to Identity if unknown
    const shortTheme = themeMapping[uq.quest.theme]; 
    if (shortTheme && statsMap[shortTheme] !== undefined) {
        // Add normalized score based on XP
        // Example: 100 XP = 5 points on radar
        statsMap[shortTheme] += Math.min(uq.quest.xp / 5, 30); // More impact per quest
    }
  });

  // Convert to Nivo format
  // Max value is visually 100
  return Object.entries(statsMap).map(([subject, value]) => ({
    subject,
    value: Math.min(value, 100),
    fullMark: 100
  }));
}

export async function getUserActivityHistory(userId: string) {
  // Get activity for the last 365 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 365);

  const events = await prisma.xPEvent.groupBy({
    by: ['createdAt'],
    where: {
      userId: userId,
      createdAt: {
        gte: startDate
      }
    },
    _sum: {
      amount: true
    }
  });

  // Group by Day (YYYY-MM-DD)
  const activityMap = new Map<string, number>();
  
  events.forEach(event => {
      const day = event.createdAt.toISOString().split('T')[0];
      const amount = event._sum.amount || 0;
      activityMap.set(day, (activityMap.get(day) || 0) + amount);
  });

  // Format for Nivo Calendar or custom grid
  const data = Array.from(activityMap.entries()).map(([day, value]) => ({
      day,
      value
  }));

  return data;
}

export async function getUserGlobalAura(userId: string) {
  // Aura = Average completion % of ALL base journeys
  // This encourages touching all aspects of life, not just one.
  
  const user = await prisma.userProfile.findUnique({
    where: { id: userId },
    include: {
      quests: { where: { status: 'COMPLETED' } }
    }
  });

  if (!user) return 0;

  // Fetch all journeys definitions (we need total steps count for each)
  const allJourneys = await prisma.journey.findMany();
  
  if (allJourneys.length === 0) return 0;

  let totalProgressSum = 0;

  allJourneys.forEach(journey => {
      const totalSteps = journey.steps.length;
      if (totalSteps === 0) return; // Skip empty journeys

      const completedSteps = journey.steps.filter((stepId: string) => 
          user.quests.some(uq => uq.questId === stepId)
      ).length;

      const progress = (completedSteps / totalSteps) * 100;
      totalProgressSum += progress;
  });

  const aura = Math.round(totalProgressSum / allJourneys.length);
  return aura;
}
