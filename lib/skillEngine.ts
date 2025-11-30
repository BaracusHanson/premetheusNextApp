import { formSteps, FormQuestion, QuestionSubField } from "./formSteps";

export interface SkillNode {
  id: string;
  label: string;
  category: string; // "Soft Skill", "Hard Skill", "Life Skill"
  score: number; // 0 to 100
  maxScore: number;
  unlocked: boolean;
}

export interface SkillTreeData {
  nodes: any[]; // ReactFlow Nodes
  edges: any[]; // ReactFlow Edges
  stats: SkillNode[]; // Raw stats
}

const SKILL_DEFINITIONS: Record<string, { label: string, category: string }> = {
  // Identity & Roots
  "self_awareness": { label: "Connaissance de Soi", category: "Life Skill" },
  "cultural_heritage": { label: "Héritage Culturel", category: "Life Skill" },
  
  // Adaptation
  "adaptability": { label: "Adaptabilité", category: "Soft Skill" },
  "openness": { label: "Ouverture d'esprit", category: "Soft Skill" },
  
  // School
  "critical_thinking": { label: "Esprit Critique", category: "Soft Skill" },
  "expertise": { label: "Expertise Technique", category: "Hard Skill" },
  "specialization": { label: "Spécialisation", category: "Hard Skill" },
  
  // Work
  "leadership": { label: "Leadership", category: "Soft Skill" },
  "people_management": { label: "Management", category: "Soft Skill" },
  "autonomy": { label: "Autonomie", category: "Life Skill" },
  "financial_literacy": { label: "Gestion Financière", category: "Life Skill" },
  
  // Resilience
  "resilience": { label: "Résilience", category: "Life Skill" },
  "grit": { label: "Persévérance", category: "Life Skill" },
  "vision": { label: "Vision", category: "Soft Skill" },
  "ambition": { label: "Ambition", category: "Soft Skill" }
};

export function generateUserSkillTree(answers: Record<string, any>): SkillTreeData {
  const skillsMap = new Map<string, number>();

  // Initialize all known skills to 0 (or hidden)
  Object.keys(SKILL_DEFINITIONS).forEach(key => skillsMap.set(key, 0));

  // 1. Calculate Scores based on Answers & Tags
  const processQuestion = (q: FormQuestion | QuestionSubField) => {
    const value = answers[q.id];
    
    // If question has a value (and condition met ideally, but answers usually implies condition met)
    if (value && q.skillTags) {
        const weight = q.weight || 1.0; // Default weight
        
        q.skillTags.forEach(tag => {
            const current = skillsMap.get(tag) || 0;
            // Base increment: 10 points * weight
            // If value is boolean true -> full points
            // If value is number (e.g. moveCount), scale it? For now simpler logic.
            let points = 10 * weight;
            
            if (q.type === 'boolean' && value !== 'true' && value !== true) points = 0;
            if (q.type === 'select' && (value === 'no' || value === 'false')) points = 0;
            
            // Specific boosters
            if (q.id === 'moveCount' && typeof value === 'number') points = value * 5;
            if (q.id === 'teamSize' && typeof value === 'number') points = Math.min(value * 2, 50);

            skillsMap.set(tag, current + points);
        });
    }

    if ('subQuestions' in q && q.subQuestions) {
        q.subQuestions.forEach(processQuestion);
    }
  };

  formSteps.forEach(step => {
      step.questions.forEach(processQuestion);
  });

  // 2. Generate Graph Nodes
  const nodes: any[] = [];
  const edges: any[] = [];
  const stats: SkillNode[] = [];

  // Central Node (The Core)
  nodes.push({
      id: 'core',
      type: 'input', // or default, but styled as center
      data: { label: 'Moi' },
      position: { x: 0, y: 0 },
      style: { background: '#fff', color: '#000', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid #000' }
  });

  let angle = 0;
  const radius = 200;
  const skillKeys = Array.from(skillsMap.keys()).filter(k => (skillsMap.get(k) || 0) > 0);
  const stepAngle = (2 * Math.PI) / (skillKeys.length || 1);

  skillKeys.forEach((key, idx) => {
      const score = Math.min(skillsMap.get(key) || 0, 100); // Cap at 100
      const def = SKILL_DEFINITIONS[key];
      if (!def) return;

      // Stats for UI
      stats.push({
          id: key,
          label: def.label,
          category: def.category,
          score,
          maxScore: 100,
          unlocked: true
      });

      // Graph Node
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      nodes.push({
          id: key,
          data: { label: `${def.label}\nLvl ${Math.floor(score/10)}` },
          position: { x, y },
          className: "bg-card border-2 border-primary text-card-foreground text-xs font-bold p-2 rounded-lg shadow-md text-center min-w-[100px]",
          // Could add custom data for size based on score
      });

      // Edge from Core
      edges.push({
          id: `e-core-${key}`,
          source: 'core',
          target: key,
          animated: true,
          style: { stroke: '#888' }
      });

      angle += stepAngle;
  });

  return { nodes, edges, stats };
}
