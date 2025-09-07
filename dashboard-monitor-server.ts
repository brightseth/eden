/**
 * Dashboard Monitor Server
 * WebSocket server for real-time bridge monitoring
 */

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import path from 'path';
import { bridgeMonitor } from './claude-eden3-bridge';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store for recent events (in-memory for simplicity)
const recentConversations: any[] = [];
const recentEvents: any[] = [];
const stats = {
  totalConversations: 0,
  eventsEmitted: 0,
  eventsFiltered: 0,
  agentStats: {} as Record<string, { conversations: number; events: number }>
};

// Initialize agent stats
const agents = ['abraham', 'solienne', 'miyomi', 'bertha', 'sue', 'citizen', 'koru', 'geppetto', 'bart', 'verdelis'];
agents.forEach(agent => {
  stats.agentStats[agent] = { conversations: 0, events: 0 };
});

// Serve the dashboard HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard-monitor.html'));
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('Dashboard client connected');
  
  // Send initial stats
  ws.send(JSON.stringify({
    type: 'stats',
    ...stats
  }));
  
  // Send recent conversations
  recentConversations.slice(-10).forEach(conv => {
    ws.send(JSON.stringify(conv));
  });
  
  // Send recent events
  recentEvents.slice(-10).forEach(event => {
    ws.send(JSON.stringify(event));
  });
  
  ws.on('close', () => {
    console.log('Dashboard client disconnected');
  });
});

// Broadcast to all connected clients
function broadcast(data: any) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Listen for bridge events
bridgeMonitor.on('conversation', (data: any) => {
  const conversationData = {
    type: 'conversation',
    agent: data.agent,
    timestamp: data.timestamp,
    message: data.message,
    response: data.response,
    conversationId: data.conversationId
  };
  
  recentConversations.push(conversationData);
  if (recentConversations.length > 100) {
    recentConversations.shift();
  }
  
  stats.totalConversations++;
  const agent = data.agent.toLowerCase();
  if (stats.agentStats[agent]) {
    stats.agentStats[agent].conversations++;
  }
  
  broadcast(conversationData);
});

bridgeMonitor.on('event-emitted', (data: any) => {
  const eventData = {
    type: 'event',
    status: 'emitted',
    agent: data.agent,
    timestamp: data.timestamp,
    eventType: data.eventType,
    score: data.score || 0,
    description: data.description
  };
  
  recentEvents.push(eventData);
  if (recentEvents.length > 100) {
    recentEvents.shift();
  }
  
  stats.eventsEmitted++;
  const agent = data.agent.toLowerCase();
  if (stats.agentStats[agent]) {
    stats.agentStats[agent].events++;
  }
  
  broadcast(eventData);
});

bridgeMonitor.on('event-filtered', (data: any) => {
  const eventData = {
    type: 'event',
    status: 'filtered',
    agent: data.agent,
    timestamp: data.timestamp,
    reason: data.reason
  };
  
  recentEvents.push(eventData);
  if (recentEvents.length > 100) {
    recentEvents.shift();
  }
  
  stats.eventsFiltered++;
  
  broadcast(eventData);
});

// Start server
const PORT = 7778;
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║           BRIDGE MONITOR DASHBOARD                    ║
║                                                        ║
║  Status: RUNNING                                       ║
║  Port: ${PORT}                                           ║
║  URL: http://localhost:${PORT}                           ║
║                                                        ║
║  Open browser to see real-time monitoring             ║
╚════════════════════════════════════════════════════════╝
  `);
});