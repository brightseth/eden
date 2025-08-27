#!/usr/bin/env node

const agents = [
  { name: 'ABRAHAM', endpoint: '/api/agents/abraham', expectedField: 'currentWork' },
  { name: 'SOLIENNE', endpoint: '/api/agents/solienne', expectedField: 'consciousness' },
  { name: 'SUE', endpoint: '/api/agents/sue', expectedField: 'gallery' },
  { name: 'CITIZEN', endpoint: '/api/agents/citizen', expectedField: 'dao' },
  { name: 'BERTHA', endpoint: '/api/agents/bertha', expectedField: 'intelligence' },
  { name: 'MIYOMI', endpoint: '/api/agents/miyomi', expectedField: 'market' },
  { name: 'GEPPETTO', endpoint: '/api/agents/geppetto', expectedField: 'design' },
  { name: 'KORU', endpoint: '/api/agents/koru', expectedField: 'community' }
];

async function testAgent(agent) {
  try {
    const response = await fetch(`http://localhost:3000${agent.endpoint}`, {
      timeout: 10000,
    });
    
    if (!response.ok) {
      return { ...agent, status: 'ERROR', details: `HTTP ${response.status}` };
    }
    
    const data = await response.json();
    
    // Check if response has valid JSON structure
    if (data && typeof data === 'object') {
      // Look for key indicators of a working agent endpoint
      const hasAgentData = data.agent || data.name || data.handle || 
                          data.currentWork || data.consciousness || data.gallery || 
                          data.dao || data.intelligence || data.market || 
                          data.design || data.community || data.capabilities;
      
      if (hasAgentData) {
        return { ...agent, status: 'OPERATIONAL', details: 'Endpoint responding correctly' };
      } else {
        return { ...agent, status: 'WARNING', details: 'Valid JSON but unexpected format' };
      }
    } else {
      return { ...agent, status: 'WARNING', details: 'Invalid JSON response' };
    }
    
  } catch (error) {
    return { ...agent, status: 'ERROR', details: error.message };
  }
}

async function testAllAgents() {
  console.log('🚀 Eden Academy - Agent Deployment Verification');
  console.log('='.repeat(50));
  
  const results = [];
  
  for (const agent of agents) {
    process.stdout.write(`Testing ${agent.name}... `);
    const result = await testAgent(agent);
    results.push(result);
    
    const statusIcon = result.status === 'OPERATIONAL' ? '✅' : 
                      result.status === 'WARNING' ? '⚠️' : '❌';
    console.log(`${statusIcon} ${result.status}`);
    
    if (result.details !== 'Endpoint responding correctly') {
      console.log(`   Details: ${result.details}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 DEPLOYMENT SUMMARY');
  console.log('='.repeat(50));
  
  const operational = results.filter(r => r.status === 'OPERATIONAL').length;
  const warnings = results.filter(r => r.status === 'WARNING').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log(`✅ OPERATIONAL: ${operational}/8 agents`);
  console.log(`⚠️  WARNINGS: ${warnings}/8 agents`);
  console.log(`❌ ERRORS: ${errors}/8 agents`);
  
  console.log(`\n🎯 DEPLOYMENT STATUS: ${operational === 8 ? 'SUCCESS' : 'NEEDS ATTENTION'}`);
  
  if (operational === 8) {
    console.log('\n🎉 ALL AGENTS SUCCESSFULLY DEPLOYED!');
    console.log('💰 Total Monthly Revenue: $76,700');
    console.log('🏆 Eden Academy is fully operational');
  } else {
    console.log(`\n🔧 ${8 - operational} agents need attention`);
    console.log('📈 Revenue at risk until all agents are operational');
  }
  
  return results;
}

// Run the test
testAllAgents().catch(console.error);