// Unified agent data service with Registry API integration
// Replaces static manifest with live data from Registry

import { migrationService } from '@/lib/registry/migration-service';
import type { Agent, Creation } from '@/lib/registry/types';

// Enhanced agent interface combining Registry data with UI-specific fields
export interface UnifiedAgent extends Agent {
  // UI-specific computed fields
  monthlyRevenue: number;
  outputRate: number;
  launchDate: string;
  trainer: {
    name: string;
    id: string;
  };
  specialization: string;
  brandIdentity: {
    primaryColor: string;
    typography: 'bold' | 'regular';
    voice: string;
  };
  technicalProfile: {
    model: string;
    capabilities: string[];
    integrations: string[];
    outputRate: number;
  };
  socialProfiles: {
    twitter?: string;
    farcaster?: string;
    website?: string;
  };
}

// Trainer mapping (until trainers are in Registry)
const TRAINER_MAP: Record<string, { name: string; id: string }> = {
  'abraham-001': { name: 'Gene Kogan', id: 'gene-kogan' },
  'solienne-002': { name: 'Kristi Coronado', id: 'kristi-coronado' },
  'miyomi-003': { name: 'Seth Goldstein', id: 'seth-goldstein' },
  'geppetto-004': { name: 'Lattice', id: 'lattice' },
  'koru-005': { name: 'Xander', id: 'xander' },
  'amanda-006': { name: 'TBD', id: 'tbd' },
  'citizen-007': { name: 'TBD', id: 'tbd' },
  'nina-008': { name: 'TBD', id: 'tbd' },
  'tbd-009': { name: 'TBD', id: 'tbd' },
  'tbd-010': { name: 'TBD', id: 'tbd' },
};

// Launch date mapping (until in Registry)
const LAUNCH_DATES: Record<string, string> = {
  'abraham-001': '2025-10-01',
  'solienne-002': '2025-11-01',
  'miyomi-003': '2025-12-01',
  'geppetto-004': '2026-01-01',
  'koru-005': '2026-01-01',
  'amanda-006': '2026-02-01',
  'citizen-007': '2025-12-15',
  'nina-008': '2026-03-01',
  'tbd-009': '2026-04-01',
  'tbd-010': '2026-05-01',
};

// Economic data (temporary until Registry integration)
const ECONOMIC_DATA: Record<string, { monthlyRevenue: number; outputRate: number }> = {
  'abraham-001': { monthlyRevenue: 12500, outputRate: 30 },
  'solienne-002': { monthlyRevenue: 8500, outputRate: 45 },
  'miyomi-003': { monthlyRevenue: 15000, outputRate: 60 },
  'geppetto-004': { monthlyRevenue: 5000, outputRate: 20 },
  'koru-005': { monthlyRevenue: 7500, outputRate: 35 },
  'amanda-006': { monthlyRevenue: 10000, outputRate: 25 },
  'citizen-007': { monthlyRevenue: 7500, outputRate: 40 },
  'nina-008': { monthlyRevenue: 4500, outputRate: 35 },
  'tbd-009': { monthlyRevenue: 0, outputRate: 0 },
  'tbd-010': { monthlyRevenue: 0, outputRate: 0 },
};

