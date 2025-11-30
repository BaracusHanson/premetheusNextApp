import { QUESTS } from '@/prisma/data/quests';
import { formTriggers } from '@/prisma/data/formTriggers';

describe('Quests Data Validation', () => {
  // Filter out generated quests to focus on base quests
  const baseQuests = QUESTS.filter(q => !q.id.startsWith('quest_gen_'));

  it('should have valid base quests defined', () => {
    expect(baseQuests.length).toBeGreaterThan(0);
    baseQuests.forEach(quest => {
      expect(quest.id).toBeDefined();
      expect(quest.title).toBeDefined();
      expect(quest.description).toBeDefined();
      expect(quest.theme).toBeDefined();
      expect(quest.xp).toBeGreaterThan(0);
    });
  });

  it('should have consistent form triggers', () => {
    baseQuests.forEach(quest => {
      if (quest.trigger && quest.trigger.type.startsWith('form.')) {
        const fieldName = quest.trigger.field;
        
        // Check if the field exists in formTriggers
        // @ts-ignore - dynamic access
        const triggerConfig = formTriggers[fieldName];
        
        if (!triggerConfig) {
          throw new Error(`Quest ${quest.id} relies on form field '${fieldName}', but this field is not in formTriggers.`);
        }

        // Check if the trigger config actually points back to this quest
        // It might be in 'quests' array or in 'valueMapping'
        let found = false;

        if (triggerConfig.quests && triggerConfig.quests.includes(quest.id)) {
          found = true;
        } else if (triggerConfig.valueMapping) {
          // Check all values in valueMapping
          Object.values(triggerConfig.valueMapping).forEach((questIds: any) => {
            if (questIds.includes(quest.id)) found = true;
          });
        }

        if (!found) {
           // Some specific cases might be handled differently (like direct value checks not in 'quests' array)
           // But for now, let's enforce consistency or expect failures if data is desync
           throw new Error(`Quest ${quest.id} is triggered by '${fieldName}', but formTriggers['${fieldName}'] does not list this quest ID.`);
        }
        
        expect(found).toBe(true);
      }
    });
  });

  it('should validate specific complex triggers', () => {
    // Example: Baccalauréat
    const bacQuest = baseQuests.find(q => q.id === 'quest_school_bac');
    expect(bacQuest).toBeDefined();
    expect(bacQuest.trigger.field).toBe('bacObtained');
    expect(bacQuest.trigger.value).toBe('true');

    // Verify formTriggers mapping
    // @ts-ignore
    expect(formTriggers.bacObtained.quests).toContain('quest_school_bac');
  });

  it('should validate degree level mapping', () => {
    const bachelorQuest = baseQuests.find(q => q.id === 'quest_studies_bachelor');
    const masterQuest = baseQuests.find(q => q.id === 'quest_studies_master');

    expect(bachelorQuest).toBeDefined();
    expect(masterQuest).toBeDefined();

    // Check mapping logic in formTriggers
    // @ts-ignore
    const degreeMapping = formTriggers.degreeLevel.valueMapping;
    expect(degreeMapping.bachelor).toContain('quest_studies_bachelor');
    expect(degreeMapping.master).toContain('quest_studies_bachelor');
    expect(degreeMapping.master).toContain('quest_studies_master');
  });
});
