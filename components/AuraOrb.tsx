"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AuraOrbProps {
  aura: number;
  size?: "sm" | "md" | "lg";
}

export function AuraOrb({ aura, size = "md" }: AuraOrbProps) {
  const sizeClasses = {
    sm: "w-16 h-16 text-xl",
    md: "w-24 h-24 text-3xl",
    lg: "w-32 h-32 text-4xl"
  };

  // Determine color based on aura level
  const getColor = (val: number) => {
      if (val >= 80) return "from-yellow-400 to-orange-500 shadow-yellow-500/50";
      if (val >= 60) return "from-violet-500 to-purple-600 shadow-violet-500/50";
      if (val >= 30) return "from-blue-400 to-cyan-500 shadow-blue-500/50";
      return "from-slate-400 to-slate-600 shadow-slate-500/50";
  };

  const gradient = getColor(aura);

  return (
    <div className="relative flex items-center justify-center group">
      {/* Pulsing Outer Ring */}
      <motion.div 
        className={cn(
            "absolute rounded-full opacity-30 blur-md bg-gradient-to-r", 
            gradient,
            size === "lg" ? "w-40 h-40" : size === "md" ? "w-28 h-28" : "w-20 h-20"
        )}
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Main Orb */}
      <div className={cn(
          "relative rounded-full bg-gradient-to-br flex items-center justify-center font-heading font-bold text-white shadow-lg border-2 border-white/20 z-10",
          gradient,
          sizeClasses[size]
      )}>
        {aura}
      </div>

      {/* Label Tooltip (simplified) */}
      <div className="absolute -bottom-8 text-xs font-bold uppercase tracking-wider text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Aura Globale
      </div>
    </div>
  );
}
