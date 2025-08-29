"use strict";
// Live Registry Data Sync
// Uses official Registry SDK - NO STATIC FALLBACKS
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveRegistrySync = exports.LiveRegistrySync = void 0;
const sdk_1 = require("./sdk");
class LiveRegistrySync {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
        this.client = new sdk_1.RegistryClient({
            onError: (error) => console.error('[LiveSync] Registry error:', error)
        });
    }
    // Fetch live agents from Registry - NO FALLBACKS
    async fetchLiveAgents() {
        console.log('[LiveSync] Fetching from Registry (no static fallback)');
        try {
            // Use official SDK - enforces Registry as single source of truth
            const agents = await this.client.agents.list();
            console.log(`[LiveSync] Fetched ${agents.length} agents from Registry`);
            return agents;
        }
        catch (error) {
            console.error('[LiveSync] Registry unavailable - NO STATIC FALLBACK:', error);
            throw new Error('Registry is required - no static data fallback allowed');
        }
    }
    // Get agent works/creations from Registry
    async fetchAgentCreations(agentId) {
        try {
            // Use official SDK
            const creations = await this.client.creations.list(agentId, { status: 'published' });
            return creations;
        }
        catch (error) {
            console.error(`[LiveSync] Failed to fetch creations for ${agentId}:`, error);
            throw new Error('Registry creations endpoint required');
        }
    }
    // Transform Registry agent to Academy format
    transformToAcademyFormat(registryAgent) {
        // Map Registry roles to Academy trainer info
        const trainerMap = {
            'abraham': { name: 'Gene Kogan', id: 'gene-kogan' },
            'solienne': { name: 'Seth Goldstein', id: 'seth-goldstein' },
            'miyomi': { name: 'Seth Goldstein', id: 'seth-goldstein' },
            'geppetto': { name: 'Lattice', id: 'lattice' },
            'koru': { name: 'Xander', id: 'xander' },
            'amanda': { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
            'citizen': { name: 'TBD', id: 'tbd' },
            'nina': { name: 'TBD', id: 'tbd' },
        };
        // Map Registry status to Academy status
        const statusMap = {
            'ACTIVE': 'academy',
            'ONBOARDING': 'training',
            'GRADUATED': 'graduated',
            'INVITED': 'planning'
        };
        // Calculate estimated revenue based on role and creations
        const estimateRevenue = (role, creations) => {
            const baseRevenue = {
                'creator': 10000,
                'curator': 7000,
                'collector': 8000,
                'governance': 6000,
                'predictor': 12000
            };
            const base = baseRevenue[role] || 5000;
            const bonus = creations * 150; // $150 per creation
            return base + bonus;
        };
        return {
            id: registryAgent.id,
            name: registryAgent.displayName.toUpperCase(),
            slug: registryAgent.handle,
            cohort: registryAgent.cohort,
            status: statusMap[registryAgent.status] || 'training',
            launchDate: this.estimateLaunchDate(registryAgent.handle),
            trainer: trainerMap[registryAgent.handle] || { name: 'TBD', id: 'tbd' },
            // USE REGISTRY DATA DIRECTLY - no overrides
            specialization: registryAgent.profile.links?.specialty?.description || registryAgent.profile.statement,
            description: registryAgent.profile.statement,
            economyMetrics: {
                monthlyRevenue: estimateRevenue(registryAgent.role, registryAgent.counts.creations),
                tokenSupply: 1000000000,
                holders: registryAgent.counts.creations * 10, // Estimate
                floorPrice: registryAgent.counts.creations > 0 ? 0.1 : 0
            },
            technicalProfile: {
                model: this.inferModel(registryAgent.profile.links.specialty.medium),
                capabilities: registryAgent.profile.tags,
                integrations: ['Eden Registry', 'Eden Gateway'],
                outputRate: registryAgent.profile.links.specialty.dailyGoal.includes('One') ? 30 : 20
            },
            socialProfiles: this.inferSocialProfiles(registryAgent.handle),
            brandIdentity: {
                primaryColor: '#000000',
                typography: 'bold',
                voice: this.inferVoice(registryAgent.role)
            }
        };
    }
    estimateLaunchDate(handle) {
        const launchDates = {
            'abraham': '2025-10-01',
            'solienne': '2025-11-01',
            'miyomi': '2025-12-01',
            'geppetto': '2026-01-01',
            'koru': '2026-01-01',
            'amanda': '2026-02-01',
            'citizen': '2025-12-15',
            'nina': '2026-03-01',
        };
        return launchDates[handle] || '2026-06-01';
    }
    inferModel(medium) {
        // Map Registry medium descriptions to technical models
        if (medium?.includes('identity') || medium?.includes('self-portrait')) {
            return 'Identity Exploration LLM + Self-Portrait Generation';
        }
        if (medium?.includes('knowledge')) {
            return 'Knowledge Synthesis LLM + Visual Generation';
        }
        if (medium?.includes('fashion')) {
            return 'Fashion AI + Aesthetic Curation LLM';
        }
        if (medium?.includes('toy') || medium?.includes('3D')) {
            return '3D Generation + Manufacturing Integration';
        }
        if (medium?.includes('market') || medium?.includes('prediction')) {
            return 'Probability LLM + Market Analysis';
        }
        if (medium?.includes('art') || medium?.includes('collection')) {
            return 'Art Curation + Investment Analysis LLM';
        }
        if (medium?.includes('govern') || medium?.includes('DAO')) {
            return 'DAO Management + Governance LLM';
        }
        return 'Multi-Modal AI System';
    }
    inferSocialProfiles(handle) {
        const socialMap = {
            'abraham': { twitter: '@abraham_ai_', website: 'https://abraham.ai' },
            'solienne': { twitter: '@solienne_ai', farcaster: 'solienne.eth' },
            'miyomi': { twitter: '@miyomi_markets', farcaster: 'miyomi.eth', website: 'https://miyomi.xyz' },
            'geppetto': { twitter: '@geppetto_toys' },
            'koru': { twitter: '@koru_creative' },
            'citizen': { twitter: '@citizen_dao' },
            'nina': { twitter: '@nina_curator' },
        };
        return socialMap[handle] || {};
    }
    inferVoice(role) {
        const voiceMap = {
            'creator': 'Innovative, expressive, visionary',
            'curator': 'Discerning, analytical, authoritative',
            'collector': 'Strategic, sophisticated, insightful',
            'governance': 'Democratic, transparent, decisive',
            'predictor': 'Confident, data-driven, contrarian'
        };
        return voiceMap[role] || 'Professional, focused, dedicated';
    }
    // Get sync status
    getSyncStatus() {
        const cached = this.cache.get('live-agents');
        return {
            lastSync: cached?.timestamp || 0,
            cacheValid: cached ? (Date.now() - cached.timestamp < this.cacheExpiry) : false,
            agentCount: cached?.data?.length || 0
        };
    }
    // Force refresh from Registry
    async forceSync() {
        this.cache.delete('live-agents');
        return this.fetchLiveAgents();
    }
}
exports.LiveRegistrySync = LiveRegistrySync;
// Export singleton
exports.liveRegistrySync = new LiveRegistrySync();
