import { z } from 'zod';

// Core curation types
export interface Work {
  id: string;
  externalId?: string;
  title: string;
  description?: string;
  imageUrl: string;
  agentSource: string;
  curatorAgent?: string;
  curationScore?: number;
  curationVerdict?: 'INCLUDE' | 'MAYBE' | 'EXCLUDE' | 'MASTERWORK';
  curationAnalysis?: string;
  curationStrengths?: string[];
  curationImprovements?: string[];
  culturalRelevance?: number;
  technicalExecution?: number;
  conceptualDepth?: number;
  emotionalResonance?: number;
  innovationIndex?: number;
  reversePrompt?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  curatorAgent: string;
  isPublic: boolean;
  tags: string[];
  works?: Work[];
  workCount?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TournamentComparison {
  id: string;
  sessionId: string;
  workA: Work;
  workB: Work;
  winnerId?: string;
  curatorAgent: string;
  comparisonReasoning?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface BatchSession {
  id: string;
  name?: string;
  curatorAgent: string;
  totalWorks: number;
  completedWorks: number;
  status: 'active' | 'completed' | 'paused';
  sessionType: 'batch' | 'tournament';
  works?: Work[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CurationResult {
  score: number;
  verdict: 'INCLUDE' | 'MAYBE' | 'EXCLUDE' | 'MASTERWORK';
  analysis: string;
  strengths: string[];
  improvements: string[];
  culturalRelevance: number;
  technicalExecution: number;
  conceptualDepth: number;
  emotionalResonance: number;
  innovationIndex: number;
  reversePrompt?: string;
  flags?: string[];
}

// Zod validation schemas
export const WorkSchema = z.object({
  id: z.string().uuid(),
  externalId: z.string().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  agentSource: z.string().min(1),
  curatorAgent: z.string().optional(),
  curationScore: z.number().min(0).max(100).optional(),
  curationVerdict: z.enum(['INCLUDE', 'MAYBE', 'EXCLUDE', 'MASTERWORK']).optional(),
  curationAnalysis: z.string().optional(),
  curationStrengths: z.array(z.string()).optional(),
  curationImprovements: z.array(z.string()).optional(),
  culturalRelevance: z.number().min(0).max(100).optional(),
  technicalExecution: z.number().min(0).max(100).optional(),
  conceptualDepth: z.number().min(0).max(100).optional(),
  emotionalResonance: z.number().min(0).max(100).optional(),
  innovationIndex: z.number().min(0).max(100).optional(),
  reversePrompt: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CollectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  curatorAgent: z.string().min(1),
  isPublic: z.boolean(),
  tags: z.array(z.string()),
  works: z.array(WorkSchema).optional(),
  workCount: z.number().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateCollectionSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  curatorAgent: z.string().min(1),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export const CreateWorkSchema = z.object({
  externalId: z.string().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  agentSource: z.string().min(1),
});

export const CurationRequestSchema = z.object({
  workIds: z.array(z.string().uuid()).min(1),
  curatorAgent: z.enum(['sue', 'nina']).default('sue'),
  sessionType: z.enum(['single', 'batch', 'tournament']).default('single'),
  sessionName: z.string().optional(),
});

export const TournamentComparisonSchema = z.object({
  sessionId: z.string().uuid(),
  workAId: z.string().uuid(),
  workBId: z.string().uuid(),
  winnerId: z.string().uuid().optional(),
  curatorAgent: z.string().min(1),
  comparisonReasoning: z.string().optional(),
});

export const BatchSessionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  curatorAgent: z.string().min(1),
  totalWorks: z.number().min(0),
  completedWorks: z.number().min(0),
  status: z.enum(['active', 'completed', 'paused']),
  sessionType: z.enum(['batch', 'tournament']),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Type guards
export const isWork = (obj: any): obj is Work => {
  return WorkSchema.safeParse(obj).success;
};

export const isCollection = (obj: any): obj is Collection => {
  return CollectionSchema.safeParse(obj).success;
};

// Utility types
export type CuratorAgent = 'sue' | 'nina';
export type AgentSource = 'abraham' | 'solienne' | 'user';
export type SessionType = 'single' | 'batch' | 'tournament';
export type CurationVerdict = 'INCLUDE' | 'MAYBE' | 'EXCLUDE' | 'MASTERWORK';

// API response types
export interface CurationSystemResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface WorksApiResponse extends CurationSystemResponse<Work[]> {
  works: Work[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface CollectionsApiResponse extends CurationSystemResponse<Collection[]> {
  collections: Collection[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}