"use client";

import { useState } from "react";
import { BadgeCard } from "@/components/BadgeCard";
import { BadgeModal } from "@/components/BadgeModal";
import { BadgeDefinition } from "@/types/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

interface BadgeCollectionProps {
  badges: BadgeDefinition[];
  unlockedBadgeIds: string[];
}

export function BadgeCollection({ badges, unlockedBadgeIds }: BadgeCollectionProps) {
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBadgeClick = (badge: BadgeDefinition) => {
    if (unlockedBadgeIds.includes(badge.id)) {
        setSelectedBadge(badge);
        setIsModalOpen(true);
    }
  };

  const unlocked = badges.filter(b => unlockedBadgeIds.includes(b.id));
  const locked = badges.filter(b => !unlockedBadgeIds.includes(b.id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-surface p-4 rounded-lg border shadow-sm">
          <div className="text-sm font-medium">
              Total Collected: <span className="text-primary text-lg">{unlocked.length}</span> / {badges.length}
          </div>
          <div className="w-1/3 h-2 bg-secondary/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all duration-500" 
                style={{ width: `${(unlocked.length / badges.length) * 100}%` }}
              />
          </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
            <TabsTrigger value="all">Tout</TabsTrigger>
            <TabsTrigger value="unlocked">Débloqués</TabsTrigger>
            <TabsTrigger value="locked">Verrouillés</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {badges.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }} // Faster for 300 items
                    >
                        {/* @ts-ignore */}
                        <BadgeCard 
                            badge={badge} 
                            isUnlocked={unlockedBadgeIds.includes(badge.id)} 
                            onClick={() => handleBadgeClick(badge)}
                        />
                    </motion.div>
                ))}
            </div>
        </TabsContent>

        <TabsContent value="unlocked" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {unlocked.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {/* @ts-ignore */}
                        <BadgeCard 
                            badge={badge} 
                            isUnlocked={true} 
                            onClick={() => handleBadgeClick(badge)}
                        />
                    </motion.div>
                ))}
                {unlocked.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        Pas encore de badges débloqués. Continuez vos quêtes !
                    </div>
                )}
            </div>
        </TabsContent>

        <TabsContent value="locked" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {locked.map((badge, index) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.02 }}
                    >
                        {/* @ts-ignore */}
                        <BadgeCard 
                            badge={badge} 
                            isUnlocked={false} 
                            onClick={() => {}}
                        />
                    </motion.div>
                ))}
            </div>
        </TabsContent>
      </Tabs>

      {/* @ts-ignore */}
      <BadgeModal 
        badge={selectedBadge} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
