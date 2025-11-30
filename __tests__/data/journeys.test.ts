import { JOURNEYS } from '@/prisma/data/journeys';
import { QUESTS } from '@/prisma/data/quests';
import { formTriggers } from '@/prisma/data/formTriggers';

describe('Journeys Data Validation', () => {
  // Create a Set of all quest IDs for O(1) lookup
  const allQuestIds = new Set(QUESTS.map(q => q.id));

  // Filter out generated journeys to focus on handcrafted ones
  const baseJourneys = JOURNEYS.filter(j => !j.id.startsWith('journey_gen_'));

  it('should have valid base journeys defined', () => {
    expect(baseJourneys.length).toBeGreaterThan(0);
    baseJourneys.forEach(journey => {
      expect(journey.id).toBeDefined();
      expect(journey.title).toBeDefined();
      expect(journey.steps).toBeInstanceOf(Array);
      expect(journey.steps.length).toBeGreaterThan(0);
    });
  });

  describe('Journey Steps Integrity', () => {
    // Generate a test case for EACH journey
    baseJourneys.forEach(journey => {
      it(`Journey '${journey.title}' (${journey.id}) should have valid steps`, () => {
        journey.steps.forEach((stepId: string) => {
          const exists = allQuestIds.has(stepId);
          if (!exists) {
             throw new Error(`Journey '${journey.id}' references quest '${stepId}', but this quest does not exist in QUESTS.`);
          }
          expect(exists).toBe(true);
        });
      });
    });
  });

  describe('Journey Triggers Integrity', () => {
    baseJourneys.forEach(journey => {
      if (journey.triggers && journey.triggers.length > 0) {
        it(`Journey '${journey.title}' triggers should match formTriggers configuration`, () => {
          journey.triggers.forEach((trigger: any) => {
             // Skip special 'any' trigger
             if (trigger.field === 'any') return;

             const fieldName = trigger.field;
             // @ts-ignore
             const triggerConfig = formTriggers[fieldName];

             if (!triggerConfig) {
               throw new Error(`Journey '${journey.id}' is triggered by field '${fieldName}', but this field is not in formTriggers.`);
             }

             // Check if formTriggers points back to this journey
             const linkedJourneys = triggerConfig.journeys || [];
             if (!linkedJourneys.includes(journey.id)) {
                // Warning: It's possible the logic is handled in code without explicit mapping, 
                // but ideally it should be in formTriggers for transparency.
                // For this test suite, let's enforce strict mapping.
                throw new Error(`Journey '${journey.id}' is triggered by '${fieldName}', but formTriggers['${fieldName}'] does not list this journey ID.`);
             }
             expect(linkedJourneys).toContain(journey.id);
          });
        });
      }
    });
  });

  // Specific Tests for Critical Journeys
  it('should validate Science Tech Journey path', () => {
      const journey = baseJourneys.find(j => j.id === 'journey_science_tech');
      expect(journey).toBeDefined();
      expect(journey.steps).toContain('quest_studies_master');
      expect(journey.steps).toContain('quest_work_first');
  });

  it('should validate Resilience Journey path', () => {
      const journey = baseJourneys.find(j => j.id === 'journey_resilience');
      expect(journey).toBeDefined();
      expect(journey.steps).toContain('quest_resilience_1');
      expect(journey.steps).toContain('quest_social_hobbies');
  });
});
