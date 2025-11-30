"use client";

import { cn } from "@/lib/utils";
import { formSteps } from "@/lib/formSteps";
import { CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StepperProps {
  currentStepId: string;
}

export function Stepper({ currentStepId }: StepperProps) {
  const currentIndex = formSteps.findIndex(s => s.id === currentStepId);
  const progress = ((currentIndex) / (formSteps.length - 1)) * 100;

  return (
    <div className="w-full space-y-4 mb-8">
      <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
        <span>Progression</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-4 px-2 overflow-x-auto py-2 gap-4">
        {formSteps.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step.id} className="flex flex-col items-center min-w-[60px] gap-2">
               <div className={cn(
                   "transition-colors duration-300",
                   isCompleted ? "text-primary" : isCurrent ? "text-primary" : "text-muted-foreground"
               )}>
                   {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
               </div>
               <span className={cn(
                   "text-xs text-center whitespace-nowrap",
                   isCurrent ? "text-foreground font-bold" : "text-muted-foreground"
               )}>
                   {step.title}
               </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
