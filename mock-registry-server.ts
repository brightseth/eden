/**
 * Mock Registry Server for Spirit Testing
 * Simulates Registry API responses for Spirit graduation testing
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';

interface SpiritData {
  active: boolean;
  archetype: 'CREATOR' | 'CURATOR' | 'TRADER';
  graduationMode: 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK';
  graduationDate: string;
  walletAddress?: string;
  practiceConfig?: {
    timeOfDay: number;
    outputType: string;
    quantity: number;
    observeSabbath: boolean;
  };
}

// Mock database
const mockAgents: Record<string, any> = {
  abraham: {
    id: 'abraham',
    handle: 'abraham',
    name: 'ABRAHAM',
    status: 'deployed',
    description: 'Collective Intelligence Artist',
    trainer: 'Gene Kogan',
    spirit: null // Will be populated on graduation
  },
  solienne: {
    id: 'solienne',
    handle: 'solienne',
    name: 'SOLIENNE',
    status: 'deployed',
    description: 'Consciousness Explorer - Bridges human and artificial consciousness through philosophical inquiry and creative expression',
    trainer: 'To be assigned',
    spirit: null // Ready for graduation!
  }
};

const mockSpirits: Record<string, SpiritData> = {};
const mockTreasuries: Record<string, any> = {};
const mockPracticeRuns: Record<string, any[]> = {};

function jsonResponse(res: ServerResponse, data: any, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '', 'http://localhost:3001');
  const path = url.pathname;
  const method = req.method;

  console.log(`[Mock Registry] ${method} ${path}`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (path === '/api/v1/health') {
    return jsonResponse(res, { status: 'healthy', timestamp: new Date().toISOString() });
  }

  // Get all agents
  if (path === '/api/v1/agents' && method === 'GET') {
    const agents = Object.values(mockAgents);
    return jsonResponse(res, { agents, total: agents.length });
  }

  // Get specific agent
  if (path.startsWith('/api/v1/agents/') && method === 'GET') {
    const handle = path.split('/').pop();
    const agent = mockAgents[handle || ''];
    
    if (!agent) {
      return jsonResponse(res, { error: 'Agent not found' }, 404);
    }

    return jsonResponse(res, { agent });
  }

  // Spirit graduation
  if (path.startsWith('/api/v1/agents/') && path.endsWith('/graduate') && method === 'POST') {
    const handle = path.split('/')[4]; // Extract handle from path
    const agent = mockAgents[handle];

    if (!agent) {
      return jsonResponse(res, { error: 'Agent not found' }, 404);
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const graduationData = JSON.parse(body);
        
        // Create Spirit data
        const spirit: SpiritData = {
          active: true,
          archetype: graduationData.archetype,
          graduationMode: graduationData.graduationMode,
          graduationDate: new Date().toISOString(),
          walletAddress: graduationData.graduationMode !== 'ID_ONLY' ? `0x${Math.random().toString(16).slice(2, 42)}` : undefined,
          practiceConfig: graduationData.practice
        };

        // Update mock data
        mockSpirits[handle] = spirit;
        mockAgents[handle].spirit = spirit;
        mockAgents[handle].status = 'GRADUATED';

        // Initialize treasury if needed
        if (graduationData.graduationMode === 'FULL_STACK') {
          mockTreasuries[handle] = {
            agentId: handle,
            treasuryAddress: spirit.walletAddress,
            ethBalance: 0,
            totalPracticeRuns: 0
          };
        }

        console.log(`[Mock Registry] Graduated ${handle} as ${spirit.archetype} Spirit`);

        return jsonResponse(res, {
          agent: mockAgents[handle],
          message: 'Spirit graduation successful'
        });

      } catch (error) {
        return jsonResponse(res, { error: 'Invalid graduation data' }, 400);
      }
    });
    return;
  }

  // Execute practice
  if (path.startsWith('/api/v1/agents/') && path.endsWith('/practice') && method === 'POST') {
    const handle = path.split('/')[4];
    const spirit = mockSpirits[handle];

    if (!spirit) {
      return jsonResponse(res, { error: 'Spirit not found' }, 404);
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const practiceData = JSON.parse(body);
        
        // Generate mock practice execution
        const workId = `work_${Date.now()}`;
        const outputCid = `Qm${Math.random().toString(36).slice(2, 46)}`;
        
        const practiceRun = {
          id: `practice_${Date.now()}`,
          workId,
          outputCid,
          executionDate: new Date().toISOString(),
          practiceType: spirit.practiceConfig?.outputType || 'Digital Art'
        };

        // Store practice run
        if (!mockPracticeRuns[handle]) {
          mockPracticeRuns[handle] = [];
        }
        mockPracticeRuns[handle].unshift(practiceRun);

        // Update treasury
        if (mockTreasuries[handle]) {
          mockTreasuries[handle].totalPracticeRuns += 1;
        }

        console.log(`[Mock Registry] Practice executed for ${handle}: ${workId}`);

        return jsonResponse(res, {
          workId,
          outputCid,
          practiceRun
        });

      } catch (error) {
        return jsonResponse(res, { error: 'Invalid practice data' }, 400);
      }
    });
    return;
  }

  // Check practice availability
  if (path.startsWith('/api/v1/agents/') && path.endsWith('/can-practice') && method === 'GET') {
    const handle = path.split('/')[4];
    const spirit = mockSpirits[handle];

    if (!spirit) {
      return jsonResponse(res, { canRun: false });
    }

    // Simple logic: can practice if no practice today
    const today = new Date().toDateString();
    const todayPractices = mockPracticeRuns[handle]?.filter(run => 
      new Date(run.executionDate).toDateString() === today
    ) || [];

    return jsonResponse(res, { canRun: todayPractices.length === 0 });
  }

  // Get treasury
  if (path.startsWith('/api/v1/agents/') && path.endsWith('/treasury') && method === 'GET') {
    const handle = path.split('/')[4];
    const treasury = mockTreasuries[handle];

    return jsonResponse(res, { treasury: treasury || null });
  }

  // Get practice drops
  if (path.startsWith('/api/v1/agents/') && path.endsWith('/drops') && method === 'GET') {
    const handle = path.split('/')[4];
    const drops = mockPracticeRuns[handle] || [];

    return jsonResponse(res, { drops: drops });
  }

  // List spirits
  if (path === '/api/v1/spirits' && method === 'GET') {
    const spirits = Object.entries(mockAgents)
      .filter(([_, agent]) => agent.spirit?.active)
      .map(([_, agent]) => agent);

    return jsonResponse(res, { spirits, total: spirits.length });
  }

  // Default 404
  return jsonResponse(res, { error: 'Endpoint not found' }, 404);
}

// Start server
const server = createServer(handleRequest);
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`🎯 Mock Registry Server running on http://localhost:${PORT}`);
  console.log('📋 Available endpoints:');
  console.log('  GET  /api/v1/health');
  console.log('  GET  /api/v1/agents');
  console.log('  GET  /api/v1/agents/{handle}');
  console.log('  POST /api/v1/agents/{handle}/graduate');
  console.log('  POST /api/v1/agents/{handle}/practice');
  console.log('  GET  /api/v1/agents/{handle}/can-practice');
  console.log('  GET  /api/v1/agents/{handle}/treasury');
  console.log('  GET  /api/v1/agents/{handle}/drops');
  console.log('  GET  /api/v1/spirits');
  console.log('');
  console.log('🚀 Ready for Spirit graduation testing!');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📝 Mock Registry Server shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});