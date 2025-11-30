import { create } from 'zustand';
import { initialNodes, initialEdges } from '@/lib/skilltree';
import { Node, Edge, applyNodeChanges, applyEdgeChanges, OnNodesChange, OnEdgesChange } from 'reactflow';

interface SkillTreeState {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  unlockNode: (nodeId: string) => void;
}

export const useSkillTreeStore = create<SkillTreeState>((set, get) => ({
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  unlockNode: (nodeId) => set((state) => ({
    nodes: state.nodes.map((node) => 
      node.id === nodeId ? { ...node, data: { ...node.data, status: 'completed' } } : node
    )
  })),
}));
