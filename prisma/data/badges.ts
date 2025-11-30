import { Rarity } from '@prisma/client';

// Categories alignées sur Quests V2 (5 Thèmes)
// 0: Identity, 1: Knowledge, 2: Career, 3: Lifestyle, 4: Growth
const CATEGORIES = [
  "Identity", 
  "Knowledge", 
  "Career", 
  "Lifestyle", 
  "Growth"
];

const CATEGORY_ICONS: Record<string, string> = {
  "Identity": "fingerprint",
  "Knowledge": "book-open",
  "Career": "briefcase",
  "Lifestyle": "home",
  "Growth": "sprout",
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
    category: 'Identity', // Changed from Adaptation to Identity/Lifestyle
    rarity: Rarity.COMMON,
    xp: 100,
    condition: { type: 'form.value', field: 'moveCount', threshold: 3, operator: '>' },
    icon: 'compass'
  },
  {
    id: 'badge_explorer_ir',
    name: 'Grand Explorateur',
    description: 'A déménagé plus de 7 fois.',
    category: 'Identity',
    rarity: Rarity.EPIC,
    xp: 1000,
    condition: { type: 'form.value', field: 'moveCount', threshold: 7, operator: '>' },
    icon: 'map'
  },
  {
    id: 'badge_bac_fighter',
    name: 'Bachelier',
    description: 'A obtenu le Bac.',
    category: 'Knowledge', // School -> Knowledge
    rarity: Rarity.COMMON,
    xp: 200,
    condition: { type: 'quest.completed', questId: 'quest_school_bac' },
    icon: 'scroll'
  },
  {
    id: 'badge_master_mind',
    name: 'Master Mind',
    description: 'Titulaire d\'un Master.',
    category: 'Knowledge',
    rarity: Rarity.RARE,
    xp: 600,
    condition: { type: 'quest.completed', questId: 'quest_studies_master' },
    icon: 'graduation-cap'
  },
  {
    id: 'badge_first_paycheck',
    name: 'Indépendant',
    description: 'A gagné son premier salaire.',
    category: 'Career', // Work -> Career
    rarity: Rarity.COMMON,
    xp: 150,
    condition: { type: 'quest.completed', questId: 'quest_work_first' },
    icon: 'coins'
  },
  {
    id: 'badge_survivor',
    name: 'Survivant',
    description: 'A surmonté une épreuve majeure.',
    category: 'Growth', // Resilience -> Growth
    rarity: Rarity.EPIC,
    xp: 800,
    condition: { type: 'form.value', field: 'major_hardship', value: 'true' },
    icon: 'shield'
  },
  {
    id: 'badge_team_leader',
    name: 'Chef de Meute',
    description: 'A géré une équipe.',
    category: 'Career',
    rarity: Rarity.RARE,
    xp: 450,
    condition: { type: 'form.value', field: 'leadership_experience', value: 'true' },
    icon: 'users'
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

// Generate ~150 badges (30 per category)
const generatedBadges: any[] = [];
const rarities = [Rarity.COMMON, Rarity.COMMON, Rarity.COMMON, Rarity.RARE, Rarity.RARE, Rarity.EPIC];

CATEGORIES.forEach((cat, idx) => {
    // We generated 10 quests per theme in quests.ts, so let's generate 10 matching badges
    // If we generate more badges than quests, they will be impossible to unlock via 'quest.completed'
    // unless they link to non-existent quests.
    // Let's limit to 10 to match quests.ts filler volume.
    for (let i = 0; i < 10; i++) {
        const rarity = i > 8 ? Rarity.EPIC : rarities[i % rarities.length];
        generatedBadges.push({
            id: `badge_gen_${cat.toLowerCase()}_${i}`,
            name: `${cat} ${rarity === Rarity.EPIC ? 'Master' : 'Expert'} ${i+1}`,
            description: `Un badge témoignant de votre progression en ${cat}.`,
            category: cat,
            rarity: rarity,
            xp: (rarity === Rarity.COMMON ? 50 : rarity === Rarity.RARE ? 200 : rarity === Rarity.EPIC ? 800 : 2000) + i * 10,
            condition: { type: 'quest.completed', questId: `quest_gen_${idx}_${i}` }, // Links correctly to quest_gen_0_0, etc.
            icon: CATEGORY_ICONS[cat] || 'trophy'
        });
    }
});

export const BADGES = [...BASE_BADGES, ...generatedBadges];
