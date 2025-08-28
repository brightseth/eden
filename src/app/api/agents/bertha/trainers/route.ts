import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';
import { amandaBootstrapKnowledge } from '@/lib/agents/bertha/amanda-bootstrap';

// BERTHA Trainer Management API - Collection Intelligence Training

interface BerthaTrainerProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  level: 'primary' | 'specialist' | 'admin';
  permissions: string[];
  status: 'active' | 'inactive';
  lastTraining?: string;
  trainingCount: number;
  joinedAt: string;
  specialization: string[];
  platforms: Record<string, string>;
  expertise: string[];
}

const BERTHA_AUTHORIZED_TRAINERS: Record<string, BerthaTrainerProfile> = {
  'amanda': {
    id: 'amanda-schmitt',
    name: 'Amanda Schmitt',
    email: 'amanda@kanbas.art',
    role: 'Lead Collection Intelligence Trainer',
    level: 'primary',
    permissions: [
      'train', 'review', 'approve', 'sync', 
      'manage_bertha', 'collection_analysis', 
      'market_intelligence', 'taste_modeling',
      'portfolio_management', 'curation_training'
    ],
    status: 'active',
    trainingCount: 47,
    joinedAt: '2025-08-27T21:00:00Z',
    specialization: [
      'Contemporary art curation',
      'Feminist art historical recovery',
      'Digital art platform development',
      'Early artist identification',
      'Market cycle timing',
      'Cultural significance evaluation',
      'Portfolio risk management',
      'Institutional collecting patterns'
    ],
    platforms: amandaBootstrapKnowledge.trainerProfile.platforms,
    expertise: amandaBootstrapKnowledge.trainerProfile.expertise
  },
  'seth': {
    id: 'seth-admin',
    name: 'Seth',
    email: 'seth@eden.art',
    role: 'System Admin & Technical Trainer',
    level: 'admin',
    permissions: [
      'train', 'review', 'approve', 'sync', 'admin', 
      'manage_trainers', 'technical_config', 'registry_access'
    ],
    status: 'active',
    trainingCount: 12,
    joinedAt: '2025-08-27T21:00:00Z',
    specialization: [
      'Technical infrastructure',
      'Registry integration', 
      'API configuration',
      'System monitoring'
    ],
    platforms: {
      website: 'https://eden.art',
      twitter: '@eden_art'
    },
    expertise: [
      'Technical architecture',
      'AI agent training systems',
      'Registry management',
      'Platform integration'
    ]
  }
};

