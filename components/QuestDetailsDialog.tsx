"use client";

import { QuestDefinition } from "@/types/quest";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, ListChecks, Trophy, CheckCircle } from "lucide-react";
import { useState } from "react";

interface QuestDetailsDialogProps {
  quest: QuestDefinition;
  onStart: () => void;
  children: React.ReactNode;
}

export function QuestDetailsDialog({ quest, onStart, children }: QuestDetailsDialogProps) {
  const [open, setOpen] = useState(false);
  const isCompleted = quest.status === 'completed';

  const handleStart = () => {
    setOpen(false);
    onStart();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs uppercase tracking-wider">
              {quest.theme}
            </Badge>
            {quest.estimatedTime && (
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {quest.estimatedTime}
              </Badge>
            )}
            {isCompleted && (
               <Badge className="bg-green-600 text-white hover:bg-green-700">
                   Complétée
               </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl flex items-center gap-2">
              {quest.title}
              {isCompleted && <CheckCircle className="w-6 h-6 text-green-600" />}
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            {quest.longDescription || quest.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* XP Reward */}
          <div className={`flex items-center p-4 rounded-lg border ${isCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900' : 'bg-accent/10 border-accent/20'}`}>
            <Trophy className={`w-8 h-8 mr-4 ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-accent'}`} />
            <div>
              <h4 className={`font-semibold ${isCompleted ? 'text-green-700 dark:text-green-300' : 'text-accent'}`}>
                  {isCompleted ? 'Récompense obtenue' : 'Récompense'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {isCompleted ? 'Vous avez déjà gagné' : 'Compléter cette quête vous rapporte'} <span className="font-bold text-foreground">{quest.xp} XP</span>
              </p>
            </div>
          </div>

          {/* Steps / Objectives */}
          {quest.steps && quest.steps.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <ListChecks className="w-4 h-4" />
                Étapes de la quête
              </h4>
              <ul className="space-y-2">
                {quest.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${isCompleted ? 'bg-green-100 text-green-700 border-green-200' : 'bg-background'}`}>
                      {isCompleted ? <CheckCircle className="w-3 h-3" /> : index + 1}
                    </span>
                    <span className={isCompleted ? 'line-through opacity-70' : ''}>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!quest.steps && (
             <div className="p-4 bg-muted/30 rounded-lg border text-sm text-muted-foreground">
                Cette quête consiste à remplir les informations dans le formulaire dédié.
             </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fermer
          </Button>
          <Button onClick={handleStart} className="group" variant={isCompleted ? "secondary" : "default"}>
            {isCompleted ? "Modifier mes réponses" : "Commencer l'aventure"}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
