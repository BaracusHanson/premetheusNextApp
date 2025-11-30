import { SkillNode } from "@/types/skilltree";

export const SKILL_TREE: SkillNode[] = [
  {
    id: "productivity",
    label: "Productivité",
    description: "Améliorez votre gestion du temps",
    xpCost: 0,
    children: ["time-management", "focus"],
  },
  {
    id: "time-management",
    label: "Gestion du temps",
    description: "Maîtrisez votre agenda",
    xpCost: 100,
    children: [],
  },
  {
    id: "focus",
    label: "Concentration",
    description: "Restez focalisé sur vos tâches",
    xpCost: 100,
    children: [],
  },
];

export function getSkillTree() {
  // Transform flat list to nodes/edges for visualization libraries like ReactFlow if needed
  const nodes = SKILL_TREE.map((node, index) => ({
    id: node.id,
    data: { label: node.label },
    position: { x: 250 * (index % 2), y: 100 * Math.floor(index / 2) }, 
  }));

  const edges = SKILL_TREE.flatMap((node) =>
    node.children.map((childId) => ({
      id: `${node.id}-${childId}`,
      source: node.id,
      target: childId,
    }))
  );

  return { nodes, edges };
}

const { nodes, edges } = getSkillTree();
export const initialNodes = nodes;
export const initialEdges = edges;
