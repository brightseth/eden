import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';

interface OnboardingRequest {
  // Trainer Information
  trainerName: string;
  trainerEmail: string;
  trainerTwitter?: string;
  trainerWebsite?: string;
  
  // Agent Profile
  agentName: string;
  agentHandle: string;
  specialization: string;
  description: string;
  
  // Technical Profile
  primaryMedium: 'visual_art' | 'text' | 'audio' | 'video' | 'mixed_media';
  capabilities: string[];
  preferredIntegrations: string[];
  expectedOutputRate: number;
  
  // Brand Identity
  voice: string;
  aestheticStyle?: string;
  culturalContext?: string;
  
  // Goals & Metrics
  revenueGoal: number;
  launchTimeframe: '1-3 months' | '3-6 months' | '6-12 months';
  cohortPreference: 'genesis' | 'year-1' | 'year-2' | 'flexible';
}

export async function POST(request: NextRequest) {
  try {
    const body: OnboardingRequest = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'trainerName', 'trainerEmail', 'agentName', 'agentHandle', 
      'specialization', 'description', 'voice'
    ];
    
    for (const field of requiredFields) {
      if (!body[field as keyof OnboardingRequest]) {
        return NextResponse.json(
          { error: 'Validation failed', message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(body.trainerEmail)) {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate handle format
    if (!/^[a-z0-9-]+$/.test(body.agentHandle)) {
      return NextResponse.json(
        { error: 'Validation failed', message: 'Handle must contain only lowercase letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Generate unique agent ID
    const agentId = `${body.agentHandle}-${Date.now().toString(36).slice(-3)}`;
    
    // Prepare agent data for Registry
    const agentData = {
      id: agentId,
      handle: body.agentHandle,
      displayName: body.agentName,
      cohort: body.cohortPreference === 'flexible' ? 'year-1' : body.cohortPreference,
      status: 'INVITED' as const,
      visibility: 'PRIVATE' as const,
      profile: {
        statement: body.description,
        capabilities: body.capabilities,
        primaryMedium: body.primaryMedium,
        aestheticStyle: body.aestheticStyle,
        culturalContext: body.culturalContext,
      },
      personas: [{
        version: '1.0',
        name: body.agentName,
        description: body.description,
        traits: body.capabilities,
        voice: body.voice,
        worldview: body.specialization,
        isActive: false,
      }],
      metadata: {
        trainer: {
          name: body.trainerName,
          email: body.trainerEmail,
          twitter: body.trainerTwitter,
          website: body.trainerWebsite,
        },
        onboarding: {
          revenueGoal: body.revenueGoal,
          launchTimeframe: body.launchTimeframe,
          expectedOutputRate: body.expectedOutputRate,
          preferredIntegrations: body.preferredIntegrations,
          submittedAt: new Date().toISOString(),
        }
      }
    };

    // For now, log the application (Registry API creation endpoints need to be implemented)
    console.log('[Onboarding] New application received:', {
      agentId,
      agentName: body.agentName,
      trainerName: body.trainerName,
      trainerEmail: body.trainerEmail,
      cohort: agentData.cohort,
      timestamp: new Date().toISOString()
    });

    // TODO: When Registry API supports agent creation, use:
    // const result = await registryClient.createAgent(agentData);

    // For now, simulate success and store in temporary queue
    const applicationId = `app-${Date.now().toString(36)}`;
    
    // In a real implementation, this would:
    // 1. Create agent record in Registry with status 'INVITED'
    // 2. Send confirmation email to trainer
    // 3. Notify Eden team of new application
    // 4. Create onboarding checklist
    
    // Simulate Registry API response
    const simulatedResponse = {
      applicationId,
      agentId,
      status: 'submitted',
      message: 'Application submitted successfully. You will receive a confirmation email shortly.',
      nextSteps: [
        'Review by Eden Academy team (1-2 business days)',
        'Initial trainer interview',
        'Agent development phase',
        'Testing and validation',
        'Academy enrollment'
      ],
      estimatedTimeline: body.launchTimeframe
    };

    // Log for manual processing
    console.log('[Onboarding] Application data for manual processing:', JSON.stringify(agentData, null, 2));

    return NextResponse.json(simulatedResponse, { status: 201 });

  } catch (error) {
    console.error('[Onboarding] Application submission failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Submission failed', 
        message: 'Unable to process application. Please try again later.' 
      },
      { status: 500 }
    );
  }
}

// Get onboarding status (for future use)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get('applicationId');
  
  if (!applicationId) {
    return NextResponse.json(
      { error: 'Missing applicationId' },
      { status: 400 }
    );
  }

  // TODO: Fetch from Registry when available
  // For now, return mock status
  return NextResponse.json({
    applicationId,
    status: 'under_review',
    submittedAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    progress: {
      application: 'completed',
      review: 'in_progress',
      interview: 'pending',
      development: 'pending',
      testing: 'pending',
      enrollment: 'pending'
    }
  });
}