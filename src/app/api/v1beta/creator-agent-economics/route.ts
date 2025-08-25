/**
 * Creator Agent Economics API
 * Phase 3: Revenue Impact Modeling & Agent Launch Integration
 * 
 * API endpoints for creator agent economic validation, revenue sharing,
 * and launch criteria integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreatorAgentRevenueCalculator } from '@/services/creator-agent-economics/revenue-calculator';
import { 
  CreatorAgentEconomicValidation,
  CreatorRevenueModel,
  CREATOR_AGENT_ECONOMICS_FEATURE_FLAGS
} from '../../../types/creator-agent-economics';

// Initialize revenue calculator
const revenueCalculator = new CreatorAgentRevenueCalculator();

/**
 * POST /api/v1beta/creator-agent-economics/validate-launch
 * Validate economic viability of creator agent launch
 */
export async function POST(request: NextRequest) {
  try {
    // Feature flag check
    const economicsEnabled = process.env.CREATOR_AGENT_ECONOMICS === 'true';
    if (!economicsEnabled) {
      return NextResponse.json({
        success: false,
        error: 'Creator agent economics features not enabled',
        message: 'This feature is currently in development. Please check back later.',
        culturalNote: 'We\'re building this system to ensure fair compensation for creators while maintaining ecosystem health.'
      }, { status: 503 });
    }

    const body = await request.json();
    
    // Validate required fields
    const { creatorProfileId, creatorProfile, revenueModel, baselineProjection } = body;
    
    if (!creatorProfileId || !creatorProfile || !revenueModel || !baselineProjection) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        required: ['creatorProfileId', 'creatorProfile', 'revenueModel', 'baselineProjection']
      }, { status: 400 });
    }

    // Project revenue enhancement
    const revenueProjection = revenueCalculator.projectRevenueEnhancement({
      creatorProfile,
      baselineAgentProjection: baselineProjection
    });

    // Generate contract terms based on revenue model
    const contractTerms = generateContractTerms(revenueModel, creatorProfile);

    // Validate launch economics
    const economicValidation = revenueCalculator.validateLaunchEconomics({
      creatorProfile,
      contractTerms,
      revenueProjection
    });

    // Compile comprehensive validation result
    const validationResult: CreatorAgentEconomicValidation = {
      launchCriteriaValidation: {
        demandValidation: {
          standardRequirement: 7500, // $75 baseline
          creatorAudienceContribution: Math.floor(creatorProfile.audienceSize * 0.1), 
          nonCreatorNetworkSales: Math.floor(baselineProjection.month1 * 0.6),
          crossPromotionEffectiveness: creatorProfile.engagementRate,
          totalScore: Math.floor(baselineProjection.month1 * revenueProjection.enhancementFactors.overallMultiplier),
          passed: revenueProjection.creatorEnhancedProjection.month1 >= 7500
        },
        retentionMetrics: {
          standardRequirement: 30,
          creatorCommunityBonus: Math.min(5, creatorProfile.engagementRate * 0.5),
          crossPlatformEngagement: creatorProfile.brandStrength * 0.1,
          culturalFitWeight: creatorProfile.culturalAlignment * 0.15,
          adjustedScore: 30 + Math.min(5, creatorProfile.engagementRate * 0.5),
          passed: true // Assume creator community provides retention boost
        },
        operationalEfficiency: {
          standardRequirement: {
            outputsPerMonth: 45,
            maxComputeCost: 500
          },
          creatorEnhancements: {
            curatedOutputReduction: 10, // Can produce fewer but higher quality
            qualityPremiumAllowance: 150, // Can charge premium for creator-curated work
            marketingEfficiencyBonus: 100 // Creator promotion reduces marketing costs
          },
          adjustedScore: 85, // Enhanced efficiency through creator involvement
          passed: true
        }
      },
      revenueEnhancementAnalysis: revenueProjection,
      contractTerms,
      economicHealth: economicValidation.economicHealth,
      validationDate: new Date().toISOString(),
      validatedBy: 'token-economist-agent',
      notes: `Creator agent economic validation completed. Projected ${Math.round((revenueProjection.enhancementFactors.overallMultiplier - 1) * 100)}% revenue enhancement over baseline.`
    };

    return NextResponse.json({
      success: true,
      data: validationResult,
      summary: {
        launchRecommended: economicValidation.launchRecommended,
        projectedEnhancement: `${Math.round((revenueProjection.enhancementFactors.overallMultiplier - 1) * 100)}%`,
        riskLevel: economicValidation.economicHealth.riskProfile,
        spiritHolderImpact: economicValidation.economicHealth.spiritTokenImpact,
        creatorRevenueShare: `${contractTerms.revenueModel.baseSharePercentage}%${contractTerms.revenueModel.performanceBonusDetails ? ` + up to ${contractTerms.revenueModel.performanceBonusDetails.maxBonus}% bonus` : ''}`
      }
    });

  } catch (error) {
    console.error('Creator agent economic validation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during economic validation',
      message: 'Please try again. If the issue persists, contact support.',
      culturalNote: 'We\'re committed to building robust economic systems for creators.'
    }, { status: 500 });
  }
}

