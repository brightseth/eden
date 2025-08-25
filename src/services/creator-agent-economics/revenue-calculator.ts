/**
 * Creator Agent Revenue Sharing Calculator
 * Phase 3: Revenue Impact Modeling & Agent Launch Integration
 * 
 * Handles revenue distribution calculations for creator-sourced agents
 * with performance bonuses and enhanced sharing models
 */

import { 
  CreatorRevenueModel, 
  CreatorAgentContractTerms,
  RevenueEnhancementAnalysis
} from '../../types/creator-agent-economics';

/**
 * Revenue sharing calculator for creator agents
 */
export class CreatorAgentRevenueCalculator {
  
  /**
   * Calculate creator's revenue share for a given period
   */
  calculateCreatorShare(params: {
    totalAgentRevenue: number; // USDC cents
    revenueModel: CreatorRevenueModel;
    contractTerms: CreatorAgentContractTerms;
    performanceMetrics?: {
      monthlyRevenue: number;
      baselineRevenue: number;
      engagementHours: number;
      culturalAlignment: number;
      retentionRate: number;
      newCollectors: number;
    };
  }): CreatorShareCalculation {
    
    const { totalAgentRevenue, revenueModel, contractTerms, performanceMetrics } = params;
    
    // Base revenue share calculation
    const baseShare = this.calculateBaseShare(totalAgentRevenue, contractTerms);
    
    // Performance bonus calculation (if eligible)
    const performanceBonus = contractTerms.revenueModel.performanceBonusDetails && performanceMetrics
      ? this.calculatePerformanceBonus(totalAgentRevenue, contractTerms, performanceMetrics)
      : 0;
    
    // Calculate total creator share
    const totalCreatorShare = baseShare + performanceBonus;
    const effectivePercentage = (totalCreatorShare / totalAgentRevenue) * 100;
    
    return {
      totalAgentRevenue,
      baseShare,
      performanceBonus,
      totalCreatorShare,
      basePercentage: contractTerms.revenueModel.baseSharePercentage,
      effectivePercentage,
      calculationBreakdown: {
        revenueModel,
        baseCalculation: this.getBaseCalculationDetails(totalAgentRevenue, contractTerms),
        bonusCalculation: performanceMetrics 
          ? this.getBonusCalculationDetails(totalAgentRevenue, contractTerms, performanceMetrics)
          : null
      }
    };
  }

  /**
   * Project revenue enhancement from creator partnership
   */
  projectRevenueEnhancement(params: {
    creatorProfile: {
      audienceSize: number;
      engagementRate: number;
      brandStrength: number; // 0-100 score
      culturalAlignment: number; // 0-100 score
      marketingReach: number; // estimated monthly impressions
    };
    baselineAgentProjection: {
      month1: number;
      month6: number;
      month12: number;
    };
  }): RevenueEnhancementAnalysis {
    
    const { creatorProfile, baselineAgentProjection } = params;
    
    // Calculate enhancement factors
    const enhancementFactors = this.calculateEnhancementFactors(creatorProfile);
    
    // Apply enhancement to baseline projections
    const creatorEnhancedProjection = {
      month1: baselineAgentProjection.month1 * enhancementFactors.overallMultiplier,
      month6: baselineAgentProjection.month6 * enhancementFactors.overallMultiplier,
      month12: baselineAgentProjection.month12 * enhancementFactors.overallMultiplier
    };
    
    // Assess risk factors
    const riskFactors = this.assessRiskFactors(creatorProfile);
    
    return {
      baselineProjection: baselineAgentProjection,
      creatorEnhancedProjection,
      enhancementFactors,
      riskFactors
    };
  }

