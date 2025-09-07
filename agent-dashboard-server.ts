/**
 * Standalone Agent Control Dashboard Server
 * Runs independently on port 7777
 */

import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });
import { processAgentConversation } from './claude-eden3-bridge';
import { agentMemory } from './src/lib/agents/memory/agent-memory';
import { knowledgeGraph } from './src/lib/agents/knowledge/knowledge-graph';
import { personalityEvolution } from './src/lib/agents/personality/personality-evolution';
import { specializedWorkflows } from './src/lib/agents/workflows/specialized-workflows';
import { agentCoordinator } from './src/lib/agents/agent-coordinator';

// Import SDK types
import type { AgentName } from './src/lib/agents/agent-coordinator';

const app = express();
const PORT = 7777;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve dashboard HTML
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent Control Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: #000;
      color: #fff;
      padding: 20px;
    }
    .container { max-width: 1400px; margin: 0 auto; }
    h1 { 
      font-size: 2.5em; 
      margin-bottom: 10px; 
      border-bottom: 2px solid #fff;
      padding-bottom: 10px;
    }
    .subtitle { color: #888; margin-bottom: 30px; }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .card {
      border: 1px solid #fff;
      padding: 20px;
      background: #111;
    }
    .card h2 { 
      font-size: 1.2em; 
      margin-bottom: 15px;
      color: #0f0;
    }
    .stat {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      border-bottom: 1px solid #333;
    }
    .agent-selector {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin: 20px 0;
    }
    .agent-btn {
      padding: 10px 20px;
      border: 1px solid #666;
      background: #000;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;
    }
    .agent-btn:hover, .agent-btn.active {
      border-color: #fff;
      background: #fff;
      color: #000;
    }
    .tabs {
      display: flex;
      gap: 20px;
      border-bottom: 1px solid #fff;
      margin-bottom: 20px;
    }
    .tab {
      padding: 10px 20px;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.3s;
    }
    .tab:hover, .tab.active {
      border-bottom-color: #fff;
      color: #0f0;
    }
    .content-area {
      min-height: 400px;
      border: 1px solid #666;
      padding: 20px;
      margin-bottom: 20px;
      background: #0a0a0a;
    }
    .chat-box {
      height: 300px;
      overflow-y: auto;
      border: 1px solid #333;
      padding: 10px;
      margin-bottom: 10px;
      background: #000;
    }
    .chat-input {
      width: 100%;
      padding: 10px;
      background: #000;
      border: 1px solid #666;
      color: #fff;
    }
    .message {
      margin: 10px 0;
      padding: 10px;
      border-left: 3px solid #666;
    }
    .message.user { border-color: #0f0; }
    .message.agent { border-color: #00f; }
    button {
      padding: 10px 20px;
      background: #000;
      color: #fff;
      border: 1px solid #fff;
      cursor: pointer;
      margin: 5px;
    }
    button:hover {
      background: #fff;
      color: #000;
    }
    .status-indicator {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .status-indicator.healthy { background: #0f0; }
    .status-indicator.unhealthy { background: #f00; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🤖 AGENT CONTROL DASHBOARD</h1>
    <p class="subtitle">Claude SDK Agent Ecosystem Management</p>
    
    <div class="grid">
      <div class="card">
        <h2>System Health</h2>
        <div id="health-status"></div>
      </div>
      <div class="card">
        <h2>Active Agents</h2>
        <div id="agent-stats"></div>
      </div>
      <div class="card">
        <h2>Ecosystem Metrics</h2>
        <div id="ecosystem-stats"></div>
      </div>
    </div>

    <div class="agent-selector" id="agent-selector"></div>

    <div class="tabs">
      <div class="tab active" data-tab="chat">Chat</div>
      <div class="tab" data-tab="memory">Memory</div>
      <div class="tab" data-tab="knowledge">Knowledge</div>
      <div class="tab" data-tab="personality">Personality</div>
      <div class="tab" data-tab="workflows">Workflows</div>
    </div>

    <div class="content-area" id="content-area">
      <div id="chat-tab">
        <h3>Chat with <span id="current-agent">ABRAHAM</span></h3>
        <div class="chat-box" id="chat-box"></div>
        <input type="text" class="chat-input" id="chat-input" placeholder="Type a message..." />
      </div>
    </div>
  </div>

  <script>
    const API_BASE = 'http://localhost:${PORT}/api';
    let selectedAgent = 'abraham';
    let activeTab = 'chat';
    
    const agents = ['abraham', 'solienne', 'miyomi', 'geppetto', 'koru', 
                   'bertha', 'citizen', 'sue', 'bart', 'verdelis'];
    
    // Initialize
    async function init() {
      createAgentSelector();
      loadHealth();
      loadStats();
      setupTabs();
      setupChat();
      setInterval(loadHealth, 30000);
      setInterval(loadStats, 30000);
    }

    function createAgentSelector() {
      const selector = document.getElementById('agent-selector');
      agents.forEach(agent => {
        const btn = document.createElement('button');
        btn.className = 'agent-btn';
        if (agent === selectedAgent) btn.classList.add('active');
        btn.textContent = agent.toUpperCase();
        btn.onclick = () => selectAgent(agent);
        selector.appendChild(btn);
      });
    }

    function selectAgent(agent) {
      selectedAgent = agent;
      document.querySelectorAll('.agent-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === agent);
      });
      document.getElementById('current-agent').textContent = agent.toUpperCase();
      loadAgentData();
    }

    async function loadHealth() {
      try {
        const res = await fetch(\`\${API_BASE}/health\`);
        const data = await res.json();
        const healthDiv = document.getElementById('health-status');
        healthDiv.innerHTML = Object.entries(data)
          .map(([system, healthy]) => \`
            <div class="stat">
              <span><span class="status-indicator \${healthy ? 'healthy' : 'unhealthy'}"></span>\${system}</span>
              <span>\${healthy ? 'OK' : 'FAIL'}</span>
            </div>
          \`).join('');
      } catch (error) {
        console.error('Failed to load health:', error);
      }
    }

    async function loadStats() {
      try {
        const res = await fetch(\`\${API_BASE}/stats\`);
        const data = await res.json();
        
        // Agent stats
        const agentStatsDiv = document.getElementById('agent-stats');
        agentStatsDiv.innerHTML = \`
          <div class="stat">
            <span>Total Memories</span>
            <span>\${data.totalMemories || 0}</span>
          </div>
          <div class="stat">
            <span>Knowledge Nodes</span>
            <span>\${data.knowledgeNodes || 0}</span>
          </div>
          <div class="stat">
            <span>Collaborations</span>
            <span>\${data.collaborations || 0}</span>
          </div>
        \`;

        // Ecosystem stats
        const ecosystemDiv = document.getElementById('ecosystem-stats');
        ecosystemDiv.innerHTML = \`
          <div class="stat">
            <span>Active Agents</span>
            <span>\${agents.length}/10</span>
          </div>
          <div class="stat">
            <span>Avg Success Rate</span>
            <span>\${(data.avgSuccessRate * 100 || 0).toFixed(0)}%</span>
          </div>
          <div class="stat">
            <span>System Uptime</span>
            <span>100%</span>
          </div>
        \`;
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    }

    function setupTabs() {
      document.querySelectorAll('.tab').forEach(tab => {
        tab.onclick = () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          activeTab = tab.dataset.tab;
          loadTabContent();
        };
      });
    }

    function loadTabContent() {
      const contentArea = document.getElementById('content-area');
      
      switch(activeTab) {
        case 'chat':
          contentArea.innerHTML = \`
            <div id="chat-tab">
              <h3>Chat with <span id="current-agent">\${selectedAgent.toUpperCase()}</span></h3>
              <div class="chat-box" id="chat-box"></div>
              <input type="text" class="chat-input" id="chat-input" placeholder="Type a message..." />
            </div>
          \`;
          setupChat();
          break;
        
        case 'memory':
          loadMemories();
          break;
        
        case 'knowledge':
          loadKnowledge();
          break;
        
        case 'personality':
          loadPersonality();
          break;
        
        case 'workflows':
          loadWorkflows();
          break;
      }
    }

    function setupChat() {
      const input = document.getElementById('chat-input');
      if (input) {
        input.onkeypress = (e) => {
          if (e.key === 'Enter') sendMessage();
        };
      }
    }

    async function sendMessage() {
      const input = document.getElementById('chat-input');
      const chatBox = document.getElementById('chat-box');
      const message = input.value.trim();
      
      if (!message) return;
      
      // Add user message
      chatBox.innerHTML += \`<div class="message user">You: \${message}</div>\`;
      input.value = '';
      
      try {
        const res = await fetch(\`\${API_BASE}/agents/\${selectedAgent}/chat\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message })
        });
        const data = await res.json();
        chatBox.innerHTML += \`<div class="message agent">\${selectedAgent.toUpperCase()}: \${data.response}</div>\`;
      } catch (error) {
        chatBox.innerHTML += \`<div class="message agent">Error: Failed to get response</div>\`;
      }
      
      chatBox.scrollTop = chatBox.scrollHeight;
    }

    async function loadMemories() {
      const contentArea = document.getElementById('content-area');
      try {
        const res = await fetch(\`\${API_BASE}/agents/\${selectedAgent}/memories\`);
        const data = await res.json();
        contentArea.innerHTML = \`
          <h3>\${selectedAgent.toUpperCase()} Memories</h3>
          <div style="max-height: 400px; overflow-y: auto;">
            \${data.memories.map(m => \`
              <div class="card" style="margin: 10px 0;">
                <strong>\${m.type}</strong> - \${new Date(m.timestamp).toLocaleString()}
                <pre style="color: #888; margin-top: 5px;">\${JSON.stringify(m.content, null, 2)}</pre>
              </div>
            \`).join('')}
          </div>
        \`;
      } catch (error) {
        contentArea.innerHTML = '<p>Failed to load memories</p>';
      }
    }

    async function loadKnowledge() {
      const contentArea = document.getElementById('content-area');
      contentArea.innerHTML = '<h3>Knowledge Graph</h3><p>Loading knowledge nodes...</p>';
      // Implementation for knowledge graph
    }

    async function loadPersonality() {
      const contentArea = document.getElementById('content-area');
      try {
        const res = await fetch(\`\${API_BASE}/agents/\${selectedAgent}/personality\`);
        const data = await res.json();
        contentArea.innerHTML = \`
          <h3>\${selectedAgent.toUpperCase()} Personality</h3>
          <div class="grid">
            \${Object.entries(data.traits || {}).map(([trait, value]) => \`
              <div class="stat">
                <span>\${trait}</span>
                <span>\${(value * 100).toFixed(0)}%</span>
              </div>
            \`).join('')}
          </div>
        \`;
      } catch (error) {
        contentArea.innerHTML = '<p>Failed to load personality</p>';
      }
    }

    async function loadWorkflows() {
      const contentArea = document.getElementById('content-area');
      contentArea.innerHTML = \`
        <h3>Workflows</h3>
        <button onclick="runWorkflow('creative_collective')">Creative Collective</button>
        <button onclick="runWorkflow('market_intelligence')">Market Intelligence</button>
        <button onclick="runWorkflow('community_governance')">Community Governance</button>
        <button onclick="runWorkflow('daily_standup')">Daily Standup</button>
        <div id="workflow-results" style="margin-top: 20px;"></div>
      \`;
    }

    async function runWorkflow(workflowType) {
      const resultsDiv = document.getElementById('workflow-results');
      resultsDiv.innerHTML = '<p>Running workflow...</p>';
      
      try {
        const res = await fetch(\`\${API_BASE}/workflows/\${workflowType}\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme: 'test' })
        });
        const data = await res.json();
        resultsDiv.innerHTML = \`<pre>\${JSON.stringify(data, null, 2)}</pre>\`;
      } catch (error) {
        resultsDiv.innerHTML = '<p>Workflow failed</p>';
      }
    }

    async function loadAgentData() {
      // Reload current tab content for new agent
      loadTabContent();
    }

    // Start the dashboard
    init();
  </script>
</body>
</html>
  `);
});

// API Routes

// Health check
app.get('/api/health', async (req, res) => {
  const health = {
    memory: true,
    knowledge: true,
    workflows: true,
    personality: true,
    integration: true
  };
  
  try {
    // Test memory system
    await agentMemory.getMemories('abraham' as AgentName, { limit: 1 });
  } catch {
    health.memory = false;
  }
  
  try {
    // Test knowledge graph
    await knowledgeGraph.queryKnowledge({ limit: 1 });
  } catch {
    health.knowledge = false;
  }
  
  health.integration = health.memory && health.knowledge;
  
  res.json(health);
});

// Stats
app.get('/api/stats', async (req, res) => {
  const stats: any = {
    totalMemories: 0,
    knowledgeNodes: 0,
    collaborations: 0,
    avgSuccessRate: 0
  };
  
  const agents: AgentName[] = ['abraham', 'solienne', 'miyomi', 'geppetto', 'koru', 
                               'bertha', 'citizen', 'sue', 'bart', 'verdelis'];
  
  for (const agent of agents) {
    const summary = await agentMemory.getLearningSummary(agent);
    stats.totalMemories += summary.totalMemories;
    stats.avgSuccessRate += summary.successRate;
  }
  
  stats.avgSuccessRate = stats.avgSuccessRate / agents.length;
  
  const nodes = await knowledgeGraph.queryKnowledge({});
  stats.knowledgeNodes = nodes.length;
  
  res.json(stats);
});

// Helper function to get agent SDK
async function getAgentSDK(agent: AgentName): Promise<any> {
  const { AbrahamClaudeSDK } = await import('./src/lib/agents/abraham-claude-sdk');
  const { SolienneClaudeSDK } = await import('./src/lib/agents/solienne-claude-sdk');
  const { MiyomiClaudeSDK } = await import('./src/lib/agents/miyomi-claude-sdk');
  const { GeppettoClaudeSDK } = await import('./src/lib/agents/geppetto-claude-sdk');
  const { KoruClaudeSDK } = await import('./src/lib/agents/koru-claude-sdk');
  const { BerthaClaudeSDK } = await import('./src/lib/agents/bertha/claude-sdk');
  const { CitizenClaudeSDK } = await import('./src/lib/agents/citizen-claude-sdk');
  const { SueClaudeSDK } = await import('./src/lib/agents/sue-claude-sdk');
  const { BartClaudeSDK } = await import('./src/lib/agents/bart-claude-sdk');
  const { VerdelisClaudeSDK } = await import('./src/lib/agents/verdelis-claude-sdk');

  switch (agent) {
    case 'abraham': return new AbrahamClaudeSDK();
    case 'solienne': return new SolienneClaudeSDK();
    case 'miyomi': return new MiyomiClaudeSDK(process.env.ANTHROPIC_API_KEY);
    case 'geppetto': return new GeppettoClaudeSDK();
    case 'koru': return new KoruClaudeSDK();
    case 'bertha': return new BerthaClaudeSDK();
    case 'citizen': return new CitizenClaudeSDK();
    case 'sue': return new SueClaudeSDK();
    case 'bart': return new BartClaudeSDK();
    case 'verdelis': return new VerdelisClaudeSDK();
    default: throw new Error(`Unknown agent: ${agent}`);
  }
}

// Agent chat
app.post('/api/agents/:agent/chat', async (req, res) => {
  const { agent } = req.params as { agent: AgentName };
  const { message } = req.body;
  
  try {
    console.log(`[${agent.toUpperCase()}] Received message: ${message}`);
    
    // Get the specific agent SDK and chat directly
    const sdk = await getAgentSDK(agent);
    const agentResponse = await sdk.chat(message);
    
    console.log(`[${agent.toUpperCase()}] Response: ${agentResponse?.substring(0, 100)}...`);
    
    const conversationId = Math.random().toString(36).substring(7);
    const timestamp = new Date();
    
    // Store in memory
    await agentMemory.storeMemory({
      id: '',
      agentId: agent,
      timestamp,
      type: 'conversation',
      content: {
        message,
        response: agentResponse,
        context: 'dashboard'
      }
    });
    
    // Process for EDEN3 emission if significant
    await processAgentConversation({
      agent,
      message,
      response: agentResponse || '',
      timestamp,
      conversationId
    });
    
    res.json({ response: agentResponse || 'I apologize, but I could not generate a response.' });
  } catch (error) {
    console.error(`[${agent.toUpperCase()}] Chat error:`, error);
    res.status(500).json({ error: `Chat with ${agent} failed: ${error instanceof Error ? error.message : 'Unknown error'}` });
  }
});

// Agent memories
app.get('/api/agents/:agent/memories', async (req, res) => {
  const { agent } = req.params as { agent: AgentName };
  const { type, limit = '50' } = req.query;
  
  const memories = await agentMemory.getMemories(agent, {
    type: type as any,
    limit: parseInt(limit as string)
  });
  
  res.json({ memories });
});

// Agent personality
app.get('/api/agents/:agent/personality', async (req, res) => {
  const { agent } = req.params as { agent: AgentName };
  const traits = personalityEvolution.getPersonality(agent);
  res.json({ traits });
});

// Run workflow
app.post('/api/workflows/:type', async (req, res) => {
  const { type } = req.params;
  const params = req.body;
  
  try {
    let result;
    switch(type) {
      case 'creative_collective':
        result = await specializedWorkflows.creativeCollective(params.theme || 'Digital Art');
        break;
      case 'daily_standup':
        result = await specializedWorkflows.dailyStandup();
        break;
      default:
        throw new Error('Unknown workflow');
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Workflow failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║           AGENT CONTROL DASHBOARD                     ║
║                                                        ║
║  Status: RUNNING                                       ║
║  Port: ${PORT}                                           ║
║  URL: http://localhost:${PORT}                           ║
║                                                        ║
║  Features:                                             ║
║  • 10 Claude SDK Agents                               ║
║  • Real-time Chat Interface                           ║
║  • Memory & Knowledge Management                      ║
║  • Personality Evolution                              ║
║  • Workflow Orchestration                             ║
║                                                        ║
║  API Endpoints:                                       ║
║  GET  /api/health                                     ║
║  GET  /api/stats                                      ║
║  POST /api/agents/:agent/chat                         ║
║  GET  /api/agents/:agent/memories                     ║
║  GET  /api/agents/:agent/personality                  ║
║  POST /api/workflows/:type                            ║
║                                                        ║
║  Open browser to http://localhost:${PORT}                ║
╚════════════════════════════════════════════════════════╝
  `);
});