// Standardized Event Schema for Eden Academy

export type EventType = 
  | 'mint.created' 
  | 'curation.verdict' 
  | 'prompt.patch.applied' 
  | 'training.iteration' 
  | 'sale.executed' 
  | 'follow.added' 
  | 'memory.ingested';

export interface AgentEvent {
  event_id: string;
  ts: string; // ISO timestamp
  agent_id: string;
  type: EventType;
  payload: EventPayload;
  meta?: {
    model?: string;
    latency_ms?: number;
  };
}

export interface EventPayload {
  mint?: {
    token_id: string;
    reserve: string;
    image_url: string;
  };
  curation?: {
    image_id: string;
    verdict: 'INCLUDE' | 'MAYBE' | 'EXCLUDE';
    weighted: number;
    patch?: string;
  };
  training?: {
    iteration: number;
    loss: number;
  };
  sale?: {
    amount_usd: number;
    buyer: string;
  };
  memory?: {
    triple: [string, string, string];
    confidence: number;
  };
}

export interface AgentMetrics {
  agent_id: string;
  revenue_usd: number;
  engagement_idx: number;
  streak_days: number;
  curation_pass_rate: number;
  score?: number;
}