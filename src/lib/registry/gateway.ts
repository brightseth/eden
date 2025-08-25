// Lightweight Registry Gateway for internal prototyping
// Enforces UI → Gateway → Registry pattern and provides circuit breaker protection

import { createRegistryApiClient, RegistryApiClient } from '../generated-sdk';
import type { 
  Agent, 
  AgentQuery, 
  Creation, 
  CreationPost,
  Profile,
  Persona,
  Artifact,
  Progress,
  RegistryResponse
} from './types';

interface GatewayConfig {
  maxRetries: number;
  retryDelay: number;
  circuitBreakerThreshold: number;
  circuitBreakerTimeout: number;
  enableCache: boolean;
  cacheTimeout: number;
}

interface CircuitBreakerState {
  failureCount: number;
  lastFailureTime: number;
  isOpen: boolean;
  nextRetryTime: number;
}

class RegistryGateway {
  private config: GatewayConfig;
  private circuitBreaker: CircuitBreakerState;
  private cache: Map<string, { data: any; timestamp: number }>;
  private traceCounter: number = 0;

  constructor(config?: Partial<GatewayConfig>) {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      circuitBreakerThreshold: 5,
      circuitBreakerTimeout: 30000, // 30 seconds
      enableCache: true,
      cacheTimeout: 60000, // 1 minute
      ...config
    };

    this.circuitBreaker = {
      failureCount: 0,
      lastFailureTime: 0,
      isOpen: false,
      nextRetryTime: 0
    };

    this.cache = new Map();
  }

  // Generate trace ID for observability
  private generateTraceId(): string {
    this.traceCounter++;
    return `gw-${Date.now()}-${this.traceCounter}`;
  }

  // Check circuit breaker state
  private checkCircuitBreaker(): void {
    if (this.circuitBreaker.isOpen) {
      if (Date.now() < this.circuitBreaker.nextRetryTime) {
        throw new Error('Circuit breaker is open - Registry temporarily unavailable');
      }
      // Reset circuit breaker for retry
      this.circuitBreaker.isOpen = false;
      this.circuitBreaker.failureCount = 0;
    }
  }

  // Handle circuit breaker failure
  private handleFailure(error: Error): void {
    this.circuitBreaker.failureCount++;
    this.circuitBreaker.lastFailureTime = Date.now();

    if (this.circuitBreaker.failureCount >= this.config.circuitBreakerThreshold) {
      this.circuitBreaker.isOpen = true;
      this.circuitBreaker.nextRetryTime = Date.now() + this.config.circuitBreakerTimeout;
      console.error(`Circuit breaker opened after ${this.circuitBreaker.failureCount} failures`);
    }

    throw error;
  }

  // Reset circuit breaker on success
  private handleSuccess(): void {
    this.circuitBreaker.failureCount = 0;
    this.circuitBreaker.isOpen = false;
  }

  // Cache management
  private getCached<T>(key: string): T | null {
    if (!this.config.enableCache) return null;

    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      console.log(`[Gateway] Cache hit for ${key}`);
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    if (!this.config.enableCache) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Gateway wrapper for Registry calls
  private async gatewayCall<T>(
    operation: string,
    fn: () => Promise<T>,
    cacheKey?: string
  ): Promise<T> {
    const traceId = this.generateTraceId();
    console.log(`[Gateway] ${operation} - trace: ${traceId}`);

    // Check cache first
    if (cacheKey) {
      const cached = this.getCached<T>(cacheKey);
      if (cached) return cached;
    }

    // Check circuit breaker
    this.checkCircuitBreaker();

    try {
      const result = await fn();
      this.handleSuccess();
      
      // Update cache
      if (cacheKey) {
        this.setCache(cacheKey, result);
      }

      return result;
    } catch (error) {
      console.error(`[Gateway] ${operation} failed - trace: ${traceId}`, error);
      this.handleFailure(error as Error);
      throw error; // This won't be reached due to handleFailure throwing
    }
  }

  // Public API methods

  async getAgents(query?: AgentQuery): Promise<Agent[]> {
    const cacheKey = `agents-${JSON.stringify(query || {})}`;
    return this.gatewayCall(
      'getAgents',
      () => registryClient.getAgents(query),
      cacheKey
    );
  }

  async getAgent(id: string, include?: string[]): Promise<Agent> {
    const cacheKey = `agent-${id}-${JSON.stringify(include || [])}`;
    return this.gatewayCall(
      'getAgent',
      () => registryClient.getAgent(id, include),
      cacheKey
    );
  }

  async getAgentProfile(id: string): Promise<Profile> {
    const cacheKey = `profile-${id}`;
    return this.gatewayCall(
      'getAgentProfile',
      () => registryClient.getAgentProfile(id),
      cacheKey
    );
  }

  async getAgentPersonas(id: string): Promise<Persona[]> {
    const cacheKey = `personas-${id}`;
    return this.gatewayCall(
      'getAgentPersonas',
      () => registryClient.getAgentPersonas(id),
      cacheKey
    );
  }

  async getAgentArtifacts(id: string): Promise<Artifact[]> {
    const cacheKey = `artifacts-${id}`;
    return this.gatewayCall(
      'getAgentArtifacts',
      () => registryClient.getAgentArtifacts(id),
      cacheKey
    );
  }

  async getAgentCreations(
    id: string,
    status?: 'curated' | 'published'
  ): Promise<Creation[]> {
    const cacheKey = `creations-${id}-${status || 'all'}`;
    return this.gatewayCall(
      'getAgentCreations',
      () => registryClient.getAgentCreations(id, status),
      cacheKey
    );
  }

  async postCreation(agentId: string, creation: CreationPost): Promise<Creation> {
    // Don't cache POST operations
    return this.gatewayCall(
      'postCreation',
      () => registryClient.postCreation(agentId, creation)
    );
  }

  async getDashboardProgress(cohort?: string): Promise<Progress[]> {
    const cacheKey = `progress-${cohort || 'all'}`;
    return this.gatewayCall(
      'getDashboardProgress',
      () => registryClient.getDashboardProgress(cohort),
      cacheKey
    );
  }

  // Health check endpoint
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    circuitBreaker: CircuitBreakerState;
    cacheSize: number;
  }> {
    const status = this.circuitBreaker.isOpen 
      ? 'unhealthy' 
      : this.circuitBreaker.failureCount > 0 
      ? 'degraded' 
      : 'healthy';

    return {
      status,
      circuitBreaker: { ...this.circuitBreaker },
      cacheSize: this.cache.size
    };
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cache.clear();
    console.log('[Gateway] Cache cleared');
  }

  // Reset circuit breaker (useful for testing)
  resetCircuitBreaker(): void {
    this.circuitBreaker = {
      failureCount: 0,
      lastFailureTime: 0,
      isOpen: false,
      nextRetryTime: 0
    };
    console.log('[Gateway] Circuit breaker reset');
  }
}

// Export singleton instance with default config
export const registryGateway = new RegistryGateway();

// Export class for custom configurations
export { RegistryGateway };

// Convenience exports matching Registry client interface
export async function getAgents(query?: AgentQuery): Promise<Agent[]> {
  return registryGateway.getAgents(query);
}

export async function getAgent(id: string, include?: string[]): Promise<Agent> {
  return registryGateway.getAgent(id, include);
}

export async function getAgentCreations(
  agentId: string,
  status?: 'curated' | 'published'
): Promise<Creation[]> {
  return registryGateway.getAgentCreations(agentId, status);
}

export async function postCreation(
  agentId: string,
  creation: CreationPost
): Promise<Creation> {
  return registryGateway.postCreation(agentId, creation);
}