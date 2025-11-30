"use client";

import { SIDEvent } from "@/lib/sidEngine";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Home, Baby, Star, MapPin, ArrowRight } from "lucide-react";

interface LifeTimelineProps {
  events: SIDEvent[];
}

export function LifeTimeline({ events }: LifeTimelineProps) {
  if (!events || events.length === 0) {
    return (
        <div className="p-8 border-2 border-dashed rounded-xl text-center text-muted-foreground bg-muted/20">
            <p>Complétez votre diagnostic pour voir apparaître votre Ligne de Vie.</p>
        </div>
    );
  }

  // Icon mapping based on SID Key or Type
  const getIcon = (event: SIDEvent) => {
      if (event.sidKey.includes("BIRTH")) return Baby;
      if (event.sidKey.includes("BAC") || event.sidKey.includes("STUDIES") || event.sidKey.includes("ACADEMIC")) return GraduationCap;
      if (event.sidKey.includes("CAREER") || event.sidKey.includes("JOB")) return Briefcase;
      if (event.sidKey.includes("SETTLEMENT") || event.sidKey.includes("MOVE")) return Home;
      if (event.sidKey.includes("MIGRATION")) return MapPin;
      return Star;
  };

  const getColor = (event: SIDEvent) => {
      if (event.type === "PERIOD") return "bg-primary/10 border-primary text-primary";
      return "bg-secondary border-secondary text-secondary-foreground";
  };

  return (
    <div className="w-full overflow-x-auto pb-6 pt-2 px-2">
      <div className="flex gap-4 min-w-max items-start relative">
        {/* Central Line */}
        <div className="absolute top-8 left-0 right-0 h-0.5 bg-border -z-10" />

        {events.map((event, idx) => {
          const Icon = getIcon(event);
          const isPeriod = event.type === "PERIOD";
          
          return (
            <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border shadow-sm bg-card min-w-[180px] max-w-[220px] transition-all hover:scale-105 hover:shadow-md group",
                    isPeriod ? "border-primary/50 bg-primary/5" : ""
                )}
            >
                {/* Date Badge */}
                <div className="text-xs font-mono text-muted-foreground bg-background px-2 py-0.5 rounded-full border mb-1 shadow-sm">
                    {format(event.startDate, "yyyy")}
                    {event.endDate && ` - ${format(event.endDate, "yyyy")}`}
                </div>

                {/* Icon Orb */}
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 bg-card",
                    isPeriod ? "border-primary text-primary" : "border-secondary text-secondary-foreground"
                )}>
                    <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="text-center">
                    <h4 className="font-bold text-sm leading-tight">{event.label}</h4>
                    {event.metadata?.level && (
                        <span className="text-xs text-muted-foreground capitalize block mt-1">{event.metadata.level}</span>
                    )}
                    {event.metadata?.rawValue && (
                        <span className="text-xs text-muted-foreground block mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {event.metadata.rawValue}
                        </span>
                    )}
                </div>

                {/* Period Indicator (Bar below) */}
                {isPeriod && (
                    <div className="absolute top-8 left-1/2 w-full h-1 bg-primary/30 -z-20" />
                )}
            </motion.div>
          );
        })}
        
        {/* Future Arrow */}
        <div className="flex flex-col items-center justify-center min-w-[100px] opacity-50 pt-8">
            <ArrowRight className="w-8 h-8 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-wider mt-2">Futur</span>
        </div>
      </div>
    </div>
  );
}
