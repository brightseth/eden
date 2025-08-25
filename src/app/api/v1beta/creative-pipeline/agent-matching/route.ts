/**
 * Agent Potential Matching API
 * 
 * Production endpoints for creator-to-agent role matching with economic validation.
 * Integrates with existing Eden ecosystem while maintaining cultural alignment.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AgentPotentialMatcher } from '@/services/creative-pipeline/matching/agent-potential-matcher';
import { featureFlags } from '@/config/flags';

// Initialize services
let potentialMatcher: AgentPotentialMatcher | null = null;

function getAgentPotentialMatcher() {
  if (!potentialMatcher) {
    potentialMatcher = new AgentPotentialMatcher();
  }
  return potentialMatcher;
}

/**
 * POST /api/v1beta/creative-pipeline/agent-matching
 * Find optimal agent collaboration matches for a creator
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Validate feature access
    if (!featureFlags.isEnabled('CREATIVE_PIPELINE_ASSESSMENT')) {
      return NextResponse.json({
        success: false,
        error: 'Agent matching not available',
        message: 'This feature is being enhanced to provide better creator-agent partnerships.',
        culturalSupport: 'We\'re developing sophisticated matching to find your perfect AI creative partner.'
      }, { status: 503 });
    }

    const matcher = getAgentPotentialMatcher();
    const body = await request.json();
    const { creatorId, preferences, skillLevel, culturalAlignment, includeEconomics } = body;

    if (!creatorId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required field',
        message: 'Creator ID is required for agent matching.',
        culturalSupport: 'We need your creator profile to find the best AI collaboration opportunities.'
      }, { status: 400 });
    }

    // Prepare matching criteria
    const matchingCriteria = {
      creatorId,
      preferences: preferences || {},
      skillLevel: skillLevel || 70,
      culturalAlignment: culturalAlignment || 70,
      economicValidation: includeEconomics && featureFlags.isEnabled('CREATOR_AGENT_ECONOMICS')
    };

    // Find best matches with enhanced analysis
    const potentialMappings = await matcher.findBestMatches(matchingCriteria);

    // Log successful matching
    console.log(`Agent matching completed for creator ${creatorId}, found ${potentialMappings.length} matches, duration: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      data: {
        creatorId,
        potentialMappings,
        matchingCriteria: {
          skillLevel: matchingCriteria.skillLevel,
          culturalAlignment: matchingCriteria.culturalAlignment,
          economicValidationEnabled: matchingCriteria.economicValidation
        },
        culturalCelebration: generateMatchingCelebration(potentialMappings.length),
        nextSteps: [
          'Review each agent collaboration opportunity',
          'Consider training path requirements',
          'Explore economic projections if available',
          'Select primary focus for Academy training'
        ],
        communitySupport: 'The Academy community will support you in whichever agent collaboration path you choose.',
        economicsNote: matchingCriteria.economicValidation 
          ? 'Economic projections included to help you understand revenue potential.'
          : 'Enable economic validation for revenue projections and market analysis.'
      },
      metrics: {
        processingTimeMs: Date.now() - startTime,
        matchesFound: potentialMappings.length,
        topMatchConfidence: potentialMappings.length > 0 ? potentialMappings[0].confidence : 0,
        economicsIncluded: matchingCriteria.economicValidation
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Agent matching error (${processingTime}ms):`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Agent matching failed',
      message: 'We encountered an issue finding your agent matches. Please try again.',
      culturalSupport: 'Finding the right AI creative partner is important - we\'ll help you get there.',
      supportContact: 'academy-support@eden.art',
      fallbackGuidance: 'Consider starting with multi-modal creative collaboration while we resolve this.',
      metrics: {
        processingTimeMs: processingTime
      }
    }, { status: 500 });
  }
}

/**
 * GET /api/v1beta/creative-pipeline/agent-matching/[creatorId]
 * Get existing agent potential mappings and recommendations
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    if (!featureFlags.isEnabled('CREATIVE_PIPELINE_ASSESSMENT')) {
      return NextResponse.json({
        success: false,
        error: 'Agent matching not available'
      }, { status: 503 });
    }

    const url = new URL(request.url);
    const creatorId = url.pathname.split('/').pop();

    if (!creatorId) {
      return NextResponse.json({
        success: false,
        error: 'Creator ID required',
        message: 'Please provide a creator ID to retrieve agent matches.'
      }, { status: 400 });
    }

    const matcher = getAgentPotentialMatcher();
    
    // Get existing mappings with basic criteria
    const existingMappings = await matcher.findBestMatches({
      creatorId,
      preferences: {},
      skillLevel: 70,
      economicValidation: featureFlags.isEnabled('CREATOR_AGENT_ECONOMICS')
    });

    return NextResponse.json({
      success: true,
      data: {
        creatorId,
        existingMappings,
        recommendationSummary: generateRecommendationSummary(existingMappings),
        culturalGuidance: 'These agent partnerships are designed to amplify your unique creative voice.',
        progressPath: 'Choose the collaboration that most excites your creative spirit.',
        economicsAvailable: featureFlags.isEnabled('CREATOR_AGENT_ECONOMICS')
      },
      metrics: {
        processingTimeMs: Date.now() - startTime,
        mappingsCount: existingMappings.length
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Agent mapping retrieval error (${processingTime}ms):`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve agent mappings',
      culturalSupport: 'Your agent collaboration options are safe - we\'ll help you access them.',
      metrics: {
        processingTimeMs: processingTime
      }
    }, { status: 500 });
  }
}

/**
 * PUT /api/v1beta/creative-pipeline/agent-matching/[creatorId]/preference
 * Update creator preferences and regenerate matches
 */
