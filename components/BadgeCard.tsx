"use client";

import { Badge as BadgeType } from "@/types/badge";
import { Card } from "@/components/ui/card";
import { 
  Lock, Fingerprint, GraduationCap, Briefcase, Compass, Shield, 
  Telescope, Users, Home, Trophy, Map, Scroll, Coins, Hourglass 
} from "lucide-react";

const IconMap: Record<string, any> = {
  "fingerprint": Fingerprint,
  "graduation-cap": GraduationCap,
  "briefcase": Briefcase,
  "compass": Compass,
  "shield": Shield,
  "telescope": Telescope,
  "users": Users,
  "home": Home,
  "lock": Lock,
  "trophy": Trophy,
  "map": Map,
  "scroll": Scroll,
  "coins": Coins,
  "hourglass": Hourglass
};

interface BadgeCardProps {
  badge: BadgeType;
  isUnlocked: boolean;
  onClick: () => void;
}

export function BadgeCard({ badge, isUnlocked, onClick }: BadgeCardProps) {
  const IconComponent = (badge.icon && IconMap[badge.icon]) ? IconMap[badge.icon] : Trophy;

  return (
    <Card 
        className={`aspect-square flex flex-col items-center justify-center p-4 cursor-pointer transition-all hover:scale-105 ${
            isUnlocked 
                ? 'bg-surface border-primary/20 hover:shadow-lg hover:shadow-primary/20' 
                : 'bg-muted opacity-70 grayscale'
        }`}
        onClick={isUnlocked ? onClick : undefined}
    >
        {isUnlocked ? (
            <>
                <div className="mb-3 p-3 bg-primary/10 rounded-full text-primary">
                    <IconComponent className="h-8 w-8" />
                </div>
                <span className="font-bold text-sm text-center line-clamp-2">{badge.name}</span>
            </>
        ) : (
            <>
                <Lock className="h-8 w-8 mb-2 text-muted-foreground" />
                <span className="font-bold text-sm text-center text-muted-foreground">Verrouillé</span>
            </>
        )}
    </Card>
  );
}
