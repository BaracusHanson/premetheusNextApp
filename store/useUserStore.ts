import { create } from 'zustand';
import { UserData } from '@/types/user';
import { calculateLevel } from '@/lib/xp';

interface UserState extends UserData {
  addXp: (amount: number) => void;
  completeQuest: (questId: string) => void;
  unlockBadge: (badgeId: string) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  xp: 1250,
  level: 4,
  completedQuests: ['q1'],
  unlockedBadges: ['b1'],
  stats: {
    strength: 3,
    intelligence: 7,
    creativity: 5,
    social: 4,
  },
  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    const newLevel = calculateLevel(newXp);
    return { xp: newXp, level: newLevel };
  }),
  completeQuest: (questId) => set((state) => {
    if (state.completedQuests.includes(questId)) return state;
    return { completedQuests: [...state.completedQuests, questId] };
  }),
  unlockBadge: (badgeId) => set((state) => {
    if (state.unlockedBadges.includes(badgeId)) return state;
    return { unlockedBadges: [...state.unlockedBadges, badgeId] };
  }),
}));
