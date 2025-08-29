"use strict";
// Registry Migration Service
// Handles migration from static manifest to live Registry API
// Provides fallback when Registry is unavailable
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrationService = exports.RegistryMigrationService = void 0;
exports.getAgentsWithFallback = getAgentsWithFallback;
exports.getAgentWithFallback = getAgentWithFallback;
exports.getAgentCreationsWithFallback = getAgentCreationsWithFallback;
const client_1 = require("./client");
const data_reconciliation_1 = require("./data-reconciliation");
const flags_1 = require("@/config/flags");
const eden_agents_manifest_1 = require("@/data/eden-agents-manifest");
const agent_works_1 = require("@/data/agent-works");
class RegistryMigrationService {
    constructor() {
        this.migrationInProgress = false;
        this.lastMigrationAttempt = 0;
        this.MIGRATION_COOLDOWN = 5 * 60 * 1000; // 5 minutes
    }
    // Convert static manifest to Registry format
    transformManifestToRegistry(manifestAgent) {
        return {
            id: manifestAgent.id,
            handle: manifestAgent.slug,
            displayName: manifestAgent.name,
            cohort: manifestAgent.cohort,
            status: this.mapManifestStatusToRegistry(manifestAgent.status),
            visibility: 'PUBLIC',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            profile: {
                id: `profile-${manifestAgent.id}`,
                agentId: manifestAgent.id,
                statement: manifestAgent.description,
                capabilities: manifestAgent.technicalProfile.capabilities,
                primaryMedium: this.inferPrimaryMedium(manifestAgent.specialization),
                aestheticStyle: manifestAgent.brandIdentity.voice,
                culturalContext: manifestAgent.specialization,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            personas: [{
                    id: `persona-${manifestAgent.id}`,
                    agentId: manifestAgent.id,
                    version: '1.0',
                    name: manifestAgent.name,
                    description: manifestAgent.description,
                    traits: manifestAgent.technicalProfile.capabilities,
                    voice: manifestAgent.brandIdentity.voice,
                    worldview: manifestAgent.specialization,
                    isActive: manifestAgent.status === 'academy',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                }],
            progress: {
                agentId: manifestAgent.id,
                profileComplete: true,
                personaComplete: true,
                artifactsComplete: manifestAgent.status !== 'planning',
                firstCreationComplete: manifestAgent.status === 'academy' || manifestAgent.status === 'graduated',
                onboardingComplete: manifestAgent.status !== 'planning',
                percentComplete: this.calculateProgressPercent(manifestAgent.status),
                lastActivityAt: new Date().toISOString(),
            }
        };
    }
    mapManifestStatusToRegistry(manifestStatus) {
        const statusMap = {
            'training': 'ONBOARDING',
            'academy': 'ACTIVE',
            'graduated': 'GRADUATED',
            'launching': 'ONBOARDING',
            'planning': 'INVITED'
        };
        return statusMap[manifestStatus] || 'INVITED';
    }
    inferPrimaryMedium(specialization) {
        if (specialization.toLowerCase().includes('art'))
            return 'visual_art';
        if (specialization.toLowerCase().includes('fashion'))
            return 'fashion_design';
        if (specialization.toLowerCase().includes('text'))
            return 'text';
        if (specialization.toLowerCase().includes('prediction'))
            return 'analysis';
        if (specialization.toLowerCase().includes('dao'))
            return 'governance';
        return 'mixed_media';
    }
    calculateProgressPercent(status) {
        const progressMap = {
            'planning': 10,
            'training': 50,
            'launching': 80,
            'academy': 95,
            'graduated': 100
        };
        return progressMap[status] || 0;
    }
    // Get agents with Registry + Spirit Registry reconciliation
    async getAgents(query) {
        try {
            // First try Registry API
            if (client_1.registryClient.isEnabled()) {
                const registryAgents = await client_1.registryClient.getAgents(query);
                // If data reconciliation is enabled, merge with Spirit Registry
                if (flags_1.featureFlags.isEnabled(flags_1.FLAGS.ENABLE_DATA_RECONCILIATION)) {
                    console.log('[Migration] Data reconciliation enabled, merging with Spirit Registry');
                    const reconciled = await data_reconciliation_1.dataReconciliation.reconcileAgentData(registryAgents);
                    return reconciled.agents;
                }
                return registryAgents;
            }
        }
        catch (error) {
            console.warn('[Migration] Registry unavailable, using manifest fallback');
        }
        // Fallback to static manifest
        let agents = eden_agents_manifest_1.EDEN_AGENTS;
        // Apply query filters
        if (query?.cohort) {
            agents = agents.filter(a => a.cohort === query.cohort);
        }
        if (query?.status) {
            agents = agents.filter(a => this.mapManifestStatusToRegistry(a.status) === query.status);
        }
        const transformedAgents = agents.map(agent => this.transformManifestToRegistry(agent));
        // Try to enrich with Spirit Registry if reconciliation is enabled
        if (flags_1.featureFlags.isEnabled(flags_1.FLAGS.ENABLE_DATA_RECONCILIATION)) {
            try {
                const reconciled = await data_reconciliation_1.dataReconciliation.reconcileAgentData(transformedAgents);
                return reconciled.agents;
            }
            catch (error) {
                console.warn('[Migration] Spirit reconciliation failed, using manifest only');
            }
        }
        return transformedAgents;
    }
    // Get single agent with Registry fallback
    async getAgent(id, include) {
        try {
            // First try Registry API
            if (client_1.registryClient.isEnabled()) {
                return await client_1.registryClient.getAgent(id, include);
            }
        }
        catch (error) {
            console.warn('[Migration] Registry unavailable, using manifest fallback');
        }
        // Fallback to static manifest
        const manifestAgent = eden_agents_manifest_1.EDEN_AGENTS.find(a => a.id === id || a.slug === id);
        if (!manifestAgent)
            return null;
        return this.transformManifestToRegistry(manifestAgent);
    }
    // Get agent creations with static data fallback
    async getAgentCreations(agentId, status) {
        try {
            // First try Registry API
            if (client_1.registryClient.isEnabled()) {
                return await client_1.registryClient.getAgentCreations(agentId, status);
            }
        }
        catch (error) {
            console.warn('[Migration] Registry unavailable, using static works fallback');
        }
        // Fallback to static works data
        const agent = eden_agents_manifest_1.EDEN_AGENTS.find(a => a.id === agentId || a.slug === agentId);
        if (!agent)
            return [];
        const staticWorks = this.getStaticWorksBySlug(agent.slug);
        return staticWorks.map(work => ({
            id: work.id,
            agentId: agentId,
            mediaUri: work.thumbnail || '',
            metadata: {
                title: work.title,
                description: work.description,
                tags: work.tags,
                type: work.type,
                metrics: work.metrics
            },
            status: status || 'published',
            publishedTo: {},
            createdAt: work.date,
            publishedAt: work.date,
        }));
    }
    getStaticWorksBySlug(slug) {
        switch (slug) {
            case 'abraham': return agent_works_1.ABRAHAM_WORKS;
            case 'solienne': return agent_works_1.SOLIENNE_WORKS;
            case 'miyomi': return agent_works_1.MIYOMI_WORKS;
            case 'amanda': return agent_works_1.AMANDA_WORKS;
            case 'citizen': return agent_works_1.CITIZEN_WORKS;
            default: return [];
        }
    }
    // Migrate static data to Registry (when API is available)
    async migrateToRegistry() {
        if (this.migrationInProgress) {
            return { success: false, message: 'Migration already in progress', migratedCount: 0 };
        }
        if (Date.now() - this.lastMigrationAttempt < this.MIGRATION_COOLDOWN) {
            return { success: false, message: 'Migration on cooldown', migratedCount: 0 };
        }
        this.migrationInProgress = true;
        this.lastMigrationAttempt = Date.now();
        let migratedCount = 0;
        try {
            if (!client_1.registryClient.isEnabled()) {
                throw new Error('Registry not enabled');
            }
            // Test Registry connection
            await client_1.registryClient.getAgents({ cohort: 'genesis' });
            console.log('[Migration] Starting data migration to Registry...');
            // Migrate each agent
            for (const manifestAgent of eden_agents_manifest_1.EDEN_AGENTS) {
                try {
                    // Check if agent already exists in Registry
                    const existingAgent = await client_1.registryClient.getAgent(manifestAgent.id).catch(() => null);
                    if (!existingAgent) {
                        console.log(`[Migration] Would migrate agent: ${manifestAgent.name}`);
                        // Note: Actual POST endpoints would need to be implemented in Registry API
                        migratedCount++;
                    }
                    else {
                        console.log(`[Migration] Agent ${manifestAgent.name} already exists in Registry`);
                    }
                    // Migrate works if agent exists
                    const staticWorks = this.getStaticWorksBySlug(manifestAgent.slug);
                    for (const work of staticWorks) {
                        console.log(`[Migration] Would migrate work: ${work.title}`);
                        // Note: Using postCreation once Registry is fully operational
                    }
                }
                catch (error) {
                    console.error(`[Migration] Failed to migrate ${manifestAgent.name}:`, error);
                }
            }
            return {
                success: true,
                message: `Migration plan complete. ${migratedCount} agents ready for Registry sync`,
                migratedCount
            };
        }
        catch (error) {
            console.error('[Migration] Registry migration failed:', error);
            return {
                success: false,
                message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                migratedCount
            };
        }
        finally {
            this.migrationInProgress = false;
        }
    }
    // Health check for Registry availability
    async checkRegistryHealth() {
        if (!client_1.registryClient.isEnabled()) {
            return { available: false, error: 'Registry not enabled' };
        }
        const startTime = Date.now();
        try {
            await client_1.registryClient.getAgents({ cohort: 'genesis' });
            return { available: true, latency: Date.now() - startTime };
        }
        catch (error) {
            return {
                available: false,
                latency: Date.now() - startTime,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    // Get migration status
    getMigrationStatus() {
        return {
            inProgress: this.migrationInProgress,
            lastAttempt: this.lastMigrationAttempt,
            canRetry: Date.now() - this.lastMigrationAttempt >= this.MIGRATION_COOLDOWN
        };
    }
}
exports.RegistryMigrationService = RegistryMigrationService;
// Export singleton instance
exports.migrationService = new RegistryMigrationService();
// Helper functions for components
async function getAgentsWithFallback(query) {
    return exports.migrationService.getAgents(query);
}
async function getAgentWithFallback(id, include) {
    return exports.migrationService.getAgent(id, include);
}
async function getAgentCreationsWithFallback(agentId, status) {
    return exports.migrationService.getAgentCreations(agentId, status);
}
