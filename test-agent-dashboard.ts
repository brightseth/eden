/**
 * Test Agent Dashboard Server
 * Verify all systems are working before launch
 */

import { agentMemory } from './src/lib/agents/memory/agent-memory';
import { knowledgeGraph } from './src/lib/agents/knowledge/knowledge-graph';
import { personalityEvolution } from './src/lib/agents/personality/personality-evolution';

async function testSystems() {
  console.log('🔧 Testing Agent Dashboard Systems...\n');

  // Test 1: Memory System
  console.log('1. Testing Memory System...');
  try {
    await agentMemory.storeMemory({
      id: '',
      agentId: 'abraham',
      timestamp: new Date(),
      type: 'conversation',
      content: {
        message: 'test message',
        response: 'test response'
      }
    });
    
    const memories = await agentMemory.getMemories('abraham', { limit: 1 });
    console.log(`   ✅ Memory system working (${memories.length} memories found)`);
  } catch (error) {
    console.log('   ❌ Memory system failed:', error);
  }

  // Test 2: Knowledge Graph
  console.log('2. Testing Knowledge Graph...');
  try {
    const nodeId = await knowledgeGraph.addKnowledge({
      type: 'insight',
      content: { test: 'dashboard test' },
      createdBy: 'abraham',
      confidence: 0.8,
      tags: ['test']
    });
    
    const nodes = await knowledgeGraph.queryKnowledge({ limit: 1 });
    console.log(`   ✅ Knowledge graph working (${nodes.length} nodes, latest: ${nodeId.substring(0, 10)}...)`);
  } catch (error) {
    console.log('   ❌ Knowledge graph failed:', error);
  }

  // Test 3: Personality System
  console.log('3. Testing Personality System...');
  try {
    const personality = personalityEvolution.getPersonality('abraham');
    console.log(`   ✅ Personality system working (confidence: ${(personality.confidence * 100).toFixed(0)}%)`);
  } catch (error) {
    console.log('   ❌ Personality system failed:', error);
  }

  // Test 4: Agent Statistics
  console.log('4. Testing Agent Statistics...');
  try {
    const agents = ['abraham', 'solienne', 'miyomi', 'geppetto', 'koru', 
                   'bertha', 'citizen', 'sue', 'bart', 'verdelis'];
    let totalMemories = 0;
    
    for (const agent of agents) {
      const summary = await agentMemory.getLearningSummary(agent as any);
      totalMemories += summary.totalMemories;
    }
    
    console.log(`   ✅ Agent statistics working (${totalMemories} total memories across ${agents.length} agents)`);
  } catch (error) {
    console.log('   ❌ Agent statistics failed:', error);
  }

  console.log('\n✨ System test complete!');
  console.log('🚀 Ready to launch dashboard with: ./launch-agent-dashboard.sh');
  console.log('📱 Dashboard will be available at: http://localhost:7777');
}

// Run tests
testSystems().catch(console.error);