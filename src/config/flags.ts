/**
 * Feature Flag Configuration for Eden Academy
 * 
 * Hierarchical flag system for safe rollout of creative pipeline features
 * Aligned with existing Eden Academy architecture patterns
 */

export interface FeatureFlag {
  key: string;
  description: string;
  defaultValue: boolean;
  rolloutStrategy: 'off' | 'dev' | 'beta' | 'gradual' | 'full';
  dependencies?: string[];
  culturalImpact: string;
}

export interface CreativePipelineFlags {
  ENABLE_CREATIVE_PIPELINE: boolean;        // Master switch
  CREATIVE_PIPELINE_ASSESSMENT: boolean;    // Assessment system
  CREATOR_AGENT_ECONOMICS: boolean;         // Revenue sharing
  CREATOR_AGENT_LAUNCH: boolean;           // Agent spawning
  CREATIVE_PIPELINE_FULL: boolean;         // End-to-end pipeline
}

export const CREATIVE_PIPELINE_FLAGS: Record<keyof CreativePipelineFlags, FeatureFlag> = {
  ENABLE_CREATIVE_PIPELINE: {
    key: 'ENABLE_CREATIVE_PIPELINE',
    description: 'Enable creator onboarding and assessment pipeline',
    defaultValue: false,
    rolloutStrategy: 'gradual',
    culturalImpact: 'Introduces new creator pathway while maintaining Academy cultural values'
  },
  CREATIVE_PIPELINE_ASSESSMENT: {
    key: 'CREATIVE_PIPELINE_ASSESSMENT',
    description: 'Enable AI-assisted creative assessment system',
    defaultValue: false,
    rolloutStrategy: 'beta',
    dependencies: ['ENABLE_CREATIVE_PIPELINE'],
    culturalImpact: 'Provides supportive growth-oriented assessment aligned with Academy mission'
  },
  CREATOR_AGENT_ECONOMICS: {
    key: 'CREATOR_AGENT_ECONOMICS',
    description: 'Enable creator revenue sharing and economic validation',
    defaultValue: false,
    rolloutStrategy: 'beta',
    dependencies: ['CREATIVE_PIPELINE_ASSESSMENT'],
    culturalImpact: 'Ensures fair creator compensation within Eden ecosystem'
  },
  CREATOR_AGENT_LAUNCH: {
    key: 'CREATOR_AGENT_LAUNCH',
    description: 'Enable automated agent launching for qualified creators',
    defaultValue: false,
    rolloutStrategy: 'beta',
    dependencies: ['CREATOR_AGENT_ECONOMICS'],
    culturalImpact: 'Enables creator agent spawning with economic validation'
  },
  CREATIVE_PIPELINE_FULL: {
    key: 'CREATIVE_PIPELINE_FULL',
    description: 'Enable complete end-to-end creator pipeline',
    defaultValue: false,
    rolloutStrategy: 'beta',
    dependencies: ['CREATOR_AGENT_LAUNCH'],
    culturalImpact: 'Complete creator journey from submission to agent launch'
  }
};

/**
 * Feature Flag Evaluation with Environment Variable Override
 */
export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: Map<string, boolean> = new Map();

  private constructor() {
    this.initializeFlags();
  }

  static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  private initializeFlags(): void {
    // Load from environment variables with fallbacks
    Object.entries(CREATIVE_PIPELINE_FLAGS).forEach(([key, config]) => {
      const envValue = process.env[config.key];
      const isEnabled = envValue === 'true' || 
        (process.env.NODE_ENV === 'development' && config.defaultValue);
      
      this.flags.set(config.key, isEnabled);
    });
  }

  isEnabled(flagKey: keyof CreativePipelineFlags): boolean {
    const flag = CREATIVE_PIPELINE_FLAGS[flagKey];
    
    // Check dependencies first
    if (flag.dependencies) {
      const dependenciesEnabled = flag.dependencies.every(
        dep => this.flags.get(dep) === true
      );
      if (!dependenciesEnabled) {
        return false;
      }
    }

    return this.flags.get(flag.key) || false;
  }

  getFlagStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    Object.keys(CREATIVE_PIPELINE_FLAGS).forEach(key => {
      status[key] = this.isEnabled(key as keyof CreativePipelineFlags);
    });
    return status;
  }

  async validateRolloutSafety(): Promise<{ safe: boolean; warnings: string[] }> {
    const warnings: string[] = [];
    const currentFlags = this.getFlagStatus();
    
    // Check for unsafe flag combinations
    if (currentFlags.CREATIVE_PIPELINE_FULL && !currentFlags.CREATOR_AGENT_ECONOMICS) {
      warnings.push('Full pipeline enabled without economics validation - revenue sharing may fail');
    }
    
    if (currentFlags.CREATOR_AGENT_LAUNCH && !currentFlags.CREATIVE_PIPELINE_ASSESSMENT) {
      warnings.push('Agent launching enabled without assessment system - quality control compromised');
    }

    return {
      safe: warnings.length === 0,
      warnings
    };
  }
}

// Singleton instance export
export const featureFlags = FeatureFlagService.getInstance();

// Helper function for components
export function useFeatureFlag(flagKey: keyof CreativePipelineFlags): boolean {
  return featureFlags.isEnabled(flagKey);
}