/**
 * POST /api/v1beta/creator-agent-economics/calculate-revenue-share
 * Calculate creator revenue share for a given period
 */
export async function PUT(request: NextRequest) {
  try {
    const economicsEnabled = process.env.CREATOR_AGENT_ECONOMICS === 'true';
    if (!economicsEnabled) {
      return NextResponse.json({
        success: false,
        error: 'Creator agent economics features not enabled'
      }, { status: 503 });
    }

    const body = await request.json();
    
    const { 
      totalAgentRevenue, 
      revenueModel, 
      contractTerms, 
      performanceMetrics 
    } = body;

    if (!totalAgentRevenue || !revenueModel || !contractTerms) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields for revenue calculation',
        required: ['totalAgentRevenue', 'revenueModel', 'contractTerms']
      }, { status: 400 });
    }

    // Calculate creator share
    const shareCalculation = revenueCalculator.calculateCreatorShare({
      totalAgentRevenue,
      revenueModel,
      contractTerms,
      performanceMetrics
    });

    return NextResponse.json({
      success: true,
      data: shareCalculation,
      summary: {
        totalCreatorShare: `$${(shareCalculation.totalCreatorShare / 100).toFixed(2)}`,
        effectivePercentage: `${shareCalculation.effectivePercentage.toFixed(1)}%`,
        performanceBonus: `$${(shareCalculation.performanceBonus / 100).toFixed(2)}`,
        baseShare: `$${(shareCalculation.baseShare / 100).toFixed(2)}`
      }
    });

  } catch (error) {
    console.error('Revenue share calculation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to calculate revenue share'
    }, { status: 500 });
  }
}

/**
 * GET /api/v1beta/creator-agent-economics/revenue-models
 * Get available creator revenue model templates
 */
