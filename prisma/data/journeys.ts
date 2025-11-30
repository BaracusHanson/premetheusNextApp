const BASE_JOURNEYS: any[] = [
    {
        id: 'journey_pathfinder',
        title: 'Life Pathfinder',
        description: 'Un parcours équilibré pour toucher à tout.',
        triggers: [{ field: 'any', value: 'any' }], // Always available? or specific
        steps: ['quest_identity_roots', 'quest_school_primary', 'quest_work_first'],
        rewardXp: 500,
        rewardBadges: ['badge_identity_master']
    },
    {
        id: 'journey_science_tech',
        title: 'De la Science au Numérique',
        description: 'Transition d\'études scientifiques vers la tech.',
        triggers: [{ field: 'degreeDetails', value: 'science' }], // Mock trigger
        steps: ['quest_studies_master', 'quest_work_first'],
        rewardXp: 800,
        rewardBadges: ['badge_master_mind']
    },
    {
        id: 'journey_autonomy',
        title: 'Autonomie Complète',
        description: 'Prendre son envol et gérer sa vie.',
        triggers: [{ field: 'hasApartment', value: 'owner' }],
        steps: ['quest_adult_home', 'quest_adult_budget'],
        rewardXp: 1000,
        rewardBadges: ['badge_builder']
    },
    {
        id: 'journey_resilience',
        title: 'Résilience et Rebond',
        description: 'Surmonter les épreuves.',
        triggers: [{ field: 'covidPeriodOverlaps', value: 'true' }],
        steps: ['quest_resilience_1'], // Assuming generated
        rewardXp: 1200,
        rewardBadges: ['badge_survivor']
    }
];

const generatedJourneys: any[] = [];

for (let i = 0; i < 36; i++) {
    generatedJourneys.push({
        id: `journey_gen_${i}`,
        title: `Parcours Découverte ${i+1}`,
        description: `Un chemin unique généré pour vous.`,
        triggers: [],
        steps: [`quest_gen_${i % 8}_0`, `quest_gen_${i % 8}_1`],
        rewardXp: 300 + i * 10,
        rewardBadges: []
    });
}

export const JOURNEYS = [...BASE_JOURNEYS, ...generatedJourneys];
