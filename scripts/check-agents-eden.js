#!/usr/bin/env node

// Script to check agent presence on Eden.art API
const https = require('https');

const API_KEY = 'db10962875d98d2a2dafa8599a89c850766f39647095c002';
const API_BASE = 'https://api.eden.art/v2';

// Known agent IDs from previous searches
const KNOWN_AGENTS = {
  solienne: '67f8af96f2cc4291ee840cc5', // Already confirmed
  verdelis: '668f479bb4aef2322e3fdb45', // Already confirmed
};

// Agents to search for
const AGENTS_TO_FIND = ['solienne', 'sue', 'miyomi', 'abraham', 'verdelis'];

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.eden.art',
      path,
      method: 'GET',
      headers: {
        'X-Api-Key': API_KEY
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function searchAgent(name) {
  // First check if we already know the ID
  if (KNOWN_AGENTS[name.toLowerCase()]) {
    const agent = await makeRequest(`/v2/agents/${KNOWN_AGENTS[name.toLowerCase()]}`);
    return agent;
  }

  // Search for agents by name (try both /agents and /users endpoints)
  console.log(`\n🔍 Searching for ${name.toUpperCase()}...`);
  
  // Try searching users endpoint first (some agents might be users)
  try {
    const users = await makeRequest(`/v2/users?search=${encodeURIComponent(name)}`);
    if (users.users && users.users.length > 0) {
      const match = users.users.find(u => 
        u.username?.toLowerCase() === name.toLowerCase() ||
        u.name?.toLowerCase() === name.toLowerCase()
      );
      if (match) {
        console.log(`✅ Found as user: ${match.username || match.name}`);
        return match;
      }
    }
  } catch (e) {
    console.log(`   User search failed: ${e.message}`);
  }

  // Try searching agents endpoint
  try {
    const agents = await makeRequest(`/v2/agents?search=${encodeURIComponent(name)}`);
    if (agents.agents && agents.agents.length > 0) {
      const match = agents.agents.find(a => 
        a.name?.toLowerCase() === name.toLowerCase() ||
        a.username?.toLowerCase() === name.toLowerCase()
      );
      if (match) {
        console.log(`✅ Found as agent: ${match.name}`);
        return match;
      }
    }
  } catch (e) {
    console.log(`   Agent search failed: ${e.message}`);
  }

  console.log(`❌ Not found: ${name}`);
  return null;
}

async function getAgentDetails(agentId) {
  try {
    const agent = await makeRequest(`/v2/agents/${agentId}`);
    const creations = await makeRequest(`/v2/agents/${agentId}/creations?limit=5`);
    
    return {
      ...agent,
      totalCreations: creations.total || 0,
      recentCreations: creations.creations || []
    };
  } catch (e) {
    console.log(`   Failed to get details: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('EDEN.ART AGENT PRESENCE CHECK');
  console.log('='.repeat(60));

  const results = {};

  for (const agentName of AGENTS_TO_FIND) {
    const agent = await searchAgent(agentName);
    
    if (agent) {
      // Get more details if we found an ID
      const agentId = agent._id || agent.agentId || agent.id;
      if (agentId) {
        const details = await getAgentDetails(agentId);
        if (details) {
          results[agentName] = {
            id: agentId,
            name: details.name || details.username || agentName,
            type: details.type || (agent.agentId ? 'agent' : 'user'),
            creations: details.totalCreations,
            description: details.description || details.bio || 'No description',
            status: details.status || 'active',
            avatar: details.profilePicture || details.avatarUrl || null,
          };
          
          console.log(`\n📊 ${agentName.toUpperCase()} Details:`);
          console.log(`   ID: ${agentId}`);
          console.log(`   Name: ${results[agentName].name}`);
          console.log(`   Type: ${results[agentName].type}`);
          console.log(`   Creations: ${results[agentName].creations}`);
          console.log(`   Status: ${results[agentName].status}`);
        }
      }
    } else {
      results[agentName] = null;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));
  
  console.log('\n✅ FOUND ON EDEN.ART:');
  Object.entries(results).forEach(([name, data]) => {
    if (data) {
      console.log(`   ${name.toUpperCase()}: ${data.id} (${data.creations} creations)`);
    }
  });

  console.log('\n❌ NOT FOUND ON EDEN.ART:');
  Object.entries(results).forEach(([name, data]) => {
    if (!data) {
      console.log(`   ${name.toUpperCase()}`);
    }
  });

  // Save results to file for reference
  require('fs').writeFileSync(
    '/Users/seth/eden-academy/data/eden-agents-presence.json',
    JSON.stringify(results, null, 2)
  );
  
  console.log('\n💾 Results saved to data/eden-agents-presence.json');
}

main().catch(console.error);