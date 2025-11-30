"use client";

import { useRouter } from "next/navigation";
import { QuestDefinition } from "@/types/quest";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle, ArrowRight } from "lucide-react";
import { QuestDetailsDialog } from "./QuestDetailsDialog";

interface QuestCardProps {
  quest: QuestDefinition;
  className?: string;
}

const THEME_MAP: Record<string, string> = {
  // French Step Titles / Groups
  "Identité & Origines": "identity",
  "Stabilité & Adaptation": "identity",
  "Enfance & Scolarité": "childhood",
  "Collège & Lycée": "education",
  "Études supérieures": "education",
  "Vie professionnelle": "work",
  "Autonomie & Vie d’adulte": "adulting",
  "Social, Résilience, Vision": "vision", // Starts at social, user can click next

  // English Internal Categories (from seed/badges)
  "Identity": "identity",
  "Adaptation": "identity",
  "School": "childhood", // Broad mapping, could be college/studies
  "Work": "work",
  "Adulting": "adulting",
  "Social": "vision",
  "Resilience": "vision",
  "Vision": "vision",

  // Legacy / Other keywords
  "Enfance": "childhood",
  "Scolarité": "education",
  "Savoir": "education",
  "Carrière": "work",
  "Vie Adulte": "adulting"
};

export function QuestCard({ quest, className }: QuestCardProps) {
  const router = useRouter();

  const handleStart = () => {
      const tab = THEME_MAP[quest.theme] || "identity";
      router.push(`/diagnostic?tab=${tab}`);
  };

  return (
    <Card className={`transition-all hover:shadow-md ${quest.status === 'locked' ? 'opacity-70 grayscale' : ''} ${className || ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{quest.title}</CardTitle>
            {quest.status === 'completed' && <CheckCircle className="text-accent h-5 w-5" />}
            {quest.status === 'locked' && <Lock className="text-muted-foreground h-5 w-5" />}
            {quest.status === 'available' && <Badge variant="secondary">Disponible</Badge>}
        </div>
        <CardDescription>{quest.theme.toUpperCase()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{quest.description}</p>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
                +{quest.xp} XP
            </Badge>
        </div>
      </CardContent>
      <CardFooter>
        {quest.status === 'available' && (
            <QuestDetailsDialog quest={quest} onStart={handleStart}>
                <Button className="w-full group">
                    Commencer la Quête
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
            </QuestDetailsDialog>
        )}
        {quest.status === 'completed' && (
            <QuestDetailsDialog quest={quest} onStart={handleStart}>
                <Button variant="outline" className="w-full group">
                    Complétée
                    <CheckCircle className="ml-2 h-4 w-4 text-green-600" />
                </Button>
            </QuestDetailsDialog>
        )}
        {quest.status === 'locked' && (
            <Button variant="ghost" className="w-full" disabled>
                Verrouillée
            </Button>
        )}
      </CardFooter>
    </Card>
  );
}
