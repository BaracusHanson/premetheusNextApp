import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Map, Trophy, Star } from "lucide-react";
import { Journey, UserJourney, QuestStatus } from "@prisma/client";
import Link from "next/link";

// Extend the type to include calculated progress
type JourneyWithProgress = Partial<UserJourney> & {
  id: string;
  journey: Journey;
  progress: number;
  totalSteps: number;
  completedSteps: number;
  status: QuestStatus | string; // Allow string for 'NOT_STARTED' fallback
};

interface JourneyCardProps {
  userJourney: JourneyWithProgress;
}

export function JourneyCard({ userJourney }: JourneyCardProps) {
  const { journey, progress, status } = userJourney;

  return (
    <Link href={`/journeys/${journey.id}`} className="block h-full">
      <Card className="border-2 hover:border-primary/50 transition-colors h-full cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Map className="h-5 w-5 text-primary" />
                {journey.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">{journey.description}</p>
            </div>
            <Badge variant={status === "COMPLETED" ? "default" : "outline"}>
              {status === "COMPLETED" ? "Terminé" : status === "IN_PROGRESS" ? "En cours" : "Non commencé"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progression</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{journey.rewardXp} XP</span>
              </div>
              {journey.rewardBadges.length > 0 && (
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-orange-500" />
                  <span>{journey.rewardBadges.length} Badge{journey.rewardBadges.length > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
