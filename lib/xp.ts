export function calculateLevel(xp: number): number {
  return Math.floor(1 + xp / 500); 
}

export function xpToNextLevel(level: number): number {
  return level * 500;
}

export function getXPProgress(xp: number): { level: number; current: number; needed: number } {
  const level = calculateLevel(xp);
  const needed = xpToNextLevel(level);
  const previousLevelXp = xpToNextLevel(level - 1);
  const current = xp - previousLevelXp;
  const xpNeededForNextLevel = needed - previousLevelXp;
  
  return { level, current, needed: xpNeededForNextLevel };
}