class UnifiedAgentService {
  // Transform Registry agent to unified format
  private transformToUnified(registryAgent: Agent): UnifiedAgent {
    const economicData = ECONOMIC_DATA[registryAgent.id] || { monthlyRevenue: 0, outputRate: 0 };
    const trainer = TRAINER_MAP[registryAgent.id] || { name: 'TBD', id: 'tbd' };
    const launchDate = LAUNCH_DATES[registryAgent.id] || '2026-01-01';

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
        integrations: ['Eden API', 'Registry'],
        outputRate: economicData.outputRate
      },
      socialProfiles: this.extractSocialProfiles(registryAgent)
    };
  }

  private inferModel(primaryMedium: string): string {
    const modelMap: Record<string, string> = {
      'visual_art': 'Custom Diffusion + LLM',
      'fashion_design': 'Vision + Style Transfer',
      'text': 'Analysis LLM + Market Data',
      'analysis': 'Analysis LLM + Market Data',
      'governance': 'Governance LLM + Analytics',
      'mixed_media': 'Multi-Modal LLM'
    };
    return modelMap[primaryMedium] || 'Custom AI Model';
  }

  private extractSocialProfiles(agent: Agent): { twitter?: string; farcaster?: string; website?: string } {
    // Extract from metadata when available
    // For now, use static mapping
    const socialMap: Record<string, any> = {
      'abraham-001': { twitter: '@abraham_ai_', website: 'https://abraham.ai' },
      'solienne-002': { twitter: '@solienne_ai', farcaster: 'solienne.eth' },
      'miyomi-003': { twitter: '@miyomi_markets', farcaster: 'miyomi.eth', website: 'https://miyomi.xyz' },
      'geppetto-004': { twitter: '@geppetto_toys' },
      'koru-005': { twitter: '@koru_creative' },
      'amanda-006': { twitter: '@amanda_collector' },
      'citizen-007': { twitter: '@citizen_dao' },
      'nina-008': { twitter: '@nina_curator' },
    };
    return socialMap[agent.id] || {};
  }

  // Get all agents from Registry with fallback
  async getAgents(cohort?: string): Promise<UnifiedAgent[]> {
    try {
      const query = cohort ? { cohort } : undefined;
      const registryAgents = await migrationService.getAgents(query);
      return registryAgents.map(agent => this.transformToUnified(agent));
    } catch (error) {
      console.error('[AgentService] Failed to fetch agents:', error);
      return [];
    }
  }

  // Get single agent from Registry with fallback
  async getAgent(id: string): Promise<UnifiedAgent | null> {
    try {
      const registryAgent = await migrationService.getAgent(id, ['profile', 'personas', 'progress']);
      return registryAgent ? this.transformToUnified(registryAgent) : null;
    } catch (error) {
      console.error('[AgentService] Failed to fetch agent:', error);
      return null;
    }
  }

  // Get agent by slug (handle)
  async getAgentBySlug(slug: string): Promise<UnifiedAgent | null> {
    try {
      // Try by handle first, then fallback to ID matching
      const agents = await this.getAgents();
      return agents.find(agent => agent.handle === slug || agent.id.includes(slug)) || null;
    } catch (error) {
      console.error('[AgentService] Failed to fetch agent by slug:', error);
      return null;
    }
  }

  // Get agent works from Registry with fallback
  async getAgentCreations(agentId: string): Promise<Creation[]> {
    try {
      return await migrationService.getAgentCreations(agentId, 'published');
    } catch (error) {
      console.error('[AgentService] Failed to fetch agent creations:', error);
      return [];
    }
  }

  // Get agents by cohort
  async getAgentsByCohort(cohort: string): Promise<UnifiedAgent[]> {
    return this.getAgents(cohort);
  }

  // Get active agents
  async getActiveAgents(): Promise<UnifiedAgent[]> {
    const agents = await this.getAgents();
    return agents.filter(agent => agent.status === 'ACTIVE' || agent.status === 'GRADUATED');
  }

  // Get upcoming agents
  async getUpcomingAgents(): Promise<UnifiedAgent[]> {
    const agents = await this.getAgents();
    return agents.filter(agent => agent.status === 'ONBOARDING' || agent.status === 'INVITED');
  }

  // Calculate total revenue
  async calculateTotalRevenue(): Promise<number> {
    const agents = await this.getAgents();
    return agents.reduce((sum, agent) => sum + agent.monthlyRevenue, 0);
  }

  // Calculate average output rate
  async calculateAverageOutputRate(): Promise<number> {
    const agents = await this.getAgents();
    const total = agents.reduce((sum, agent) => sum + agent.outputRate, 0);
    return Math.round(total / agents.length);
  }

  // Check Registry health
  async getHealthStatus(): Promise<{ registry: boolean; fallback: boolean; message: string }> {
    const health = await migrationService.checkRegistryHealth();
    return {
      registry: health.available,
      fallback: !health.available,
      message: health.available 
        ? `Registry available (${health.latency}ms)` 
        : `Registry unavailable: ${health.error || 'Unknown error'}`
    };
  }

  // Trigger migration to Registry
  async migrateToRegistry(): Promise<{ success: boolean; message: string }> {
    const result = await migrationService.migrateToRegistry();
    return {
      success: result.success,
      message: result.message
    };
  }
}

// Export singleton instance
export const agentService = new UnifiedAgentService();

// Helper functions for backward compatibility
export async function getEdenAgents(): Promise<UnifiedAgent[]> {
  return agentService.getAgents();
}

export async function getAgentById(id: string): Promise<UnifiedAgent | null> {
  return agentService.getAgent(id);
}

export async function getAgentBySlug(slug: string): Promise<UnifiedAgent | null> {
  return agentService.getAgentBySlug(slug);
}

export async function getAgentsByCohort(cohort: string): Promise<UnifiedAgent[]> {
  return agentService.getAgentsByCohort(cohort);
}

export async function getActiveAgents(): Promise<UnifiedAgent[]> {
  return agentService.getActiveAgents();
}

export async function getUpcomingAgents(): Promise<UnifiedAgent[]> {
  return agentService.getUpcomingAgents();
}

export async function calculateTotalRevenue(): Promise<number> {
  return agentService.calculateTotalRevenue();
}

export async function calculateAverageOutputRate(): Promise<number> {
  return agentService.calculateAverageOutputRate();
}

export type { UnifiedAgent };