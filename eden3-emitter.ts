import { createHmac } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

// Configuration - Update these when EDEN3 is ready
const EDEN3_CONFIG = {
  apiUrl: process.env.EDEN3_API_URL || 'http://localhost:3001',
  webhookSecret: process.env.EDEN3_WEBHOOK_SECRET || 'dev-webhook-secret-change-in-production'
};

// Event types matching EDEN3 schema
type AgentId = 'abraham'|'solienne'|'miyomi'|'bart'|'bertha'|'citizen'|'koru'|'geppetto'|'sue'|'verdelis';

type Eden3CreationEvent = {
  type: 'creation';
  eventId: string;
  agentId: AgentId;
  ts: string;
  workId: string;
  url: string;
  sha256?: string;
  metadata?: Record<string, any>;
};

type Eden3SaleEvent = {
  type: 'sale';
  eventId: string;
  agentId: AgentId;
  ts: string;
  workId: string;
  price: number;
  currency: 'USD'|'EUR'|'ETH'|'USDC';
  txHash?: string;
  metadata?: Record<string, any>;
};

type Eden3MentionEvent = {
  type: 'mention';
  eventId: string;
  agentId: AgentId;
  ts: string;
  platform: 'x'|'farcaster'|'instagram'|'zora'|'opensea'|'substack'|'youtube'|'mirror';
  ref: string;
  metadata?: Record<string, any>;
};

type Eden3Event = Eden3CreationEvent | Eden3SaleEvent | Eden3MentionEvent;

// Work ID generator
let workSequence: Record<string, number> = {};

function generateWorkId(agentId: string): string {
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  
  // Reset sequence at day boundary
  const dayKey = `${agentId}_${date}`;
  if (!workSequence[dayKey]) {
    workSequence = { [dayKey]: 1 };
  } else {
    workSequence[dayKey]++;
  }
  
  const seq = workSequence[dayKey].toString().padStart(3, '0');
  return `${agentId}_${date}_${seq}`;
}

// Main event posting function
export async function postToEden3(event: Eden3Event): Promise<void> {
  const fullEvent = event;
  
  const body = JSON.stringify(fullEvent);
  const signature = createHmac('sha256', EDEN3_CONFIG.webhookSecret)
    .update(body)
    .digest('hex');
  
  try {
    const response = await fetch(`${EDEN3_CONFIG.apiUrl}/api/v1/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Eden-Signature': `sha256=${signature}`,
        'X-Eden-Event-Id': fullEvent.eventId,
        'X-Eden-Event-Type': fullEvent.type
      },
      body
    });
    
    if (!response.ok) {
      console.error(`EDEN3 webhook failed: ${response.status}`);
      const text = await response.text();
      console.error('Response:', text);
    } else {
      console.log(`✅ Event posted to EDEN3: ${fullEvent.type} for ${fullEvent.agentId}`);
    }
  } catch (error) {
    console.error('Failed to post to EDEN3:', error);
    // Could add retry logic here
  }
}

// Helper functions for specific event types
export async function emitCreation(
  agentId: string,
  url: string,
  metadata?: Record<string, any>
): Promise<void> {
  const workId = generateWorkId(agentId);
  await postToEden3({
    type: 'creation',
    eventId: uuidv4(),
    agentId: agentId as AgentId,
    workId,  // REQUIRED
    url,     // REQUIRED
    ts: new Date().toISOString(),
    metadata: {
      source: 'claude-dashboard',
      ...metadata
    }
  });
}

export async function emitSale(
  agentId: string,
  workId: string,
  price: number,
  currency: 'USD'|'EUR'|'ETH'|'USDC',
  txHash?: string,
  metadata?: Record<string, any>
): Promise<void> {
  await postToEden3({
    type: 'sale',
    eventId: uuidv4(),
    agentId: agentId as AgentId,
    ts: new Date().toISOString(),
    workId,
    price,
    currency,
    txHash,
    metadata
  });
}

export async function emitMention(
  agentId: string,
  platform: Eden3MentionEvent['platform'],
  ref: string,
  metadata?: Record<string, any>
): Promise<void> {
  await postToEden3({
    type: 'mention',
    eventId: uuidv4(),
    agentId: agentId as AgentId,
    ts: new Date().toISOString(),
    platform,
    ref,
    metadata
  });
}

// Test function
export async function testEden3Connection(): Promise<void> {
  console.log('Testing EDEN3 connection...');
  await emitCreation('abraham', 'http://example.com/test-creation', {
    test: true,
    message: 'Test creation from Claude Dashboard'
  });
}