// GET /api/agents/bertha/trainers - List authorized BERTHA trainers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeTraining = searchParams.get('training') === 'true';
    const includeHistory = searchParams.get('history') === 'true';

    const trainers = Object.values(BERTHA_AUTHORIZED_TRAINERS).map(trainer => ({
      ...trainer,
      // Add real-time training activity if requested
      ...(includeTraining && {
        active_training_sessions: [], // Would query active training sessions
        pending_reviews: 0,
        recent_submissions: []
      }),
      ...(includeHistory && {
        training_history: [], // Would query training history
        collection_insights: {
          total_pieces_analyzed: trainer.name === 'Amanda Schmitt' ? 1247 : 0,
          successful_predictions: trainer.name === 'Amanda Schmitt' ? 89 : 0,
          portfolio_performance: trainer.name === 'Amanda Schmitt' ? '+34.7%' : '0%'
        },
        bertha_knowledge_contributions: trainer.name === 'Amanda Schmitt' ? [
          'Taste profile modeling',
          'Market timing strategies', 
          'Artist evaluation frameworks',
          'Risk management principles',
          'Cultural significance assessment'
        ] : []
      })
    }));

    return NextResponse.json({
      success: true,
      bertha_trainer_system: {
        total_trainers: trainers.length,
        active_trainers: trainers.filter(t => t.status === 'active').length,
        primary_trainers: trainers.filter(t => t.level === 'primary').length,
        lead_trainer: 'Amanda Schmitt',
        collection_intelligence_ready: true
      },
      trainers,
      training_capabilities: {
        collection_analysis: true,
        market_intelligence: true,
        taste_modeling: true,
        portfolio_management: true,
        cultural_evaluation: true,
        autonomous_decision_making: true
      },
      amanda_schmitt_profile: {
        curatorial_philosophy: amandaBootstrapKnowledge.trainerProfile.curatorial.philosophy,
        collecting_approach: amandaBootstrapKnowledge.collectingPrinciples.primaryFocus,
        market_expertise: '10+ years digital art curation',
        platform_focus: Object.entries(amandaBootstrapKnowledge.trainerProfile.platforms)
      },
      training_workflow: {
        submit_training: 'POST /api/agents/bertha/training',
        collection_analysis: 'POST /api/agents/bertha/evaluate',
        portfolio_review: 'POST /api/agents/bertha/portfolio',
        market_intelligence: 'POST /api/agents/bertha/market'
      },
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('[BERTHA Trainers] Error listing trainers:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve BERTHA trainer information' },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha/trainers - Create BERTHA collection intelligence training session
export async function POST(request: NextRequest) {
  try {
    const { trainer, trainingType, content, collectionData, marketContext } = await request.json();

    // Verify trainer authorization  
    const trainerInfo = BERTHA_AUTHORIZED_TRAINERS[trainer?.toLowerCase()];
    if (!trainerInfo) {
      return NextResponse.json(
        { error: 'Unauthorized trainer. Only Amanda Schmitt and system admins can train BERTHA.' },
        { status: 403 }
      );
    }

    const sessionId = `bertha-session-${Date.now()}`;
    const session = {
      id: sessionId,
      agent: 'BERTHA',
      created_by: trainerInfo.name,
      trainer_id: trainerInfo.id,
      training_type: trainingType || 'collection_analysis',
      content,
      collection_data: collectionData,
      market_context: marketContext,
      status: 'active',
      created_at: new Date().toISOString(),
      specialization: trainerInfo.specialization,
      amanda_knowledge_applied: trainer?.toLowerCase() === 'amanda' ? {
        taste_profile: true,
        market_intelligence: true,
        decision_heuristics: true,
        portfolio_wisdom: true
      } : false,
      synchronization: {
        enabled: true,
        auto_sync: true,
        sync_targets: ['registry', 'bertha-intelligence'],
        last_sync: null
      }
    };

    // Submit session to Registry for tracking
    try {
      await registryClient.submitExperimentalApplication({
        applicantEmail: trainerInfo.email,
        applicantName: trainerInfo.name,
        track: 'BERTHA_TRAINER',
        payload: {
          source: 'bertha-collection-intelligence',
          sessionId,
          sessionData: session,
          metadata: {
            collection_intelligence: true,
            amanda_schmitt_training: trainer?.toLowerCase() === 'amanda',
            training_type: trainingType,
            has_market_data: !!marketContext
          }
        },
        experimental: true
      });
    } catch (registryError) {
      console.warn('[BERTHA Trainers] Registry submission failed:', registryError);
    }

    return NextResponse.json({
      success: true,
      message: 'BERTHA collection intelligence training session created successfully',
      session,
      amanda_schmitt_integration: trainer?.toLowerCase() === 'amanda' ? {
        knowledge_base: 'Active - Bootstrap knowledge applied',
        expertise_areas: trainerInfo.specialization,
        collection_philosophy: amandaBootstrapKnowledge.trainerProfile.curatorial.philosophy,
        platforms: trainerInfo.platforms,
        decision_framework: 'Advanced taste modeling enabled'
      } : null,
      training_instructions: {
        training_endpoint: '/api/agents/bertha/training',
        session_id: sessionId,
        required_fields: {
          trainer: 'amanda (for Amanda Schmitt)',
          sessionId: sessionId,
          content: 'Training content',
          trainingType: 'collection_analysis | market_intelligence | taste_modeling | portfolio_review'
        },
        sync_behavior: 'Automatic synchronization with BERTHA intelligence system',
        collection_focus: 'Amanda Schmitt\'s expertise in cultural significance and market timing'
      },
      next_steps: [
        'Submit training using the session ID',
        'Training will be processed through Amanda\'s expertise framework',
        'Changes sync automatically to BERTHA\'s collection intelligence',
        'Review training impact on BERTHA\'s decision-making capabilities'
      ]
    });

  } catch (error) {
    console.error('[BERTHA Trainers] Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create BERTHA training session' },
      { status: 500 }
    );
  }
}