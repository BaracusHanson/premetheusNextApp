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

const generatedNodes: any[] = [];

THEMES.forEach((theme, themeIdx) => {
    // 10 nodes per theme
    for (let i = 0; i < 10; i++) {
        generatedNodes.push({
            id: `node_${themeIdx}_${i}`,
            label: `${theme.split(' ')[0]} Level ${i + 1}`,
            theme: theme,
            questIds: [`quest_gen_${themeIdx}_${i*3}`, `quest_gen_${themeIdx}_${i*3+1}`, `quest_gen_${themeIdx}_${i*3+2}`] // Link 3 quests per node roughly
        });
    }
});

export const SKILL_NODES = generatedNodes;
