"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
  steps: string[];
  currentStepIndex: number;
  className?: string;
}

export function Stepper({ steps, currentStepIndex, className }: StepperProps) {
  return (
    <div className={cn("w-full space-y-4 mb-8", className)}>
      <div className="flex justify-between items-center relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />
        
        {/* Animated Progress Bar */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentStepIndex / (steps.length - 1) }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step} className="flex flex-col items-center gap-2 relative group cursor-default">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isCurrent ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 z-10",
                  isCompleted || isCurrent ? "border-primary text-primary-foreground" : "border-muted text-muted-foreground bg-background"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-bold">{index + 1}</span>
                )}
              </motion.div>
              
              <div className={cn(
                  "absolute -bottom-8 text-xs font-medium whitespace-nowrap transition-colors duration-300",
                  isCurrent ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                {step}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