  /**
   * Validate creator agent launch economics
   */
  validateLaunchEconomics(params: {
    creatorProfile: any;
    contractTerms: CreatorAgentContractTerms;
    revenueProjection: RevenueEnhancementAnalysis;
  }): LaunchEconomicValidation {
    
    const { creatorProfile, contractTerms, revenueProjection } = params;
    
    // Minimum revenue requirements check
    const month1Minimum = 5000; // $50 in USDC cents
    const month6Minimum = 8000; // $80 in USDC cents
    
    const revenueRequirementsMet = 
      revenueProjection.creatorEnhancedProjection.month1 >= month1Minimum &&
      revenueProjection.creatorEnhancedProjection.month6 >= month6Minimum;
    
    // Risk assessment
    const overallRisk = revenueProjection.riskFactors.overallRisk;
    const acceptableRisk = overallRisk === 'low' || overallRisk === 'medium';
    
    // Token economics impact
    const spiritTokenImpact = this.assessSpiritTokenImpact(revenueProjection);
    const ecosystemImpact = this.assessEcosystemImpact(revenueProjection);
    
    return {
      launchRecommended: revenueRequirementsMet && acceptableRisk,
      economicHealth: {
        spiritTokenImpact,
        ecosystemRevenueImpact: ecosystemImpact,
        riskProfile: overallRisk,
        recommendedLaunch: revenueRequirementsMet && acceptableRisk
      },
      validationDetails: {
        revenueRequirements: {
          month1: {
            projected: revenueProjection.creatorEnhancedProjection.month1,
            minimum: month1Minimum,
            met: revenueProjection.creatorEnhancedProjection.month1 >= month1Minimum
          },
          month6: {
            projected: revenueProjection.creatorEnhancedProjection.month6,
            minimum: month6Minimum,
            met: revenueProjection.creatorEnhancedProjection.month6 >= month6Minimum
          }
        },
        riskAssessment: revenueProjection.riskFactors,
        tokenEconomicsImpact: {
          spiritHolderBenefit: spiritTokenImpact === 'positive',
          ecosystemGrowth: ecosystemImpact === 'positive'
        }
      }
    };
  }

  /**
   * Calculate base revenue share without bonuses
   */
  private calculateBaseShare(totalRevenue: number, contractTerms: CreatorAgentContractTerms): number {
    return Math.floor(totalRevenue * (contractTerms.revenueModel.baseSharePercentage / 100));
  }

  /**
   * Calculate performance bonus based on metrics
   */
  private calculatePerformanceBonus(
    totalRevenue: number, 
    contractTerms: CreatorAgentContractTerms, 
    metrics: any
  ): number {
    
    const bonusDetails = contractTerms.revenueModel.performanceBonusDetails;
    if (!bonusDetails) return 0;
    
    let totalBonusPercentage = 0;
    
    // Check each performance trigger
    for (const trigger of bonusDetails.triggers) {
      const metricValue = this.getMetricValue(metrics, trigger.metric);
      if (metricValue >= trigger.threshold) {
        totalBonusPercentage += trigger.bonusPercentage;
      }
    }
    
    // Cap at maximum bonus
    totalBonusPercentage = Math.min(totalBonusPercentage, bonusDetails.maxBonus);
    
    return Math.floor(totalRevenue * (totalBonusPercentage / 100));
  }

  /**
   * Calculate enhancement factors from creator profile
   */
  private calculateEnhancementFactors(creatorProfile: any) {
    // Audience size factor (0.9 - 1.3)
    const audienceSize = Math.min(1.3, 0.9 + (creatorProfile.audienceSize / 100000) * 0.4);
    
    // Brand authenticity factor (0.95 - 1.25)
    const brandAuthenticity = 0.95 + (creatorProfile.brandStrength / 100) * 0.3;
    
    // Cultural resonance factor (0.95 - 1.2)
    const culturalResonance = 0.95 + (creatorProfile.culturalAlignment / 100) * 0.25;
    
    // Marketing synergy factor (0.9 - 1.15)
    const marketingSynergy = 0.9 + (creatorProfile.engagementRate / 100) * 0.25;
    
    // Combined multiplier (conservative approach)
    const overallMultiplier = (audienceSize + brandAuthenticity + culturalResonance + marketingSynergy) / 4;
    
    return {
      audienceSize,
      brandAuthenticity,
      culturalResonance,
      marketingSynergy,
      overallMultiplier: Math.min(1.25, Math.max(1.0, overallMultiplier)) // Cap between 1.0 - 1.25
    };
  }

