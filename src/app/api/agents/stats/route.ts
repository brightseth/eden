import { NextResponse } from 'next/server';
import { agentMemory } from '@/lib/agents/memory/agent-memory';
import { knowledgeGraph } from '@/lib/agents/knowledge/knowledge-graph';
import { personalityEvolution } from '@/lib/agents/personality/personality-evolution';

const agents = ['abraham', 'solienne', 'miyomi', 'geppetto', 'koru', 
                'bertha', 'citizen', 'sue', 'bart', 'verdelis'];

export async function GET() {
  try {
    const stats: any = {};

    // Get stats for each agent
    for (const agent of agents) {
      const summary = await agentMemory.getLearningSummary(agent as any);
      const personality = personalityEvolution.getPersonality(agent as any);
      
      stats[agent] = {
        totalMemories: summary.totalMemories,
        successRate: summary.successRate,
        confidence: personality.confidence,
        collaborations: summary.memoryTypes.collaboration || 0
      };
    }

    // Get knowledge graph stats
    const knowledgeNodes = await knowledgeGraph.queryKnowledge({});
    stats.knowledgeNodes = knowledgeNodes.length;

    // Calculate total collaborations
    stats.collaborations = Object.values(stats).reduce(
      (sum: number, agentStats: any) => sum + (agentStats.collaborations || 0), 
      0
    );

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}