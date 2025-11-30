import { UserProfile, UserBadge } from "@prisma/client";

export type BadgeDefinition = {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: "COMMON" | "RARE" | "EPIC" | "SECRET" | "common" | "rare" | "epic" | "secret";
  xp: number;
  icon?: string;
  condition?: ((user: UserProfile & { badges: UserBadge[] }) => boolean) | any;
};

export type Badge = BadgeDefinition;
