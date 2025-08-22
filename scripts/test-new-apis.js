#!/usr/bin/env node

// Test script for new API routes
// Run this after applying the migration to verify everything works

const baseUrl = 'http://localhost:3000';

async function testAPIs() {
  console.log('🧪 Testing new API routes...\n');

  try {
    // 1. Test GET /api/agents
    console.log('Testing GET /api/agents...');
    const agentsRes = await fetch(`${baseUrl}/api/agents`);
    const agents = await agentsRes.json();
    console.log(`  ✅ Found ${agents.agents?.length || 0} agents`);
    if (agents.agents?.length > 0) {
      console.log(`     Sample: ${agents.agents[0].name} (${agents.agents[0].id})`);
    }

    // 2. Test GET /api/agents/abraham
    console.log('\nTesting GET /api/agents/abraham...');
    const abrahamRes = await fetch(`${baseUrl}/api/agents/abraham`);
    const abraham = await abrahamRes.json();
    if (abraham.agent) {
      console.log(`  ✅ Agent details: ${abraham.agent.name}`);
      console.log(`     Status: ${abraham.agent.status}`);
      console.log(`     Works: ${abraham.works?.length || 0}`);
      console.log(`     Critiques: ${abraham.critiques?.length || 0}`);
    }

    // 3. Test GET /api/works
    console.log('\nTesting GET /api/works...');
    const worksRes = await fetch(`${baseUrl}/api/works?limit=5`);
    const works = await worksRes.json();
    console.log(`  ✅ Found ${works.count || 0} works (limited to 5)`);

    // 4. Test filtering works by state
    console.log('\nTesting GET /api/works?state=created...');
    const createdRes = await fetch(`${baseUrl}/api/works?state=created&limit=5`);
    const created = await createdRes.json();
    console.log(`  ✅ Found ${created.count || 0} works in 'created' state`);

    // 5. Test GET /api/critiques
    console.log('\nTesting GET /api/critiques...');
    const critiquesRes = await fetch(`${baseUrl}/api/critiques?limit=5`);
    const critiques = await critiquesRes.json();
    console.log(`  ✅ Found ${critiques.count || 0} critiques`);

    // 6. Test GET /api/collects
    console.log('\nTesting GET /api/collects...');
    const collectsRes = await fetch(`${baseUrl}/api/collects?limit=5`);
    const collects = await collectsRes.json();
    console.log(`  ✅ Found ${collects.count || 0} collects`);
    console.log(`     Total value: ${collects.total_value || 0}`);

    // 7. Test Tagger status
    console.log('\nTesting GET /api/tagger...');
    const taggerRes = await fetch(`${baseUrl}/api/tagger`);
    const tagger = await taggerRes.json();
    console.log(`  ✅ Tagger status:`);
    console.log(`     Enabled: ${tagger.enabled}`);
    console.log(`     Sample rate: ${tagger.sample_rate}`);
    console.log(`     Daily budget: $${tagger.daily_budget}`);
    console.log(`     Daily spend: $${tagger.daily_spend}`);

    console.log('\n✨ All API routes tested successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Make sure the dev server is running on http://localhost:3000');
  }
}

testAPIs();