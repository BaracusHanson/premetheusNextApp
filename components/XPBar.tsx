"use client";

import { motion } from "framer-motion";
import { getXPProgress, xpToNextLevel, calculateLevel } from "@/lib/xp";

interface XPBarProps {
  xp: number;
  className?: string;
}

export function XPBar({ xp, className = "" }: XPBarProps) {
  const level = calculateLevel(xp);
  const progressData = getXPProgress(xp);
  const percentage = (progressData.current / progressData.needed) * 100;

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      <div className="flex justify-between text-xs font-mono text-muted-foreground">
        <span>NIV {level}</span>
        <span>{percentage.toFixed(1)}%</span>
        <span>NIV {level + 1}</span>
      </div>
      <div className="h-4 w-full bg-secondary/20 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-secondary shadow-[0_0_10px_rgba(44,201,194,0.5)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
