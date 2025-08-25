/**
 * Creator Agent Economics Types & Schema
 * Phase 3: Revenue Impact Modeling & Agent Launch Integration
 * 
 * Extends the existing token economics to support creator-sourced agents
 * with enhanced revenue sharing and launch criteria integration
 */

import { CreativePipelineDatabase } from './creative-pipeline-database';

/**
 * Creator Agent Revenue Sharing Models
 */
export type CreatorRevenueModel = 
  | 'agent-originator'     // Enhanced share for agent creators
  | 'ongoing-trainer'      // Performance-based ongoing training
  | 'agent-collaborator'   // Project-based collaboration
  | 'creator-mentor';      // Academy mentorship compensation

/**
 * Enhanced database schema for creator agent economics
 */
export interface CreatorAgentEconomicsDatabase extends CreativePipelineDatabase {
  public: CreativePipelineDatabase['public'] & {
    Tables: CreativePipelineDatabase['public']['Tables'] & {
      
      creator_agent_contracts: {
        Row: {
          id: string;
          creator_profile_id: string;
          agent_id: string | null;
          revenue_model: CreatorRevenueModel;
          base_token_allocation: number; // Base agent tokens allocated
          enhanced_token_allocation: number; // Additional tokens for creators
          revenue_share_percentage: number; // Percentage of ongoing revenue
          performance_bonus_eligible: boolean;
          commitment_start_date: string;
          commitment_end_date: string | null;
          status: 'active' | 'completed' | 'terminated' | 'pending';
          contract_terms: any; // JSON with specific terms
          creator_wallet_address: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_profile_id: string;
          agent_id?: string | null;
          revenue_model: CreatorRevenueModel;
          base_token_allocation: number;
          enhanced_token_allocation?: number;
          revenue_share_percentage: number;
          performance_bonus_eligible?: boolean;
          commitment_start_date: string;
          commitment_end_date?: string | null;
          status?: 'active' | 'completed' | 'terminated' | 'pending';
          contract_terms?: any;
          creator_wallet_address: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_profile_id?: string;
          agent_id?: string | null;
          revenue_model?: CreatorRevenueModel;
          base_token_allocation?: number;
          enhanced_token_allocation?: number;
          revenue_share_percentage?: number;
          performance_bonus_eligible?: boolean;
          commitment_start_date?: string;
          commitment_end_date?: string | null;
          status?: 'active' | 'completed' | 'terminated' | 'pending';
          contract_terms?: any;
          creator_wallet_address?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      creator_agent_launch_criteria: {
        Row: {
          id: string;
          creator_profile_id: string;
          agent_id: string | null;
          demand_validation_score: number; // Enhanced score including creator audience
          retention_score: number; // Adjusted for creator community
          efficiency_score: number; // Modified for creator curation
          overall_score: number; // Combined score
          creator_audience_size: number;
          creator_engagement_rate: number;
          projected_month_1_revenue: number;
          projected_month_6_revenue: number;
          risk_assessment: 'low' | 'medium' | 'high';
          launch_readiness: boolean;
          validation_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_profile_id: string;
          agent_id?: string | null;
          demand_validation_score: number;
          retention_score: number;
          efficiency_score: number;
          overall_score: number;
          creator_audience_size: number;
          creator_engagement_rate: number;
          projected_month_1_revenue: number;
          projected_month_6_revenue: number;
          risk_assessment: 'low' | 'medium' | 'high';
          launch_readiness: boolean;
          validation_date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_profile_id?: string;
          agent_id?: string | null;
          demand_validation_score?: number;
          retention_score?: number;
          efficiency_score?: number;
          overall_score?: number;
          creator_audience_size?: number;
          creator_engagement_rate?: number;
          projected_month_1_revenue?: number;
          projected_month_6_revenue?: number;
          risk_assessment?: 'low' | 'medium' | 'high';
          launch_readiness?: boolean;
          validation_date?: string;
          notes?: string | null;
          created_at?: string;
        };
      };

      creator_revenue_distributions: {
        Row: {
          id: string;
          creator_contract_id: string;
          agent_id: string;
          distribution_period: string; // YYYY-MM format
          total_agent_revenue: number; // Total USDC revenue for the period
          creator_share_amount: number; // Creator's USDC share
          creator_share_percentage: number; // Effective percentage for this distribution
          performance_bonus_amount: number; // Additional bonus if applicable
          distribution_status: 'pending' | 'completed' | 'failed';
          transaction_hash: string | null;
          creator_wallet_address: string;
          distribution_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_contract_id: string;
          agent_id: string;
          distribution_period: string;
          total_agent_revenue: number;
          creator_share_amount: number;
          creator_share_percentage: number;
          performance_bonus_amount?: number;
          distribution_status?: 'pending' | 'completed' | 'failed';
          transaction_hash?: string | null;
          creator_wallet_address: string;
          distribution_date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_contract_id?: string;
          agent_id?: string;
          distribution_period?: string;
          total_agent_revenue?: number;
          creator_share_amount?: number;
          creator_share_percentage?: number;
          performance_bonus_amount?: number;
          distribution_status?: 'pending' | 'completed' | 'failed';
          transaction_hash?: string | null;
          creator_wallet_address?: string;
          distribution_date?: string;
          notes?: string | null;
          created_at?: string;
        };
      };

      creator_agent_performance_metrics: {
        Row: {
          id: string;
          creator_contract_id: string;
          agent_id: string;
          measurement_period: string; // YYYY-MM format
          agent_monthly_revenue: number;
          baseline_agent_revenue: number; // Comparable non-creator agent average
          revenue_enhancement_percentage: number;
          creator_engagement_hours: number; // Hours of documented collaboration
          cultural_alignment_score: number; // 0-100
          collector_retention_rate: number; // Percentage
          new_collector_acquisition: number; // Count of new collectors attributed to creator
          performance_tier: 'underperforming' | 'baseline' | 'enhanced' | 'exceptional';
          bonus_eligible: boolean;
          notes: string | null;
          measured_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_contract_id: string;
          agent_id: string;
          measurement_period: string;
          agent_monthly_revenue: number;
          baseline_agent_revenue: number;
          revenue_enhancement_percentage: number;
          creator_engagement_hours: number;
          cultural_alignment_score: number;
          collector_retention_rate: number;
          new_collector_acquisition: number;
          performance_tier: 'underperforming' | 'baseline' | 'enhanced' | 'exceptional';
          bonus_eligible: boolean;
          notes?: string | null;
          measured_at: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_contract_id?: string;
          agent_id?: string;
          measurement_period?: string;
          agent_monthly_revenue?: number;
          baseline_agent_revenue?: number;
          revenue_enhancement_percentage?: number;
          creator_engagement_hours?: number;
          cultural_alignment_score?: number;
          collector_retention_rate?: number;
          new_collector_acquisition?: number;
          performance_tier?: 'underperforming' | 'baseline' | 'enhanced' | 'exceptional';
          bonus_eligible?: boolean;
          notes?: string | null;
          measured_at?: string;
          created_at?: string;
        };
      };
    };
  };
}

/**
 * Creator agent contract terms interface
 */
export interface CreatorAgentContractTerms {
  // Revenue sharing model details
  revenueModel: {
    type: CreatorRevenueModel;
    baseSharePercentage: number;
    enhancedSharePercentage?: number;
    performanceBonusDetails?: {
      triggers: Array<{
        metric: string;
        threshold: number;
        bonusPercentage: number;
      }>;
      maxBonus: number;
    };
  };

  // Token allocation details
  tokenAllocation: {
    baseTokens: number;
    enhancedTokens?: number;
    vestingSchedule?: 'none' | 'linear' | 'milestone';
    vestingPeriod?: number; // months
  };

  // Creator commitment requirements
  commitments: {
    minimumEngagementHours: number; // per month
    promotionRequirements: string[];
    exclusivityPeriod?: number; // months
    culturalAlignmentMaintenance: boolean;
  };

  // Performance requirements
  performance: {
    minimumRevenueTargets: Array<{
      month: number;
      targetRevenue: number;
    }>;
    qualityMaintenance: {
      minimumCurationScore: number;
      culturalAlignmentThreshold: number;
    };
    reportingRequirements: string[];
  };

  // Termination conditions
  termination: {
    creatorInitiated: {
      noticePeriod: number; // days
      penalties?: string[];
    };
    performanceBased: {
      underperformancePeriod: number; // consecutive months
      revenueThreshold: number; // monthly minimum
    };
    platformInitiated: {
      culturalMisalignment: boolean;
      noticePeriod: number;
    };
  };
}

/**
 * Creator agent launch criteria interface
 */
export interface CreatorAgentLaunchCriteria {
  // Enhanced demand validation
  demandValidation: {
    standardRequirement: number; // $7,500 baseline
    creatorAudienceContribution: number;
    nonCreatorNetworkSales: number;
    crossPromotionEffectiveness: number;
    totalScore: number;
    passed: boolean;
  };

  // Creator-adjusted retention metrics  
  retentionMetrics: {
    standardRequirement: number; // 30% baseline
    creatorCommunityBonus: number;
    crossPlatformEngagement: number;
    culturalFitWeight: number;
    adjustedScore: number;
    passed: boolean;
  };

  // Creator-enhanced operational efficiency
  operationalEfficiency: {
    standardRequirement: {
      outputsPerMonth: number; // 45 baseline
      maxComputeCost: number; // $500 baseline
    };
    creatorEnhancements: {
      curatedOutputReduction: number;
      qualityPremiumAllowance: number;
      marketingEfficiencyBonus: number;
    };
    adjustedScore: number;
    passed: boolean;
  };
}

/**
 * Revenue enhancement calculation result
 */
export interface RevenueEnhancementAnalysis {
  baselineProjection: {
    month1: number;
    month6: number;
    month12: number;
  };
  
  creatorEnhancedProjection: {
    month1: number;
    month6: number;
    month12: number;
  };

  enhancementFactors: {
    audienceSize: number;
    brandAuthenticity: number;
    culturalResonance: number;
    marketingSynergy: number;
    overallMultiplier: number;
  };

  riskFactors: {
    creatorDependency: 'low' | 'medium' | 'high';
    revenueVolatility: 'low' | 'medium' | 'high';
    competitionRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
}

/**
 * Creator agent economic validation result
 */
export interface CreatorAgentEconomicValidation {
  launchCriteriaValidation: CreatorAgentLaunchCriteria;
  revenueEnhancementAnalysis: RevenueEnhancementAnalysis;
  contractTerms: CreatorAgentContractTerms;
  economicHealth: {
    spiritTokenImpact: 'positive' | 'neutral' | 'negative';
    ecosystemRevenueImpact: 'positive' | 'neutral' | 'negative';
    riskProfile: 'low' | 'medium' | 'high';
    recommendedLaunch: boolean;
  };
  validationDate: string;
  validatedBy: string; // Agent or system ID
  notes?: string;
}

/**
 * Database migration SQL for creator agent economics
 */
export const CREATOR_AGENT_ECONOMICS_MIGRATION_SQL = `
-- Creator Agent Contracts Table
CREATE TABLE IF NOT EXISTS creator_agent_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  agent_id UUID, -- References agents table when agent is launched
  revenue_model TEXT CHECK (revenue_model IN ('agent-originator', 'ongoing-trainer', 'agent-collaborator', 'creator-mentor')) NOT NULL,
  base_token_allocation BIGINT NOT NULL,
  enhanced_token_allocation BIGINT DEFAULT 0,
  revenue_share_percentage DECIMAL(5,2) NOT NULL,
  performance_bonus_eligible BOOLEAN DEFAULT false,
  commitment_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  commitment_end_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('active', 'completed', 'terminated', 'pending')) DEFAULT 'pending',
  contract_terms JSONB DEFAULT '{}',
  creator_wallet_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator Agent Launch Criteria Table
CREATE TABLE IF NOT EXISTS creator_agent_launch_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  agent_id UUID, -- References agents table when available
  demand_validation_score INTEGER CHECK (demand_validation_score >= 0 AND demand_validation_score <= 100) NOT NULL,
  retention_score INTEGER CHECK (retention_score >= 0 AND retention_score <= 100) NOT NULL,
  efficiency_score INTEGER CHECK (efficiency_score >= 0 AND efficiency_score <= 100) NOT NULL,
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100) NOT NULL,
  creator_audience_size INTEGER DEFAULT 0,
  creator_engagement_rate DECIMAL(5,2) DEFAULT 0,
  projected_month_1_revenue INTEGER DEFAULT 0,
  projected_month_6_revenue INTEGER DEFAULT 0,
  risk_assessment TEXT CHECK (risk_assessment IN ('low', 'medium', 'high')) DEFAULT 'medium',
  launch_readiness BOOLEAN DEFAULT false,
  validation_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator Revenue Distributions Table
CREATE TABLE IF NOT EXISTS creator_revenue_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_contract_id UUID NOT NULL REFERENCES creator_agent_contracts(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL, -- References agents table
  distribution_period TEXT NOT NULL, -- YYYY-MM format
  total_agent_revenue INTEGER NOT NULL, -- USDC cents
  creator_share_amount INTEGER NOT NULL, -- USDC cents  
  creator_share_percentage DECIMAL(5,2) NOT NULL,
  performance_bonus_amount INTEGER DEFAULT 0, -- USDC cents
  distribution_status TEXT CHECK (distribution_status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  transaction_hash TEXT,
  creator_wallet_address TEXT NOT NULL,
  distribution_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator Agent Performance Metrics Table  
CREATE TABLE IF NOT EXISTS creator_agent_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_contract_id UUID NOT NULL REFERENCES creator_agent_contracts(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL, -- References agents table
  measurement_period TEXT NOT NULL, -- YYYY-MM format
  agent_monthly_revenue INTEGER NOT NULL, -- USDC cents
  baseline_agent_revenue INTEGER NOT NULL, -- USDC cents
  revenue_enhancement_percentage DECIMAL(5,2) NOT NULL,
  creator_engagement_hours INTEGER DEFAULT 0,
  cultural_alignment_score INTEGER CHECK (cultural_alignment_score >= 0 AND cultural_alignment_score <= 100) DEFAULT 50,
  collector_retention_rate DECIMAL(5,2) DEFAULT 0,
  new_collector_acquisition INTEGER DEFAULT 0,
  performance_tier TEXT CHECK (performance_tier IN ('underperforming', 'baseline', 'enhanced', 'exceptional')) DEFAULT 'baseline',
  bonus_eligible BOOLEAN DEFAULT false,
  notes TEXT,
  measured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS creator_agent_contracts_creator_profile_id_idx ON creator_agent_contracts(creator_profile_id);
CREATE INDEX IF NOT EXISTS creator_agent_contracts_agent_id_idx ON creator_agent_contracts(agent_id);
CREATE INDEX IF NOT EXISTS creator_agent_contracts_status_idx ON creator_agent_contracts(status);

CREATE INDEX IF NOT EXISTS creator_agent_launch_criteria_creator_profile_id_idx ON creator_agent_launch_criteria(creator_profile_id);
CREATE INDEX IF NOT EXISTS creator_agent_launch_criteria_launch_readiness_idx ON creator_agent_launch_criteria(launch_readiness);

CREATE INDEX IF NOT EXISTS creator_revenue_distributions_creator_contract_id_idx ON creator_revenue_distributions(creator_contract_id);
CREATE INDEX IF NOT EXISTS creator_revenue_distributions_agent_id_idx ON creator_revenue_distributions(agent_id);
CREATE INDEX IF NOT EXISTS creator_revenue_distributions_period_idx ON creator_revenue_distributions(distribution_period);

CREATE INDEX IF NOT EXISTS creator_agent_performance_metrics_contract_id_idx ON creator_agent_performance_metrics(creator_contract_id);
CREATE INDEX IF NOT EXISTS creator_agent_performance_metrics_agent_id_idx ON creator_agent_performance_metrics(agent_id);
CREATE INDEX IF NOT EXISTS creator_agent_performance_metrics_period_idx ON creator_agent_performance_metrics(measurement_period);

-- Row Level Security (RLS)
ALTER TABLE creator_agent_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_agent_launch_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_revenue_distributions ENABLE ROW LEVEL SECURITY;  
ALTER TABLE creator_agent_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies (creators can only access their own data)
CREATE POLICY "Creators can view own contracts" ON creator_agent_contracts
  FOR SELECT USING (creator_profile_id IN (
    SELECT id FROM creator_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Creators can insert own contracts" ON creator_agent_contracts  
  FOR INSERT WITH CHECK (creator_profile_id IN (
    SELECT id FROM creator_profiles WHERE user_id = auth.uid()
  ));

-- Similar policies would be implemented for other tables...
`;

/**
 * Feature flag configuration for creator agent economics
 */
export const CREATOR_AGENT_ECONOMICS_FEATURE_FLAGS = {
  CREATOR_AGENT_ECONOMICS: {
    key: 'CREATOR_AGENT_ECONOMICS',
    description: 'Enable economic validation and revenue sharing for creator agents',
    defaultValue: false,
    rolloutStrategy: 'gradual',
    economicImpact: 'Introduces enhanced revenue sharing while preserving token health'
  },
  
  ENHANCED_REVENUE_SHARING: {
    key: 'ENHANCED_REVENUE_SHARING',
    description: 'Performance-based creator bonus system',
    defaultValue: false,
    rolloutStrategy: 'beta',
    economicImpact: 'Provides performance incentives for creator collaboration',
    dependencies: ['CREATOR_AGENT_ECONOMICS']
  },
  
  CREATOR_LAUNCH_CRITERIA: {
    key: 'CREATOR_LAUNCH_CRITERIA',
    description: 'Creator-specific agent launch validation',
    defaultValue: false,
    rolloutStrategy: 'beta',
    economicImpact: 'Adapts launch criteria for creator-agent partnerships'
  }
} as const;