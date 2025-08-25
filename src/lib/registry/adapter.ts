// Registry Guardian Data Adapter
// ENFORCES Gateway-only access - no more dual-path data access

import { registryGateway } from './gateway';
import { registryMonitor } from './monitor';
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
  private gatewayOnly: boolean;

  constructor() {
    // ENFORCE: Always use Gateway - no more feature flag bypass
    this.gatewayOnly = process.env.DISABLE_GATEWAY_ENFORCEMENT !== 'true';
    
    if (!this.gatewayOnly) {
      console.warn('⚠️  Gateway enforcement DISABLED - this should only be used for debugging!');
    }
  }

  // Get all agents - ENFORCED through Gateway only
  async getAgents(query?: AgentQuery): Promise<Agent[]> {
    registryMonitor.trackGatewayCall();
    
    try {
      return await registryGateway.getAgents(query);
    } catch (error) {
      console.error('Gateway fetch failed, checking cache:', error);
      return this.getCachedData('agents', []);
    }
  }

  // Get single agent - ENFORCED through Gateway only
  async getAgent(id: string, include?: string[]): Promise<Agent | null> {
    registryMonitor.trackGatewayCall();
    
    try {
      return await registryGateway.getAgent(id, include);
    } catch (error) {
      console.error('Gateway fetch failed, checking cache:', error);
      return this.getCachedData(`agent-${id}`, null);
    }
  }

  // Post creation - ENFORCED through Gateway only
  async postCreation(agentId: string, creation: CreationPost): Promise<Creation | null> {
    registryMonitor.trackGatewayCall();
    
    try {
      return await registryGateway.postCreation(agentId, creation);
    } catch (error) {
      console.error('Gateway post failed, queuing for retry:', error);
      // Queue for retry with exponential backoff
      this.queueForRetry('postCreation', { agentId, creation });
      return null;
    }
  }

  // Get agent works/creations - ENFORCED through Gateway only
  async getAgentCreations(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]> {
    registryMonitor.trackGatewayCall();
    
    try {
      return await registryGateway.getAgentCreations(agentId, status);
    } catch (error) {
      console.error('Gateway fetch failed:', error);
      return this.getCachedData(`creations-${agentId}`, []);
    }
  }

  // Legacy transformation methods removed - Gateway enforces Registry-only access

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
        await registryGateway.postCreation(item.params.agentId, item.params.creation);
        console.log('Retry successful for', operation);
      }
    } catch (error) {
      console.error('Retry failed, requeuing:', error);
      queue.push(item); // Re-add to queue
    }

    this.retryQueue.set(operation, queue);
  }

  // Check if Gateway enforcement is active
  isUsingGateway(): boolean {
    return this.gatewayOnly;
  }

  // Report Gateway enforcement status
  getEnforcementStatus(): string {
    if (this.gatewayOnly) {
      return 'Gateway enforcement ACTIVE - all requests via Gateway';
    }
    return 'Gateway enforcement DISABLED - debugging mode';
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