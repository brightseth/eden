"use strict";
// Registry Guardian Data Adapter
// ENFORCES Gateway-only access - no more dual-path data access
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataAdapter = exports.DataAdapter = void 0;
exports.getAgents = getAgents;
exports.getAgent = getAgent;
exports.getAgentCreations = getAgentCreations;
exports.postCreation = postCreation;
const gateway_1 = require("./gateway");
const monitor_1 = require("./monitor");
// Cache for storing fallback data when Registry is down
const fallbackCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
class DataAdapter {
    constructor() {
        // Retry queue for failed operations
        this.retryQueue = new Map();
        // ENFORCE: Registry is the single source of truth - NO FALLBACKS
        this.gatewayOnly = true; // Always enforce Registry
        console.log('✅ Registry enforcement ACTIVE - Genesis Registry is the single source of truth');
    }
    // Get all agents - ENFORCED through Gateway only
    async getAgents(query) {
        monitor_1.registryMonitor.trackGatewayCall();
        try {
            return await gateway_1.registryGateway.getAgents(query);
        }
        catch (error) {
            console.error('[CRITICAL] Registry unavailable - no fallback allowed:', error);
            throw new Error(`Registry is required: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Get single agent - ENFORCED through Gateway only
    async getAgent(id, include) {
        monitor_1.registryMonitor.trackGatewayCall();
        try {
            return await gateway_1.registryGateway.getAgent(id, include);
        }
        catch (error) {
            console.error('[CRITICAL] Registry unavailable - no fallback allowed:', error);
            throw new Error(`Registry is required: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Post creation - ENFORCED through Gateway only
    async postCreation(agentId, creation) {
        monitor_1.registryMonitor.trackGatewayCall();
        try {
            return await gateway_1.registryGateway.postCreation(agentId, creation);
        }
        catch (error) {
            console.error('Gateway post failed, queuing for retry:', error);
            // Queue for retry with exponential backoff
            this.queueForRetry('postCreation', { agentId, creation });
            return null;
        }
    }
    // Get agent works/creations - ENFORCED through Gateway only
    async getAgentCreations(agentId, status) {
        monitor_1.registryMonitor.trackGatewayCall();
        try {
            return await gateway_1.registryGateway.getAgentCreations(agentId, status);
        }
        catch (error) {
            console.error('[CRITICAL] Registry unavailable - no fallback allowed:', error);
            throw new Error(`Registry is required: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    // Legacy transformation methods removed - Gateway enforces Registry-only access
    // Cache management - DEPRECATED (no fallback to cache allowed)
    getCachedData(key, defaultValue) {
        console.error('DEPRECATED: Cache fallback attempted - Registry is the only source of truth');
        throw new Error('Cache fallback is disabled - Registry must be available');
    }
    setCachedData(key, data) {
        fallbackCache.set(key, { data, timestamp: Date.now() });
    }
    queueForRetry(operation, params) {
        const queue = this.retryQueue.get(operation) || [];
        queue.push({ params, timestamp: Date.now() });
        this.retryQueue.set(operation, queue);
        // Process retry queue after delay
        setTimeout(() => this.processRetryQueue(operation), 5000);
    }
    async processRetryQueue(operation) {
        const queue = this.retryQueue.get(operation);
        if (!queue || queue.length === 0)
            return;
        const item = queue.shift();
        if (!item)
            return;
        try {
            if (operation === 'postCreation') {
                await gateway_1.registryGateway.postCreation(item.params.agentId, item.params.creation);
                console.log('Retry successful for', operation);
            }
        }
        catch (error) {
            console.error('Retry failed, requeuing:', error);
            queue.push(item); // Re-add to queue
        }
        this.retryQueue.set(operation, queue);
    }
    // Check if Gateway enforcement is active
    isUsingGateway() {
        return this.gatewayOnly;
    }
    // Report Gateway enforcement status
    getEnforcementStatus() {
        if (this.gatewayOnly) {
            return 'Gateway enforcement ACTIVE - all requests via Gateway';
        }
        return 'Gateway enforcement DISABLED - debugging mode';
    }
}
exports.DataAdapter = DataAdapter;
// Export singleton instance
exports.dataAdapter = new DataAdapter();
// Helper functions for common operations
async function getAgents(query) {
    return exports.dataAdapter.getAgents(query);
}
async function getAgent(id, include) {
    return exports.dataAdapter.getAgent(id, include);
}
async function getAgentCreations(agentId, status) {
    return exports.dataAdapter.getAgentCreations(agentId, status);
}
async function postCreation(agentId, creation) {
    return exports.dataAdapter.postCreation(agentId, creation);
}
