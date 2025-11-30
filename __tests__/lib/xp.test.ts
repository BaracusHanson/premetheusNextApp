import { calculateLevel, getXPProgress, xpToNextLevel } from '@/lib/xp';

describe('XP System', () => {
  describe('calculateLevel', () => {
    it('starts at level 1 with 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('remains level 1 with 499 XP', () => {
      expect(calculateLevel(499)).toBe(1);
    });

    it('reaches level 2 with 500 XP', () => {
      expect(calculateLevel(500)).toBe(2);
    });

    it('calculates higher levels correctly', () => {
      expect(calculateLevel(1000)).toBe(3);
      expect(calculateLevel(2500)).toBe(6);
    });
  });

  describe('xpToNextLevel', () => {
    it('calculates XP needed for next level correctly', () => {
      expect(xpToNextLevel(1)).toBe(500);
      expect(xpToNextLevel(2)).toBe(1000);
    });
  });

  describe('getXPProgress', () => {
    it('returns correct progress for 0 XP', () => {
      const progress = getXPProgress(0);
      expect(progress).toEqual({
        level: 1,
        current: 0,
        needed: 500
      });
    });

    it('returns correct progress for mid-level XP', () => {
      const progress = getXPProgress(250);
      expect(progress).toEqual({
        level: 1,
        current: 250,
        needed: 500
      });
    });

    it('returns correct progress for level 2 start', () => {
      const progress = getXPProgress(500);
      expect(progress).toEqual({
        level: 2,
        current: 0,
        needed: 500
      });
    });

    it('returns correct progress for level 2 mid-way', () => {
      // Level 2 starts at 500. Level 3 starts at 1000.
      // Span is 500.
      // 750 XP = 250 into Level 2.
      const progress = getXPProgress(750);
      expect(progress).toEqual({
        level: 2,
        current: 250,
        needed: 500
      });
    });
  });
});
