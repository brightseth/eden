/**
 * Creative Pipeline Assessment API
 * 
 * Production endpoints for processing creator assessments through pipeline stages.
 * Maintains cultural alignment with Eden Academy's supportive mission.
 */

import { NextRequest, NextResponse } from 'next/server';
import { OnboardingFlowManager } from '@/services/creative-pipeline/workflows/onboarding-flow';
import { featureFlags } from '@/config/flags';

// Initialize services
let onboardingManager: OnboardingFlowManager | null = null;

function getOnboardingManager() {
  if (!onboardingManager) {
    onboardingManager = new OnboardingFlowManager();
  }
  return onboardingManager;
}

/**
 * POST /api/v1beta/creative-pipeline/assessment
 * Process different assessment stages based on request body
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Validate feature access
    if (!featureFlags.isEnabled('CREATIVE_PIPELINE_ASSESSMENT')) {
      return NextResponse.json({
        success: false,
        error: 'Assessment system not available',
        message: 'This feature is being enhanced to better serve our creative community.',
        culturalSupport: 'We\'re building assessment tools that celebrate your creative growth.'
      }, { status: 503 });
    }

    const manager = getOnboardingManager();
    const body = await request.json();
    const { creatorId, assessmentType, data } = body;

    if (!creatorId || !assessmentType || !data) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields',
        message: 'Please provide creatorId, assessmentType, and assessment data.',
        required: ['creatorId', 'assessmentType', 'data']
      }, { status: 400 });
    }

    let result;
    
    switch (assessmentType) {
      case 'portfolio-submission':
        result = await manager.processPortfolioSubmission(creatorId, data);
        break;
        
      case 'cultural-alignment':
        result = await manager.processCulturalAlignment(creatorId, data);
        break;
        
      case 'skill-assessment':
        result = await manager.processSkillAssessment(creatorId, data);
        break;
        
      case 'agent-potential-mapping':
        result = await manager.processAgentPotentialMapping(creatorId, data);
        break;
        
      case 'academy-integration':
        result = await manager.processAcademyIntegration(creatorId, data);
        break;
        
      case 'onboarding-completion':
        result = await manager.completeOnboarding(creatorId, data);
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown assessment type',
          message: `Assessment type "${assessmentType}" is not supported.`,
          supportedTypes: [
            'portfolio-submission',
            'cultural-alignment', 
            'skill-assessment',
            'agent-potential-mapping',
            'academy-integration',
            'onboarding-completion'
          ]
        }, { status: 400 });
    }

    // Log successful assessment processing
    console.log(`Assessment processed: ${assessmentType} for creator ${creatorId}, duration: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: result.success,
      data: {
        assessmentType,
        result,
        culturalCelebration: generateAssessmentCelebration(assessmentType, result.success),
        nextStepGuidance: result.culturalGuidance,
        communitySupport: 'The Academy community celebrates every step of your creative growth journey.'
      },
      metrics: {
        processingTimeMs: Date.now() - startTime,
        assessmentType,
        success: result.success
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Assessment processing error (${processingTime}ms):`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Assessment processing failed',
      message: 'We encountered an issue processing your assessment. Please try again.',
      culturalSupport: 'Your creative growth is important to us. Technical issues won\'t slow down your Academy journey.',
      supportContact: 'academy-support@eden.art',
      metrics: {
        processingTimeMs: processingTime
      }
    }, { status: 500 });
  }
}

/**
 * GET /api/v1beta/creative-pipeline/assessment/[creatorId]
 * Get comprehensive assessment history and current status
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    if (!featureFlags.isEnabled('CREATIVE_PIPELINE_ASSESSMENT')) {
      return NextResponse.json({
        success: false,
        error: 'Assessment system not available'
      }, { status: 503 });
    }

    const url = new URL(request.url);
    const creatorId = url.pathname.split('/').pop();

    if (!creatorId) {
      return NextResponse.json({
        success: false,
        error: 'Creator ID required'
      }, { status: 400 });
    }

    const manager = getOnboardingManager();
    const status = await manager.getOnboardingStatus(creatorId);

    return NextResponse.json({
      success: true,
      data: {
        creatorId,
        assessmentHistory: status,
        progressCelebration: generateProgressCelebration(status.progress),
        culturalSupport: 'Every assessment helps us understand how to better support your creative journey.',
        nextMilestone: generateNextMilestone(status.currentStage)
      },
      metrics: {
        processingTimeMs: Date.now() - startTime,
        progress: status.progress
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    console.error(`Assessment history retrieval error (${processingTime}ms):`, error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to retrieve assessment history',
      culturalSupport: 'Your assessment progress is safe - we\'ll help you access it.',
      metrics: {
        processingTimeMs: processingTime
      }
    }, { status: 500 });
  }
}

// Helper functions for cultural responses
function generateAssessmentCelebration(assessmentType: string, success: boolean): string {
  const celebrations: Record<string, { success: string; retry: string }> = {
    'portfolio-submission': {
      success: 'Your creative work shows beautiful potential for AI collaboration!',
      retry: 'Every portfolio tells a story - let\'s make sure we capture yours properly.'
    },
    'cultural-alignment': {
      success: 'Your values align wonderfully with our Academy community!',
      retry: 'Cultural fit develops over time - let\'s explore this together.'
    },
    'skill-assessment': {
      success: 'Your skills provide an excellent foundation for AI partnership!',
      retry: 'Skills grow through practice - we\'re here to support your development.'
    },
    'agent-potential-mapping': {
      success: 'Exciting AI collaboration opportunities identified for you!',
      retry: 'Finding the right AI partnership takes thoughtful exploration.'
    },
    'academy-integration': {
      success: 'You\'re becoming a valued Academy community member!',
      retry: 'Community integration happens at different paces - no pressure.'
    },
    'onboarding-completion': {
      success: 'Congratulations! You\'re ready for AI creative collaboration!',
      retry: 'We want to make sure you\'re fully prepared for success.'
    }
  };
  
  const typeMessages = celebrations[assessmentType] || {
    success: 'Assessment completed successfully!',
    retry: 'Let\'s work through this assessment together.'
  };
  
  return success ? typeMessages.success : typeMessages.retry;
}

function generateProgressCelebration(progress: number): string {
  if (progress >= 90) {
    return 'Outstanding! You\'ve nearly completed your Academy journey - amazing work!';
  } else if (progress >= 70) {
    return 'Excellent progress! You\'re developing into a strong Academy community member.';
  } else if (progress >= 50) {
    return 'Great momentum! You\'re halfway to AI creative collaboration.';
  } else if (progress >= 25) {
    return 'Good progress! Every step brings you closer to your creative goals.';
  } else {
    return 'Welcome to Eden Academy! Your creative journey is just beginning.';
  }
}

function generateNextMilestone(currentStage: string): string {
  const milestones: Record<string, string> = {
    'portfolio-submission': 'Next: Explore how your values align with Academy culture',
    'cultural-alignment-check': 'Next: Assessment of your creative skills and learning style',
    'skill-assessment': 'Next: Discover your ideal AI agent collaboration opportunities',
    'agent-potential-mapping': 'Next: Integration with Academy training community',
    'academy-integration': 'Next: Select your specialized AI collaboration training path',
    'training-path-selection': 'Next: Complete onboarding and begin creating!',
    'completed': 'Begin your AI creative collaboration journey!'
  };
  
  return milestones[currentStage] || 'Continue your Academy journey at your own pace.';
}