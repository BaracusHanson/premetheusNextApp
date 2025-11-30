export interface UserData {
    xp: number;
    level: number;
    completedQuests: string[]; // Quest IDs
    unlockedBadges: string[]; // Badge IDs
    stats: {
        strength: number;
        intelligence: number;
        creativity: number;
        social: number;
    };
}
