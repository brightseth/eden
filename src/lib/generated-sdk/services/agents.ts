// Agent service client for Registry SDK
// Following ADR-019 Registry Integration Pattern

import { Agent, GetAgentsParams, GetAgentParams } from '../types/agents';
import { ApiResponse } from '../types/common';
import { BaseRegistryError, createRegistryError } from '../utils/errors';
import { withRetry, RetryConfig } from '../utils/retry';
import { MemoryCache, cached, generateCacheKey } from '../utils/cache';

export class AgentService {
  constructor(
    private request: <T>(path: string, options?: RequestInit, retries?: number) => Promise<T>,
    private cache?: MemoryCache,
    private retryConfig?: RetryConfig
  ) {}

  /**
   * Get all agents with optional filtering
   * Implements client-side filtering until Registry API query parameters are fixed
   */
  async getAgents(params?: GetAgentsParams): Promise<Agent[]> {
    const fetchAgents = async () => {
      const path = '/agents';
      
      // Registry API returns {agents: Agent[], pagination: {...}}
      // Extract just the agents array for SDK compatibility
      const response = await this.request<{agents: Agent[], pagination?: any, total?: number}>(path);
      let agents = response.agents || [];
      
      // Client-side filtering until Registry API query parameters are fixed
      if (params) {
        agents = agents.filter(agent => {
          if (params.cohort && agent.cohort !== params.cohort) return false;
          if (params.status && agent.status !== params.status) return false;
          if (params.visibility && agent.visibility !== params.visibility) return false;
          return true;
        });
      }
      
      return agents;
    };

    if (this.retryConfig) {
      const result = await withRetry(fetchAgents, this.retryConfig);
      return result.data;
    }

    return fetchAgents();
  }

  /**
   * Get a specific agent by ID or handle
   */
  async getAgent(id: string, params?: GetAgentParams): Promise<Agent> {
    const fetchAgent = async () => {
      const searchParams = new URLSearchParams();
      if (params?.include) {
        searchParams.append('include', params.include.join(','));
      }

      const query = searchParams.toString();
      const path = `/agents/${id}${query ? `?${query}` : ''}`;
      
      try {
        return await this.request<Agent>(path);
      } catch (error: any) {
        if (error.statusCode === 404) {
          throw createRegistryError(404, `Agent '${id}' not found`, error.response);
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(fetchAgent, this.retryConfig);
      return result.data;
    }

    return fetchAgent();
  }

  /**
   * Update agent profile information
   */
  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const updateAgent = async () => {
      const path = `/agents/${id}`;
      
      try {
        const result = await this.request<Agent>(path, {
          method: 'PATCH',
          body: JSON.stringify(updates)
        });

        // Invalidate related cache entries
        if (this.cache) {
          this.cache.invalidateByTag('agents');
          this.cache.invalidateByTag('agent');
        }

        return result;
      } catch (error: any) {
        if (error.statusCode === 404) {
          throw createRegistryError(404, `Agent '${id}' not found`, error.response);
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(updateAgent, this.retryConfig);
      return result.data;
    }

    return updateAgent();
  }

  /**
   * Get agents by status with enhanced filtering
   */
  async getAgentsByStatus(status: Agent['status'], params?: Omit<GetAgentsParams, 'status'>): Promise<Agent[]> {
    return this.getAgents({ ...params, status });
  }

  /**
   * Get agents by cohort
   */
  async getAgentsByCohort(cohort: string, params?: Omit<GetAgentsParams, 'cohort'>): Promise<Agent[]> {
    return this.getAgents({ ...params, cohort });
  }

  /**
   * Search agents by display name or handle
   */
  async searchAgents(query: string, params?: GetAgentsParams): Promise<Agent[]> {
    const agents = await this.getAgents(params);
    const searchTerm = query.toLowerCase();
    
    return agents.filter(agent => 
      agent.displayName.toLowerCase().includes(searchTerm) ||
      agent.handle.toLowerCase().includes(searchTerm) ||
      agent.profile?.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get agent creation statistics
   */
  async getAgentStats(id: string): Promise<{
    totalCreations: number;
    publishedCreations: number;
    draftCreations: number;
    personas: number;
  }> {
    const agent = await this.getAgent(id, { include: ['counts', 'creations', 'personas'] });
    
    const publishedCreations = agent.creations?.filter(c => c.status === 'PUBLISHED').length || 0;
    const draftCreations = agent.creations?.filter(c => c.status === 'DRAFT').length || 0;
    
    return {
      totalCreations: agent.counts?.creations || 0,
      publishedCreations,
      draftCreations,
      personas: agent.counts?.personas || 0
    };
  }

  /**
   * Check if agent exists
   */
  async exists(id: string): Promise<boolean> {
    try {
      await this.getAgent(id);
      return true;
    } catch (error) {
      if (error instanceof BaseRegistryError && error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  }
}