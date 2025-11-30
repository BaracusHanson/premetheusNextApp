"use client";

import { useRouter } from "next/navigation";
import { QuestDefinition } from "@/types/quest";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle, ArrowRight, Zap, Clock } from "lucide-react";
import { QuestDetailsDialog } from "./QuestDetailsDialog";
import { motion } from "framer-motion";
import { hoverCard } from "@/lib/motion";

interface QuestCardProps {
  quest: QuestDefinition;
  className?: string;
}

const THEME_MAP: Record<string, string> = {
  // V2 Themes (Matches quests.ts) mapped to ACTUAL formSteps IDs
  "Identité & Origines": "general",       // formSteps[0].id
  "Savoir & Formation": "education",      // formSteps[1].id
  "Carrière & Impact": "work",            // formSteps[2].id
  "Style de Vie": "adulting",             // formSteps[3].id
  "Croissance & Futur": "resilience_vision", // formSteps[4].id

  // English Internal Categories (Backup)
  "Identity": "general",
  "Knowledge": "education",
  "School": "education",
  "Career": "work",
  "Work": "work",
  "Lifestyle": "adulting",
  "Adulting": "adulting",
  "Growth": "resilience_vision",
  "Resilience": "resilience_vision",
  "Vision": "resilience_vision",
  "Social": "resilience_vision"
};

export function QuestCard({ quest, className }: QuestCardProps) {
  const router = useRouter();

  const handleStart = () => {
      const tab = THEME_MAP[quest.theme] || "general";
      router.push(`/diagnostic?tab=${tab}`);
  };

  return (
    <motion.div
        whileHover={quest.status !== 'locked' ? hoverCard : {}}
        className={`h-full ${className}`}
    >
        <Card className={`h-full flex flex-col transition-all duration-300 border-l-4 
            ${quest.status === 'locked' ? 'opacity-60 bg-muted border-l-muted-foreground/30' : 
              quest.status === 'completed' ? 'border-l-green-500 bg-green-500/5' : 
              'border-l-primary shadow-sm hover:shadow-md bg-card'}
        `}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-lg font-bold leading-tight line-clamp-2">{quest.title}</CardTitle>
                {quest.status === 'completed' && <CheckCircle className="text-green-500 h-6 w-6 shrink-0" />}
                {quest.status === 'locked' && <Lock className="text-muted-foreground h-5 w-5 shrink-0" />}
                {quest.status === 'available' && <Badge className="bg-primary/10 text-primary hover:bg-primary/20 whitespace-nowrap">Disponible</Badge>}
                {quest.status === 'in_progress' && <Badge variant="secondary" className="whitespace-nowrap flex items-center gap-1"><Clock className="w-3 h-3" /> En cours</Badge>}
            </div>
            <CardDescription className="font-medium text-xs tracking-wider uppercase text-muted-foreground/80">{quest.theme}</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed line-clamp-3">{quest.description}</p>
            
            <div className="flex items-center gap-3">
                <Badge variant="outline" className="font-mono text-xs px-3 py-1 border-primary/20 bg-primary/5 text-primary flex items-center gap-1.5">
                    <Zap className="w-3 h-3 fill-primary" />
                    +{quest.xp} XP
                </Badge>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2">
            {quest.status === 'available' && (
                <QuestDetailsDialog quest={quest} onStart={handleStart}>
                    <Button className="w-full group font-semibold shadow-sm hover:shadow-primary/20">
                        Commencer la Quête
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </QuestDetailsDialog>
            )}
            {quest.status === 'in_progress' && (
                <QuestDetailsDialog quest={quest} onStart={handleStart}>
                    <Button className="w-full group font-semibold" variant="secondary">
                        Continuer
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </QuestDetailsDialog>
            )}
            {quest.status === 'completed' && (
                <QuestDetailsDialog quest={quest} onStart={handleStart}>
                    <Button variant="ghost" className="w-full group text-green-600 hover:text-green-700 hover:bg-green-50">
                        Détails
                        <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                </QuestDetailsDialog>
            )}
            {quest.status === 'locked' && (
                <Button variant="ghost" className="w-full bg-muted/50 text-muted-foreground" disabled>
                    <Lock className="w-4 h-4 mr-2" /> Verrouillée
                </Button>
            )}
          </CardFooter>
        </Card>
    </motion.div>
  );
}
