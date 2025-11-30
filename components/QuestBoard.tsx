"use client";

import { useState } from "react";
import { QuestDefinition } from "@/types/quest";
import { QuestCard } from "@/components/QuestCard";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface QuestBoardProps {
  availableQuests: QuestDefinition[];
  lockedQuests: QuestDefinition[];
  completedQuests: QuestDefinition[];
  highlightId?: string;
}

export function QuestBoard({ availableQuests, lockedQuests, completedQuests, highlightId }: QuestBoardProps) {
  // Determine default tab based on highlightId
  let defaultTab = "available";
  if (highlightId) {
      if (lockedQuests.some(q => q.id === highlightId)) defaultTab = "locked";
      else if (completedQuests.some(q => q.id === highlightId)) defaultTab = "completed";
  }

  const getCardStyle = (questId: string) => {
      if (highlightId === questId) {
          return "border-2 border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] scale-[1.02] ring-2 ring-primary/20";
      }
      return "";
  };

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
        <TabsTrigger value="available">Disponibles ({availableQuests.length})</TabsTrigger>
        <TabsTrigger value="locked">Verrouillées ({lockedQuests.length})</TabsTrigger>
        <TabsTrigger value="completed">Terminées ({completedQuests.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="available" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              id={`quest-${quest.id}`}
            >
              <QuestCard quest={quest} className={getCardStyle(quest.id)} />
            </motion.div>
          ))}
          {availableQuests.length === 0 && (
              <p className="text-muted-foreground py-8">Aucune quête disponible pour le moment.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="locked" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lockedQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              id={`quest-${quest.id}`}
            >
              <QuestCard quest={quest} className={getCardStyle(quest.id)} />
            </motion.div>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="completed" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedQuests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              id={`quest-${quest.id}`}
            >
              <QuestCard quest={quest} className={getCardStyle(quest.id)} />
            </motion.div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
