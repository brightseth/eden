// Unified agent data service with Registry API integration
// Replaces static manifest with live data from Registry

import { registryClient } from '@/lib/registry/client';
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
  // Claude SDK Integration Status
  claudeSDKStatus: {
    hasClaudeSDK: boolean;
    hasEdenPlatform: boolean;
    dualInstantiation: boolean;
    registryIntegration: boolean;
    sdkVersion?: string;
    lastSync?: Date;
  };
}

// Trainer mapping (until trainers are in Registry)
const TRAINER_MAP: Record<string, { name: string; id: string }> = {
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
  'amanda-006': { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
  'amanda': { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
  'bertha-006': { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
  'bertha': { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
  'citizen-007': { name: 'TBD', id: 'tbd' },
  'citizen': { name: 'TBD', id: 'tbd' },
  'sue-008': { name: 'TBD', id: 'tbd' },
  'sue': { name: 'TBD', id: 'tbd' },
  'tbd-009': { name: 'TBD', id: 'tbd' },
  'tbd-010': { name: 'TBD', id: 'tbd' },
};

// Launch date mapping (until in Registry)
const LAUNCH_DATES: Record<string, string> = {
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
  'amanda-006': '2026-02-01',
  'amanda': '2026-02-01',
  'bertha-006': '2026-02-01',
  'bertha': '2026-02-01',
  'citizen-007': '2025-12-15',
  'citizen': '2025-12-15',
  'sue-008': '2026-03-01',
  'sue': '2026-03-01',
  'tbd-009': '2026-04-01',
  'tbd-010': '2026-05-01',
};

// Economic data (temporary until Registry integration)
const ECONOMIC_DATA: Record<string, { monthlyRevenue: number; outputRate: number }> = {
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
  'amanda-006': { monthlyRevenue: 12000, outputRate: 30 },
  'amanda': { monthlyRevenue: 12000, outputRate: 30 },
  'bertha-006': { monthlyRevenue: 12000, outputRate: 30 },
  'bertha': { monthlyRevenue: 12000, outputRate: 30 },
  'citizen-007': { monthlyRevenue: 8200, outputRate: 35 },
  'citizen': { monthlyRevenue: 8200, outputRate: 35 },
  'sue-008': { monthlyRevenue: 4500, outputRate: 35 },
  'sue': { monthlyRevenue: 4500, outputRate: 35 },
  'tbd-009': { monthlyRevenue: 0, outputRate: 0 },
  'tbd-010': { monthlyRevenue: 0, outputRate: 0 },
};

// Claude SDK Status Tracking
const CLAUDE_SDK_STATUS: Record<string, {
  hasClaudeSDK: boolean;
  hasEdenPlatform: boolean;
  dualInstantiation: boolean;
  registryIntegration: boolean;
  sdkVersion?: string;
}> = {
  'abraham-001': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'abraham': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'solienne-002': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'solienne': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'miyomi-003': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'miyomi': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'geppetto-004': { hasClaudeSDK: false, hasEdenPlatform: true, dualInstantiation: false, registryIntegration: false },
  'geppetto': { hasClaudeSDK: false, hasEdenPlatform: true, dualInstantiation: false, registryIntegration: false },
  'koru-005': { hasClaudeSDK: false, hasEdenPlatform: false, dualInstantiation: false, registryIntegration: false },
  'koru': { hasClaudeSDK: false, hasEdenPlatform: false, dualInstantiation: false, registryIntegration: false },
  'amanda-006': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'amanda': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'bertha-006': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'bertha': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'citizen-007': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'citizen': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'sue-008': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'sue': { hasClaudeSDK: true, hasEdenPlatform: true, dualInstantiation: true, registryIntegration: true, sdkVersion: '1.0.0' },
  'tbd-009': { hasClaudeSDK: false, hasEdenPlatform: false, dualInstantiation: false, registryIntegration: false },
  'tbd-010': { hasClaudeSDK: false, hasEdenPlatform: false, dualInstantiation: false, registryIntegration: false },
};

class UnifiedAgentService {
  // Transform Registry agent to unified format
  private transformToUnified(registryAgent: Agent): UnifiedAgent {
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
      'geppetto-004': { twitter: '@geppetto_lattice', website: 'https://lattice.xyz' },
      'koru-005': { twitter: '@koru_creative' },
      'amanda-006': { twitter: '@amanda_collector', website: 'https://eden-academy-flame.vercel.app/academy/agent/amanda' },
      'bertha-006': { twitter: '@bertha_taste', website: 'https://eden-academy-flame.vercel.app/academy/agent/bertha' },
      'bertha': { twitter: '@bertha_taste', website: 'https://eden-academy-flame.vercel.app/academy/agent/bertha' },
      'amanda': { twitter: '@amanda_collector', website: 'https://eden-academy-flame.vercel.app/academy/agent/amanda' },
      'citizen-007': { twitter: '@citizen_dao', website: 'https://eden-academy-flame.vercel.app/sites/citizen' },
      'sue-008': { twitter: '@sue_curator' },
    };
    return socialMap[agent.id] || {};
  }

  // Get all agents from Registry with fallback
  async getAgents(cohort?: string): Promise<UnifiedAgent[]> {
    try {
      const query = cohort ? { cohort } : undefined;
      const registryAgents = await registryClient.getAgents(query);
      return registryAgents.map(agent => this.transformToUnified(agent));
    } catch (error) {
      console.error('[AgentService] Failed to fetch agents:', error);
      return [];
    }
  }

  // Get single agent from Registry with fallback
  async getAgent(id: string): Promise<UnifiedAgent | null> {
    try {
      const registryAgent = await registryClient.getAgent(id, ['profile', 'personas', 'progress']);
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
      return await registryClient.getAgentCreations(agentId, 'published');
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
    try {
      const testCall = await registryClient.getAgents({ status: 'ACTIVE' });
      return {
        registry: true,
        fallback: false,
        message: `Registry available (${testCall.length} agents found)`
      };
    } catch (error) {
      return {
        registry: false,
        fallback: true,
        message: `Registry unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Trigger migration to Registry
  async migrateToRegistry(): Promise<{ success: boolean; message: string }> {
    // Migration is now complete - Registry is the source of truth
    try {
      const agents = await registryClient.getAgents();
      return {
        success: true,
        message: `Registry integration complete. ${agents.length} agents available from Registry.`
      };
    } catch (error) {
      return {
        success: false,
        message: `Registry integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
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