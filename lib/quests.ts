import { QuestDefinition } from "@/types/quest";

export const QUESTS: QuestDefinition[] = [
  {
    id: "first-steps",
    title: "Premiers pas",
    description: "Complétez votre profil pour commencer l'aventure.",
    theme: "Onboarding",
    xp: 100,
    prerequisites: [],
  },
  {
    id: "explorer",
    title: "Explorateur",
    description: "Visitez 3 pages différentes de l'application.",
    theme: "Exploration",
    xp: 50,
    prerequisites: ["first-steps"],
  },
];

export function getQuestById(id: string): QuestDefinition | undefined {
  return QUESTS.find((q) => q.id === id);
}
