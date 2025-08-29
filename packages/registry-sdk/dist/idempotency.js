"use strict";
// Request Deduplication with Idempotency Keys
// Prevents duplicate Registry operations and ensures data consistency
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotencyManager = exports.IdempotencyManager = void 0;
exports.executeWithIdempotency = executeWithIdempotency;
exports.generateIdempotencyKey = generateIdempotencyKey;
exports.checkDuplicate = checkDuplicate;
const cache_1 = require("./cache");
class IdempotencyManager {
    constructor(config) {
        this.config = {
            defaultTTL: 3600, // 1 hour
            keyPrefix: 'idem:',
            enableAutoGeneration: true,
            hashAlgorithm: 'sha256',
            ...config
        };
    }
    // Generate idempotency key from request data
    generateKey(data) {
        // Simple hash implementation for browser compatibility
        const parts = [
            data.operation,
            data.userId || '',
            data.agentId || '',
            data.requestBody ? JSON.stringify(data.requestBody, Object.keys(data.requestBody).sort()) : '',
            data.timestamp ? Math.floor(data.timestamp / 60000) * 60000 : ''
        ];
        const combined = parts.join('|');
        // Simple hash function (not cryptographically secure but sufficient for deduplication)
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            const char = combined.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return `${this.config.keyPrefix}${Math.abs(hash).toString(36)}`;
    }
    // Execute operation with idempotency protection
    async executeWithIdempotency(idempotencyKey, operation, ttl) {
        const finalTTL = ttl || this.config.defaultTTL;
        // Check if we already have a result for this key
        const existing = await cache_1.registryCache.get(idempotencyKey);
        if (existing) {
            console.log(`[Idempotency] Key ${idempotencyKey} found in cache - returning cached result`);
            return {
                data: existing,
                fromCache: true,
                key: idempotencyKey,
                ttl: finalTTL
            };
        }
        // Execute the operation
        console.log(`[Idempotency] Key ${idempotencyKey} not found - executing operation`);
        try {
            const result = await operation();
            // Store result for future deduplication
            await cache_1.registryCache.set(idempotencyKey, result, finalTTL);
            console.log(`[Idempotency] Operation completed - cached result for ${finalTTL}s`);
            return {
                data: result,
                fromCache: false,
                key: idempotencyKey,
                ttl: finalTTL
            };
        }
        catch (error) {
            console.error(`[Idempotency] Operation failed for key ${idempotencyKey}:`, error);
            throw error;
        }
    }
    // Create agent creation with idempotency
    async createCreationIdempotent(params) {
        let key = params.idempotencyKey;
        // Auto-generate key if not provided
        if (!key && this.config.enableAutoGeneration) {
            key = this.generateKey({
                operation: 'create_creation',
                userId: params.userId,
                agentId: params.agentId,
                requestBody: params.creation,
                timestamp: Date.now()
            });
        }
        if (!key) {
            throw new Error('Idempotency key is required');
        }
        return this.executeWithIdempotency(key, async () => {
            // This would be your actual creation logic
            // For now, return mock data
            return {
                id: `creation-${Date.now()}`,
                agentId: params.agentId,
                ...params.creation,
                createdAt: new Date().toISOString()
            };
        }, params.ttl);
    }
    // Update agent with idempotency
    async updateAgentIdempotent(params) {
        let key = params.idempotencyKey;
        if (!key && this.config.enableAutoGeneration) {
            key = this.generateKey({
                operation: 'update_agent',
                userId: params.userId,
                agentId: params.agentId,
                requestBody: params.updates,
                timestamp: Date.now()
            });
        }
        if (!key) {
            throw new Error('Idempotency key is required');
        }
        return this.executeWithIdempotency(key, async () => {
            return {
                id: params.agentId,
                ...params.updates,
                updatedAt: new Date().toISOString()
            };
        }, params.ttl);
    }
    // Check if operation is duplicate
    async isDuplicate(idempotencyKey) {
        const existing = await cache_1.registryCache.get(idempotencyKey);
        return existing !== null;
    }
    // Invalidate idempotency key (force re-execution)
    async invalidateKey(idempotencyKey) {
        return cache_1.registryCache.del(idempotencyKey);
    }
    // Clean up expired idempotency keys
    async cleanup() {
        return cache_1.registryCache.invalidatePattern(`${this.config.keyPrefix}*`);
    }
    // Get idempotency statistics
    async getStats() {
        // This is a simplified implementation
        // In production, you'd query the cache for actual statistics
        return {
            totalKeys: 0, // Would need to implement cache scanning
            config: this.config
        };
    }
    // Middleware for Express/Next.js API routes
    async middleware(operation, headers, body, userId, agentId) {
        // Extract idempotency key from headers
        let idempotencyKey = headers['idempotency-key'] || headers['x-idempotency-key'];
        // Auto-generate if not provided
        if (!idempotencyKey && this.config.enableAutoGeneration) {
            idempotencyKey = this.generateKey({
                operation,
                userId,
                agentId,
                requestBody: body,
                timestamp: Date.now()
            });
        }
        if (!idempotencyKey) {
            return {
                idempotencyKey: '',
                isDuplicate: false
            };
        }
        // Check for duplicate
        const cached = await cache_1.registryCache.get(idempotencyKey);
        return {
            idempotencyKey,
            isDuplicate: cached !== null,
            cached
        };
    }
    // Time-based deduplication window
    generateTimeWindowKey(data) {
        const windowMinutes = data.windowMinutes || 5; // 5 minute window
        const now = Date.now();
        const windowStart = Math.floor(now / (windowMinutes * 60 * 1000)) * (windowMinutes * 60 * 1000);
        return this.generateKey({
            ...data,
            timestamp: windowStart
        });
    }
    // Content-based deduplication (ignores timing)
    generateContentKey(data) {
        return this.generateKey(data); // No timestamp = content-only hash
    }
}
exports.IdempotencyManager = IdempotencyManager;
// Export singleton instance
exports.idempotencyManager = new IdempotencyManager();
// Convenience functions
async function executeWithIdempotency(idempotencyKey, operation, ttl) {
    return exports.idempotencyManager.executeWithIdempotency(idempotencyKey, operation, ttl);
}
function generateIdempotencyKey(data) {
    return exports.idempotencyManager.generateKey(data);
}
async function checkDuplicate(idempotencyKey) {
    return exports.idempotencyManager.isDuplicate(idempotencyKey);
}
