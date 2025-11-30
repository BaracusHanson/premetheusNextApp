import { Quest } from '@prisma/client';

// Themes alignés sur formSteps V2
const THEMES = [
  "Identité & Origines", // IDENTITY
  "Savoir & Formation",  // KNOWLEDGE
  "Carrière & Impact",   // CAREER
  "Style de Vie",        // LIFESTYLE
  "Croissance & Futur"   // GROWTH
];

// Base Quests - Aligned with Form V2
const BASE_QUESTS: any[] = [
  // --- IDENTITY ---
  {
    id: 'quest_identity_birth',
    title: 'Point de Départ',
    description: 'Confirmez votre date et lieu de naissance.',
    theme: THEMES[0],
    xp: 50,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'birthCountry' }
  },
  {
    id: 'quest_identity_mobility',
    title: 'Citoyen du Monde',
    description: 'Renseignez votre parcours géographique.',
    theme: THEMES[0],
    xp: 100,
    prerequisites: ['quest_identity_birth'],
    trigger: { type: 'form.field_filled', field: 'moveCount' }
  },

  // --- KNOWLEDGE (School) ---
  {
    id: 'quest_school_brevet',
    title: 'Premier Diplôme',
    description: 'Obtention du Brevet des collèges.',
    theme: THEMES[1],
    xp: 150,
    prerequisites: [],
    trigger: { type: 'form.value', field: 'brevetObtained', value: 'true' }
  },
  {
    id: 'quest_school_bac',
    title: 'Bachelier',
    description: 'Obtention du Baccalauréat.',
    theme: THEMES[1],
    xp: 200,
    prerequisites: ['quest_school_brevet'],
    trigger: { type: 'form.value', field: 'bacObtained', value: 'true' }
  },
  {
    id: 'quest_studies_higher',
    title: 'Étudiant',
    description: 'Entrée dans les études supérieures.',
    theme: THEMES[1],
    xp: 300,
    prerequisites: ['quest_school_bac'],
    trigger: { type: 'form.value', field: 'higher_education', value: 'true' }
  },
  {
    id: 'quest_studies_master',
    title: 'Master Mind',
    description: 'Validation d\'un Bac+5 (Master/Ingénieur).',
    theme: THEMES[1],
    xp: 500,
    prerequisites: ['quest_studies_higher'],
    trigger: { type: 'form.value', field: 'degreeLevel', value: 'master' }
  },

  // --- CAREER ---
  {
    id: 'quest_work_first',
    title: 'Premier Salaire',
    description: 'Entrée dans la vie active.',
    theme: THEMES[2],
    xp: 250,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'firstJob' }
  },
  {
    id: 'quest_work_leader',
    title: 'Leadership',
    description: 'Prise de responsabilité managériale.',
    theme: THEMES[2],
    xp: 450,
    prerequisites: ['quest_work_first'],
    trigger: { type: 'form.value', field: 'leadership_experience', value: 'true' }
  },

  // --- LIFESTYLE (Adulting) ---
  {
    id: 'quest_adult_settle',
    title: 'Bien Installé',
    description: 'Situation résidentielle stable (Propriétaire/Locataire).',
    theme: THEMES[3],
    xp: 300,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'housing_situation' } // Any value filled is good start, specific check in logic maybe
  },
  {
    id: 'quest_adult_finance',
    title: 'Trésorier',
    description: 'Gestion active du budget.',
    theme: THEMES[3],
    xp: 200,
    prerequisites: [],
    trigger: { type: 'form.value', field: 'finance_management', value: 'strict' } // Or 'loose' could work too, but strict is better for quest
  },

  // --- GROWTH (Resilience & Vision) ---
  {
    id: 'quest_growth_survivor',
    title: 'Phénix',
    description: 'Avoir surmonté une épreuve majeure.',
    theme: THEMES[4],
    xp: 500,
    prerequisites: [],
    trigger: { type: 'form.value', field: 'major_hardship', value: 'true' }
  },
  {
    id: 'quest_growth_vision',
    title: 'Visionnaire',
    description: 'Définir son prochain grand chapitre.',
    theme: THEMES[4],
    xp: 300,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'next_big_thing' }
  }
];

// Programmatically generate filler quests to reach volume if needed
// For now, let's stick to these high quality ones + some generic ones
const generatedQuests: any[] = [];

const LAST_BASE_QUESTS: Record<number, string> = {
    0: 'quest_identity_mobility',
    1: 'quest_studies_master',
    2: 'quest_work_leader',
    3: 'quest_adult_finance',
    4: 'quest_growth_vision'
};

THEMES.forEach((theme, themeIdx) => {
    // Generate ~10 quests per theme for filler
    for (let i = 0; i < 10; i++) {
        const prevQuestId = i > 0 ? `quest_gen_${themeIdx}_${i-1}` : LAST_BASE_QUESTS[themeIdx];
        
        generatedQuests.push({
            id: `quest_gen_${themeIdx}_${i}`,
            title: `${theme} - Niveau ${i + 1}`,
            description: `Continuez votre progression en ${theme.toLowerCase()}.`,
            theme: theme,
            xp: 50 + (i * 20),
            prerequisites: prevQuestId ? [prevQuestId] : [],
            trigger: { type: 'quest.completed', value: prevQuestId } // Chain reaction
        });
    }
});

export const QUESTS = [...BASE_QUESTS, ...generatedQuests];
