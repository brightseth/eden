/**
 * Eden Registry SDK
 * Official SDK for accessing Eden Genesis Registry - the single source of truth for all agent data
 * 
 * ENFORCES:
 * - No static data fallbacks
 * - All agent data from Registry
 * - Contract validation on responses
 * - Proper error handling
 */

import fetch from 'cross-fetch';

// Registry API Configuration
const DEFAULT_BASE_URL = 'https://eden-genesis-registry.vercel.app/api/v1';
const DEFAULT_TIMEOUT = 10000; // 10 seconds

// Type definitions matching Registry schema
export interface Agent {
  id: string;
  handle: string;
  displayName: string;
  role: 'creator' | 'curator' | 'collector' | 'governance' | 'predictor';
  status: 'INVITED' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED';
  visibility: 'PUBLIC' | 'PRIVATE';
  cohort: string;
  profile: AgentProfile;
  counts: AgentCounts;
  createdAt: string;
  updatedAt: string;
}

export interface AgentProfile {
  statement: string;
  tags: string[];
  links: {
    specialty: {
      medium: string;
      description: string;
      dailyGoal: string;
    };
  };
}

export interface AgentCounts {
  creations: number;
  personas: number;
  artifacts: number;
}

export interface Creation {
  id: string;
  agentId: string;
  type: 'artwork' | 'text' | 'prediction' | 'curation' | 'governance';
  title: string;
  description: string;
  metadata: Record<string, any>;
  status: 'draft' | 'published' | 'curated';
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// SDK Configuration
export interface SDKConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
  onError?: (error: Error) => void;
}

// Main Registry Client
export class RegistryClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;
  private onError?: (error: Error) => void;

  constructor(config: SDKConfig = {}) {
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': '@eden/registry-sdk/1.0.0',
      ...config.headers
    };
    this.onError = config.onError;
  }

  // Core API request method with contract validation
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`Registry API error: ${response.status} ${response.statusText}`);
        if (this.onError) this.onError(error);
        throw error;
      }

      const data = await response.json();
      
      // Contract validation
      if (!this.validateResponse(data)) {
        throw new Error('Invalid Registry response format');
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError = new Error(`Registry request timeout after ${this.timeout}ms`);
          if (this.onError) this.onError(timeoutError);
          throw timeoutError;
        }
        if (this.onError) this.onError(error);
      }
      
      throw error;
    }
  }

  // Response validation
  private validateResponse(data: any): boolean {
    // Basic structure validation
    if (!data || typeof data !== 'object') return false;
    
    // Registry responses should have consistent structure
    if ('agents' in data) {
      return Array.isArray(data.agents);
    }
    if ('agent' in data) {
      return typeof data.agent === 'object';
    }
    if ('creations' in data) {
      return Array.isArray(data.creations);
    }
    if ('creation' in data) {
      return typeof data.creation === 'object';
    }
    
    // Allow other valid response shapes
    return true;
  }

  // Agent operations
  agents = {
    // List all agents
    list: async (params?: {
      cohort?: string;
      status?: string;
      role?: string;
      limit?: number;
      offset?: number;
    }): Promise<Agent[]> => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, String(value));
        });
      }

      const endpoint = `/agents${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await this.request<{ agents: Agent[] }>(endpoint);
      return response.agents;
    },

    // Get single agent
    get: async (id: string): Promise<Agent> => {
      const response = await this.request<{ agent: Agent }>(`/agents/${id}`);
      return response.agent;
    },

    // Get agent by handle
    getByHandle: async (handle: string): Promise<Agent> => {
      const response = await this.request<{ agent: Agent }>(`/agents/handle/${handle}`);
      return response.agent;
    },

    // Update agent (requires auth)
    update: async (id: string, updates: Partial<Agent>): Promise<Agent> => {
      const response = await this.request<{ agent: Agent }>(`/agents/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      return response.agent;
    }
  };

  // Creation operations
  creations = {
    // List agent creations
    list: async (agentId: string, params?: {
      status?: 'draft' | 'published' | 'curated';
      type?: string;
      limit?: number;
      offset?: number;
    }): Promise<Creation[]> => {
      const queryParams = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, String(value));
        });
      }

      const endpoint = `/agents/${agentId}/creations${queryParams.toString() ? `?${queryParams}` : ''}`;
      const response = await this.request<{ creations: Creation[] }>(endpoint);
      return response.creations;
    },

    // Get single creation
    get: async (agentId: string, creationId: string): Promise<Creation> => {
      const response = await this.request<{ creation: Creation }>(`/agents/${agentId}/creations/${creationId}`);
      return response.creation;
    },

    // Post new creation
    create: async (agentId: string, creation: Omit<Creation, 'id' | 'agentId' | 'createdAt' | 'updatedAt'>): Promise<Creation> => {
      const response = await this.request<{ creation: Creation }>(`/agents/${agentId}/creations`, {
        method: 'POST',
        body: JSON.stringify(creation)
      });
      return response.creation;
    },

    // Update creation
    update: async (agentId: string, creationId: string, updates: Partial<Creation>): Promise<Creation> => {
      const response = await this.request<{ creation: Creation }>(`/agents/${agentId}/creations/${creationId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      return response.creation;
    }
  };

  // Health check
  async health(): Promise<{ status: 'ok' | 'degraded' | 'down'; message: string; timestamp: string }> {
    try {
      const response = await this.request<any>('/health');
      return {
        status: 'ok',
        message: 'Registry is operational',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'down',
        message: error instanceof Error ? error.message : 'Registry unavailable',
        timestamp: new Date().toISOString()
      };
    }
  }

  // Batch operations for efficiency
  batch = {
    // Get multiple agents in one request
    getAgents: async (ids: string[]): Promise<Agent[]> => {
      const response = await this.request<{ agents: Agent[] }>('/agents/batch', {
        method: 'POST',
        body: JSON.stringify({ ids })
      });
      return response.agents;
    },

    // Get creations for multiple agents
    getCreations: async (agentIds: string[]): Promise<Record<string, Creation[]>> => {
      const response = await this.request<{ creations: Record<string, Creation[]> }>('/creations/batch', {
        method: 'POST',
        body: JSON.stringify({ agentIds })
      });
      return response.creations;
    }
  };
}

// Default client instance
export const registryClient = new RegistryClient();

// Helper functions for common operations
export const getAgent = (id: string) => registryClient.agents.get(id);
export const getAgentByHandle = (handle: string) => registryClient.agents.getByHandle(handle);
export const listAgents = (params?: Parameters<typeof registryClient.agents.list>[0]) => registryClient.agents.list(params);
export const getAgentCreations = (agentId: string, params?: Parameters<typeof registryClient.creations.list>[1]) => 
  registryClient.creations.list(agentId, params);

// Types are already exported above

// Version info
export const SDK_VERSION = '1.0.0';
export const REGISTRY_VERSION = '1.0.0';