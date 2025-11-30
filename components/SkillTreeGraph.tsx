"use client";

import React, { useCallback } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap, 
    Node, 
    NodeProps, 
    Handle, 
    Position 
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useSkillTreeStore } from '@/store/useSkillTreeStore';
import { cn } from '@/lib/utils';

// Custom Node Component
const CustomSkillNode = ({ data }: NodeProps) => {
  return (
    <div className={cn(
      "px-4 py-2 rounded-md border-2 shadow-sm min-w-[150px] text-center transition-colors",
      data.status === 'completed' ? "bg-accent/20 border-accent text-accent-foreground" :
      data.status === 'available' ? "bg-surface border-primary text-primary hover:bg-primary/10 cursor-pointer" :
      "bg-muted border-muted-foreground/50 text-muted-foreground opacity-80"
    )}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-current" />
      <div className="font-bold text-sm">{data.label}</div>
      <div className="text-xs opacity-80">{data.description}</div>
      {data.status === 'locked' && <div className="mt-1 text-[10px] uppercase tracking-wider">Locked</div>}
      {data.xpCost > 0 && data.status !== 'completed' && (
          <div className="mt-1 text-[10px] font-mono">{data.xpCost} XP</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-current" />
    </div>
  );
};

const nodeTypes = {
  default: CustomSkillNode,
};

export function SkillTreeGraph() {
  const { nodes, edges, onNodesChange, onEdgesChange, unlockNode } = useSkillTreeStore();

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
      if (node.data.status === 'available') {
          // In real app, show confirmation modal to spend XP
          // For now, just unlock
          console.log("Unlocking node", node.id);
          // This should ideally call a store action that checks XP and updates status
          // unlockNode(node.id); // Commented out to prevent accidental clicks in preview without logic
      }
  }, [unlockNode]);

  return (
    <div className="h-[600px] w-full border rounded-xl overflow-hidden bg-slate-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#ccc" gap={16} />
        <Controls />
        <MiniMap style={{ height: 120 }} zoomable pannable />
      </ReactFlow>
    </div>
  );
}