  /**
   * Assess risk factors for creator dependency
   */
  private assessRiskFactors(creatorProfile: any) {
    // Creator dependency risk based on audience size and exclusivity
    const creatorDependency = creatorProfile.audienceSize > 50000 ? 'medium' : 'high';
    
    // Revenue volatility based on engagement patterns
    const revenueVolatility = creatorProfile.engagementRate > 5 ? 'low' : 'medium';
    
    // Competition risk based on market presence
    const competitionRisk = creatorProfile.brandStrength > 75 ? 'low' : 'medium';
    
    // Overall risk assessment
    const riskScore = (
      (creatorDependency === 'low' ? 1 : creatorDependency === 'medium' ? 2 : 3) +
      (revenueVolatility === 'low' ? 1 : revenueVolatility === 'medium' ? 2 : 3) +
      (competitionRisk === 'low' ? 1 : competitionRisk === 'medium' ? 2 : 3)
    ) / 3;
    
    const overallRisk = riskScore <= 1.5 ? 'low' : riskScore <= 2.5 ? 'medium' : 'high';
    
    return {
      creatorDependency: creatorDependency as 'low' | 'medium' | 'high',
      revenueVolatility: revenueVolatility as 'low' | 'medium' | 'high',
      competitionRisk: competitionRisk as 'low' | 'medium' | 'high',
      overallRisk: overallRisk as 'low' | 'medium' | 'high'
    };
  }

  /**
   * Assess impact on SPIRIT token ecosystem
   */
  private assessSpiritTokenImpact(revenueProjection: RevenueEnhancementAnalysis): 'positive' | 'neutral' | 'negative' {
    // Creator agents use same 25% SPIRIT airdrop, but generate more revenue
    const revenueEnhancement = 
      revenueProjection.creatorEnhancedProjection.month12 / revenueProjection.baselineProjection.month12;
    
    return revenueEnhancement > 1.1 ? 'positive' : 'neutral';
  }

  /**
   * Assess impact on overall ecosystem revenue
   */
  private assessEcosystemImpact(revenueProjection: RevenueEnhancementAnalysis): 'positive' | 'neutral' | 'negative' {
    // Creator agents should enhance overall ecosystem revenue
    const enhancementFactor = revenueProjection.enhancementFactors.overallMultiplier;
    return enhancementFactor > 1.05 ? 'positive' : 'neutral';
  }

  /**
   * Get metric value from performance metrics object
   */
  private getMetricValue(metrics: any, metricName: string): number {
    switch (metricName) {
      case 'monthly_revenue': return metrics.monthlyRevenue;
      case 'engagement_hours': return metrics.engagementHours;
      case 'cultural_alignment': return metrics.culturalAlignment;
      case 'retention_rate': return metrics.retentionRate;
      case 'new_collectors': return metrics.newCollectors;
      default: return 0;
    }
  }

  /**
   * Get detailed breakdown of base calculation
   */
  private getBaseCalculationDetails(totalRevenue: number, contractTerms: CreatorAgentContractTerms) {
    return {
      totalRevenue,
      basePercentage: contractTerms.revenueModel.baseSharePercentage,
      baseShare: this.calculateBaseShare(totalRevenue, contractTerms)
    };
  }

  /**
   * Get detailed breakdown of bonus calculation
   */
  private getBonusCalculationDetails(totalRevenue: number, contractTerms: CreatorAgentContractTerms, metrics: any) {
    const bonusDetails = contractTerms.revenueModel.performanceBonusDetails;
    if (!bonusDetails) return null;

    const triggersEvaluated = bonusDetails.triggers.map(trigger => ({
      metric: trigger.metric,
      threshold: trigger.threshold,
      actualValue: this.getMetricValue(metrics, trigger.metric),
      met: this.getMetricValue(metrics, trigger.metric) >= trigger.threshold,
      bonusPercentage: trigger.bonusPercentage
    }));

    const totalEarnedBonus = triggersEvaluated
      .filter(t => t.met)
      .reduce((sum, t) => sum + t.bonusPercentage, 0);

    const cappedBonus = Math.min(totalEarnedBonus, bonusDetails.maxBonus);

    return {
      triggersEvaluated,
      totalEarnedBonus,
      cappedBonus,
      bonusAmount: Math.floor(totalRevenue * (cappedBonus / 100))
    };
  }
}

