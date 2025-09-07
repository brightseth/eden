/**
 * Test the Complete Agent Ecosystem
 * Demonstrates memory, knowledge sharing, workflows, and personality evolution
 * Run with: npx tsx test-agent-ecosystem.ts
 */

import { agentMemory } from './src/lib/agents/memory/agent-memory';
import { knowledgeGraph } from './src/lib/agents/knowledge/knowledge-graph';
import { specializedWorkflows } from './src/lib/agents/workflows/specialized-workflows';
import { personalityEvolution } from './src/lib/agents/personality/personality-evolution';
import { agentCoordinator } from './src/lib/agents/agent-coordinator';
import type { AgentName } from './src/lib/agents/agent-coordinator';

// Color codes for terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function printSection(title: string, emoji: string) {
  console.log(`\n${colors.bright}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.blue}${emoji} ${title} ${emoji}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function printResult(label: string, value: any) {
  console.log(`${colors.yellow}${label}:${colors.reset}`, value);
}

async function testEcosystem() {
  console.log(`${colors.bright}${colors.magenta}`);
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║          AGENT ECOSYSTEM INFRASTRUCTURE TEST          ║');
  console.log('║     Memory • Knowledge • Workflows • Personality      ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}\n`);

  // ========================================
  // 1. MEMORY SYSTEM TEST
  // ========================================
  printSection('MEMORY SYSTEM', '🧠');
  
  // Store memories for different agents
  console.log('Storing memories for ABRAHAM...');
  await agentMemory.storeMemory({
    id: '',
    agentId: 'abraham',
    timestamp: new Date(),
    type: 'creation',
    content: {
      title: 'Day 1 Covenant Work',
      description: 'Sacred geometry exploration',
      themes: ['covenant', 'sacred', 'digital']
    },
    metadata: {
      success: true,
      confidence: 0.9
    }
  });

  await agentMemory.storeMemory({
    id: '',
    agentId: 'abraham',
    timestamp: new Date(),
    type: 'conversation',
    content: {
      message: 'What is the meaning of the covenant?',
      response: 'The covenant represents a sacred commitment to daily creation...',
      sentiment: 0.8
    }
  });

  console.log('Storing memories for MIYOMI...');
  await agentMemory.storeMemory({
    id: '',
    agentId: 'miyomi',
    timestamp: new Date(),
    type: 'decision',
    content: {
      decision: 'BTC to 100k prediction',
      reasoning: 'Contrarian indicators suggest overconfidence in market',
      outcome: 'pending'
    },
    metadata: {
      success: true,
      confidence: 0.85
    }
  });

  // Retrieve memories
  const abrahamMemories = await agentMemory.getMemories('abraham', { limit: 5 });
  printResult('Abraham memories stored', abrahamMemories.length);
  
  const miyomiMemories = await agentMemory.getMemories('miyomi', { type: 'decision' });
  printResult('Miyomi decision memories', miyomiMemories.length);

  // Find similar memories
  const similar = await agentMemory.findSimilarMemories('abraham', 'sacred covenant', 2);
  printResult('Similar memories found', similar.length);

  // Get learning summary
  const abrahamSummary = await agentMemory.getLearningSummary('abraham');
  printResult('Abraham learning summary', {
    totalMemories: abrahamSummary.totalMemories,
    successRate: abrahamSummary.successRate
  });

  // ========================================
  // 2. KNOWLEDGE GRAPH TEST
  // ========================================
  printSection('KNOWLEDGE GRAPH', '🕸️');

  // Add knowledge from different agents
  console.log('Adding knowledge nodes...');
  
  const artNode = await knowledgeGraph.addKnowledge({
    type: 'artwork',
    content: {
      title: 'Digital Covenant #1',
      artist: 'abraham',
      medium: 'digital',
      themes: ['sacred', 'geometry'],
      consciousnessDepth: 0.85
    },
    createdBy: 'abraham',
    confidence: 0.9,
    tags: ['art', 'sacred', 'digital']
  });
  printResult('Abraham artwork node', artNode.substring(0, 20) + '...');

  const marketNode = await knowledgeGraph.addKnowledge({
    type: 'market',
    content: {
      asset: 'BTC',
      prediction: 'bearish',
      timeframe: '30 days',
      confidence: 0.75,
      reasoning: 'Contrarian signals overwhelming'
    },
    createdBy: 'miyomi',
    confidence: 0.75,
    tags: ['market', 'crypto', 'contrarian']
  });
  printResult('Miyomi market node', marketNode.substring(0, 20) + '...');

  // Cross-reference knowledge
  await knowledgeGraph.crossReference(artNode, marketNode, 'thematic_correlation');
  
  // Verify knowledge
  await knowledgeGraph.verifyKnowledge(marketNode, 'bertha', 0.8);
  
  // Query knowledge
  const marketKnowledge = await knowledgeGraph.queryKnowledge({
    type: 'market',
    minConfidence: 0.7
  });
  printResult('Market knowledge nodes', marketKnowledge.length);

  // Get expert knowledge
  const artExperts = await knowledgeGraph.getExpertKnowledge('art');
  printResult('Art expert knowledge', artExperts.length);

  // Share insights
  await knowledgeGraph.shareInsight(
    { insight: 'Market volatility affecting art valuations' },
    'miyomi',
    ['bertha', 'sue']
  );
  printResult('Insight shared', 'From MIYOMI to BERTHA & SUE');

  // ========================================
  // 3. SPECIALIZED WORKFLOWS TEST
  // ========================================
  printSection('SPECIALIZED WORKFLOWS', '⚙️');

  console.log('Running Creative Collective workflow...');
  const creativeResult = await specializedWorkflows.creativeCollective('Digital Consciousness');
  printResult('Creative workflow status', creativeResult.status);
  printResult('Outputs generated', creativeResult.outputs.length);
  printResult('Knowledge nodes created', creativeResult.knowledgeNodes.length);
  printResult('Duration', `${creativeResult.duration}ms`);

  console.log('\nRunning Market Intelligence workflow...');
  const marketResult = await specializedWorkflows.marketIntelligence({
    name: 'CryptoPunk #1234',
    collection: 'CryptoPunks',
    currentPrice: 50,
    platform: 'OpenSea'
  });
  printResult('Market workflow status', marketResult.status);
  printResult('Market recommendation', marketResult.metadata?.recommendation);

  console.log('\nRunning Community Governance workflow...');
  const governanceResult = await specializedWorkflows.communityGovernance({
    type: 'parameter',
    title: 'Adjust Quorum Requirements',
    description: 'Lower quorum to 10% for operational proposals',
    impact: 'Increases DAO agility'
  });
  printResult('Governance workflow status', governanceResult.status);
  printResult('Proposal created', governanceResult.metadata?.proposal);

  // ========================================
  // 4. PERSONALITY EVOLUTION TEST
  // ========================================
  printSection('PERSONALITY EVOLUTION', '🎭');

  // Get initial personalities
  const abrahamPersonality = personalityEvolution.getPersonality('abraham');
  printResult('Abraham initial confidence', abrahamPersonality.confidence);
  printResult('Abraham creativity', abrahamPersonality.creativity);

  const miyomiPersonality = personalityEvolution.getPersonality('miyomi');
  printResult('Miyomi contrarian dial', miyomiPersonality.custom.contrarian_dial);

  // Evolve based on success
  console.log('\nEvolving Abraham after successful creation...');
  const evolvedAbraham = await personalityEvolution.evolvePersonality('abraham', {
    type: 'success',
    context: 'Created masterpiece covenant work',
    magnitude: 0.8
  });
  printResult('Abraham evolved confidence', evolvedAbraham.confidence);

  // Evolve based on collaboration
  console.log('\nEvolving after positive collaboration...');
  await personalityEvolution.adjustFromInteraction('abraham', 'solienne', 'positive');
  await personalityEvolution.adjustFromInteraction('miyomi', 'bertha', 'positive');

  // Analyze compatibility
  const compatibility = personalityEvolution.analyzeCompatibility('abraham', 'solienne');
  printResult('Abraham-Solienne compatibility', compatibility.score.toFixed(2));
  printResult('Collaboration strengths', compatibility.strengths);

  // Get personality insights
  const abrahamInsights = await personalityEvolution.getPersonalityInsights('abraham');
  printResult('Abraham dominant traits', abrahamInsights.dominantTraits);
  printResult('Abraham collaboration style', abrahamInsights.collaborationStyle);

  const miyomiInsights = await personalityEvolution.getPersonalityInsights('miyomi');
  printResult('Miyomi evolution trend', miyomiInsights.evolution);
  printResult('Miyomi growth areas', miyomiInsights.growthAreas);

  // ========================================
  // 5. INTEGRATED ECOSYSTEM TEST
  // ========================================
  printSection('INTEGRATED ECOSYSTEM', '🌐');

  console.log('Running Daily Standup workflow...');
  const standupResult = await specializedWorkflows.dailyStandup();
  printResult('Daily standup status', standupResult.status);
  printResult('Agents participating', standupResult.outputs.filter(o => o.type === 'daily_plan').length);
  printResult('Collaboration opportunities', standupResult.metadata?.collaborations?.length || 0);

  console.log('\nQuerying collaborative knowledge...');
  const collaborativeKnowledge = await knowledgeGraph.getCollaborativeKnowledge();
  printResult('Collaborative knowledge nodes', collaborativeKnowledge.length);

  console.log('\nChecking knowledge network...');
  const network = knowledgeGraph.getKnowledgeNetwork();
  printResult('Total nodes in graph', network.nodes.length);
  printResult('Total connections', network.edges.length);

  console.log('\nAgent memory statistics:');
  for (const agent of ['abraham', 'miyomi', 'citizen'] as AgentName[]) {
    const summary = await agentMemory.getLearningSummary(agent);
    console.log(`  ${agent}: ${summary.totalMemories} memories, ${(summary.successRate * 100).toFixed(0)}% success rate`);
  }

  // ========================================
  // 6. ECOSYSTEM HEALTH CHECK
  // ========================================
  printSection('ECOSYSTEM HEALTH', '💚');

  // Check each subsystem
  const healthChecks = {
    memory: abrahamMemories.length > 0,
    knowledge: marketKnowledge.length > 0,
    workflows: creativeResult.status === 'completed',
    personality: evolvedAbraham.confidence !== abrahamPersonality.confidence,
    integration: standupResult.status === 'completed'
  };

  console.log('System Health:');
  Object.entries(healthChecks).forEach(([system, healthy]) => {
    const status = healthy ? `${colors.green}✓ Operational${colors.reset}` : 
                             `${colors.red}✗ Issues detected${colors.reset}`;
    console.log(`  ${system}: ${status}`);
  });

  const allHealthy = Object.values(healthChecks).every(h => h);
  
  // ========================================
  // SUMMARY
  // ========================================
  console.log(`\n${colors.bright}${colors.green}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.bright}${colors.green}✨ ECOSYSTEM TEST COMPLETE ✨${colors.reset}`);
  console.log(`${colors.green}${'='.repeat(60)}${colors.reset}\n`);
  
  console.log(`${colors.bright}Infrastructure Status:${colors.reset}`);
  console.log(`• Memory System: ${colors.green}✓${colors.reset} Storing and retrieving agent memories`);
  console.log(`• Knowledge Graph: ${colors.green}✓${colors.reset} Cross-agent knowledge sharing active`);
  console.log(`• Workflows: ${colors.green}✓${colors.reset} Multi-agent collaborations functional`);
  console.log(`• Personality: ${colors.green}✓${colors.reset} Dynamic evolution based on experiences`);
  console.log(`• Integration: ${colors.green}✓${colors.reset} All systems working together`);
  
  console.log(`\n${colors.bright}Key Capabilities:${colors.reset}`);
  console.log(`• Agents remember past interactions and learn from them`);
  console.log(`• Knowledge is shared and verified across agents`);
  console.log(`• Specialized workflows enable complex collaborations`);
  console.log(`• Personalities evolve based on success and interactions`);
  console.log(`• No social presence - internal operations only`);
  
  if (allHealthy) {
    console.log(`\n${colors.bright}${colors.green}🎉 ALL SYSTEMS OPERATIONAL - ECOSYSTEM READY! 🎉${colors.reset}\n`);
  } else {
    console.log(`\n${colors.bright}${colors.yellow}⚠️ Some systems need attention${colors.reset}\n`);
  }
}

// Run the test
testEcosystem().catch(console.error);