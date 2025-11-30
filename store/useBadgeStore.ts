import { create } from 'zustand';
import { Badge } from '@/types/badge';
import { BADGES } from '@/lib/badges';

interface BadgeState {
    badges: Badge[];
    // Add filter state if needed
}

export const useBadgeStore = create<BadgeState>((set) => ({
    badges: BADGES,
}));
