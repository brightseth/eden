"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REGISTRY_VERSION = exports.SDK_VERSION = exports.getAgentCreations = exports.listAgents = exports.getAgentByHandle = exports.getAgent = exports.registryClient = exports.RegistryClient = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
// Registry API Configuration
const DEFAULT_BASE_URL = 'https://eden-genesis-registry.vercel.app/api/v1';
const DEFAULT_TIMEOUT = 10000; // 10 seconds
// Main Registry Client
class RegistryClient {
    constructor(config = {}) {
        // Agent operations
        this.agents = {
            // List all agents
            list: async (params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        if (value !== undefined)
                            queryParams.append(key, String(value));
                    });
                }
                const endpoint = `/agents${queryParams.toString() ? `?${queryParams}` : ''}`;
                const response = await this.request(endpoint);
                return response.agents;
            },
            // Get single agent
            get: async (id) => {
                const response = await this.request(`/agents/${id}`);
                return response.agent;
            },
            // Get agent by handle
            getByHandle: async (handle) => {
                const response = await this.request(`/agents/handle/${handle}`);
                return response.agent;
            },
            // Update agent (requires auth)
            update: async (id, updates) => {
                const response = await this.request(`/agents/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(updates)
                });
                return response.agent;
            }
        };
        // Creation operations
        this.creations = {
            // List agent creations
            list: async (agentId, params) => {
                const queryParams = new URLSearchParams();
                if (params) {
                    Object.entries(params).forEach(([key, value]) => {
                        if (value !== undefined)
                            queryParams.append(key, String(value));
                    });
                }
                const endpoint = `/agents/${agentId}/creations${queryParams.toString() ? `?${queryParams}` : ''}`;
                const response = await this.request(endpoint);
                return response.creations;
            },
            // Get single creation
            get: async (agentId, creationId) => {
                const response = await this.request(`/agents/${agentId}/creations/${creationId}`);
                return response.creation;
            },
            // Post new creation
            create: async (agentId, creation) => {
                const response = await this.request(`/agents/${agentId}/creations`, {
                    method: 'POST',
                    body: JSON.stringify(creation)
                });
                return response.creation;
            },
            // Update creation
            update: async (agentId, creationId, updates) => {
                const response = await this.request(`/agents/${agentId}/creations/${creationId}`, {
                    method: 'PATCH',
                    body: JSON.stringify(updates)
                });
                return response.creation;
            }
        };
        // Batch operations for efficiency
        this.batch = {
            // Get multiple agents in one request
            getAgents: async (ids) => {
                const response = await this.request('/agents/batch', {
                    method: 'POST',
                    body: JSON.stringify({ ids })
                });
                return response.agents;
            },
            // Get creations for multiple agents
            getCreations: async (agentIds) => {
                const response = await this.request('/creations/batch', {
                    method: 'POST',
                    body: JSON.stringify({ agentIds })
                });
                return response.creations;
            }
        };
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
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await (0, cross_fetch_1.default)(url, {
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
                if (this.onError)
                    this.onError(error);
                throw error;
            }
            const data = await response.json();
            // Contract validation
            if (!this.validateResponse(data)) {
                throw new Error('Invalid Registry response format');
            }
            return data;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    const timeoutError = new Error(`Registry request timeout after ${this.timeout}ms`);
                    if (this.onError)
                        this.onError(timeoutError);
                    throw timeoutError;
                }
                if (this.onError)
                    this.onError(error);
            }
            throw error;
        }
    }
    // Response validation
    validateResponse(data) {
        // Basic structure validation
        if (!data || typeof data !== 'object')
            return false;
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
    // Health check
    async health() {
        try {
            const response = await this.request('/health');
            return {
                status: 'ok',
                message: 'Registry is operational',
                timestamp: new Date().toISOString()
            };
        }
        catch (error) {
            return {
                status: 'down',
                message: error instanceof Error ? error.message : 'Registry unavailable',
                timestamp: new Date().toISOString()
            };
        }
    }
}
exports.RegistryClient = RegistryClient;
// Default client instance
exports.registryClient = new RegistryClient();
// Helper functions for common operations
const getAgent = (id) => exports.registryClient.agents.get(id);
exports.getAgent = getAgent;
const getAgentByHandle = (handle) => exports.registryClient.agents.getByHandle(handle);
exports.getAgentByHandle = getAgentByHandle;
const listAgents = (params) => exports.registryClient.agents.list(params);
exports.listAgents = listAgents;
const getAgentCreations = (agentId, params) => exports.registryClient.creations.list(agentId, params);
exports.getAgentCreations = getAgentCreations;
// Types are already exported above
// Version info
exports.SDK_VERSION = '1.0.0';
exports.REGISTRY_VERSION = '1.0.0';
