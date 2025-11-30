"use client";

import { CheckCircle, Trophy, ArrowUpCircle } from "lucide-react";

const timelineEvents = [
    {
        id: 1,
        type: "levelup",
        title: "Reached Level 4",
        date: "2 days ago",
        description: "You earned 1250 XP total.",
        icon: ArrowUpCircle,
        color: "text-primary"
    },
    {
        id: 2,
        type: "quest",
        title: "Completed 'Hello World'",
        date: "3 days ago",
        description: "Wrote your first line of code.",
        icon: CheckCircle,
        color: "text-accent"
    },
    {
        id: 3,
        type: "badge",
        title: "Earned 'Pioneer' Badge",
        date: "5 days ago",
        description: "Joined the platform early.",
        icon: Trophy,
        color: "text-warning"
    },
    {
        id: 4,
        type: "quest",
        title: "Completed 'First Steps'",
        date: "1 week ago",
        description: "Set up your profile.",
        icon: CheckCircle,
        color: "text-accent"
    }
];

export function StatsTimeline() {
  return (
    <div className="relative border-l-2 border-muted ml-3 space-y-8 py-2">
      {timelineEvents.map((event) => (
        <div key={event.id} className="relative pl-8">
            <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-muted-foreground ${event.color === 'text-primary' ? 'border-primary' : event.color === 'text-accent' ? 'border-accent' : 'border-warning'}`}></div>
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground mb-1">{event.date}</span>
                <div className="flex items-center gap-2 font-bold text-foreground">
                    <event.icon className={`w-4 h-4 ${event.color}`} />
                    {event.title}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
            </div>
        </div>
      ))}
    </div>
  );
}
