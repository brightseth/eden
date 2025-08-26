// Registry Migration Service
// Handles migration from static manifest to live Registry API
// Provides fallback when Registry is unavailable

import { registryClient } from './client';
import { dataAdapter } from './adapter';
import { dataReconciliation, type ReconciledAgent } from './data-reconciliation';
import { featureFlags, FLAGS } from '@/config/flags';
import { EDEN_AGENTS, type EdenAgent } from '@/data/eden-agents-manifest';
import { ABRAHAM_WORKS, SOLIENNE_WORKS, MIYOMI_WORKS, AMANDA_WORKS, CITIZEN_WORKS } from '@/data/agent-works';
import type { Agent, Creation, AgentQuery } from './types';

export class RegistryMigrationService {
  private migrationInProgress = false;
  private lastMigrationAttempt = 0;
  private readonly MIGRATION_COOLDOWN = 5 * 60 * 1000; // 5 minutes

  // Convert static manifest to Registry format
  private transformManifestToRegistry(manifestAgent: EdenAgent): Agent {
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

  private mapManifestStatusToRegistry(manifestStatus: string): Agent['status'] {
    const statusMap: Record<string, Agent['status']> = {
      'training': 'ONBOARDING',
      'academy': 'ACTIVE',
      'graduated': 'GRADUATED',
      'launching': 'ONBOARDING',
      'planning': 'INVITED'
    };
    return statusMap[manifestStatus] || 'INVITED';
  }

  private inferPrimaryMedium(specialization: string): string {
    if (specialization.toLowerCase().includes('art')) return 'visual_art';
    if (specialization.toLowerCase().includes('fashion')) return 'fashion_design';
    if (specialization.toLowerCase().includes('text')) return 'text';
    if (specialization.toLowerCase().includes('prediction')) return 'analysis';
    if (specialization.toLowerCase().includes('dao')) return 'governance';
    return 'mixed_media';
  }

  private calculateProgressPercent(status: string): number {
    const progressMap: Record<string, number> = {
      'planning': 10,
      'training': 50,
      'launching': 80,
      'academy': 95,
      'graduated': 100
    };
    return progressMap[status] || 0;
  }

  // Get agents with Registry + Spirit Registry reconciliation
  async getAgents(query?: AgentQuery): Promise<Agent[] | ReconciledAgent[]> {
    try {
      // First try Registry API
      if (registryClient.isEnabled()) {
        const registryAgents = await registryClient.getAgents(query);
        
        // If data reconciliation is enabled, merge with Spirit Registry
        if (featureFlags.isEnabled(FLAGS.ENABLE_DATA_RECONCILIATION)) {
          console.log('[Migration] Data reconciliation enabled, merging with Spirit Registry');
          const reconciled = await dataReconciliation.reconcileAgentData(registryAgents);
          return reconciled.agents;
        }
        
        return registryAgents;
      }
    } catch (error) {
      console.warn('[Migration] Registry unavailable, using manifest fallback');
    }

    // Fallback to static manifest
    let agents = EDEN_AGENTS;
    
    // Apply query filters
    if (query?.cohort) {
      agents = agents.filter(a => a.cohort === query.cohort);
    }
    if (query?.status) {
      agents = agents.filter(a => this.mapManifestStatusToRegistry(a.status) === query.status);
    }

    const transformedAgents = agents.map(agent => this.transformManifestToRegistry(agent));
    
    // Try to enrich with Spirit Registry if reconciliation is enabled
    if (featureFlags.isEnabled(FLAGS.ENABLE_DATA_RECONCILIATION)) {
      try {
        const reconciled = await dataReconciliation.reconcileAgentData(transformedAgents);
        return reconciled.agents;
      } catch (error) {
        console.warn('[Migration] Spirit reconciliation failed, using manifest only');
      }
    }
    
    return transformedAgents;
  }

  // Get single agent with Registry fallback
  async getAgent(id: string, include?: string[]): Promise<Agent | null> {
    try {
      // First try Registry API
      if (registryClient.isEnabled()) {
        return await registryClient.getAgent(id, include);
      }
    } catch (error) {
      console.warn('[Migration] Registry unavailable, using manifest fallback');
    }

    // Fallback to static manifest
    const manifestAgent = EDEN_AGENTS.find(a => a.id === id || a.slug === id);
    if (!manifestAgent) return null;

    return this.transformManifestToRegistry(manifestAgent);
  }

  // Get agent creations with static data fallback
  async getAgentCreations(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]> {
    try {
      // First try Registry API
      if (registryClient.isEnabled()) {
        return await registryClient.getAgentCreations(agentId, status);
      }
    } catch (error) {
      console.warn('[Migration] Registry unavailable, using static works fallback');
    }

    // Fallback to static works data
    const agent = EDEN_AGENTS.find(a => a.id === agentId || a.slug === agentId);
    if (!agent) return [];

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

  private getStaticWorksBySlug(slug: string) {
    switch (slug) {
      case 'abraham': return ABRAHAM_WORKS;
      case 'solienne': return SOLIENNE_WORKS;
      case 'miyomi': return MIYOMI_WORKS;
      case 'amanda': return AMANDA_WORKS;
      case 'citizen': return CITIZEN_WORKS;
      default: return [];
    }
  }

  // Migrate static data to Registry (when API is available)
  async migrateToRegistry(): Promise<{ success: boolean; message: string; migratedCount: number }> {
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
      if (!registryClient.isEnabled()) {
        throw new Error('Registry not enabled');
      }

      // Test Registry connection
      await registryClient.getAgents({ cohort: 'genesis' });

      console.log('[Migration] Starting data migration to Registry...');

      // Migrate each agent
      for (const manifestAgent of EDEN_AGENTS) {
        try {
          // Check if agent already exists in Registry
          const existingAgent = await registryClient.getAgent(manifestAgent.id).catch(() => null);
          
          if (!existingAgent) {
            console.log(`[Migration] Would migrate agent: ${manifestAgent.name}`);
            // Note: Actual POST endpoints would need to be implemented in Registry API
            migratedCount++;
          } else {
            console.log(`[Migration] Agent ${manifestAgent.name} already exists in Registry`);
          }

          // Migrate works if agent exists
          const staticWorks = this.getStaticWorksBySlug(manifestAgent.slug);
          for (const work of staticWorks) {
            console.log(`[Migration] Would migrate work: ${work.title}`);
            // Note: Using postCreation once Registry is fully operational
          }

        } catch (error) {
          console.error(`[Migration] Failed to migrate ${manifestAgent.name}:`, error);
        }
      }

      return { 
        success: true, 
        message: `Migration plan complete. ${migratedCount} agents ready for Registry sync`, 
        migratedCount 
      };

    } catch (error) {
      console.error('[Migration] Registry migration failed:', error);
      return { 
        success: false, 
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        migratedCount 
      };
    } finally {
      this.migrationInProgress = false;
    }
  }

  // Health check for Registry availability
  async checkRegistryHealth(): Promise<{ available: boolean; latency?: number; error?: string }> {
    if (!registryClient.isEnabled()) {
      return { available: false, error: 'Registry not enabled' };
    }

    const startTime = Date.now();
    try {
      await registryClient.getAgents({ cohort: 'genesis' });
      return { available: true, latency: Date.now() - startTime };
    } catch (error) {
      return { 
        available: false, 
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get migration status
  getMigrationStatus(): { inProgress: boolean; lastAttempt: number; canRetry: boolean } {
    return {
      inProgress: this.migrationInProgress,
      lastAttempt: this.lastMigrationAttempt,
      canRetry: Date.now() - this.lastMigrationAttempt >= this.MIGRATION_COOLDOWN
    };
  }
}

// Export singleton instance
export const migrationService = new RegistryMigrationService();

// Helper functions for components
export async function getAgentsWithFallback(query?: AgentQuery): Promise<Agent[]> {
  return migrationService.getAgents(query);
}

export async function getAgentWithFallback(id: string, include?: string[]): Promise<Agent | null> {
  return migrationService.getAgent(id, include);
}

export async function getAgentCreationsWithFallback(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]> {
  return migrationService.getAgentCreations(agentId, status);
}