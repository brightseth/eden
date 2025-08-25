// Shared types for Eden Genesis Registry
// These types are used by both Academy and Registry services

export type AgentStatus = 'INVITED' | 'APPLYING' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED' | 'ARCHIVED';
export type Visibility = 'PRIVATE' | 'INTERNAL' | 'PUBLIC';

export interface Agent {
  id: string;
  handle: string;
  displayName: string;
  cohort: string;
  status: AgentStatus;
  visibility: Visibility;
  createdAt?: string;
  updatedAt?: string;
  profile?: Profile;
  personas?: Persona[];
  artifacts?: Artifact[];
  progress?: Progress;
}

export interface Profile {
  id: string;
  agentId: string;
  statement?: string;
  capabilities?: string[];
  primaryMedium?: string;
  aestheticStyle?: string;
  culturalContext?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Persona {
  id: string;
  agentId: string;
  version: string;
  name: string;
  description?: string;
  traits?: string[];
  voice?: string;
  worldview?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Artifact {
  id: string;
  agentId: string;
  type: 'model' | 'lora' | 'embedding' | 'checkpoint' | 'config';
  name: string;
  description?: string;
  vaultPath?: string; // Reference to secrets vault, never store raw keys
  metadata?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Creation {
  id: string;
  agentId: string;
  mediaUri: string;
  metadata: Record<string, unknown>; // prompts, seeds, params
  status: 'draft' | 'curated' | 'published';
  publishedTo?: {
    chainTx?: string;
    farcasterCastId?: string;
    shopifySku?: string;
  };
  createdAt?: string;
  publishedAt?: string;
}

export interface Progress {
  agentId: string;
  profileComplete: boolean;
  personaComplete: boolean;
  artifactsComplete: boolean;
  firstCreationComplete: boolean;
  onboardingComplete: boolean;
  percentComplete: number;
  lastActivityAt?: string;
}

// API Response types
export interface RegistryResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

export interface RegistryError {
  error: string;
  message: string;
  statusCode: number;
}

// Webhook event types
export type WebhookEventType = 
  | 'agent.updated' 
  | 'persona.created' 
  | 'artifact.added' 
  | 'creation.published' 
  | 'progress.updated';

export interface WebhookEvent {
  type: WebhookEventType;
  agentId: string;
  data: Record<string, unknown>;
  timestamp: string;
}

// Request types
export interface CreationPost {
  mediaUri: string;
  metadata: Record<string, unknown>;
  publishedTo?: {
    chainTx?: string;
    farcasterCastId?: string;
    shopifySku?: string;
  };
}

export interface AgentQuery {
  cohort?: string;
  status?: AgentStatus;
  include?: ('profile' | 'personas' | 'artifacts' | 'progress')[];
}