/**
 * Result interfaces
 */
export interface CreatorShareCalculation {
  totalAgentRevenue: number;
  baseShare: number;
  performanceBonus: number;
  totalCreatorShare: number;
  basePercentage: number;
  effectivePercentage: number;
  calculationBreakdown: {
    revenueModel: CreatorRevenueModel;
    baseCalculation: {
      totalRevenue: number;
      basePercentage: number;
      baseShare: number;
    };
    bonusCalculation: {
      triggersEvaluated: Array<{
        metric: string;
        threshold: number;
        actualValue: number;
        met: boolean;
        bonusPercentage: number;
      }>;
      totalEarnedBonus: number;
      cappedBonus: number;
      bonusAmount: number;
    } | null;
  };
}

export interface LaunchEconomicValidation {
  launchRecommended: boolean;
  economicHealth: {
    spiritTokenImpact: 'positive' | 'neutral' | 'negative';
    ecosystemRevenueImpact: 'positive' | 'neutral' | 'negative';
    riskProfile: 'low' | 'medium' | 'high';
    recommendedLaunch: boolean;
  };
  validationDetails: {
    revenueRequirements: {
      month1: {
        projected: number;
        minimum: number;
        met: boolean;
      };
      month6: {
        projected: number;
        minimum: number;
        met: boolean;
      };
    };
    riskAssessment: {
      creatorDependency: 'low' | 'medium' | 'high';
      revenueVolatility: 'low' | 'medium' | 'high';
      competitionRisk: 'low' | 'medium' | 'high';
      overallRisk: 'low' | 'medium' | 'high';
    };
    tokenEconomicsImpact: {
      spiritHolderBenefit: boolean;
      ecosystemGrowth: boolean;
    };
  };
}

/**
 * Revenue model templates for different creator types
 */
export const CREATOR_REVENUE_MODEL_TEMPLATES = {
  'agent-originator': {
    baseSharePercentage: 30, // Enhanced from standard 25%
    enhancedSharePercentage: 35, // With performance bonus
    performanceBonusDetails: {
      triggers: [
        { metric: 'monthly_revenue', threshold: 5000, bonusPercentage: 3 },
        { metric: 'cultural_alignment', threshold: 85, bonusPercentage: 2 },
      ],
      maxBonus: 5 // Max 5% additional bonus
    }
  },
  
  'ongoing-trainer': {
    baseSharePercentage: 25, // Standard share
    performanceBonusDetails: {
      triggers: [
        { metric: 'monthly_revenue', threshold: 5000, bonusPercentage: 5 },
        { metric: 'engagement_hours', threshold: 10, bonusPercentage: 2 },
        { metric: 'cultural_alignment', threshold: 80, bonusPercentage: 3 }
      ],
      maxBonus: 10 // Max 10% additional bonus (35% total)
    }
  },
  
  'agent-collaborator': {
    baseSharePercentage: 25, // Standard share
    projectSharePercentage: 40, // For specific collaborations
    performanceBonusDetails: {
      triggers: [
        { metric: 'retention_rate', threshold: 40, bonusPercentage: 3 },
        { metric: 'new_collectors', threshold: 10, bonusPercentage: 2 }
      ],
      maxBonus: 5
    }
  },
  
  'creator-mentor': {
    spiritTokensPerMentee: 50000, // 50K SPIRIT per successful mentee
    agentTokensPerLaunch: 10000000, // 10M agent tokens per mentee launch
    baseSharePercentage: 15 // Lower direct revenue share, compensated by tokens
  }
} as const;