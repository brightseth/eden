"use strict";
// Lightweight Registry Gateway for internal prototyping
// Enforces UI → Gateway → Registry pattern and provides circuit breaker protection
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistryGateway = exports.registryGateway = void 0;
exports.getAgents = getAgents;
exports.getAgent = getAgent;
exports.getAgentCreations = getAgentCreations;
exports.postCreation = postCreation;
const generated_sdk_1 = require("../generated-sdk");
const auth_1 = require("./auth");
const cache_1 = require("./cache");
// import { auditLogger } from './audit';
const idempotency_1 = require("./idempotency");
const snapshot_service_1 = require("./snapshot-service");
class RegistryGateway {
    constructor(config) {
        this.traceCounter = 0;
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
        this.apiClient = (0, generated_sdk_1.createRegistryApiClient)({
            baseUrl: process.env.REGISTRY_BASE_URL,
            apiKey: process.env.REGISTRY_API_KEY,
            timeout: 10000,
            maxRetries: this.config.maxRetries
        });
    }
    // Generate trace ID for observability
    generateTraceId() {
        this.traceCounter++;
        return `gw-${Date.now()}-${this.traceCounter}`;
    }
    // Check circuit breaker state
    checkCircuitBreaker() {
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
    handleFailure(error) {
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
    handleSuccess() {
        this.circuitBreaker.failureCount = 0;
        this.circuitBreaker.isOpen = false;
    }
    // Cache management using Redis with fallback
    async getCached(key) {
        if (!this.config.enableCache)
            return null;
        // Try Redis first, then fallback to in-memory
        const cached = await (0, cache_1.cacheGet)(key);
        if (cached) {
            console.log(`[Gateway] Redis cache hit for ${key}`);
            return cached;
        }
        // Check in-memory cache as final fallback
        const memCached = this.cache.get(key);
        if (memCached && Date.now() - memCached.timestamp < this.config.cacheTimeout) {
            console.log(`[Gateway] Memory cache hit for ${key}`);
            return memCached.data;
        }
        return null;
    }
    async setCache(key, data) {
        if (!this.config.enableCache)
            return;
        // Set in Redis with TTL
        await (0, cache_1.cacheSet)(key, data, Math.floor(this.config.cacheTimeout / 1000));
        // Also set in memory as fallback
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }
    // Gateway wrapper for Registry calls using typed SDK
    async gatewayCall(operation, fn, cacheKey, requireAuth = false, headers) {
        const traceId = this.generateTraceId();
        const startTime = Date.now();
        console.log(`[Gateway] ${operation} - trace: ${traceId}`);
        let authUser = undefined;
        // Authentication check if required
        if (requireAuth && headers) {
            const authResult = await (0, auth_1.authenticateRequest)(headers);
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
            const cached = await this.getCached(cacheKey);
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
        }
        catch (error) {
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
            this.handleFailure(error);
            throw error; // This won't be reached due to handleFailure throwing
        }
    }
    // Public API methods
    async getAgents(query) {
        const cacheKey = `agents-${JSON.stringify(query || {})}`;
        return this.gatewayCall('getAgents', () => this.apiClient.getAgents({
            cohort: query?.cohort,
            status: query?.status,
            include: query?.include
        }), cacheKey);
    }
    async getAgent(id, include) {
        const cacheKey = `agent-${id}-${JSON.stringify(include || [])}`;
        return this.gatewayCall('getAgent', () => this.apiClient.getAgent(id, include), cacheKey);
    }
    async getAgentProfile(id) {
        const cacheKey = `profile-${id}`;
        return this.gatewayCall('getAgentProfile', () => this.apiClient.getAgentProfile(id), cacheKey);
    }
    async getAgentPersonas(id) {
        const cacheKey = `personas-${id}`;
        return this.gatewayCall('getAgentPersonas', () => this.apiClient.getAgentPersonas(id), cacheKey);
    }
    async getAgentCreations(id, status) {
        const cacheKey = `creations-${id}-${status || 'all'}`;
        return this.gatewayCall('getAgentCreations', () => this.apiClient.getAgentCreations(id, status), cacheKey);
    }
    async postCreation(agentId, creation, headers) {
        // Check for idempotency key
        const idempotencyKey = headers?.['idempotency-key'] || headers?.['x-idempotency-key'];
        if (idempotencyKey) {
            // Use idempotency protection for write operations
            const idempotentResult = await idempotency_1.idempotencyManager.executeWithIdempotency(idempotencyKey, async () => {
                return this.gatewayCall('postCreation', () => this.apiClient.createAgentCreation(agentId, creation), undefined, true, // require auth
                headers);
            }, 3600 // 1 hour TTL for creation operations
            );
            if (idempotentResult.fromCache) {
                console.log(`[Gateway] Returning cached creation from idempotency key: ${idempotencyKey}`);
            }
            else {
                // Invalidate related cache entries after successful creation
                await cache_1.registryCache.invalidateCreations(agentId);
                await (0, cache_1.cacheInvalidate)(`agent-${agentId}`);
            }
            return idempotentResult.data;
        }
        // Fallback to regular operation without idempotency
        const result = await this.gatewayCall('postCreation', () => this.apiClient.createAgentCreation(agentId, creation), undefined, true, // require auth
        headers);
        // Invalidate related cache entries after successful creation
        await cache_1.registryCache.invalidateCreations(agentId);
        await (0, cache_1.cacheInvalidate)(`agent-${agentId}`);
        return result;
    }
    // Authentication methods
    async startMagicAuth(email) {
        return auth_1.registryAuth.startMagicAuth(email);
    }
    async completeMagicAuth(token) {
        return auth_1.registryAuth.completeMagicAuth(token);
    }
    async authenticateRequest(headers) {
        return (0, auth_1.authenticateRequest)(headers);
    }
    // Health check endpoint
    async healthCheck() {
        const status = this.circuitBreaker.isOpen
            ? 'unhealthy'
            : this.circuitBreaker.failureCount > 0
                ? 'degraded'
                : 'healthy';
        const cacheHealth = await cache_1.registryCache.healthCheck();
        const cacheStats = await cache_1.registryCache.getStats();
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
    async createSnapshotProposal(spaceId, proposal, headers) {
        return this.gatewayCall('createSnapshotProposal', () => snapshot_service_1.snapshotService.createProposal(spaceId, proposal), undefined, // No cache for write operations
        true, // require auth
        headers);
    }
    async getSnapshotSpace(spaceId) {
        const cacheKey = `snapshot-space-${spaceId}`;
        return this.gatewayCall('getSnapshotSpace', () => snapshot_service_1.snapshotService.getSpace(spaceId), cacheKey);
    }
    async getSnapshotProposal(proposalId) {
        const cacheKey = `snapshot-proposal-${proposalId}`;
        return this.gatewayCall('getSnapshotProposal', () => snapshot_service_1.snapshotService.getProposal(proposalId), cacheKey);
    }
    async getSnapshotVotingPower(spaceId, address) {
        const cacheKey = `voting-power-${spaceId}-${address}`;
        return this.gatewayCall('getSnapshotVotingPower', () => snapshot_service_1.snapshotService.getVotingPower(spaceId, address), cacheKey);
    }
    async castSnapshotVote(proposalId, choice, address, headers) {
        return this.gatewayCall('castSnapshotVote', () => snapshot_service_1.snapshotService.castVote(proposalId, choice, address), undefined, // No cache for write operations
        true, // require auth
        headers);
    }
    async syncSnapshotProposal(proposalId, registryWorkId, headers) {
        return this.gatewayCall('syncSnapshotProposal', () => snapshot_service_1.snapshotService.syncProposalData(proposalId, registryWorkId), undefined, // No cache for sync operations
        true, // require auth
        headers);
    }
    // Clear cache (useful for testing)
    clearCache() {
        this.cache.clear();
        console.log('[Gateway] Cache cleared');
    }
    // Reset circuit breaker (useful for testing)
    resetCircuitBreaker() {
        this.circuitBreaker = {
            failureCount: 0,
            lastFailureTime: 0,
            isOpen: false,
            nextRetryTime: 0
        };
        console.log('[Gateway] Circuit breaker reset');
    }
}
exports.RegistryGateway = RegistryGateway;
// Export singleton instance with default config
exports.registryGateway = new RegistryGateway();
// Convenience exports matching Registry client interface
async function getAgents(query) {
    return exports.registryGateway.getAgents(query);
}
async function getAgent(id, include) {
    return exports.registryGateway.getAgent(id, include);
}
async function getAgentCreations(agentId, status) {
    return exports.registryGateway.getAgentCreations(agentId, status);
}
async function postCreation(agentId, creation) {
    return exports.registryGateway.postCreation(agentId, creation);
}
