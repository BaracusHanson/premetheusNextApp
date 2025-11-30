"use client";

import { motion } from "framer-motion";
import { Trophy, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { XPBar } from "./XPBar";
import { hoverCard } from "@/lib/motion";

interface LevelCardProps {
  level: number;
  currentXP: number;
  nextLevelXP: number; // XP total needed for next level typically, or progress needed
  className?: string;
}

export function LevelCard({ level, currentXP, nextLevelXP, className }: LevelCardProps) {
  // Calculate progress within current level (assuming 500 XP per level flat for display simplicity here)
  // In a real app, use the xpEngine logic passed as props or computed here.
  const levelProgress = currentXP % 500; 
  
  return (
    <motion.div
      whileHover={hoverCard}
      className={`w-full ${className}`}
    >
      <Card className="p-6 bg-gradient-to-br from-card to-primary/5 border-primary/20 shadow-lg relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="flex items-start justify-between mb-6 relative z-10">
            <div>
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    Niveau Actuel
                </h3>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-heading font-bold text-primary">{level}</span>
                    <span className="text-sm text-muted-foreground">Héros en devenir</span>
                </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Star className="w-6 h-6 text-primary fill-primary/20" />
            </div>
        </div>

        <div className="space-y-2 relative z-10">
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-foreground">Progression XP</span>
                <span className="text-muted-foreground font-mono">{currentXP} XP Total</span>
            </div>
            <XPBar xp={currentXP} className="h-3" />
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {500 - levelProgress} XP manquants pour le niveau {level + 1}
            </p>
        </div>
      </Card>
    </motion.div>
  );
}
