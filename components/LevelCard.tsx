"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card"; // Need to create UI components first!
// I will stub Card here or create ui/card.tsx

// I'll stick to raw HTML/Tailwind for the card if I haven't created the ui component, 
// but I should create the ui components to follow instructions "Use shadcn/ui".
// I will simulate the shadcn components structure in this file for now to save tool calls 
// or better: I will create a `components/ui/card.tsx` right now.

export function LevelCard({ level, xp }: { level: number; xp: number }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative bg-surface border border-border rounded-xl p-6 flex flex-col items-center justify-center shadow-lg aspect-square">
        <h3 className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Niveau Actuel</h3>
        <motion.div
          key={level}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl font-mono font-bold text-primary mt-2 drop-shadow-md"
        >
          {level}
        </motion.div>
        <p className="text-xs text-muted-foreground mt-4 font-mono">{xp.toLocaleString()} XP Total</p>
      </div>
    </div>
  );
}
