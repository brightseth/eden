// Lightweight Registry Gateway for internal prototyping
// Enforces UI → Gateway → Registry pattern and provides circuit breaker protection

import { createRegistryApiClient, RegistryApiClient } from '../generated-sdk';
import { registryAuth, authenticateRequest } from './auth';
import { registryCache, cacheGet, cacheSet, cacheInvalidate } from './cache';
// import { auditLogger } from './audit';
import { idempotencyManager } from './idempotency';
import { 
  snapshotService, 
  type GovernanceProposal, 
  type SnapshotProposal, 
  type VotingPowerResult,
  type ProposalSyncResult,
  type SnapshotSpace
} from './snapshot-service';
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
import { toLocalAgent, toLocalAgents, toLocalCreation, toLocalCreations, toLocalPersona, toLocalPersonas } from './adapters';

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

type CacheEntry<T> = { data: T; timestamp: number };

type SdkCreationInput = {
  title: string;
  description: string;
  mediaUri: string;
  metadata?: any;
  publishedTo?: string;
};

function toSdkCreationInput(c: Omit<Creation, 'id'>): SdkCreationInput {
  return {
    title: (c as any).title ?? 'Untitled',
    description: (c as any).description ?? '',
    mediaUri: c.mediaUri,
    metadata: c.metadata,
    publishedTo: c.publishedTo?.chainTx ?? undefined
  };
}

class RegistryGateway {
  private config: GatewayConfig;
  private circuitBreaker: CircuitBreakerState;
  private cache: Map<string, CacheEntry<any>>;
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

  // Cache helper methods for consistent shape
  private cacheGet<T>(key: string): T | undefined {
    const v = this.cache.get(key);
    if (!v) return undefined;
    if (Array.isArray(v)) return v as unknown as T; // legacy
    if (typeof v === 'object' && v && 'data' in (v as any)) return (v as CacheEntry<T>).data;
    return v as T;
  }

