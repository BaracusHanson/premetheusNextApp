import { Rarity } from '@prisma/client';

const CATEGORIES = [
  "Identity", "School", "Work", "Adaptation", "Resilience", "Vision", "Social", "Adulting"
];

const CATEGORY_ICONS: Record<string, string> = {
  "Identity": "fingerprint",
  "School": "graduation-cap",
  "Work": "briefcase",
  "Adaptation": "compass",
  "Resilience": "shield",
  "Vision": "telescope",
  "Social": "users",
  "Adulting": "home",
  "Secret": "lock"
};

const BASE_BADGES: any[] = [
  {
    id: 'badge_identity_master',
    name: 'Connais-toi toi-même',
    description: 'A complété toutes les quêtes d\'identité.',
    category: 'Identity',
    rarity: Rarity.RARE,
    xp: 500,
    condition: { type: 'multi_section_completed', sections: ['identity'] },
    icon: 'fingerprint'
  },
  {
    id: 'badge_nomad',
    name: 'Nomade',
    description: 'A déménagé plus de 3 fois.',
    category: 'Adaptation',
    rarity: Rarity.COMMON,
    xp: 100,
    condition: { type: 'form.value', field: 'moveCount', threshold: 3, operator: '>' },
    icon: 'compass'
  },
  {
    id: 'badge_explorer_ir',
    name: 'Grand Explorateur',
    description: 'A déménagé plus de 7 fois.',
    category: 'Adaptation',
    rarity: Rarity.EPIC,
    xp: 1000,
    condition: { type: 'form.value', field: 'moveCount', threshold: 7, operator: '>' },
    icon: 'map'
  },
  {
    id: 'badge_bac_fighter',
    name: 'Bachelier',
    description: 'A obtenu le Bac.',
    category: 'School',
    rarity: Rarity.COMMON,
    xp: 200,
    condition: { type: 'quest.completed', questId: 'quest_school_bac' },
    icon: 'scroll'
  },
  {
    id: 'badge_master_mind',
    name: 'Master Mind',
    description: 'Titulaire d\'un Master.',
    category: 'School',
    rarity: Rarity.RARE,
    xp: 600,
    condition: { type: 'quest.completed', questId: 'quest_studies_master' },
    icon: 'graduation-cap'
  },
  {
    id: 'badge_first_paycheck',
    name: 'Indépendant',
    description: 'A gagné son premier salaire.',
    category: 'Work',
    rarity: Rarity.COMMON,
    xp: 150,
    condition: { type: 'quest.completed', questId: 'quest_work_first' },
    icon: 'coins'
  },
  {
    id: 'badge_time_traveler',
    name: 'Time Traveler',
    description: 'A visité une époque révolue.',
    category: 'Secret',
    rarity: Rarity.SECRET,
    xp: 2000,
    condition: { type: 'secret', hint: '???' },
    icon: 'hourglass'
  }
];

// Generate ~300 badges
const generatedBadges: any[] = [];
const rarities = [Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, Rarity.RARE, Rarity.RARE, Rarity.EPIC];

CATEGORIES.forEach((cat, idx) => {
    for (let i = 0; i < 35; i++) {
        const rarity = i > 30 ? Rarity.SECRET : rarities[i % rarities.length];
        generatedBadges.push({
            id: `badge_gen_${cat.toLowerCase()}_${i}`,
            name: `${cat} ${rarity === Rarity.SECRET ? 'Secret' : 'Achievement'} ${i+1}`,
            description: `Un badge témoignant de votre progression en ${cat}.`,
            category: cat,
            rarity: rarity,
            xp: (rarity === Rarity.COMMON ? 50 : rarity === Rarity.RARE ? 200 : rarity === Rarity.EPIC ? 800 : 2000) + i * 10,
            condition: { type: 'quest.completed', questId: `quest_gen_${idx}_${i}` }, // Link to generated quests roughly
            icon: CATEGORY_ICONS[cat] || 'trophy'
        });
    }
});

export const BADGES = [...BASE_BADGES, ...generatedBadges];
