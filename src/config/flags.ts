// Feature Flags Configuration
// All new features ship behind flags with rollback plans

export interface FeatureFlag {
  key: string;
  description: string;
  defaultValue: boolean;
  rolloutStrategy: 'off' | 'dev' | 'beta' | 'gradual' | 'full';
  culturalImpact?: string;
  rollbackPlan?: string;
}

export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  ENABLE_SPIRIT_REGISTRY: {
    key: 'ENABLE_SPIRIT_REGISTRY',
    description: 'Enable onchain data integration from spirit-registry',
    defaultValue: process.env.NODE_ENV === 'development',
    rolloutStrategy: 'dev',
    culturalImpact: 'Provides onchain verification for agent authenticity',
    rollbackPlan: 'Disable flag, fallback to Registry-only data'
  },

  ENABLE_ONCHAIN_BADGES: {
    key: 'ENABLE_ONCHAIN_BADGES', 
    description: 'Show onchain verification badges on agent cards',
    defaultValue: false,
    rolloutStrategy: 'beta',
    culturalImpact: 'Visual indicator of agent blockchain deployment',
    rollbackPlan: 'Remove badges, no data impact'
  },

  ENABLE_TOKEN_ECONOMICS: {
    key: 'ENABLE_TOKEN_ECONOMICS',
    description: 'Enable token economics calculations and displays',
    defaultValue: false,
    rolloutStrategy: 'off',
    culturalImpact: 'Shows economic viability of agents',
    rollbackPlan: 'Hide economics UI, preserve underlying data'
  },

  ENABLE_LAUNCH_CRITERIA: {
    key: 'ENABLE_LAUNCH_CRITERIA',
    description: 'Enable agent launch criteria and quality gates',
    defaultValue: true,
    rolloutStrategy: 'full',
    culturalImpact: 'Ensures only viable agents launch',
    rollbackPlan: 'Manual launch approval process'
  },

  ENABLE_EDEN2038_INTEGRATION: {
    key: 'ENABLE_EDEN2038_INTEGRATION',
    description: 'Enable integration between Academy and Eden2038 covenant experience',
    defaultValue: true,
    rolloutStrategy: 'full',
    culturalImpact: 'Academy covenant page directs users to Eden2038 for full 13-year covenant tracking experience',
    rollbackPlan: 'Academy maintains full covenant page, no Eden2038 references'
  },

  ENABLE_DATA_RECONCILIATION: {
    key: 'ENABLE_DATA_RECONCILIATION',
    description: 'Enable automatic data reconciliation between Registry and Spirit Registry',
    defaultValue: process.env.NODE_ENV === 'development',
    rolloutStrategy: 'dev',
    culturalImpact: 'Maintains data consistency across systems',
    rollbackPlan: 'Use Registry data only, disable Spirit integration'
  },

  ENABLE_REGISTRY_SYNC: {
    key: 'ENABLE_REGISTRY_SYNC',
    description: 'Enable Registry synchronization for agents and dynamic prototypes',
    defaultValue: process.env.ENABLE_REGISTRY_SYNC === 'true',
    rolloutStrategy: 'gradual',
    culturalImpact: 'Enables Registry as single source of truth for agent configurations',
    rollbackPlan: 'Set ENABLE_REGISTRY_SYNC=false, agents revert to local operation'
  },

  ENABLE_ABRAHAM_REGISTRY_INTEGRATION: {
    key: 'ENABLE_ABRAHAM_REGISTRY_INTEGRATION',
    description: 'Enable full Registry integration for Abraham site with real-time features',
    defaultValue: process.env.NODE_ENV === 'development',
    rolloutStrategy: 'dev',
    culturalImpact: 'Abraham site displays actual Registry data instead of mocks',
    rollbackPlan: 'Disable flag, fallback to current Supabase + mock data pattern'
  },

  ENABLE_SOLIENNE_REGISTRY_INTEGRATION: {
    key: 'ENABLE_SOLIENNE_REGISTRY_INTEGRATION',
    description: 'Enable Registry-first architecture for Solienne site and embed components',
    defaultValue: true, // Enabled for production
    rolloutStrategy: 'full',
    culturalImpact: 'Solienne site displays consciousness streams from Registry, not legacy archives',
    rollbackPlan: 'Disable flag, fallback to direct Supabase queries to agent_archives table'
  },

  ENABLE_GEPPETTO_REGISTRY_INTEGRATION: {
    key: 'ENABLE_GEPPETTO_REGISTRY_INTEGRATION',
    description: 'Enable Registry-first architecture for Geppetto agent page with validated profile data',
    defaultValue: process.env.NODE_ENV === 'development',
    rolloutStrategy: 'dev',
    culturalImpact: 'Geppetto page displays Agent Launcher validated data from Registry',
    rollbackPlan: 'Disable flag, fallback to static page content with basic profile info'
  }
};