export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    if (!featureFlags.isEnabled('CREATIVE_PIPELINE_ASSESSMENT')) {
      return NextResponse.json({
        success: false,
        error: 'Agent matching updates not available'
      }, { status: 503 });
    }

    const url = new URL(request.url);
    const creatorId = url.pathname.split('/').slice(-2)[0]; // Get creatorId from path

    if (!creatorId) {
      return NextResponse.json({
        success: false,
        error: 'Creator ID required'
      }, { status: 400 });
    }

    const body = await request.json();
    const { preferences, updateType } = body;

    if (!preferences || !updateType) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide preferences and updateType.',
        supportedUpdateTypes: ['skill-focus', 'cultural-priority', 'economic-focus', 'training-preference']
      }, { status: 400 });
    }

    const matcher = getAgentPotentialMatcher();
    
    // Regenerate matches with updated preferences
    const updatedMappings = await matcher.findBestMatches({
      creatorId,
      preferences,
      skillLevel: preferences.skillLevel || 70,
      culturalAlignment: preferences.culturalAlignment || 70,
      economicValidation: preferences.includeEconomics && featureFlags.isEnabled('CREATOR_AGENT_ECONOMICS')
    });

    return NextResponse.json({
      success: true,
      data: {
        creatorId,
        updateType,
        updatedMappings,
        changesSummary: generateUpdateSummary(updateType, updatedMappings.length),
        culturalSupport: 'Your preferences help us find better AI collaboration matches.',
        nextAction: 'Review your updated matches and select your training focus.'
      },
      metrics: {
        processingTimeMs: Date.now() - startTime,
        updateType,
        newMatchCount: updatedMappings.length
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Agent matching preference update error (${processingTime}ms):`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to update matching preferences',
      culturalSupport: 'Your preferences are important - we\'ll help you update them properly.',
      metrics: {
        processingTimeMs: processingTime
      }
    }, { status: 500 });
  }
}

// Helper functions for enhanced responses
function generateMatchingCelebration(matchCount: number): string {
  if (matchCount >= 4) {
    return 'Excellent! We found multiple exciting AI collaboration opportunities for you.';
  } else if (matchCount >= 2) {
    return 'Great! We identified several strong agent partnership possibilities.';
  } else if (matchCount >= 1) {
    return 'Perfect! We found a promising AI collaboration path for your creative journey.';
  } else {
    return 'We\'re still analyzing your creative profile to find the best AI partnerships.';
  }
}

function generateRecommendationSummary(mappings: any[]): {
  topRecommendation: string;
  alternativeOptions: string;
  growthPath: string;
} {
  if (mappings.length === 0) {
    return {
      topRecommendation: 'Continue developing your creative profile for better matching.',
      alternativeOptions: 'Explore Academy community resources while we analyze your potential.',
      growthPath: 'Engage with Academy training to strengthen your collaboration readiness.'
    };
  }

  const topMatch = mappings[0];
  
  return {
    topRecommendation: `${topMatch.role.replace('-', ' ')} collaboration shows the highest potential (${topMatch.confidence}% confidence).`,
    alternativeOptions: mappings.length > 1 
      ? `Consider also exploring ${mappings[1].role.replace('-', ' ')} and ${mappings.length > 2 ? 'other' : ''} creative partnerships.`
      : 'This focused recommendation gives you a clear path forward.',
    growthPath: topMatch.trainingPathSuggestion || 'Follow Academy curriculum for your chosen collaboration.'
  };
}

function generateUpdateSummary(updateType: string, newMatchCount: number): string {
  const summaries: Record<string, string> = {
    'skill-focus': `Updated matches based on your skill preferences (${newMatchCount} options).`,
    'cultural-priority': `Refined matches to align with your cultural priorities (${newMatchCount} options).`,
    'economic-focus': `Enhanced matches with economic considerations (${newMatchCount} options).`,
    'training-preference': `Adjusted matches based on your training preferences (${newMatchCount} options).`
  };
  
  return summaries[updateType] || `Updated agent matching preferences (${newMatchCount} new options).`;
}