"use client";

import React, { useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  Position,
  Handle,
  NodeProps,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { QuestDefinition } from "@/types/quest";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Lock, CheckCircle2, Star, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// --- Custom Node Component ---
const SkillNode = ({ data }: NodeProps) => {
  const { title, status, icon, xp } = data as any;

  let bgClass = "bg-surface border-muted";
  let iconColor = "text-muted-foreground";
  
  if (status === 'COMPLETED') {
    bgClass = "bg-green-50 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]";
    iconColor = "text-green-600";
  } else if (status === 'AVAILABLE') {
    bgClass = "bg-blue-50 border-blue-500 animate-pulse-slow shadow-[0_0_15px_rgba(59,130,246,0.3)]";
    iconColor = "text-blue-600";
  } else {
    bgClass = "bg-gray-100 border-gray-300 opacity-80 grayscale";
  }

  return (
    <div className={`w-[200px] p-3 rounded-xl border-2 transition-all duration-300 ${bgClass}`}>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 bg-background ${iconColor} ${status === 'COMPLETED' ? 'border-green-500' : status === 'AVAILABLE' ? 'border-blue-500' : 'border-gray-300'}`}>
          {status === 'COMPLETED' ? <CheckCircle2 className="h-5 w-5" /> : 
           status === 'AVAILABLE' ? <PlayCircle className="h-5 w-5" /> : 
           <Lock className="h-5 w-5" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate">{title}</div>
          <div className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Star className="h-2 w-2" /> {xp} XP
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  );
};

const nodeTypes = {
  skill: SkillNode,
};

// --- Layout Logic ---
const getLayoutedElements = (nodes: any[], edges: any[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 80 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return {
    nodes: nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      return {
        ...node,
        targetPosition: 'top',
        sourcePosition: 'bottom',
        position: {
          x: nodeWithPosition.x - 100,
          y: nodeWithPosition.y - 40,
        },
      };
    }),
    edges,
  };
};

interface SkillTreeProps {
  quests: QuestDefinition[];
  completedIds: Set<string>;
}

export default function SkillTreeClient({ quests, completedIds }: SkillTreeProps) {
  const [selectedNode, setSelectedNode] = React.useState<QuestDefinition | null>(null);

  // Generate Initial Graph Data
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const nodes: any[] = [];
    const edges: any[] = [];

    quests.forEach(quest => {
      // Determine Status
      let status = 'LOCKED';
      const isCompleted = completedIds.has(quest.id);
      
      if (isCompleted) {
        status = 'COMPLETED';
      } else {
        // Check prerequisites
        const prereqs = quest.prerequisites || [];
        const allPrereqsMet = prereqs.length === 0 || prereqs.every(p => completedIds.has(p));
        if (allPrereqsMet) status = 'AVAILABLE';
      }

      nodes.push({
        id: quest.id,
        type: 'skill',
        data: { 
            title: quest.title, 
            status, 
            xp: quest.xp,
            fullQuest: quest // Store full data for details
        },
        position: { x: 0, y: 0 } // Will be computed
      });

      // Create Edges based on prerequisites
      (quest.prerequisites || []).forEach(preId => {
        // Check if prerequisite actually exists in our list (safety check)
        if (quests.some(q => q.id === preId)) {
            edges.push({
                id: `${preId}-${quest.id}`,
                source: preId,
                target: quest.id,
                type: 'smoothstep',
                animated: status === 'AVAILABLE', // Animate path to next available quest
                style: { stroke: status === 'COMPLETED' ? '#22c55e' : '#94a3b8', strokeWidth: 2 }
            });
        }
      });
    });

    return getLayoutedElements(nodes, edges);
  }, [quests, completedIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node.data.fullQuest);
  }, []);

  return (
    <div className="h-full w-full bg-white rounded-xl border shadow-sm relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap zoomable pannable />
      </ReactFlow>

      {/* Details Dialog */}
      <Dialog open={!!selectedNode} onOpenChange={(open) => !open && setSelectedNode(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    {selectedNode?.title}
                    {completedIds.has(selectedNode?.id || '') && <Badge className="bg-green-500">Complété</Badge>}
                </DialogTitle>
                <DialogDescription>{selectedNode?.theme}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">{selectedNode?.description}</p>
                
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="h-4 w-4" /> {selectedNode?.xp} XP
                    </div>
                    {selectedNode?.prerequisites && selectedNode.prerequisites.length > 0 && (
                        <div className="text-muted-foreground">
                            Prérequis: {selectedNode.prerequisites.length} quête(s)
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    {!completedIds.has(selectedNode?.id || '') ? (
                        <Link href={`/quests?focus=${selectedNode?.id}`}>
                            <Button>Voir la quête</Button>
                        </Link>
                    ) : (
                        <Button variant="outline" disabled>Déjà complété</Button>
                    )}
                </div>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
