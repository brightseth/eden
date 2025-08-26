// Data Reconciliation Service
// Merges Registry (authoritative) with Spirit Registry (supplemental) data
// Implements conflict resolution rules defined in ADR-020

import { spiritClient, type OnchainData, type SpiritAgent } from './spirit-client';
import type { Agent } from './types';

interface ReconciledAgent extends Agent {
  onchain?: OnchainData | null;
  lastSyncAt?: string;
  dataSource: 'registry' | 'registry+spirit' | 'fallback';
}

interface ReconciliationResult {
  agents: ReconciledAgent[];
  meta: {
    total: number;
    spiritDataAvailable: boolean;
    lastSyncAt: string;
    conflicts?: ReconciliationConflict[];
  };
}

interface ReconciliationConflict {
  agentId: string;
  field: string;
  registryValue: any;
  spiritValue: any;
  resolution: 'registry_wins' | 'merge' | 'skip';
}

export class DataReconciliationService {
  private conflicts: ReconciliationConflict[] = [];

  async reconcileAgentData(registryAgents: Agent[]): Promise<ReconciliationResult> {
    this.conflicts = [];
    const startTime = Date.now();

    try {
      console.log('[Reconciliation] Starting data reconciliation...');
      
      // Try to fetch Spirit Registry data
      const spiritResponse = await spiritClient.getGenesisCohort();
      const spiritAgents = spiritResponse.agents;
      
      console.log(`[Reconciliation] Found ${spiritAgents.length} agents in Spirit Registry`);

      // Reconcile each Registry agent with Spirit data
      const reconciledAgents: ReconciledAgent[] = registryAgents.map(registryAgent => {
        const spiritAgent = spiritAgents.find(s => 
          s.id === registryAgent.id || 
          s.id === registryAgent.handle
        );

        if (spiritAgent) {
          return this.mergeAgentData(registryAgent, spiritAgent);
        }

        // No Spirit data available for this agent
        return {
          ...registryAgent,
          onchain: null,
          dataSource: 'registry' as const
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

    } catch (error) {
      console.warn('[Reconciliation] Spirit Registry unavailable, using Registry data only:', error);
      
      // Fallback to Registry-only data
      const fallbackAgents: ReconciledAgent[] = registryAgents.map(agent => ({
        ...agent,
        onchain: null,
        dataSource: 'fallback' as const
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

  private mergeAgentData(registryAgent: Agent, spiritAgent: SpiritAgent): ReconciledAgent {
    // Registry data takes precedence for core fields
    // Spirit data adds onchain supplemental information
    
    const reconciledAgent: ReconciledAgent = {
      ...registryAgent, // Registry is authoritative for core data
      onchain: spiritAgent.onchain || null,
      lastSyncAt: new Date().toISOString(),
      dataSource: 'registry+spirit'
    };

    // Check for conflicts and resolve them
    this.resolveConflicts(registryAgent, spiritAgent);

    return reconciledAgent;
  }

  private resolveConflicts(registryAgent: Agent, spiritAgent: SpiritAgent): void {
    // Define fields where conflicts might occur
    const conflictFields = ['name', 'status', 'worksCount'];

    for (const field of conflictFields) {
      const registryValue = (registryAgent as any)[field];
      const spiritValue = (spiritAgent as any)[field];

      if (registryValue !== undefined && spiritValue !== undefined && registryValue !== spiritValue) {
        const conflict: ReconciliationConflict = {
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

  private getConflictResolution(field: string): 'registry_wins' | 'merge' | 'skip' {
    // Define resolution strategy per field
    const resolutionRules: Record<string, 'registry_wins' | 'merge' | 'skip'> = {
      'name': 'registry_wins',        // Registry name is authoritative
      'status': 'registry_wins',      // Registry status is authoritative  
      'description': 'registry_wins', // Registry description is authoritative
      'worksCount': 'merge',          // Could merge or compare
      'trainer': 'registry_wins',     // Registry trainer info is authoritative
    };

    return resolutionRules[field] || 'registry_wins';
  }

  // Get onchain data for a specific agent
  async getAgentOnchainData(agentId: string): Promise<OnchainData | null> {
    try {
      return await spiritClient.getAgentOnchainData(agentId);
    } catch (error) {
      console.warn(`[Reconciliation] Failed to get onchain data for ${agentId}:`, error);
      return null;
    }
  }

  // Health check for reconciliation service
  async healthCheck(): Promise<{
    reconciliationAvailable: boolean;
    spiritRegistryHealth: { available: boolean; latency?: number; error?: string };
  }> {
    const spiritHealth = await spiritClient.healthCheck();
    
    return {
      reconciliationAvailable: spiritHealth.available,
      spiritRegistryHealth: spiritHealth
    };
  }

  // Get reconciliation statistics
  getStats(): {
    conflictsDetected: number;
    lastReconciliation?: string;
  } {
    return {
      conflictsDetected: this.conflicts.length,
      lastReconciliation: new Date().toISOString()
    };
  }
}

// Export singleton
export const dataReconciliation = new DataReconciliationService();

// Type exports
export type { ReconciledAgent, ReconciliationResult, ReconciliationConflict };