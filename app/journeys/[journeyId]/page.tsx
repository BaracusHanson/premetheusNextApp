import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  MapPin, 
  Trophy, 
  Star, 
  PlayCircle,
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface JourneyDetailPageProps {
  params: {
    journeyId: string;
  };
}

const THEME_MAP: Record<string, string> = {
  // V2 Themes (Matches quests.ts) mapped to ACTUAL formSteps IDs
  "Identité & Origines": "general",       // formSteps[0].id
  "Savoir & Formation": "education",      // formSteps[1].id
  "Carrière & Impact": "work",            // formSteps[2].id
  "Style de Vie": "adulting",             // formSteps[3].id
  "Croissance & Futur": "resilience_vision", // formSteps[4].id

  // Fallbacks
  "Identity": "general",
  "Knowledge": "education",
  "Career": "work",
  "Lifestyle": "adulting",
  "Growth": "resilience_vision"
};

export default async function JourneyDetailPage({ params }: JourneyDetailPageProps) {
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

  if (!user) redirect("/auth/sign-in");

  // Fetch Journey Definition
  const journeyDef = await prisma.journey.findUnique({
    where: { id: params.journeyId },
  });

  if (!journeyDef) {
    return <div className="p-8 text-center">Parcours introuvable.</div>;
  }

  // Fetch Quests involved in this journey
  const journeyQuests = await prisma.quest.findMany({
    where: {
      id: { in: journeyDef.steps as string[] }
    }
  });

  // Collect all prerequisite IDs to fetch their titles
  const allPrereqIds = new Set<string>();
  journeyQuests.forEach(q => {
      if (Array.isArray(q.prerequisites)) {
          q.prerequisites.forEach((id: string) => allPrereqIds.add(id));
      }
  });

  const prereqQuests = await prisma.quest.findMany({
      where: { id: { in: Array.from(allPrereqIds) } },
      select: { id: true, title: true }
  });
  
  const prereqMap = new Map(prereqQuests.map(q => [q.id, q.title]));

  // Sort quests based on the order in journey.steps
  const sortedQuests = (journeyDef.steps as string[])
    .map(stepId => journeyQuests.find(q => q.id === stepId))
    .filter((q): q is NonNullable<typeof q> => !!q);

  // Determine Statuses
  const userJourney = user.journeys.find(uj => uj.journeyId === params.journeyId);
  const completedQuestIds = new Set(user.quests.filter(q => q.status === 'COMPLETED').map(q => q.questId));
  
  // Calculate Stats
  const totalSteps = journeyDef.steps.length;
  const completedStepsCount = (journeyDef.steps as string[]).filter(id => completedQuestIds.has(id)).length;
  const progress = totalSteps > 0 ? (completedStepsCount / totalSteps) * 100 : 0;

  // Fetch Reward Badges details if any
  const rewardBadges = await prisma.badge.findMany({
    where: { id: { in: journeyDef.rewardBadges as string[] } }
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
              {journeyDef.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {journeyDef.description}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={progress === 100 ? "default" : "secondary"} className="text-sm px-3 py-1">
              {progress === 100 ? "Terminé" : userJourney ? "En cours" : "Non commencé"}
            </Badge>
          </div>
        </div>

        {/* Global Stats Card */}
        <Card className="bg-card/50 border-primary/20">
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
                  {journeyDef.rewardXp}
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
            const isCompleted = completedQuestIds.has(quest.id);
            
            // Check Prerequisites
            const prerequisites = (quest.prerequisites as string[]) || [];
            const missingPrereqs = prerequisites.filter(id => !completedQuestIds.has(id));
            const isPrereqLocked = missingPrereqs.length > 0;

            // Check Sequential Order (previous step must be done)
            const isSequenceLocked = index > 0 && !completedQuestIds.has(sortedQuests[index - 1]!.id);
            
            const isLocked = isPrereqLocked || isSequenceLocked;
            const isNext = !isCompleted && !isLocked;

            // Calculate Start URL
            const tab = THEME_MAP[quest.theme] || "general";
            let targetField = null;
            if (quest.trigger && typeof quest.trigger === 'object' && (quest.trigger as any).field) {
                targetField = (quest.trigger as any).field;
            }
            const startUrl = targetField 
                ? `/diagnostic?tab=${tab}&focus=${targetField}` 
                : `/diagnostic?tab=${tab}`;

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
                <Card className={`transition-all duration-200 hover:shadow-md ${isLocked ? "opacity-80" : "border-l-4 border-l-primary"}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                         <CardTitle className="text-lg flex items-center gap-2">
                             {quest.title}
                             {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                         </CardTitle>
                         <CardDescription>{quest.theme}</CardDescription>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                        <Star className="h-3 w-3" /> {quest.xp} XP
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>
                    
                    {isPrereqLocked && (
                        <div className="mb-4 p-3 bg-destructive/10 rounded-md text-sm text-destructive">
                            <p className="font-semibold mb-1">Prérequis manquants :</p>
                            <ul className="list-disc list-inside">
                                {missingPrereqs.map(pid => (
                                    <li key={pid}>
                                        {prereqMap.get(pid) || pid}
                                        {/* Link to the prerequisite quest if it's not in this journey? */}
                                        <Link href={`/quests?focus=${pid}`} className="ml-2 text-xs underline opacity-80 hover:opacity-100">
                                            Voir
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!isLocked && !isCompleted && (
                       <Button size="sm" className="gap-2" asChild>
                            <Link href={startUrl}>
                                Commencer <ArrowRight className="h-4 w-4" />
                            </Link>
                       </Button>
                    )}
                    {isCompleted && (
                        <div className="text-sm font-medium text-green-600 flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4" /> Quête complétée
                        </div>
                    )}
                    {isSequenceLocked && !isPrereqLocked && (
                        <div className="text-sm text-muted-foreground italic">
                            Terminez l'étape précédente pour débloquer celle-ci.
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
