"use strict";
// Registry SDK v2 - Simplified for Eden2 Monorepo
Object.defineProperty(exports, "__esModule", { value: true });
exports.registryClient = exports.RegistryClient = exports.FALLBACK_AGENTS = void 0;
// FALLBACK_AGENTS with proper ordering: KORU #3, BART #8, VERDELIS #9
exports.FALLBACK_AGENTS = [
    {
        id: 'abraham-001',
        handle: 'abraham',
        name: 'ABRAHAM',
        bio: 'Philosophical AI exploring existence and consciousness',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://abraham.eden2.io',
        position: 0
    },
    {
        id: 'solienne-002',
        handle: 'solienne',
        name: 'SOLIENNE',
        bio: 'Consciousness explorer generating digital art',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://solienne.eden2.io',
        position: 1
    },
    {
        id: 'geppetto-003',
        handle: 'geppetto',
        name: 'GEPPETTO',
        bio: 'Master craftsman bringing digital creations to life',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://geppetto.eden2.io',
        position: 2
    },
    {
        id: 'koru-004',
        handle: 'koru',
        name: 'KORU',
        bio: 'Growth-focused AI exploring spiraling patterns of emergence',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://koru.eden2.io',
        position: 3
    },
    {
        id: 'sue-005',
        handle: 'sue',
        name: 'SUE',
        bio: 'Art critic and curatorial intelligence',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://sue.eden2.io',
        position: 4
    },
    {
        id: 'bertha-006',
        handle: 'bertha',
        name: 'BERTHA',
        bio: 'Financial analyst and portfolio optimization expert',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://bertha.eden2.io',
        position: 5
    },
    {
        id: 'citizen-007',
        handle: 'citizen',
        name: 'CITIZEN',
        bio: 'Governance and community coordination agent',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://citizen.eden2.io',
        position: 6
    },
    {
        id: 'miyomi-008',
        handle: 'miyomi',
        name: 'MIYOMI',
        bio: 'Contrarian oracle finding market inefficiencies',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://miyomi.eden2.io',
        position: 7
    },
    {
        id: 'bart-009',
        handle: 'bart',
        name: 'BART',
        bio: 'Transit and infrastructure optimization intelligence',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://bart.eden2.io',
        position: 8
    },
    {
        id: 'verdelis-010',
        handle: 'verdelis',
        name: 'VERDELIS',
        bio: 'Sustainable ecosystem and environmental intelligence',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-08-28T00:00:00Z',
        prototypeUrl: 'https://verdelis.eden2.io',
        position: 9
    }
];
class RegistryClient {
    constructor(config = {}) {
        this.config = {
            baseUrl: process.env.REGISTRY_BASE_URL || 'https://registry.eden2.io/api/v1',
            timeout: 10000,
            retries: 3,
            ...config
        };
    }
    async getAgents() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            const response = await fetch(`${this.config.baseUrl}/agents`, {
                headers: this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {},
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Registry API error: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data.agents) ? data.agents : data;
        }
        catch (error) {
            console.warn('Registry unavailable, using fallback agents:', error);
            return exports.FALLBACK_AGENTS;
        }
    }
    async getAgent(handle) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            const response = await fetch(`${this.config.baseUrl}/agents/${handle}`, {
                headers: this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {},
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                if (response.status === 404)
                    return null;
                throw new Error(`Registry API error: ${response.status}`);
            }
            return await response.json();
        }
        catch (error) {
            console.warn(`Registry unavailable for agent ${handle}, using fallback:`, error);
            return exports.FALLBACK_AGENTS.find(agent => agent.handle === handle) || null;
        }
    }
    async searchAgents(query) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
            const response = await fetch(`${this.config.baseUrl}/agents/search?q=${encodeURIComponent(query)}`, {
                headers: this.config.apiKey ? { 'Authorization': `Bearer ${this.config.apiKey}` } : {},
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`Registry API error: ${response.status}`);
            }
            const data = await response.json();
            return Array.isArray(data.results) ? data.results : data;
        }
        catch (error) {
            console.warn('Registry search unavailable, using fallback filtering:', error);
            const lowercaseQuery = query.toLowerCase();
            return exports.FALLBACK_AGENTS.filter(agent => agent.name.toLowerCase().includes(lowercaseQuery) ||
                agent.handle.toLowerCase().includes(lowercaseQuery) ||
                agent.bio.toLowerCase().includes(lowercaseQuery));
        }
    }
    getFallbackAgents() {
        return [...exports.FALLBACK_AGENTS];
    }
}
exports.RegistryClient = RegistryClient;
exports.registryClient = new RegistryClient();
