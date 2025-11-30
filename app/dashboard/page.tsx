import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { calculateStreak } from "@/lib/xpEngine";
import Link from "next/link";
import { ArrowRight, Trophy, Activity, BarChart3 } from "lucide-react";
import { LevelCard } from "@/components/LevelCard";
import { XPBar } from "@/components/XPBar";
import { QuestCard } from "@/components/QuestCard";
import { BadgeList } from "@/components/BadgeList"; // Refactored client component for list
import { JourneyCard } from "@/components/JourneyCard";
import { QuestStatus } from "@prisma/client";
import { InfoTooltip } from "@/components/InfoTooltip";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      quests: { include: { quest: true } },
      badges: { include: { badge: true } },
      journeys: { include: { journey: true } },
    },
  });

  if (!user) redirect("/auth/sign-in"); // Should handle creation if missing, but middleware protects

  const streak = await calculateStreak(user.id);

  // Fetch all available journeys
  const allJourneys = await prisma.journey.findMany();

  // Calculate Journey Progress for ALL journeys
  const journeysWithProgress = allJourneys.map(journey => {
    // Check if user has started this journey
    const userJourney = user.journeys.find(uj => uj.journeyId === journey.id);
    
    const totalSteps = journey.steps.length;
    const completedSteps = journey.steps.filter((stepId: string) => 
      user.quests.some(uq => uq.questId === stepId && uq.status === 'COMPLETED')
    ).length;
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    // Return composite object matching the expected prop type
    return {
      id: userJourney?.id || `virtual-${journey.id}`,
      userId: user.id,
      journeyId: journey.id,
      status: userJourney?.status || QuestStatus.NOT_STARTED,
      startedAt: userJourney?.startedAt || new Date(), // or null if allowed, but type expects Date
      completedAt: userJourney?.completedAt || null,
      journey: journey,
      progress,
      totalSteps,
      completedSteps
    };
  });

  // 1. Get In Progress Quest or Next Available
  let currentQuestData = null;
  let questStatus: 'available' | 'locked' | 'completed' = 'available';

  const inProgressQuests = user.quests.filter(uq => uq.status === 'IN_PROGRESS');
  
  if (inProgressQuests.length > 0) {
      currentQuestData = inProgressQuests[0].quest;
  } else {
      // Fallback: Find first Available quest
      const allQuests = await prisma.quest.findMany();
      const completedIds = new Set(user.quests.filter(q => q.status === 'COMPLETED').map(q => q.questId));
      
      const availableQuest = allQuests.find(q => {
          if (completedIds.has(q.id)) return false;
          // Check prerequisites
          const prereqs = q.prerequisites as string[];
          if (!prereqs || prereqs.length === 0) return true;
          return prereqs.every((pre: string) => completedIds.has(pre));
      });
      
      if (availableQuest) {
          currentQuestData = availableQuest;
      }
  }
  
  // Map DB Quest to UI Quest Type if needed, or just pass data
  const currentQuest: QuestDefinition | null = currentQuestData ? {
      ...currentQuestData,
      prerequisites: currentQuestData.prerequisites as string[], 
      status: questStatus
  } : null;

  // 2. Get Recent Badges
  // Sort by unlockedAt desc
  const recentUserBadges = [...user.badges].sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime()).slice(0, 3);
  
  const displayBadges = [];
  for (let i = 0; i < 3; i++) {
      if (i < recentUserBadges.length) {
          displayBadges.push({
              badge: {
                  ...recentUserBadges[i].badge,
                  rarity: recentUserBadges[i].badge.rarity as any
              },
              isUnlocked: true
          });
      } else {
          displayBadges.push({
              badge: {
                  id: `locked-${i}`,
                  name: "Badge Verrouillé",
                  description: "Continuez à progresser pour débloquer de nouveaux badges !",
                  category: "Locked",
                  rarity: "COMMON" as any,
                  xp: 0,
                  icon: "lock"
              },
              isUnlocked: false
          });
      }
  }

  const hour = new Date().getHours();
  const greeting = hour < 18 ? "Bonjour" : "Bonsoir";
  const subtext = streak > 2 
      ? "Vous êtes sur une lancée ! Continuez comme ça." 
      : "Prêt à reprendre votre progression aujourd'hui ?";

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <LevelCard level={user.level} xp={user.totalXP} />
        </div>
        <div className="w-full md:w-2/3 flex flex-col justify-center space-y-6 bg-gradient-to-br from-surface to-primary/5 p-8 rounded-2xl border shadow-sm relative overflow-hidden">
           {/* Background Decor */}
           <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-4xl font-heading font-extrabold mb-2 tracking-tight">
                    {greeting}, <span className="text-primary">{user.displayName || "Voyageur"}</span>.
                 </h2>
                 <p className="text-lg text-muted-foreground">
                    {subtext}
                 </p>
               </div>
               <Link href="/stats">
                 <Button variant="outline" size="icon" className="rounded-full h-10 w-10 bg-background/50 hover:bg-background">
                   <BarChart3 className="h-5 w-5" />
                 </Button>
               </Link>
            </div>
          </div>
          <XPBar xp={user.totalXP} />
          <div className="grid grid-cols-3 gap-4 text-center relative z-10">
            <div className="p-3 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm">
               <div className="text-2xl font-bold text-primary">{user.quests.filter(q => q.status === 'COMPLETED').length}</div>
               <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Quêtes</div>
            </div>
            <div className="p-3 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm">
               <div className="text-2xl font-bold text-secondary">{user.badges.length}</div>
               <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Badges</div>
            </div>
            <div className="p-3 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm">
               <div className="text-2xl font-bold text-accent">{streak}</div>
               <div className="text-xs text-muted-foreground uppercase font-medium tracking-wider">Série</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Current Quest */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Quête en cours
            </h3>
            <Link href="/quests" className="text-sm text-primary hover:underline flex items-center">
                Voir tout <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          {currentQuest ? (
              <QuestCard quest={currentQuest} />
          ) : (
              <div className="p-6 bg-surface border rounded-xl text-center text-muted-foreground">
                  Aucune quête en cours. Vérifiez le tableau des quêtes !
              </div>
          )}
        </div>

        {/* Recent Badges */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-warning" />
                Badges Récents
            </h3>
            <Link href="/badges" className="text-sm text-primary hover:underline flex items-center">
                Collection <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <BadgeList badges={displayBadges} />
        </div>
      </div>

      {/* Journeys Section */}
      {journeysWithProgress.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-heading font-bold flex items-center gap-2">
            <Map className="h-5 w-5 text-primary" />
            Parcours
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journeysWithProgress.map((uj: any) => (
              <JourneyCard key={uj.id} userJourney={uj} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
