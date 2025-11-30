"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, ArrowRight, Medal, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import confetti from 'canvas-confetti';

export type CelebrationType = 'QUEST' | 'BADGE' | 'AURA' | 'LEVEL_UP';

export interface CelebrationItem {
  type: CelebrationType;
  title: string;
  subtitle?: string;
  xp?: number;
  icon?: any; // Optional override
}

interface CelebrationModalProps {
  queue: CelebrationItem[];
  onClose: () => void;
}

export function CelebrationModal({ queue, onClose }: CelebrationModalProps) {
  const [currentItem, setCurrentItem] = useState<CelebrationItem | null>(null);
  const [open, setOpen] = useState(false);
  const [internalQueue, setInternalQueue] = useState<CelebrationItem[]>([]);

  useEffect(() => {
    if (queue.length > 0) {
      setInternalQueue([...queue]);
      setOpen(true);
    }
  }, [queue]);

  useEffect(() => {
    if (open && internalQueue.length > 0 && !currentItem) {
      const next = internalQueue[0];
      setCurrentItem(next);
      
      // Trigger Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: next.type === 'BADGE' ? ['#FFD700', '#FFA500', '#FFFFFF'] : ['#4ADE80', '#22C55E', '#FFFFFF']
      });
    }
  }, [open, internalQueue, currentItem]);

  const handleNext = () => {
    const remaining = internalQueue.slice(1);
    if (remaining.length > 0) {
      setCurrentItem(null); // Reset for animation
      setTimeout(() => {
        setInternalQueue(remaining);
      }, 100); // Small delay
    } else {
      setOpen(false);
      setCurrentItem(null);
      onClose();
    }
  };

  if (!currentItem) return null;

  // Determine Style based on Type
  let icon = <Star className="w-12 h-12 text-yellow-500" />;
  let colorClass = "text-yellow-500";
  let bgClass = "bg-yellow-100 dark:bg-yellow-900/30";
  let titleText = "Félicitations !";

  switch (currentItem.type) {
    case 'QUEST':
      icon = <Trophy className="w-12 h-12 text-yellow-600" />;
      colorClass = "text-yellow-600";
      titleText = "Quête Achevée !";
      break;
    case 'BADGE':
      icon = <Medal className="w-12 h-12 text-orange-500" />;
      colorClass = "text-orange-500";
      bgClass = "bg-orange-100 dark:bg-orange-900/30";
      titleText = "Nouveau Badge !";
      break;
    case 'AURA':
      icon = <Sparkles className="w-12 h-12 text-purple-500" />;
      colorClass = "text-purple-500";
      bgClass = "bg-purple-100 dark:bg-purple-900/30";
      titleText = "Aura Augmentée !";
      break;
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleNext()}>
      <DialogContent className="sm:max-w-md text-center border-2 border-primary/10">
        <DialogHeader>
          <div className={`mx-auto mb-4 p-4 rounded-full ring-8 ring-opacity-10 ${bgClass} ${colorClass.replace('text-', 'ring-')}`}>
            {icon}
          </div>
          <DialogTitle className="text-2xl font-bold text-center">{titleText}</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4 min-h-[140px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentItem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-2"
            >
              <h3 className="text-lg font-medium text-muted-foreground">{currentItem.subtitle || "Vous avez débloqué"}</h3>
              <p className={`text-2xl font-bold ${colorClass}`}>{currentItem.title}</p>
              
              {currentItem.xp && (
                 <div className="pt-2">
                    <span className="inline-flex items-center gap-2 px-4 py-1 bg-accent/10 rounded-full border border-accent/20 text-accent font-bold text-sm">
                        +{currentItem.xp} XP
                    </span>
                 </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={handleNext} size="lg" className="w-full sm:w-auto min-w-[150px]">
            {internalQueue.length > 1 ? "Suivant" : "Continuer"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
