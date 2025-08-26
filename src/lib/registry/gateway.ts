// Lightweight Registry Gateway for internal prototyping
// Enforces UI → Gateway → Registry pattern and provides circuit breaker protection

import { createRegistryApiClient, RegistryApiClient } from '../generated-sdk';
import { registryAuth, authenticateRequest } from './auth';
import { registryCache, cacheGet, cacheSet, cacheInvalidate } from './cache';
import { auditLogger } from './audit';
import { idempotencyManager } from './idempotency';
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
  private apiClient: RegistryApiClient;

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
    
    // Initialize typed SDK client
    this.apiClient = createRegistryApiClient({
      baseUrl: process.env.REGISTRY_BASE_URL,
      apiKey: process.env.REGISTRY_API_KEY,
      timeout: 10000,
      maxRetries: this.config.maxRetries
    });
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

  // Cache management using Redis with fallback
  private async getCached<T>(key: string): Promise<T | null> {
    if (!this.config.enableCache) return null;

    // Try Redis first, then fallback to in-memory
    const cached = await cacheGet<T>(key);
    if (cached) {
      console.log(`[Gateway] Redis cache hit for ${key}`);
      return cached;
    }

    // Check in-memory cache as final fallback
    const memCached = this.cache.get(key);
    if (memCached && Date.now() - memCached.timestamp < this.config.cacheTimeout) {
      console.log(`[Gateway] Memory cache hit for ${key}`);
      return memCached.data as T;
    }

    return null;
  }

  private async setCache(key: string, data: any): Promise<void> {
    if (!this.config.enableCache) return;
    
    // Set in Redis with TTL
    await cacheSet(key, data, Math.floor(this.config.cacheTimeout / 1000));
    
    // Also set in memory as fallback
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Gateway wrapper for Registry calls using typed SDK
  private async gatewayCall<T>(
    operation: string,
    fn: () => Promise<T>,
    cacheKey?: string,
    requireAuth: boolean = false,
    headers?: Record<string, string | undefined>
  ): Promise<T> {
    const traceId = this.generateTraceId();
    const startTime = Date.now();
    
    console.log(`[Gateway] ${operation} - trace: ${traceId}`);

    let authUser = undefined;
    
    // Authentication check if required
    if (requireAuth && headers) {
      const authResult = await authenticateRequest(headers);
      if (!authResult.authenticated) {
        const responseTime = Date.now() - startTime;
        
        // Audit failed auth
        await auditLogger.auditGatewayCall({
          operation,
          endpoint: `/${operation}`,
          method: 'POST',
          headers: headers || {},
          responseStatus: 401,
          responseTime,
          error: authResult.error,
          traceId
        });
        
        throw new Error(`Authentication failed: ${authResult.error}`);
      }
      
      authUser = authResult.user;
      console.log(`[Gateway] ${operation} authenticated for user: ${authUser?.email || 'unknown'}`);
    }

    // Check cache first
    if (cacheKey) {
      const cached = await this.getCached<T>(cacheKey);
      if (cached) {
        const responseTime = Date.now() - startTime;
        
        // Audit cache hit
        await auditLogger.auditGatewayCall({
          operation,
          endpoint: `/${operation}`,
          method: 'GET',
          headers: headers || {},
          responseStatus: 200,
          responseTime,
          userId: authUser?.userId,
          userEmail: authUser?.email,
          traceId,
        });
        
        return cached;
      }
    }

    // Check circuit breaker
    this.checkCircuitBreaker();

    try {
      const result = await fn();
      const responseTime = Date.now() - startTime;
      
      this.handleSuccess();
      
      // Update cache
      if (cacheKey) {
        await this.setCache(cacheKey, result);
      }

      // Audit successful operation
      await auditLogger.auditGatewayCall({
        operation,
        endpoint: `/${operation}`,
        method: requireAuth ? 'POST' : 'GET',
        headers: headers || {},
        responseStatus: 200,
        responseTime,
        userId: authUser?.userId,
        userEmail: authUser?.email,
        traceId
      });

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      console.error(`[Gateway] ${operation} failed - trace: ${traceId}`, error);
      
      // Audit failed operation
      await auditLogger.auditGatewayCall({
        operation,
        endpoint: `/${operation}`,
        method: requireAuth ? 'POST' : 'GET',
        headers: headers || {},
        responseStatus: 500,
        responseTime,
        userId: authUser?.userId,
        userEmail: authUser?.email,
        error: error instanceof Error ? error.message : 'Unknown error',
        traceId
      });
      
      this.handleFailure(error as Error);
      throw error; // This won't be reached due to handleFailure throwing
    }
  }

  // Public API methods

  async getAgents(query?: AgentQuery): Promise<Agent[]> {
    const cacheKey = `agents-${JSON.stringify(query || {})}`;
    return this.gatewayCall(
      'getAgents',
      () => this.apiClient.getAgents({
        cohort: query?.cohort,
        status: query?.status,
        include: query?.include
      }),
      cacheKey
    );
  }

  async getAgent(id: string, include?: string[]): Promise<Agent> {
    const cacheKey = `agent-${id}-${JSON.stringify(include || [])}`;
    return this.gatewayCall(
      'getAgent',
      () => this.apiClient.getAgent(id, include),
      cacheKey
    );
  }

  async getAgentProfile(id: string): Promise<Profile> {
    const cacheKey = `profile-${id}`;
    return this.gatewayCall(
      'getAgentProfile',
      () => this.apiClient.getAgentProfile(id),
      cacheKey
    );
  }

  async getAgentPersonas(id: string): Promise<Persona[]> {
    const cacheKey = `personas-${id}`;
    return this.gatewayCall(
      'getAgentPersonas',
      () => this.apiClient.getAgentPersonas(id),
      cacheKey
    );
  }

  async getAgentCreations(
    id: string,
    status?: 'CURATED' | 'PUBLISHED'
  ): Promise<Creation[]> {
    const cacheKey = `creations-${id}-${status || 'all'}`;
    return this.gatewayCall(
      'getAgentCreations',
      () => this.apiClient.getAgentCreations(id, status),
      cacheKey
    );
  }

  async postCreation(
    agentId: string, 
    creation: Omit<Creation, 'id'>,
    headers?: Record<string, string | undefined>
  ): Promise<Creation> {
    // Check for idempotency key
    const idempotencyKey = headers?.['idempotency-key'] || headers?.['x-idempotency-key'];
    
    if (idempotencyKey) {
      // Use idempotency protection for write operations
      const idempotentResult = await idempotencyManager.executeWithIdempotency(
        idempotencyKey,
        async () => {
          return this.gatewayCall(
            'postCreation',
            () => this.apiClient.createAgentCreation(agentId, creation),
            undefined,
            true, // require auth
            headers
          );
        },
        3600 // 1 hour TTL for creation operations
      );
      
      if (idempotentResult.fromCache) {
        console.log(`[Gateway] Returning cached creation from idempotency key: ${idempotencyKey}`);
      } else {
        // Invalidate related cache entries after successful creation
        await registryCache.invalidateCreations(agentId);
        await cacheInvalidate(`agent-${agentId}`);
      }
      
      return idempotentResult.data;
    }
    
    // Fallback to regular operation without idempotency
    const result = await this.gatewayCall(
      'postCreation',
      () => this.apiClient.createAgentCreation(agentId, creation),
      undefined,
      true, // require auth
      headers
    );
    
    // Invalidate related cache entries after successful creation
    await registryCache.invalidateCreations(agentId);
    await cacheInvalidate(`agent-${agentId}`);
    
    return result;
  }

  // Authentication methods
  async startMagicAuth(email: string): Promise<{ message: string; success: boolean }> {
    return registryAuth.startMagicAuth(email);
  }

  async completeMagicAuth(token: string): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    error?: string;
  }> {
    return registryAuth.completeMagicAuth(token);
  }

  async authenticateRequest(headers: Record<string, string | undefined>): Promise<{
    authenticated: boolean;
    user?: any;
    error?: string;
  }> {
    return authenticateRequest(headers);
  }

  // Health check endpoint
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    circuitBreaker: CircuitBreakerState;
    cache: {
      redis: boolean;
      fallback: boolean;
      memorySize: number;
      totalEntries: number;
      stats?: any;
    };
  }> {
    const status = this.circuitBreaker.isOpen 
      ? 'unhealthy' 
      : this.circuitBreaker.failureCount > 0 
      ? 'degraded' 
      : 'healthy';

    const cacheHealth = await registryCache.healthCheck();
    const cacheStats = await registryCache.getStats();

    return {
      status,
      circuitBreaker: { ...this.circuitBreaker },
      cache: {
        redis: cacheHealth.redis,
        fallback: cacheHealth.fallback,
        memorySize: this.cache.size,
        totalEntries: cacheHealth.totalEntries,
        stats: cacheStats
      }
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