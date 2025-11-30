"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface QuestCompletionModalProps {
  quest: { title: string; xp: number; theme: string } | null;
  onClose: () => void;
}

export function QuestCompletionModal({ quest, onClose }: QuestCompletionModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (quest) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [quest]);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  if (!quest) return null;

  return (
    <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
      <DialogContent className="sm:max-w-md text-center border-2 border-yellow-500/20">
        <DialogHeader>
          <div className="mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full ring-8 ring-yellow-500/10">
            <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">Quête Achevée !</DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h3 className="text-lg font-medium text-muted-foreground">Vous avez complété</h3>
            <p className="text-xl font-bold text-primary">{quest.title}</p>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full border border-accent/20"
          >
            <Star className="w-5 h-5 text-accent fill-current" />
            <span className="font-bold text-accent">+{quest.xp} XP</span>
          </motion.div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={handleClose} size="lg" className="w-full sm:w-auto min-w-[150px]">
            Continuer
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
