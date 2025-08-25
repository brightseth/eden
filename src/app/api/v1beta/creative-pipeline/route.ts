/**
 * Creative Pipeline API - Phase 2 Implementation
 * 
 * Endpoints for creator onboarding and assessment aligned with Eden Academy's
 * cultural mission and existing architecture patterns.
 * 
 * Design Principles:
 * - Supportive, growth-oriented responses
 * - Cultural alignment validation
 * - Integration with Academy training systems
 * - Feature flag controlled rollout
 */

import { NextRequest, NextResponse } from 'next/server';
import { OnboardingFlowManager } from '@/services/creative-pipeline/workflows/onboarding-flow';
import { CulturalAssessmentScorer } from '@/services/creative-pipeline/assessment/cultural-assessment';
import { AgentPotentialMatcher } from '@/services/creative-pipeline/matching/agent-potential-matcher';
import { CreatorProfile } from '@/services/creative-pipeline/types/creator-profile';

// Feature flag check - aligned with existing Academy patterns
function isCreativePipelineEnabled(): boolean {
  // Would integrate with existing feature flag system
  return process.env.ENABLE_CREATIVE_PIPELINE === 'true' || 
         process.env.NODE_ENV === 'development';
}

// Initialize services
const onboardingManager = new OnboardingFlowManager();
const assessmentScorer = new CulturalAssessmentScorer();
const potentialMatcher = new AgentPotentialMatcher();

/**
 * POST /api/v1beta/creative-pipeline
 * Initialize creator onboarding process
 */
export async function POST(request: NextRequest) {
  if (!isCreativePipelineEnabled()) {
    return NextResponse.json(
      { 
        error: 'Creative pipeline not available', 
        message: 'This feature is currently in development. Please check back soon!' 
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { userId, initialInterests, referralSource, culturalMotivation } = body;

    if (!userId) {
      return NextResponse.json(
        { 
          error: 'Missing required field', 
          message: 'userId is required to begin your creative journey at Eden Academy' 
        },
        { status: 400 }
      );
    }

    // Initialize onboarding with welcoming approach
    const creatorProfile = await onboardingManager.initiateOnboarding({
      userId,
      initialInterests,
      referralSource,
      culturalMotivation
    });

    return NextResponse.json({
      success: true,
      message: 'Welcome to Eden Academy! Your creative journey begins now.',
      data: {
        creatorProfile,
        nextStage: 'portfolio-submission',
        culturalWelcome: 'We\'re excited to learn about your unique creative voice and explore how AI collaboration can amplify your artistic expression.',
        supportResources: [
          'Academy Mission & Values Guide',
          'Community Support Channels', 
          'Creative Collaboration Examples'
        ]
      }
    });

  } catch (error) {
    console.error('Creative pipeline initialization error:', error);
    return NextResponse.json(
      {
        error: 'Initialization failed',
        message: 'We encountered an issue starting your Academy journey. Our team has been notified and will help resolve this quickly.'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/v1beta/creative-pipeline/[creatorId]
 * Retrieve creator profile and current onboarding status
 */
export async function GET(request: NextRequest) {
  if (!isCreativePipelineEnabled()) {
    return NextResponse.json(
      { error: 'Creative pipeline not available' },
      { status: 503 }
    );
  }

  try {
    const url = new URL(request.url);
    const creatorId = url.pathname.split('/').pop();

    if (!creatorId) {
      return NextResponse.json(
        { error: 'Creator ID required' },
        { status: 400 }
      );
    }

    // Would implement actual database retrieval
    // For now, return structure that maintains cultural alignment
    const mockCreatorProfile: Partial<CreatorProfile> = {
      id: creatorId,
      onboardingStage: 'skill-assessment',
      culturalAlignment: 85,
      readinessScore: 78
    };

    return NextResponse.json({
      success: true,
      data: {
        creatorProfile: mockCreatorProfile,
        progressMessage: 'You\'re making excellent progress in your Academy onboarding journey!',
        culturalSupport: 'Our community is here to support your creative growth every step of the way.',
        nextSteps: [
          'Complete your creative skill mapping',
          'Explore agent collaboration options',
          'Connect with Academy peer learners'
        ]
      }
    });

  } catch (error) {
    console.error('Creator profile retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve creator profile' },
      { status: 500 }
    );
  }
}