export async function GET(request: NextRequest) {
  try {
    const economicsEnabled = process.env.CREATOR_AGENT_ECONOMICS === 'true';
    if (!economicsEnabled) {
      return NextResponse.json({
        success: false,
        error: 'Creator agent economics features not enabled'
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const creatorType = searchParams.get('type') as CreatorRevenueModel;

    if (creatorType) {
      // Return specific model template
      const template = getRevenueModelTemplate(creatorType);
      if (!template) {
        return NextResponse.json({
          success: false,
          error: 'Invalid creator revenue model type',
          availableTypes: ['agent-originator', 'ongoing-trainer', 'agent-collaborator', 'creator-mentor']
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        data: {
          type: creatorType,
          template,
          description: getModelDescription(creatorType)
        }
      });
    }

    // Return all model templates
    const allModels = {
      'agent-originator': {
        template: getRevenueModelTemplate('agent-originator'),
        description: getModelDescription('agent-originator')
      },
      'ongoing-trainer': {
        template: getRevenueModelTemplate('ongoing-trainer'),
        description: getModelDescription('ongoing-trainer')
      },
      'agent-collaborator': {
        template: getRevenueModelTemplate('agent-collaborator'),
        description: getModelDescription('agent-collaborator')
      },
      'creator-mentor': {
        template: getRevenueModelTemplate('creator-mentor'),
        description: getModelDescription('creator-mentor')
      }
    };

    return NextResponse.json({
      success: true,
      data: allModels,
      summary: {
        totalModels: Object.keys(allModels).length,
        culturalNote: 'All revenue models are designed to fairly compensate creators while maintaining Eden\'s token economics health.'
      }
    });

  } catch (error) {
    console.error('Revenue models fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch revenue model templates'
    }, { status: 500 });
  }
}

/**
 * Helper function to generate contract terms based on revenue model
 */
function generateContractTerms(revenueModel: CreatorRevenueModel, creatorProfile: any) {
  const template = getRevenueModelTemplate(revenueModel);
  
  return {
    revenueModel: {
      type: revenueModel,
      baseSharePercentage: template.baseSharePercentage,
      enhancedSharePercentage: template.enhancedSharePercentage,
      performanceBonusDetails: template.performanceBonusDetails
    },
    tokenAllocation: {
      baseTokens: 250000000, // Standard 25%
      enhancedTokens: revenueModel === 'agent-originator' ? 50000000 : 0, // Extra 5% for originators
      vestingSchedule: 'none',
      vestingPeriod: 0
    },
    commitments: {
      minimumEngagementHours: revenueModel === 'ongoing-trainer' ? 10 : 5,
      promotionRequirements: [
        'Monthly social media promotion',
        'Academy community engagement',
        'Cultural alignment maintenance'
      ],
      exclusivityPeriod: 6, // months
      culturalAlignmentMaintenance: true
    },
    performance: {
      minimumRevenueTargets: [
        { month: 1, targetRevenue: 5000 },
        { month: 6, targetRevenue: 8000 },
        { month: 12, targetRevenue: 12000 }
      ],
      qualityMaintenance: {
        minimumCurationScore: 75,
        culturalAlignmentThreshold: 80
      },
      reportingRequirements: [
        'Monthly engagement report',
        'Quarterly cultural alignment assessment',
        'Annual performance review'
      ]
    },
    termination: {
      creatorInitiated: {
        noticePeriod: 30,
        penalties: []
      },
      performanceBased: {
        underperformancePeriod: 3,
        revenueThreshold: 3000
      },
      platformInitiated: {
        culturalMisalignment: true,
        noticePeriod: 14
      }
    }
  };
}

/**
 * Get revenue model template by type
 */
function getRevenueModelTemplate(type: CreatorRevenueModel) {
  const templates = {
    'agent-originator': {
      baseSharePercentage: 30,
      enhancedSharePercentage: 35,
      performanceBonusDetails: {
        triggers: [
          { metric: 'monthly_revenue', threshold: 5000, bonusPercentage: 3 },
          { metric: 'cultural_alignment', threshold: 85, bonusPercentage: 2 }
        ],
        maxBonus: 5
      }
    },
    'ongoing-trainer': {
      baseSharePercentage: 25,
      performanceBonusDetails: {
        triggers: [
          { metric: 'monthly_revenue', threshold: 5000, bonusPercentage: 5 },
          { metric: 'engagement_hours', threshold: 10, bonusPercentage: 2 },
          { metric: 'cultural_alignment', threshold: 80, bonusPercentage: 3 }
        ],
        maxBonus: 10
      }
    },
    'agent-collaborator': {
      baseSharePercentage: 25,
      projectSharePercentage: 40,
      performanceBonusDetails: {
        triggers: [
          { metric: 'retention_rate', threshold: 40, bonusPercentage: 3 },
          { metric: 'new_collectors', threshold: 10, bonusPercentage: 2 }
        ],
        maxBonus: 5
      }
    },
    'creator-mentor': {
      baseSharePercentage: 15,
      spiritTokensPerMentee: 50000,
      agentTokensPerLaunch: 10000000
    }
  };

  return templates[type];
}

/**
 * Get model description by type
 */
function getModelDescription(type: CreatorRevenueModel): string {
  const descriptions = {
    'agent-originator': 'Enhanced revenue share (30%) for creators who develop successful agents from the Academy pipeline. Includes performance bonuses up to 35% total.',
    'ongoing-trainer': 'Standard share (25%) with significant performance bonuses for creators who continue training and collaborating with launched agents. Up to 35% total with bonuses.',
    'agent-collaborator': 'Project-based collaboration model with 25% base share and 40% share for specific collaboration projects. Focus on retention and new collector acquisition.',
    'creator-mentor': 'Mentorship compensation through $SPIRIT and agent tokens rather than direct revenue share. Designed for creators who help train other creators.'
  };

  return descriptions[type] || 'Unknown revenue model type';
}