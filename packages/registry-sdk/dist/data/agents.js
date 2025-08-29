"use strict";
// Unified agent data service with Registry API integration
// Replaces static manifest with live data from Registry
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentService = void 0;
exports.getEdenAgents = getEdenAgents;
exports.getAgentById = getAgentById;
exports.getAgentBySlug = getAgentBySlug;
exports.getAgentsByCohort = getAgentsByCohort;
exports.getActiveAgents = getActiveAgents;
exports.getUpcomingAgents = getUpcomingAgents;
exports.calculateTotalRevenue = calculateTotalRevenue;
exports.calculateAverageOutputRate = calculateAverageOutputRate;
const client_1 = require("@/lib/registry/client");
// Trainer mapping (until trainers are in Registry)
const TRAINER_MAP = {
    'abraham-001': { name: 'Gene Kogan', id: 'gene-kogan' },
    'abraham': { name: 'Gene Kogan', id: 'gene-kogan' },
    'solienne-002': { name: 'Kristi Coronado', id: 'kristi-coronado' },
    'solienne': { name: 'Kristi Coronado', id: 'kristi-coronado' },
    'miyomi-003': { name: 'Seth Goldstein', id: 'seth-goldstein' },
    'miyomi': { name: 'Seth Goldstein', id: 'seth-goldstein' },
    'geppetto-004': { name: 'Martin Antiquel & Colin McBride', id: 'lattice-team' },
    'geppetto': { name: 'Martin Antiquel & Colin McBride', id: 'lattice-team' },
    'koru-005': { name: 'Xander', id: 'xander' },
    'koru': { name: 'Xander', id: 'xander' },
    'bertha-006': { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
    'bertha': { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
    'citizen-007': { name: 'Henry (Bright Moments)', id: 'henry-bright-moments' },
    'citizen': { name: 'Henry (Bright Moments)', id: 'henry-bright-moments' },
    'sue-008': { name: 'TBD', id: 'tbd' },
    'sue': { name: 'TBD', id: 'tbd' },
    'bart-009': { name: 'TBD', id: 'tbd' },
    'bart': { name: 'TBD', id: 'tbd' },
    'tbd-010': { name: 'TBD', id: 'tbd' },
};
// Launch date mapping (until in Registry)
const LAUNCH_DATES = {
    'abraham-001': '2025-10-01',
    'abraham': '2025-10-01',
    'solienne-002': '2025-11-01',
    'solienne': '2025-11-01',
    'miyomi-003': '2025-12-01',
    'miyomi': '2025-12-01',
    'geppetto-004': '2025-12-01',
    'geppetto': '2025-12-01',
    'koru-005': '2026-01-01',
    'koru': '2026-01-01',
    'bertha-006': '2026-02-01',
    'bertha': '2026-02-01',
    'citizen-007': '2025-12-15',
    'citizen': '2025-12-15',
    'sue-008': '2026-03-01',
    'sue': '2026-03-01',
    'bart-009': '2026-06-01',
    'bart': '2026-06-01',
    'tbd-010': '2026-05-01',
};
// Economic data (temporary until Registry integration)
const ECONOMIC_DATA = {
    'abraham-001': { monthlyRevenue: 12500, outputRate: 30 },
    'abraham': { monthlyRevenue: 12500, outputRate: 30 },
    'solienne-002': { monthlyRevenue: 8500, outputRate: 45 },
    'solienne': { monthlyRevenue: 8500, outputRate: 45 },
    'miyomi-003': { monthlyRevenue: 15000, outputRate: 60 },
    'miyomi': { monthlyRevenue: 15000, outputRate: 60 },
    'geppetto-004': { monthlyRevenue: 8500, outputRate: 25 },
    'geppetto': { monthlyRevenue: 8500, outputRate: 25 },
    'koru-005': { monthlyRevenue: 7500, outputRate: 35 },
    'koru': { monthlyRevenue: 7500, outputRate: 35 },
    'bertha-006': { monthlyRevenue: 12000, outputRate: 30 },
    'bertha': { monthlyRevenue: 12000, outputRate: 30 },
    'citizen-007': { monthlyRevenue: 8200, outputRate: 35 },
    'citizen': { monthlyRevenue: 8200, outputRate: 35 },
    'sue-008': { monthlyRevenue: 4500, outputRate: 35 },
    'sue': { monthlyRevenue: 4500, outputRate: 35 },
    'bart-009': { monthlyRevenue: 20000, outputRate: 35 },
    'bart': { monthlyRevenue: 20000, outputRate: 35 },
    'tbd-010': { monthlyRevenue: 0, outputRate: 0 },
};
// Claude SDK Status Tracking
const CLAUDE_SDK_STATUS = {
    'abraham-001': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'abraham': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'solienne-002': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'solienne': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'miyomi-003': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'miyomi': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'geppetto-004': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'geppetto': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'koru-005': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'koru': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'bertha-006': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'bertha': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'citizen-007': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'citizen': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'sue-008': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'sue': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'bart-009': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'bart': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
    'tbd-010': { hasClaudeSDK: false, hasEdenPlatform: false, dualInstantiation: false, registryIntegration: false },
};
class UnifiedAgentService {
    // Transform Registry agent to unified format
    transformToUnified(registryAgent) {
        // Use Registry data first, then fallback to static mappings
        const registryEconomic = registryAgent.profile?.economicData;
        const fallbackEconomic = ECONOMIC_DATA[registryAgent.handle] || ECONOMIC_DATA[registryAgent.id] || { monthlyRevenue: 0, outputRate: 0 };
        const economicData = registryEconomic || fallbackEconomic;
        const trainer = TRAINER_MAP[registryAgent.handle] || TRAINER_MAP[registryAgent.id] || { name: 'TBD', id: 'tbd' };
        const launchDate = LAUNCH_DATES[registryAgent.handle] || LAUNCH_DATES[registryAgent.id] || '2026-01-01';
        const sdkStatus = CLAUDE_SDK_STATUS[registryAgent.handle] || CLAUDE_SDK_STATUS[registryAgent.id] || {
            hasClaudeSDK: false,
            hasEdenPlatform: false,
            dualInstantiation: false,
            registryIntegration: false
        };
        return {
            ...registryAgent,
            monthlyRevenue: economicData.monthlyRevenue,
            outputRate: economicData.outputRate,
            launchDate,
            trainer,
            specialization: registryAgent.profile?.statement || 'Autonomous AI Agent',
            brandIdentity: {
                primaryColor: '#000000',
                typography: 'bold',
                voice: registryAgent.personas?.[0]?.voice || 'Professional, focused'
            },
            technicalProfile: {
                model: this.inferModel(registryAgent.profile?.primaryMedium || 'mixed_media'),
                capabilities: registryAgent.profile?.capabilities || ['AI Generation'],
                integrations: sdkStatus.hasClaudeSDK ? ['Eden API', 'Registry', 'Claude SDK'] : ['Eden API', 'Registry'],
                outputRate: economicData.outputRate
            },
            socialProfiles: this.extractSocialProfiles(registryAgent),
            claudeSDKStatus: {
                ...sdkStatus,
                lastSync: sdkStatus.registryIntegration ? new Date() : undefined
            }
        };
    }
    inferModel(primaryMedium) {
        const modelMap = {
            'visual_art': 'Custom Diffusion + LLM',
            'fashion_design': 'Vision + Style Transfer',
            'text': 'Analysis LLM + Market Data',
            'analysis': 'Analysis LLM + Market Data',
            'governance': 'Governance LLM + Analytics',
            'mixed_media': 'Multi-Modal LLM'
        };
        return modelMap[primaryMedium] || 'Custom AI Model';
    }
    extractSocialProfiles(agent) {
        // Extract from metadata when available
        // For now, use static mapping
        const socialMap = {
            'abraham-001': { twitter: '@abraham_ai_', website: 'https://abraham.ai' },
            'solienne-002': { twitter: '@solienne_ai', farcaster: 'solienne.eth' },
            'miyomi-003': { twitter: '@miyomi_markets', farcaster: 'miyomi.eth', website: 'https://miyomi.xyz' },
            'geppetto-004': { twitter: '@geppetto_lattice', website: 'https://lattice.xyz' },
            'koru-005': { twitter: '@koru_creative' },
            'bertha-006': { twitter: '@bertha_taste' },
            'bertha': { twitter: '@bertha_taste' },
            'citizen-007': { twitter: '@citizen_dao' },
            'sue-008': { twitter: '@sue_curator' },
            'bart-009': { twitter: '@bart_gondi', website: 'https://gondi.xyz', farcaster: 'bart' },
            'bart': { twitter: '@bart_gondi', website: 'https://gondi.xyz', farcaster: 'bart' },
        };
        return socialMap[agent.id] || {};
    }
    // Get all agents from Registry with fallback
    async getAgents(cohort) {
        try {
            const query = cohort ? { cohort } : undefined;
            const registryAgents = await client_1.registryClient.getAgents(query);
            return registryAgents.map(agent => this.transformToUnified(agent));
        }
        catch (error) {
            console.error('[AgentService] Failed to fetch agents:', error);
            return [];
        }
    }
    // Get single agent from Registry with fallback
    async getAgent(id) {
        try {
            const registryAgent = await client_1.registryClient.getAgent(id, ['profile', 'personas', 'progress']);
            return registryAgent ? this.transformToUnified(registryAgent) : null;
        }
        catch (error) {
            console.error('[AgentService] Failed to fetch agent:', error);
            return null;
        }
    }
    // Get agent by slug (handle)
    async getAgentBySlug(slug) {
        try {
            // Try by handle first, then fallback to ID matching
            const agents = await this.getAgents();
            return agents.find(agent => agent.handle === slug || agent.id.includes(slug)) || null;
        }
        catch (error) {
            console.error('[AgentService] Failed to fetch agent by slug:', error);
            return null;
        }
    }
    // Get agent works from Registry with fallback
    async getAgentCreations(agentId) {
        try {
            return await client_1.registryClient.getAgentCreations(agentId, 'published');
        }
        catch (error) {
            console.error('[AgentService] Failed to fetch agent creations:', error);
            return [];
        }
    }
    // Get agents by cohort
    async getAgentsByCohort(cohort) {
        return this.getAgents(cohort);
    }
    // Get active agents
    async getActiveAgents() {
        const agents = await this.getAgents();
        return agents.filter(agent => agent.status === 'ACTIVE' || agent.status === 'GRADUATED');
    }
    // Get upcoming agents
    async getUpcomingAgents() {
        const agents = await this.getAgents();
        return agents.filter(agent => agent.status === 'ONBOARDING' || agent.status === 'INVITED');
    }
    // Calculate total revenue
    async calculateTotalRevenue() {
        const agents = await this.getAgents();
        return agents.reduce((sum, agent) => sum + agent.monthlyRevenue, 0);
    }
    // Calculate average output rate
    async calculateAverageOutputRate() {
        const agents = await this.getAgents();
        const total = agents.reduce((sum, agent) => sum + agent.outputRate, 0);
        return Math.round(total / agents.length);
    }
    // Check Registry health
    async getHealthStatus() {
        try {
            const testCall = await client_1.registryClient.getAgents({ status: 'ACTIVE' });
            return {
                registry: true,
                fallback: false,
                message: `Registry available (${testCall.length} agents found)`
            };
        }
        catch (error) {
            return {
                registry: false,
                fallback: true,
                message: `Registry unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
    // Trigger migration to Registry
    async migrateToRegistry() {
        // Migration is now complete - Registry is the source of truth
        try {
            const agents = await client_1.registryClient.getAgents();
            return {
                success: true,
                message: `Registry integration complete. ${agents.length} agents available from Registry.`
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Registry integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
// Export singleton instance
exports.agentService = new UnifiedAgentService();
// Helper functions for backward compatibility
async function getEdenAgents() {
    return exports.agentService.getAgents();
}
async function getAgentById(id) {
    return exports.agentService.getAgent(id);
}
async function getAgentBySlug(slug) {
    return exports.agentService.getAgentBySlug(slug);
}
async function getAgentsByCohort(cohort) {
    return exports.agentService.getAgentsByCohort(cohort);
}
async function getActiveAgents() {
    return exports.agentService.getActiveAgents();
}
async function getUpcomingAgents() {
    return exports.agentService.getUpcomingAgents();
}
async function calculateTotalRevenue() {
    return exports.agentService.calculateTotalRevenue();
}
async function calculateAverageOutputRate() {
    return exports.agentService.calculateAverageOutputRate();
}
