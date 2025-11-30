import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Compass, Map, History } from "lucide-react";
import { JourneyCard } from "@/components/JourneyCard";
import { QuestStatus } from "@prisma/client";
import { generateTimelineFromAnswers } from "@/lib/sidEngine";
import { LifeTimeline } from "@/components/LifeTimeline";

export default async function JourneysListPage() {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      quests: true,
      journeys: true,
    },
  });

  if (!user) redirect("/auth/sign-in");

  // Fetch all form answers for timeline
  const formAnswersRecords = await prisma.userFormAnswers.findMany({
    where: { userId: user.id }
  });

  // Flatten answers
  const answers: Record<string, any> = {};
  formAnswersRecords.forEach(record => {
    if (record.data && typeof record.data === 'object') {
        Object.assign(answers, record.data);
    }
  });

  // Generate Timeline
  const timelineEvents = generateTimelineFromAnswers(answers);

  // Fetch all available journeys definition
  const allJourneys = await prisma.journey.findMany();

  // Calculate status & progress for each journey
  const journeysWithData = allJourneys.map(journey => {
    const userJourney = user.journeys.find(uj => uj.journeyId === journey.id);
    
    // Calculate real progress based on validated quests
    const totalSteps = journey.steps.length;
    const completedSteps = journey.steps.filter((stepId: string) => 
      user.quests.some(uq => uq.questId === stepId && uq.status === 'COMPLETED')
    ).length;
    
    const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

    // Determine display status
    let displayStatus = userJourney?.status || QuestStatus.NOT_STARTED;
    if (progress === 100) {
      displayStatus = QuestStatus.COMPLETED;
    } else if (progress > 0 && displayStatus === QuestStatus.NOT_STARTED) {
      displayStatus = QuestStatus.IN_PROGRESS;
    }

    return {
      id: userJourney?.id || `virtual-${journey.id}`,
      userId: user.id,
      journeyId: journey.id,
      status: displayStatus,
      startedAt: userJourney?.startedAt || new Date(),
      completedAt: userJourney?.completedAt || null,
      journey: journey,
      progress,
      totalSteps,
      completedSteps
    };
  });

  return (
    <div className="container max-w-6xl py-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit">
           <ArrowLeft className="mr-2 h-4 w-4" /> Retour au tableau de bord
        </Link>
        <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
                <Compass className="w-8 h-8 text-primary" />
            </div>
            <div>
                <h1 className="text-3xl font-heading font-bold tracking-tight">Parcours de Vie</h1>
                <p className="text-muted-foreground text-lg">Choisissez votre prochaine grande aventure.</p>
            </div>
        </div>
      </div>

      {/* Life Timeline Section */}
      {timelineEvents.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">Votre Ligne de Vie</h2>
            </div>
            <div className="p-1 bg-muted/30 rounded-2xl border border-dashed">
                <LifeTimeline events={timelineEvents} />
            </div>
        </div>
      )}

      {/* Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
            <Map className="w-5 h-5 text-secondary" />
            Parcours Disponibles
        </h2>
        {journeysWithData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journeysWithData.map((uj: any) => (
                    <JourneyCard key={uj.journeyId} userJourney={uj} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl bg-muted/30">
                <Map className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-xl font-semibold">Aucun parcours disponible</h3>
                <p className="text-muted-foreground">Revenez plus tard pour découvrir de nouvelles aventures.</p>
            </div>
        )}
      </div>
    </div>
  );
}
