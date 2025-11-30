import { Quest } from '@prisma/client'; // Use type if available, or any

// Themes
const THEMES = [
  "Identité & Origines",
  "Stabilité & Adaptation",
  "Enfance & Scolarité",
  "Collège & Lycée",
  "Études supérieures",
  "Vie professionnelle",
  "Autonomie & Vie d’adulte",
  "Social, Résilience, Vision"
];

// Base Quests - Handcrafted for quality
const BASE_QUESTS: any[] = [
  // --- IDENTITY ---
  {
    id: 'quest_identity_birth',
    title: 'Origine Certifiée',
    description: 'Confirmez votre lieu et date de naissance.',
    theme: THEMES[0],
    xp: 50,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'birthCountry' }
  },
  {
    id: 'quest_identity_roots',
    title: 'Racines Profondes',
    description: 'Identifiez vos origines familiales.',
    theme: THEMES[0],
    xp: 100,
    prerequisites: ['quest_identity_birth'],
    trigger: { type: 'form.field_filled', field: 'familyOrigins' }
  },
  
  // --- STABILITY ---
  {
    id: 'quest_stability_move',
    title: 'Nomade ou Sédentaire',
    description: 'Avez-vous beaucoup déménagé ?',
    theme: THEMES[1],
    xp: 75,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'moveCount' }
  },
  
  // --- CHILDHOOD ---
  {
    id: 'quest_school_primary',
    title: 'Premiers Pas d\'Écolier',
    description: 'Renseignez vos années d\'école primaire.',
    theme: THEMES[2],
    xp: 80,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'primarySchoolMemory' }
  },

  // --- COLLEGE ---
  {
    id: 'quest_school_brevet',
    title: 'Le Premier Diplôme',
    description: 'Obtention du Brevet des collèges.',
    theme: THEMES[3],
    xp: 150,
    prerequisites: ['quest_school_primary'],
    trigger: { type: 'form.value', field: 'brevetObtained', value: 'true' }
  },
  {
    id: 'quest_school_bac',
    title: 'Le Sésame',
    description: 'Obtention du Baccalauréat.',
    theme: THEMES[3],
    xp: 200,
    prerequisites: ['quest_school_brevet'],
    trigger: { type: 'form.value', field: 'bacObtained', value: 'true' }
  },

  // --- HIGHER ED ---
  {
    id: 'quest_studies_bachelor',
    title: 'Licence Validée',
    description: 'Validation d\'un Bac+3.',
    theme: THEMES[4],
    xp: 300,
    prerequisites: ['quest_school_bac'],
    trigger: { type: 'form.value', field: 'degreeLevel', value: 'bachelor' }
  },
  {
    id: 'quest_studies_master',
    title: 'Master Class',
    description: 'Validation d\'un Bac+5.',
    theme: THEMES[4],
    xp: 500,
    prerequisites: ['quest_studies_bachelor'],
    trigger: { type: 'form.value', field: 'degreeLevel', value: 'master' }
  },

  // --- WORK ---
  {
    id: 'quest_work_first',
    title: 'Premier Salaire',
    description: 'Votre toute première expérience professionnelle.',
    theme: THEMES[5],
    xp: 250,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'firstJob' }
  },
  {
    id: 'quest_work_manager',
    title: 'Leader',
    description: 'Première expérience de management.',
    theme: THEMES[5],
    xp: 400,
    prerequisites: ['quest_work_first'],
    trigger: { type: 'form.value', field: 'hasManaged', value: 'true' }
  },

  // --- ADULT ---
  {
    id: 'quest_adult_home',
    title: 'Chez Soi',
    description: 'Acquérir ou louer son premier logement indépendant.',
    theme: THEMES[6],
    xp: 350,
    prerequisites: ['quest_work_first'],
    trigger: { type: 'form.field_filled', field: 'moveInDate' }
  },
  {
    id: 'quest_adult_budget',
    title: 'Gestionnaire',
    description: 'Gérer son propre budget.',
    theme: THEMES[6],
    xp: 200,
    prerequisites: [],
    trigger: { type: 'form.value', field: 'managesBudget', value: 'true' }
  },

  // --- VISION ---
  {
    id: 'quest_vision_goal',
    title: 'Visionnaire',
    description: 'Définir un objectif clair à 5 ans.',
    theme: THEMES[7],
    xp: 500,
    prerequisites: [],
    trigger: { type: 'form.field_filled', field: 'nextGoal' }
  }
];

// Programmatically generate filler quests to reach 300+
const generatedQuests: any[] = [];
let counter = 1;

THEMES.forEach((theme, themeIdx) => {
    // Generate ~35 quests per theme
    for (let i = 0; i < 35; i++) {
        generatedQuests.push({
            id: `quest_gen_${themeIdx}_${i}`,
            title: `${theme} - Étape ${i + 1}`,
            description: `Une étape importante dans votre parcours de ${theme.toLowerCase()}.`,
            theme: theme,
            xp: 30 + Math.floor(Math.random() * 100),
            prerequisites: i > 0 ? [`quest_gen_${themeIdx}_${i-1}`] : [],
            trigger: { type: 'quest.completed', value: i > 0 ? `quest_gen_${themeIdx}_${i-1}` : undefined }
        });
    }
});

export const QUESTS = [...BASE_QUESTS, ...generatedQuests];
