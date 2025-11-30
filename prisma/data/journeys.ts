const BASE_JOURNEYS: any[] = [
    {
        id: 'journey_architect',
        title: 'L\'Architecte',
        description: 'Construire les fondations solides de votre vie : Emploi, Toit, Budget.',
        // Ce parcours se débloque dès qu'on entre dans la vie active
        triggers: [{ field: 'firstJob', value: 'filled' }],
        // Relie Carrière + Style de Vie
        steps: ['quest_work_first', 'quest_adult_settle', 'quest_adult_finance'],
        rewardXp: 1500,
        rewardBadges: ['badge_builder'] // Un badge de bâtisseur
    },
    {
        id: 'journey_strategist',
        title: 'Le Stratège',
        description: 'Voir loin, viser haut et mener les autres.',
        // Se débloque avec les études sup
        triggers: [{ field: 'higher_education', value: 'true' }],
        // Relie Savoir + Carrière + Croissance
        steps: ['quest_studies_master', 'quest_work_leader', 'quest_growth_vision'],
        rewardXp: 2000,
        rewardBadges: ['badge_visionary'] // Badge visionnaire
    },
    {
        id: 'journey_explorer',
        title: 'L\'Explorateur',
        description: 'Le monde est votre terrain de jeu. Embrassez le mouvement.',
        // Se débloque si on a bougé
        triggers: [{ field: 'moveCount', value: 'filled' }],
        // Relie Identité + Croissance (Adaptabilité)
        steps: ['quest_identity_birth', 'quest_identity_mobility', 'quest_growth_survivor'], 
        rewardXp: 1200,
        rewardBadges: ['badge_explorer_ir']
    },
    {
        id: 'journey_scholar',
        title: 'L\'Érudit',
        description: 'La quête sans fin de la connaissance académique.',
        // Se débloque avec le Bac
        triggers: [{ field: 'bacObtained', value: 'true' }],
        // Focus pur sur le Savoir
        steps: ['quest_school_brevet', 'quest_school_bac', 'quest_studies_higher'],
        rewardXp: 1000,
        rewardBadges: ['badge_master_mind']
    }
];

// Nous réduisons les parcours générés pour garder la qualité
// On en garde quelques-uns pour montrer la variété si besoin, mais moins nombreux.
const generatedJourneys: any[] = [];
for (let i = 0; i < 5; i++) {
    generatedJourneys.push({
        id: `journey_daily_life_${i}`,
        title: `Défis du Quotidien ${i + 1}`,
        description: `Un ensemble de petites victoires à accomplir.`,
        triggers: [],
        // Pioche des quêtes générées aléatoires pour le remplissage
        steps: [`quest_gen_2_${i}`, `quest_gen_3_${i}`], 
        rewardXp: 200 + (i * 50),
        rewardBadges: []
    });
}

export const JOURNEYS = [...BASE_JOURNEYS, ...generatedJourneys];
