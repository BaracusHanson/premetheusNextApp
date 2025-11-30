import { NextResponse } from "next/server";
import { getSkillTree } from "@/lib/skilltree";

export async function GET() {
  const { nodes, edges } = getSkillTree();
  
  // In a real app, we would fetch user unlocked skills here
  const state = {}; 

  return NextResponse.json({ nodes, edges, state });
}
