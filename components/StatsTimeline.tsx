"use client";

import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { subDays, format, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { fr } from "date-fns/locale";

interface ActivityData {
  day: string;
  value: number;
}

interface StatsTimelineProps {
  data: ActivityData[];
}

export function StatsTimeline({ data }: StatsTimelineProps) {
  // Generate last ~5 months of days
  const today = new Date();
  const startDate = subDays(today, 150); // ~5 months
  
  // Align to start of week for clean grid
  const calendarStart = startOfWeek(startDate, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(today, { weekStartsOn: 1 });

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // Create lookup map
  const dataMap = new Map(data.map(d => [d.day, d.value]));

  const getLevel = (value: number) => {
    if (value === 0) return 0;
    if (value < 50) return 1;
    if (value < 100) return 2;
    if (value < 200) return 3;
    return 4;
  };

  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return "bg-muted/40";
      case 1: return "bg-primary/30";
      case 2: return "bg-primary/50";
      case 3: return "bg-primary/80";
      case 4: return "bg-primary";
      default: return "bg-muted/40";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-col gap-2 min-w-fit">
        {/* Months Labels (Optional, simplified here) */}
        <div className="flex text-xs text-muted-foreground pb-2 gap-1">
            {/* Simplified logic: just showing 'Activité Récente' label or nothing for clean look */}
            <span className="font-semibold">Historique d'Activité</span>
        </div>

        <div className="grid grid-rows-7 grid-flow-col gap-1 w-fit">
          {days.map((day) => {
            const dayStr = format(day, 'yyyy-MM-dd');
            const value = dataMap.get(dayStr) || 0;
            const level = getLevel(value);

            return (
              <TooltipProvider key={dayStr} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className={cn(
                        "w-3 h-3 rounded-sm transition-colors duration-200 hover:ring-1 hover:ring-ring cursor-default",
                        getColorClass(level)
                      )}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs bg-popover text-popover-foreground border-border">
                    <div className="font-bold capitalize">{format(day, 'EEEE d MMM', { locale: fr })}</div>
                    <div>{value} XP</div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
        
        <div className="flex items-center justify-end gap-2 text-[10px] text-muted-foreground mt-2">
            <span>Moins</span>
            <div className="flex gap-1">
                <div className="w-2 h-2 rounded-sm bg-muted/40"></div>
                <div className="w-2 h-2 rounded-sm bg-primary/30"></div>
                <div className="w-2 h-2 rounded-sm bg-primary/50"></div>
                <div className="w-2 h-2 rounded-sm bg-primary/80"></div>
                <div className="w-2 h-2 rounded-sm bg-primary"></div>
            </div>
            <span>Plus</span>
        </div>
      </div>
    </div>
  );
}
