import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, MapPin, Star, Trophy, Circle, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestStatus } from "@prisma/client";

export default async function JourneyDetailsPage({ params }: { params: { journeyId: string } }) {
  const { userId } = auth();
  if (!userId) redirect("/auth/sign-in");

  const { journeyId } = params;

  // 1. Fetch Journey Details
  const journey = await prisma.journey.findUnique({
    where: { id: journeyId },
  });

  if (!journey) {
    return <div>Parcours introuvable.</div>;
  }

  // 2. Fetch User Profile for quest status checking
  const user = await prisma.userProfile.findUnique({
    where: { clerkUserId: userId },
    include: {
      quests: true,
      journeys: true,
    }
  });

  if (!user) redirect("/auth/sign-in");

  // 3. Fetch Quests involved in this journey
  // We need to preserve the order of steps defined in journey.steps
  const quests = await prisma.quest.findMany({
    where: {
      id: { in: journey.steps }
    }
  });

  // Sort quests based on the order in journey.steps
  const sortedQuests = journey.steps.map(stepId => quests.find(q => q.id === stepId)).filter(Boolean);

  // 4. Determine Statuses
  const userJourney = user.journeys.find(uj => uj.journeyId === journeyId);
  const completedQuestIds = new Set(user.quests.filter(q => q.status === 'COMPLETED').map(q => q.questId));
  
  // Calculate Stats
  const totalSteps = journey.steps.length;
  const completedStepsCount = journey.steps.filter(id => completedQuestIds.has(id)).length;
  const progress = totalSteps > 0 ? (completedStepsCount / totalSteps) * 100 : 0;

  // Fetch Reward Badges details if any
  const rewardBadges = await prisma.badge.findMany({
    where: { id: { in: journey.rewardBadges } }
  });

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Back Navigation */}
      <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour au tableau de bord
      </Link>

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-bold text-primary flex items-center gap-3">
              <MapPin className="h-8 w-8" />
              {journey.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {journey.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={progress === 100 ? "default" : "secondary"} className="text-sm px-3 py-1">
              {progress === 100 ? "Terminé" : userJourney ? "En cours" : "Non commencé"}
            </Badge>
          </div>
        </div>

        {/* Global Stats Card */}
        <Card className="bg-surface/50 border-primary/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-xs uppercase text-muted-foreground font-bold">Progression</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase text-muted-foreground font-bold">Étapes</span>
                <div className="text-2xl font-bold">
                  {completedStepsCount} / {totalSteps}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase text-muted-foreground font-bold">Récompense XP</span>
                <div className="flex items-center gap-1 text-2xl font-bold text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  {journey.rewardXp}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase text-muted-foreground font-bold">Badges</span>
                <div className="flex items-center gap-1 text-2xl font-bold text-orange-500">
                  <Trophy className="h-5 w-5 fill-current" />
                  {rewardBadges.length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline / Steps Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-heading font-bold">Votre Itinéraire</h2>
        <div className="relative space-y-0">
          {/* Vertical Line */}
          <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border -z-10" />

          {sortedQuests.map((quest, index) => {
            if (!quest) return null;
            
            const isCompleted = completedQuestIds.has(quest.id);
            // A quest is locked if the previous one isn't completed (simple sequential logic for visual, though real logic might be more complex in engine)
            // For visual simplicity here: if it's not completed and previous wasn't completed, it's locked.
            // Actually, let's just check if it's "available" based on completion.
            // Ideally we'd check prerequisites, but for the journey view, usually steps are sequential.
            // Let's assume sequential for the visual timeline.
            const isLocked = index > 0 && !completedQuestIds.has(sortedQuests[index - 1]!.id);
            const isNext = !isCompleted && !isLocked;

            return (
              <div key={quest.id} className="relative pl-16 py-4 group">
                {/* Icon Marker */}
                <div className={`absolute left-2 top-5 h-8 w-8 rounded-full border-4 flex items-center justify-center bg-background z-10 
                  ${isCompleted ? "border-green-500 text-green-500" : isNext ? "border-primary text-primary animate-pulse" : "border-muted text-muted-foreground"}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isNext ? (
                    <PlayCircle className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </div>

                {/* Card */}
                <Card className={`transition-all duration-200 hover:shadow-md ${isLocked ? "opacity-60 grayscale" : "border-l-4 border-l-primary"}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                         <CardTitle className="text-lg">{quest.title}</CardTitle>
                         <CardDescription>{quest.theme}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3" /> {quest.xp} XP
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>
                    
                    {!isLocked && !isCompleted && (
                       <Link href={`/quests?focus=${quest.id}`}>
                         <Button size="sm" className="gap-2">
                            Commencer <ArrowRight className="h-4 w-4" />
                         </Button>
                       </Link>
                    )}
                    {isCompleted && (
                        <div className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Quête complétée
                        </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rewards Section if available */}
      {rewardBadges.length > 0 && (
          <div className="space-y-4">
              <h2 className="text-xl font-heading font-bold">Récompenses Finales</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {rewardBadges.map(badge => (
                      <Card key={badge.id} className="bg-gradient-to-br from-surface to-background border-dashed">
                          <CardContent className="p-4 flex items-center gap-4">
                              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                  <Trophy className="h-6 w-6" />
                              </div>
                              <div>
                                  <div className="font-bold">{badge.name}</div>
                                  <div className="text-xs text-muted-foreground">{badge.category}</div>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}
