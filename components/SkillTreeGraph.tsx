"use client";

import React, { useCallback } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap, 
    Node, 
    NodeProps, 
    Handle, 
    Position,
    Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { cn } from '@/lib/utils';
import { Lock, Star, Check, Activity } from 'lucide-react';

// Custom Node Component
const CustomSkillNode = ({ data }: NodeProps) => {
  // data.label format: "Name\nLvl X"
  const [label, subLabel] = (data.label || "").split("\n");

  return (
    <div className={cn(
      "relative min-w-[140px] p-3 rounded-xl border-2 shadow-md transition-all duration-300 group bg-card text-card-foreground",
      data.unlocked ? "border-primary" : "border-muted grayscale opacity-70"
    )}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-current border-2 border-background" />
      
      <div className="flex items-center justify-between mb-2">
        <div className={cn("p-1.5 rounded-full bg-primary/10 text-primary")}>
            <Activity className="w-3 h-3" />
        </div>
      </div>

      <div className="font-bold text-sm leading-tight text-center">{label}</div>
      {subLabel && (
          <div className="text-[10px] text-center text-muted-foreground font-mono mt-1 px-2 py-0.5 bg-muted rounded-full mx-auto w-fit">
              {subLabel}
          </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-current border-2 border-background" />
    </div>
  );
};

const nodeTypes = {
  default: CustomSkillNode,
  input: CustomSkillNode // Handle input type too with same style for simplicity
};

interface SkillTreeGraphProps {
    nodes: Node[];
    edges: Edge[];
}

export function SkillTreeGraph({ nodes, edges }: SkillTreeGraphProps) {
  return (
    <div className="h-[600px] w-full border rounded-xl overflow-hidden bg-muted/10 relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="hsl(var(--muted-foreground))" gap={20} size={1} style={{ opacity: 0.1 }} />
        <Controls className="!bg-background !border-border !shadow-sm" />
        <MiniMap 
            style={{ height: 100, width: 150 }} 
            zoomable 
            pannable 
            className="!bg-background !border-border !rounded-lg !overflow-hidden"
        />
      </ReactFlow>
    </div>
  );
}

