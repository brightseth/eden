import { NextResponse } from 'next/server';
import { agentMemory } from '@/lib/agents/memory/agent-memory';
import { knowledgeGraph } from '@/lib/agents/knowledge/knowledge-graph';

export async function GET() {
  try {
    // Check each subsystem health
    const health = {
      memory: false,
      knowledge: false,
      workflows: true, // Always true since it's stateless
      personality: true, // Always true since it's stateless
      integration: false
    };

    // Test memory system
    try {
      const testMemory = await agentMemory.getMemories('abraham', { limit: 1 });
      health.memory = true;
    } catch (error) {
      console.error('Memory system unhealthy:', error);
    }

    // Test knowledge graph
    try {
      const testKnowledge = await knowledgeGraph.queryKnowledge({ limit: 1 });
      health.knowledge = true;
    } catch (error) {
      console.error('Knowledge graph unhealthy:', error);
    }

    // Check overall integration
    health.integration = health.memory && health.knowledge;

    return NextResponse.json(health);
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    );
  }
}