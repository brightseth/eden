// Feature flag adapter for Registry vs Legacy database access
// This provides a unified interface that switches between Registry and legacy DB

import { registryClient } from './client';
import { createClient } from '@/utils/supabase/server';
import type { 
  Agent, 
  AgentQuery, 
  Creation, 
  CreationPost,
  Profile,
  Persona,
  Artifact,
  Progress
} from './types';

// Cache for storing fallback data when Registry is down
const fallbackCache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export class DataAdapter {
  private useRegistry: boolean;

  constructor() {
    this.useRegistry = process.env.USE_REGISTRY === 'true';
  }

  // Get all agents with feature flag support
  async getAgents(query?: AgentQuery): Promise<Agent[]> {
    if (this.useRegistry) {
      try {
        return await registryClient.getAgents(query);
      } catch (error) {
        console.error('Registry fetch failed, checking cache:', error);
        return this.getCachedData('agents', []);
      }
    }

    // Legacy database access
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('cohort', query?.cohort || 'genesis');

    if (error) {
      console.error('Legacy DB fetch failed:', error);
      return [];
    }

    // Transform legacy data to Registry format
    return this.transformLegacyAgents(data || []);
  }

  // Get single agent with feature flag support
  async getAgent(id: string, include?: string[]): Promise<Agent | null> {
    if (this.useRegistry) {
      try {
        return await registryClient.getAgent(id, include);
      } catch (error) {
        console.error('Registry fetch failed, checking cache:', error);
        return this.getCachedData(`agent-${id}`, null);
      }
    }

    // Legacy database access
    const supabase = await createClient();
    let query = supabase.from('agents').select('*').eq('id', id).single();

    const { data, error } = await query;
    
    if (error) {
      console.error('Legacy DB fetch failed:', error);
      return null;
    }

    return this.transformLegacyAgent(data);
  }

  // Post creation with feature flag support
  async postCreation(agentId: string, creation: CreationPost): Promise<Creation | null> {
    if (this.useRegistry) {
      try {
        return await registryClient.postCreation(agentId, creation);
      } catch (error) {
        console.error('Registry post failed, queuing for retry:', error);
        // Queue for retry with exponential backoff
        this.queueForRetry('postCreation', { agentId, creation });
        return null;
      }
    }

    // Legacy database access
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('agent_works')
      .insert({
        agent_id: agentId,
        image_url: creation.mediaUri,
        metadata: creation.metadata,
        status: 'published',
        published_to: creation.publishedTo,
      })
      .select()
      .single();

    if (error) {
      console.error('Legacy DB insert failed:', error);
      return null;
    }

    return this.transformLegacyCreation(data);
  }

  // Get agent works/creations
  async getAgentCreations(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]> {
    if (this.useRegistry) {
      try {
        return await registryClient.getAgentCreations(agentId, status);
      } catch (error) {
        console.error('Registry fetch failed:', error);
        return this.getCachedData(`creations-${agentId}`, []);
      }
    }

    // Legacy database access
    const supabase = await createClient();
    let query = supabase
      .from('agent_works')
      .select('*')
      .eq('agent_id', agentId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Legacy DB fetch failed:', error);
      return [];
    }

    return (data || []).map(this.transformLegacyCreation);
  }

  // Transform legacy agent data to Registry format
  private transformLegacyAgent(legacyAgent: any): Agent {
    return {
      id: legacyAgent.id,
      handle: legacyAgent.handle || legacyAgent.name?.toLowerCase().replace(/\s+/g, '-'),
      displayName: legacyAgent.name,
      cohort: legacyAgent.cohort || 'genesis',
      status: (legacyAgent.status || 'ACTIVE').toUpperCase() as Agent['status'],
      visibility: (legacyAgent.visibility || 'PUBLIC').toUpperCase() as Agent['visibility'],
      createdAt: legacyAgent.created_at,
      updatedAt: legacyAgent.updated_at,
    };
  }

  private transformLegacyAgents(legacyAgents: any[]): Agent[] {
    return legacyAgents.map(agent => this.transformLegacyAgent(agent));
  }

  private transformLegacyCreation(legacyWork: any): Creation {
    return {
      id: legacyWork.id,
      agentId: legacyWork.agent_id,
      mediaUri: legacyWork.image_url,
      metadata: legacyWork.metadata || {},
      status: legacyWork.status || 'published',
      publishedTo: legacyWork.published_to,
      createdAt: legacyWork.created_at,
      publishedAt: legacyWork.published_at,
    };
  }

  // Cache management
  private getCachedData<T>(key: string, defaultValue: T): T {
    const cached = fallbackCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`Using cached data for ${key}`);
      return cached.data;
    }
    return defaultValue;
  }

  private setCachedData(key: string, data: any): void {
    fallbackCache.set(key, { data, timestamp: Date.now() });
  }

  // Retry queue for failed operations
  private retryQueue: Map<string, any[]> = new Map();

  private queueForRetry(operation: string, params: any): void {
    const queue = this.retryQueue.get(operation) || [];
    queue.push({ params, timestamp: Date.now() });
    this.retryQueue.set(operation, queue);
    
    // Process retry queue after delay
    setTimeout(() => this.processRetryQueue(operation), 5000);
  }

  private async processRetryQueue(operation: string): Promise<void> {
    const queue = this.retryQueue.get(operation);
    if (!queue || queue.length === 0) return;

    const item = queue.shift();
    if (!item) return;

    try {
      if (operation === 'postCreation') {
        await registryClient.postCreation(item.params.agentId, item.params.creation);
        console.log('Retry successful for', operation);
      }
    } catch (error) {
      console.error('Retry failed, requeuing:', error);
      queue.push(item); // Re-add to queue
    }

    this.retryQueue.set(operation, queue);
  }

  // Check if using Registry
  isUsingRegistry(): boolean {
    return this.useRegistry;
  }

  // Log legacy path usage (for monitoring during migration)
  logLegacyUsage(path: string): void {
    if (this.useRegistry) {
      console.warn(`legacy_path_used: ${path} (USE_REGISTRY=true)`);
    }
  }
}

// Export singleton instance
export const dataAdapter = new DataAdapter();

// Helper functions for common operations
export async function getAgents(query?: AgentQuery): Promise<Agent[]> {
  return dataAdapter.getAgents(query);
}

export async function getAgent(id: string, include?: string[]): Promise<Agent | null> {
  return dataAdapter.getAgent(id, include);
}

export async function getAgentCreations(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]> {
  return dataAdapter.getAgentCreations(agentId, status);
}

export async function postCreation(agentId: string, creation: CreationPost): Promise<Creation | null> {
  return dataAdapter.postCreation(agentId, creation);
}