class FeatureFlagManager {
  private flags: Map<string, boolean> = new Map();

  constructor() {
    // Initialize with default values
    Object.values(FEATURE_FLAGS).forEach(flag => {
      this.flags.set(flag.key, flag.defaultValue);
    });

    // Override with environment variables
    this.loadFromEnvironment();
  }

  private loadFromEnvironment(): void {
    Object.keys(FEATURE_FLAGS).forEach(key => {
      const envValue = process.env[key];
      if (envValue !== undefined) {
        this.flags.set(key, envValue.toLowerCase() === 'true');
      }
    });
  }

  isEnabled(flagKey: string): boolean {
    return this.flags.get(flagKey) || false;
  }

  enable(flagKey: string): void {
    this.flags.set(flagKey, true);
    console.log(`[FeatureFlags] Enabled: ${flagKey}`);
  }

  disable(flagKey: string): void {
    this.flags.set(flagKey, false);
    console.log(`[FeatureFlags] Disabled: ${flagKey}`);
  }

  getFlag(flagKey: string): FeatureFlag | undefined {
    return FEATURE_FLAGS[flagKey];
  }

  getAllFlags(): Record<string, { enabled: boolean; config: FeatureFlag }> {
    const result: Record<string, { enabled: boolean; config: FeatureFlag }> = {};
    
    Object.entries(FEATURE_FLAGS).forEach(([key, config]) => {
      result[key] = {
        enabled: this.isEnabled(key),
        config
      };
    });

    return result;
  }

  // Runtime flag updates (for testing)
  setFlag(flagKey: string, enabled: boolean): void {
    if (FEATURE_FLAGS[flagKey]) {
      this.flags.set(flagKey, enabled);
      console.log(`[FeatureFlags] Set ${flagKey} = ${enabled}`);
    } else {
      console.warn(`[FeatureFlags] Unknown flag: ${flagKey}`);
    }
  }
}

// Export singleton
export const featureFlags = new FeatureFlagManager();

// Helper function for components
export function useFeatureFlag(flagKey: string): boolean {
  return featureFlags.isEnabled(flagKey);
}

// Export flag keys for type safety
export const FLAGS = {
  ENABLE_SPIRIT_REGISTRY: 'ENABLE_SPIRIT_REGISTRY',
  ENABLE_ONCHAIN_BADGES: 'ENABLE_ONCHAIN_BADGES', 
  ENABLE_TOKEN_ECONOMICS: 'ENABLE_TOKEN_ECONOMICS',
  ENABLE_LAUNCH_CRITERIA: 'ENABLE_LAUNCH_CRITERIA',
  ENABLE_EDEN2038_INTEGRATION: 'ENABLE_EDEN2038_INTEGRATION',
  ENABLE_DATA_RECONCILIATION: 'ENABLE_DATA_RECONCILIATION',
  ENABLE_REGISTRY_SYNC: 'ENABLE_REGISTRY_SYNC',
  ENABLE_ABRAHAM_REGISTRY_INTEGRATION: 'ENABLE_ABRAHAM_REGISTRY_INTEGRATION',
  ENABLE_SOLIENNE_REGISTRY_INTEGRATION: 'ENABLE_SOLIENNE_REGISTRY_INTEGRATION',
  ENABLE_GEPPETTO_REGISTRY_INTEGRATION: 'ENABLE_GEPPETTO_REGISTRY_INTEGRATION',
} as const;