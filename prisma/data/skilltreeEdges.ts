import { SKILL_NODES } from './skilltreeNodes';

const generatedEdges: any[] = [];

// Link nodes within themes (0->1->2...)
for (let themeIdx = 0; themeIdx < 8; themeIdx++) {
    for (let i = 0; i < 9; i++) {
        generatedEdges.push({
            id: `edge_${themeIdx}_${i}_${i+1}`,
            fromNodeId: `node_${themeIdx}_${i}`,
            toNodeId: `node_${themeIdx}_${i+1}`
        });
    }
}

// Add cross-theme edges (e.g. Childhood -> College)
// Theme 2 (Enfance) -> Theme 3 (Collège)
generatedEdges.push({ id: 'edge_cross_2_3', fromNodeId: `node_2_9`, toNodeId: `node_3_0` });
// Theme 3 -> Theme 4
generatedEdges.push({ id: 'edge_cross_3_4', fromNodeId: `node_3_9`, toNodeId: `node_4_0` });
// Theme 3 -> Theme 5 (Direct work)
generatedEdges.push({ id: 'edge_cross_3_5', fromNodeId: `node_3_9`, toNodeId: `node_5_0` });
// Theme 4 -> Theme 5
generatedEdges.push({ id: 'edge_cross_4_9', fromNodeId: `node_4_9`, toNodeId: `node_5_3` });

// Add some branches to reach ~200 edges
// Link random nodes
let edgeCount = generatedEdges.length;
for (let i = 0; i < 200 - edgeCount; i++) {
    const randomTheme = Math.floor(Math.random() * 8);
    const randomNode1 = Math.floor(Math.random() * 8);
    const randomNode2 = Math.floor(Math.random() * 8) + 2;
    if (randomNode1 < 9) {
        generatedEdges.push({
            id: `edge_rand_${i}`,
            fromNodeId: `node_${randomTheme}_${randomNode1}`,
            toNodeId: `node_${randomTheme}_${randomNode1+1}` // Parallel paths
        });
    }
}

export const SKILL_EDGES = generatedEdges;
