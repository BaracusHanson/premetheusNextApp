import { BadgeDefinition } from "@/types/badge";

export const BADGES: BadgeDefinition[] = [
  {
    id: "novice",
    name: "Novice",
    description: "Connectez-vous pour la première fois",
    category: "General",
    rarity: "COMMON",
    xp: 50,
    icon: "🌱",
    condition: (user) => true,
  },
];
