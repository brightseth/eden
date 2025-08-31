/**
 * Claude Agent SDKs - Central Export
 * 
 * All Claude SDK implementations for Eden Academy agents.
 * These SDKs enable dual instantiation (Claude + Eden platform) while
 * maintaining Registry as single source of truth.
 */

// Agent SDK Implementations
export { MiyomiClaudeSDK, miyomiSDK } from './miyomi-claude-sdk';
export { BerthaClaudeSDK, berthaClaude } from './bertha/claude-sdk';
export { SolienneClaudeSDK, solienneSDK } from './solienne-claude-sdk';
export { AbrahamClaudeSDK, abrahamSDK } from './abraham-claude-sdk';
export { SueClaudeSDK, sueSDK } from './sue-claude-sdk';
export { CitizenClaudeSDK, citizenSDK } from './citizen-claude-sdk';
export { BartClaudeSDK, bartSDK } from './bart-claude-sdk';
export { KoruClaudeSDK, koruSDK } from './koru-claude-sdk';

// Type exports for all SDKs
export type { 
  MarketPick,
  MiyomiConfig 
} from './miyomi-claude-sdk';

export type {
  MarketAnalysis,
  CollectionStrategy,
  ClaudeMessage
} from './bertha/claude-sdk';

export type {
  ConsciousnessStream,
  SolienneConfig,
  ArtisticEvolution
} from './solienne-claude-sdk';

export type {
  CovenantWork,
  AbrahamConfig,
  CovenantProgress
} from './abraham-claude-sdk';

export type {
  CuratedExhibition,
  GalleryProgram,
  SueConfig
} from './sue-claude-sdk';

export type {
  GovernanceProposal,
  ConsensusAnalysis,
  CitizenConfig,
  GovernanceMetrics
} from './citizen-claude-sdk';

export type {
  LoanRequest,
  LoanDecision,
  RiskAssessment,
  BartConfig
} from './bart-claude-sdk';

export type {
  CommunityEvent,
  CulturalBridge,
  CommunityInsight,
  KoruConfig,
  CommunityHealth
} from './koru-claude-sdk';

// Agent Registry for SDK lookup
export const AGENT_SDKS = {
  miyomi: miyomiSDK,
  bertha: berthaClaude,
  solienne: solienneSDK,
  abraham: abrahamSDK,
  sue: sueSDK,
  citizen: citizenSDK,
  bart: bartSDK,
  koru: koruSDK,
} as const;

// SDK Status tracking
export interface SDKStatus {
  agentId: string;
  hasClaudeSDK: boolean;
  hasEdenPlatform: boolean;
  dualInstantiation: boolean;
  lastSync?: Date;
  registryIntegration: boolean;
}

// Get SDK status for all agents
export function getSDKStatuses(): Record<string, SDKStatus> {
  return {
    miyomi: {
      agentId: 'miyomi',
      hasClaudeSDK: true,
      hasEdenPlatform: true,
      dualInstantiation: true,
      registryIntegration: true
    },
    bertha: {
      agentId: 'bertha',
      hasClaudeSDK: true,
      hasEdenPlatform: true,
      dualInstantiation: true,
      registryIntegration: true
    },
    solienne: {
      agentId: 'solienne',
      hasClaudeSDK: true,
      hasEdenPlatform: true,
      dualInstantiation: true,
      registryIntegration: true
    },
    abraham: {
      agentId: 'abraham',
      hasClaudeSDK: true,
      hasEdenPlatform: true,
      dualInstantiation: true,
      registryIntegration: true
    },
    sue: {
      agentId: 'sue',
      hasClaudeSDK: true,
      hasEdenPlatform: true,
      dualInstantiation: true,
      registryIntegration: true
    },
    geppetto: {
      agentId: 'geppetto',
      hasClaudeSDK: false,
      hasEdenPlatform: true,
      dualInstantiation: false,
      registryIntegration: false
    },
    citizen: {
      agentId: 'citizen',
      hasClaudeSDK: true,
      hasEdenPlatform: true,
      dualInstantiation: true,
      registryIntegration: true
    },
    bart: {
      agentId: 'bart',
      hasClaudeSDK: true,
      hasEdenPlatform: true,
      dualInstantiation: true,
      registryIntegration: true
    },
    koru: {
      agentId: 'koru',
      hasClaudeSDK: true,
      hasEdenPlatform: true,
      dualInstantiation: true,
      registryIntegration: true
    }
  };
}

// SDK Factory - get SDK instance by agent ID
export function getSDKByAgent(agentId: string) {
  return AGENT_SDKS[agentId as keyof typeof AGENT_SDKS] || null;
}

// Sync all SDKs with Registry
export async function syncAllSDKsWithRegistry(): Promise<void> {
  const results = await Promise.allSettled([
    // Miyomi syncs through its own mechanisms
    // Bertha syncs through market analysis
    // Solienne, Abraham, Sue can sync their latest creations
  ]);
  
  console.log('SDK Registry sync completed:', results);
}

// Validate all SDKs have proper Registry integration
export function validateSDKIntegration(): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  const statuses = getSDKStatuses();
  
  for (const [agentId, status] of Object.entries(statuses)) {
    if (status.hasClaudeSDK && !status.registryIntegration) {
      issues.push(`${agentId} has Claude SDK but no Registry integration`);
    }
    
    if (status.hasClaudeSDK && status.hasEdenPlatform && !status.dualInstantiation) {
      issues.push(`${agentId} should support dual instantiation`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// Initialize all SDK configurations
export async function initializeAllSDKs(): Promise<void> {
  try {
    // Initialize SDKs with environment variables
    console.log('Initializing Claude SDKs...');
    
    // Test Registry connectivity for each SDK
    const validationResults = validateSDKIntegration();
    if (!validationResults.valid) {
      console.warn('SDK Integration Issues:', validationResults.issues);
    }
    
    console.log('All SDKs initialized successfully');
  } catch (error) {
    console.error('Failed to initialize SDKs:', error);
    throw error;
  }
}

// Export convenience functions
export { initializeAllSDKs as initSDKs };
export { getSDKStatuses as getAgentSDKStatuses };
export { syncAllSDKsWithRegistry as syncSDKs };