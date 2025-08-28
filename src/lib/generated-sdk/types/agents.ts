// Agent-related types extracted from Registry API
// Following ADR-019 Registry Integration Pattern

export interface Agent {
  id: string;
  handle: string;
  displayName: string;
  status: 'INVITED' | 'APPLYING' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED' | 'ARCHIVED';
  visibility: 'PRIVATE' | 'INTERNAL' | 'PUBLIC';
  cohort: string; // API returns cohort, not cohortId
  role?: string;
  createdAt: string;
  updatedAt: string;
  profile?: Profile;
  personas?: Persona[];
  creations?: Creation[];
  counts?: AgentCounts;
}

export interface Profile {
  statement?: string;
  manifesto?: string;
  tags?: string[];
  links?: Record<string, unknown>;
}

export interface Persona {
  id: string;
  name: string;
  version: string;
  prompt: string;
  alignmentNotes?: string;
  privacy: 'INTERNAL' | 'PUBLIC';
}

export interface AgentCounts {
  creations: number;
  personas: number;
  artifacts: number;
}

export interface GetAgentsParams {
  cohort?: string;
  status?: Agent['status'];
  visibility?: Agent['visibility'];
  include?: string[];
  page?: number;
  pageSize?: number;
}

export interface GetAgentParams {
  include?: string[];
}