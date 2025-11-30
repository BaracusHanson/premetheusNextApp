"use client";

import { Badge as BadgeType } from "@/types/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface BadgeModalProps {
  badge: BadgeType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BadgeModal({ badge, isOpen, onClose }: BadgeModalProps) {
  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">{badge.name}</DialogTitle>
          <div className="flex justify-center py-6">
            <div className={`text-8xl p-6 rounded-full bg-gradient-to-br ${
                badge.rarity.toLowerCase() === 'common' ? 'from-slate-200 to-slate-400' :
                badge.rarity.toLowerCase() === 'rare' ? 'from-blue-200 to-blue-400' :
                badge.rarity.toLowerCase() === 'epic' ? 'from-purple-200 to-purple-400' :
                'from-yellow-200 to-yellow-400'
            } shadow-xl animate-pulse`}>
                {badge.icon}
            </div>
          </div>
          <DialogDescription className="text-center text-lg">
            {badge.description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-2 mt-4">
            <Badge variant={
                badge.rarity.toLowerCase() === 'common' ? 'secondary' :
                badge.rarity.toLowerCase() === 'rare' ? 'default' :
                badge.rarity.toLowerCase() === 'epic' ? 'destructive' : 'outline'
            } className="uppercase">
                {badge.rarity.toLowerCase() === 'common' ? 'Commun' :
                 badge.rarity.toLowerCase() === 'rare' ? 'Rare' :
                 badge.rarity.toLowerCase() === 'epic' ? 'Épique' : 'Secret'}
            </Badge>
            <Badge variant="outline" className="border-primary text-primary">
                +{badge.xp} XP
            </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