  private cacheSet<T>(key: string, data: T) {
    this.cache.set(key, { data, timestamp: Date.now() } as CacheEntry<T>);
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
        // await auditLogger.auditGatewayCall({
        //   operation,
        //   endpoint: `/${operation}`,
        //   method: 'POST',
        //   headers: headers || {},
        //   responseStatus: 401,
        //   responseTime,
        //   error: authResult.error,
        //   traceId
        // });
        
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
        // await auditLogger.auditGatewayCall({
        //   operation,
        //   endpoint: `/${operation}`,
        //   method: 'GET',
        //   headers: headers || {},
        //   responseStatus: 200,
        //   responseTime,
        //   userId: authUser?.userId,
        //   userEmail: authUser?.email,
        //   traceId,
        // });
        
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
      // await auditLogger.auditGatewayCall({
      //   operation,
      //   endpoint: `/${operation}`,
      //   method: requireAuth ? 'POST' : 'GET',
      //   headers: headers || {},
      //   responseStatus: 200,
      //   responseTime,
      //   userId: authUser?.userId,
      //   userEmail: authUser?.email,
      //   traceId
      // });

      return result;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      console.error(`[Gateway] ${operation} failed - trace: ${traceId}`, error);
      
      // Audit failed operation
      // await auditLogger.auditGatewayCall({
      //   operation,
      //   endpoint: `/${operation}`,
      //   method: requireAuth ? 'POST' : 'GET',
      //   headers: headers || {},
      //   responseStatus: 500,
      //   responseTime,
      //   userId: authUser?.userId,
      //   userEmail: authUser?.email,
      //   error: error instanceof Error ? error.message : 'Unknown error',
      //   traceId
      // });
      
      this.handleFailure(error as Error);
      throw error; // This won't be reached due to handleFailure throwing
    }
  }

  // Public API methods

  async getAgents(query?: AgentQuery): Promise<Agent[]> {
    const cacheKey = `agents-${JSON.stringify(query || {})}`;
    
    // Check cache first
    const cached = this.cacheGet<Agent[]>(cacheKey);
    if (cached) {
      console.log('[registry/gateway] getAgents', { count: cached.length, cached: true });
      return cached;
    }
    
    // Call SDK and adapt the response
    const sdkResponse = await this.gatewayCall(
      'getAgents',
      () => this.apiClient.getAgents({
        cohort: query?.cohort,
        status: query?.status,
        include: query?.include
      }),
      null // Don't use internal caching since we handle it here
    );
    
    // Convert SDK agents to local format
    const agents = Array.isArray(sdkResponse) 
      ? toLocalAgents(sdkResponse)
      : toLocalAgents((sdkResponse as any)?.agents ?? []);
    
    // Cache the converted result
    this.cacheSet(cacheKey, agents);
    
    console.log('[registry/gateway] getAgents', { count: agents.length, cached: false });
    return agents;
  }

  async getAgent(id: string, include?: string[]): Promise<Agent> {
    const cacheKey = `agent-${id}-${JSON.stringify(include || [])}`;
    
    // Check cache first
    const cached = this.cacheGet<Agent>(cacheKey);
    if (cached) return cached;
    
    // Call SDK and adapt the response
    const sdkAgent = await this.gatewayCall(
      'getAgent',
      () => this.apiClient.getAgent(id, include),
      null // Don't use internal caching since we handle it here
    );
    
    if (!sdkAgent) {
      throw new Error(`Agent ${id} not found`);
    }
    
    // Convert SDK agent to local format
    const agent = toLocalAgent(sdkAgent);
    
    // Cache the converted result
    this.cacheSet(cacheKey, agent);
    
    return agent;
  }

  async getAgentProfile(id: string): Promise<Profile> {
    // Get the full agent with profile included
    const agent = await this.getAgent(id, ['profile']);
    
    if (!agent.profile) {
      throw new Error(`Profile not found for agent ${id}`);
    }
    
    return agent.profile;
  }

  async getAgentPersonas(id: string): Promise<Persona[]> {
    // Get the full agent with personas included
    const agent = await this.getAgent(id, ['personas']);
    
    return agent.personas ?? [];
  }

  async getAgentCreations(
    id: string,
    status?: 'CURATED' | 'PUBLISHED'
  ): Promise<Creation[]> {
    const cacheKey = `creations-${id}-${status || 'all'}`;
    
    // Check cache first
    const cached = this.cacheGet<Creation[]>(cacheKey);
    if (cached) return cached;
    
    // Call SDK and adapt the response
    const sdkCreations = await this.gatewayCall(
      'getAgentCreations',
      () => this.apiClient.getAgentCreations(id, status),
      null // Don't use internal caching since we handle it here
    );
    
    // Convert SDK creations to local format
    const creations = Array.isArray(sdkCreations)
      ? toLocalCreations(id, sdkCreations)
      : toLocalCreations(id, (sdkCreations as any)?.creations ?? []);
    
    // Cache the converted result
    this.cacheSet(cacheKey, creations);
    
    return creations;
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
          const sdkInput = toSdkCreationInput(creation);
          const sdkCreation = await this.gatewayCall(
            'postCreation',
            () => this.apiClient.createAgentCreation(agentId, sdkInput as any),
            undefined,
            true, // require auth
            headers
          );
          // Convert SDK creation to local format
          const result = toLocalCreation(agentId, sdkCreation);
          console.log('[registry/gateway] postCreation', { agentId, ok: true });
          return result;
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
    const sdkInput = toSdkCreationInput(creation);
    const sdkResult = await this.gatewayCall(
      'postCreation',
      () => this.apiClient.createAgentCreation(agentId, sdkInput as any),
      undefined,
      true, // require auth
      headers
    );
    
    // Convert SDK creation to local format
    const localCreation = toLocalCreation(agentId, sdkResult);
    
    // Invalidate related cache entries after successful creation
    await registryCache.invalidateCreations(agentId);
    await cacheInvalidate(`agent-${agentId}`);
    
    return localCreation;
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

  // Snapshot Governance Methods
  
  async createSnapshotProposal(
    spaceId: string,
    proposal: GovernanceProposal,
    headers?: Record<string, string | undefined>
  ): Promise<SnapshotProposal> {
    return this.gatewayCall(
      'createSnapshotProposal',
      () => snapshotService.createProposal(spaceId, proposal),
      undefined, // No cache for write operations
      true, // require auth
      headers
    );
  }

  async getSnapshotSpace(spaceId: string): Promise<SnapshotSpace> {
    const cacheKey = `snapshot-space-${spaceId}`;
    return this.gatewayCall(
      'getSnapshotSpace',
      () => snapshotService.getSpace(spaceId),
      cacheKey
    );
  }

  async getSnapshotProposal(proposalId: string): Promise<SnapshotProposal> {
    const cacheKey = `snapshot-proposal-${proposalId}`;
    return this.gatewayCall(
      'getSnapshotProposal',
      () => snapshotService.getProposal(proposalId),
      cacheKey
    );
  }

  async getSnapshotVotingPower(spaceId: string, address: string): Promise<VotingPowerResult> {
    const cacheKey = `voting-power-${spaceId}-${address}`;
    return this.gatewayCall(
      'getSnapshotVotingPower',
      () => snapshotService.getVotingPower(spaceId, address),
      cacheKey
    );
  }

  async castSnapshotVote(
    proposalId: string,
    choice: number,
    address: string,
    headers?: Record<string, string | undefined>
  ): Promise<{ success: boolean; txHash?: string }> {
    return this.gatewayCall(
      'castSnapshotVote',
      () => snapshotService.castVote(proposalId, choice, address),
      undefined, // No cache for write operations
      true, // require auth
      headers
    );
  }

  async syncSnapshotProposal(
    proposalId: string,
    registryWorkId: string,
    headers?: Record<string, string | undefined>
  ): Promise<ProposalSyncResult> {
    return this.gatewayCall(
      'syncSnapshotProposal',
      () => snapshotService.syncProposalData(proposalId, registryWorkId),
      undefined, // No cache for sync operations
      true, // require auth
      headers
    );
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
  // Convert lowercase status to uppercase for SDK
  const sdkStatus = status ? status.toUpperCase() as 'CURATED' | 'PUBLISHED' : undefined;
  return registryGateway.getAgentCreations(agentId, sdkStatus);
}

export async function postCreation(
  agentId: string,
  creation: CreationPost
): Promise<Creation> {
  // Convert CreationPost to Omit<Creation, 'id'> format
  const creationData: Omit<Creation, 'id'> = {
    agentId,
    mediaUri: creation.mediaUri,
    metadata: creation.metadata,
    status: 'draft', // Default status
    publishedTo: creation.publishedTo
  };
  
  return registryGateway.postCreation(agentId, creationData);
}