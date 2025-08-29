"use strict";
// Data Reconciliation Service
// Merges Registry (authoritative) with Spirit Registry (supplemental) data
// Implements conflict resolution rules defined in ADR-020
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataReconciliation = exports.DataReconciliationService = void 0;
const spirit_client_1 = require("./spirit-client");
class DataReconciliationService {
    constructor() {
        this.conflicts = [];
    }
    async reconcileAgentData(registryAgents) {
        this.conflicts = [];
        const startTime = Date.now();
        try {
            console.log('[Reconciliation] Starting data reconciliation...');
            // Try to fetch Spirit Registry data
            const spiritResponse = await spirit_client_1.spiritClient.getGenesisCohort();
            const spiritAgents = spiritResponse.agents;
            console.log(`[Reconciliation] Found ${spiritAgents.length} agents in Spirit Registry`);
            // Reconcile each Registry agent with Spirit data
            const reconciledAgents = registryAgents.map(registryAgent => {
                const spiritAgent = spiritAgents.find(s => s.id === registryAgent.id ||
                    s.id === registryAgent.handle);
                if (spiritAgent) {
                    return this.mergeAgentData(registryAgent, spiritAgent);
                }
                // No Spirit data available for this agent
                return {
                    ...registryAgent,
                    onchain: null,
                    dataSource: 'registry'
                };
            });
            return {
                agents: reconciledAgents,
                meta: {
                    total: reconciledAgents.length,
                    spiritDataAvailable: true,
                    lastSyncAt: new Date().toISOString(),
                    conflicts: this.conflicts.length > 0 ? this.conflicts : undefined
                }
            };
        }
        catch (error) {
            console.warn('[Reconciliation] Spirit Registry unavailable, using Registry data only:', error);
            // Fallback to Registry-only data
            const fallbackAgents = registryAgents.map(agent => ({
                ...agent,
                onchain: null,
                dataSource: 'fallback'
            }));
            return {
                agents: fallbackAgents,
                meta: {
                    total: fallbackAgents.length,
                    spiritDataAvailable: false,
                    lastSyncAt: new Date().toISOString()
                }
            };
        }
    }
    mergeAgentData(registryAgent, spiritAgent) {
        // Registry data takes precedence for core fields
        // Spirit data adds onchain supplemental information
        const reconciledAgent = {
            ...registryAgent, // Registry is authoritative for core data
            onchain: spiritAgent.onchain || null,
            lastSyncAt: new Date().toISOString(),
            dataSource: 'registry+spirit'
        };
        // Check for conflicts and resolve them
        this.resolveConflicts(registryAgent, spiritAgent);
        return reconciledAgent;
    }
    resolveConflicts(registryAgent, spiritAgent) {
        // Define fields where conflicts might occur
        const conflictFields = ['name', 'status', 'worksCount'];
        for (const field of conflictFields) {
            const registryValue = registryAgent[field];
            const spiritValue = spiritAgent[field];
            if (registryValue !== undefined && spiritValue !== undefined && registryValue !== spiritValue) {
                const conflict = {
                    agentId: registryAgent.id,
                    field,
                    registryValue,
                    spiritValue,
                    resolution: this.getConflictResolution(field)
                };
                this.conflicts.push(conflict);
                console.log(`[Reconciliation] Conflict detected for ${registryAgent.id}.${field}: Registry="${registryValue}" vs Spirit="${spiritValue}" -> ${conflict.resolution}`);
            }
        }
    }
    getConflictResolution(field) {
        // Define resolution strategy per field
        const resolutionRules = {
            'name': 'registry_wins', // Registry name is authoritative
            'status': 'registry_wins', // Registry status is authoritative  
            'description': 'registry_wins', // Registry description is authoritative
            'worksCount': 'merge', // Could merge or compare
            'trainer': 'registry_wins', // Registry trainer info is authoritative
        };
        return resolutionRules[field] || 'registry_wins';
    }
    // Get onchain data for a specific agent
    async getAgentOnchainData(agentId) {
        try {
            return await spirit_client_1.spiritClient.getAgentOnchainData(agentId);
        }
        catch (error) {
            console.warn(`[Reconciliation] Failed to get onchain data for ${agentId}:`, error);
            return null;
        }
    }
    // Health check for reconciliation service
    async healthCheck() {
        const spiritHealth = await spirit_client_1.spiritClient.healthCheck();
        return {
            reconciliationAvailable: spiritHealth.available,
            spiritRegistryHealth: spiritHealth
        };
    }
    // Get reconciliation statistics
    getStats() {
        return {
            conflictsDetected: this.conflicts.length,
            lastReconciliation: new Date().toISOString()
        };
    }
}
exports.DataReconciliationService = DataReconciliationService;
// Export singleton
exports.dataReconciliation = new DataReconciliationService();
