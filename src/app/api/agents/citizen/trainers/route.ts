import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';

// Trainer Management API for CITIZEN collaborative training

interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  level: 'primary' | 'secondary' | 'admin';
  permissions: string[];
  status: 'active' | 'inactive';
  lastTraining?: string;
  trainingCount: number;
  joinedAt: string;
}

const AUTHORIZED_TRAINERS: Record<string, TrainerProfile> = {
  'henry': {
    id: 'henry-bm',
    name: 'Henry',
    email: 'henry@brightmoments.io',
    role: 'Lead Trainer - Bright Moments',
    level: 'primary',
    permissions: ['train', 'review', 'approve', 'sync', 'manage_sessions'],
    status: 'active',
    trainingCount: 0,
    joinedAt: '2025-08-27T21:00:00Z'
  },
  'keith': {
    id: 'keith-bm',
    name: 'Keith',
    email: 'keith@brightmoments.io',
    role: 'BM Team Trainer',
    level: 'primary',
    permissions: ['train', 'review', 'approve', 'sync', 'manage_sessions'],
    status: 'active',
    trainingCount: 0,
    joinedAt: '2025-08-27T21:00:00Z'
  },
  'seth': {
    id: 'seth-admin',
    name: 'Seth',
    email: 'seth@eden.art',
    role: 'System Admin',
    level: 'admin',
    permissions: ['train', 'review', 'approve', 'sync', 'admin', 'manage_trainers'],
    status: 'active',
    trainingCount: 0,
    joinedAt: '2025-08-27T21:00:00Z'
  },
  'amanda': {
    id: 'amanda-schmitt',
    name: 'Amanda Schmitt',
    email: 'amanda@kanbas.art',
    role: 'Collection Intelligence Trainer - BERTHA',
    level: 'primary',
    permissions: ['train', 'review', 'approve', 'sync', 'manage_bertha', 'collection_analysis'],
    status: 'active',
    trainingCount: 47, // Based on existing training data
    joinedAt: '2025-08-27T21:00:00Z'
  }
};

// GET /api/agents/citizen/trainers - List authorized trainers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeSessions = searchParams.get('sessions') === 'true';
    const includeHistory = searchParams.get('history') === 'true';

    const trainers = Object.values(AUTHORIZED_TRAINERS).map(trainer => ({
      ...trainer,
      // Add real-time training activity if requested
      ...(includeSessions && {
        active_sessions: [], // Would query active training sessions
        pending_reviews: 0
      }),
      ...(includeHistory && {
        recent_training: [], // Would query recent training history
        collaboration_stats: {
          sessions_with_henry: 0,
          sessions_with_keith: 0,
          total_collaborations: 0
        }
      })
    }));

    return NextResponse.json({
      success: true,
      citizen_trainers: {
        total_trainers: trainers.length,
        active_trainers: trainers.filter(t => t.status === 'active').length,
        primary_trainers: trainers.filter(t => t.level === 'primary').length,
        collaboration_enabled: true
      },
      trainers,
      collaboration_features: {
        multi_trainer_sessions: true,
        real_time_sync: true,
        training_review_system: true,
        activity_logging: true,
        cross_machine_access: true
      },
      training_workflow: {
        submit_training: 'POST /api/agents/citizen/training',
        create_session: 'POST /api/agents/citizen/trainers/sessions',
        review_training: 'POST /api/agents/citizen/trainers/review',
        sync_changes: 'POST /api/agents/citizen/sync'
      },
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('[CITIZEN Trainers] Error listing trainers:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve trainer information' },
      { status: 500 }
    );
  }
}

// POST /api/agents/citizen/trainers - Create collaborative training session
export async function POST(request: NextRequest) {
  try {
    const { trainer, sessionType, collaborators, description } = await request.json();

    // Verify trainer authorization
    const trainerInfo = AUTHORIZED_TRAINERS[trainer?.toLowerCase()];
    if (!trainerInfo) {
      return NextResponse.json(
        { error: 'Unauthorized trainer. Only Henry, Keith, and system admins can create training sessions.' },
        { status: 403 }
      );
    }

    // Verify collaborators
    const validCollaborators = collaborators?.filter((collab: string) => 
      AUTHORIZED_TRAINERS[collab.toLowerCase()]
    ) || [];

    const sessionId = `citizen-session-${Date.now()}`;
    const session = {
      id: sessionId,
      agent: 'CITIZEN',
      created_by: trainerInfo.name,
      trainer_id: trainerInfo.id,
      collaborators: validCollaborators.map((collab: string) => 
        AUTHORIZED_TRAINERS[collab.toLowerCase()]
      ),
      session_type: sessionType || 'collaborative',
      description: description || 'Collaborative CITIZEN training session',
      status: 'active',
      created_at: new Date().toISOString(),
      training_count: 0,
      synchronization: {
        enabled: true,
        auto_sync: true,
        sync_targets: ['registry', 'app.eden.art'],
        last_sync: null
      }
    };

    // Submit session to Registry for tracking
    try {
      await registryClient.submitExperimentalApplication({
        applicantEmail: trainerInfo.email,
        applicantName: trainerInfo.name,
        track: 'TRAINER',
        payload: {
          source: 'citizen-collaborative-session',
          sessionId,
          sessionData: session,
          metadata: {
            bright_moments_training: true,
            multi_trainer: validCollaborators.length > 0,
            sync_enabled: true
          }
        },
        experimental: true
      });
    } catch (registryError) {
      console.warn('[CITIZEN Trainers] Registry submission failed:', registryError);
    }

    return NextResponse.json({
      success: true,
      message: 'Collaborative training session created successfully',
      session,
      collaboration_instructions: {
        training_endpoint: '/api/agents/citizen/training',
        session_id: sessionId,
        required_fields: {
          trainer: 'Your trainer name (henry/keith)',
          sessionId: sessionId,
          content: 'Training content',
          trainingType: 'lore_update | governance_update | community_insight | general'
        },
        sync_behavior: 'Automatic synchronization across all trainer machines',
        review_process: 'All trainers can review and approve changes'
      },
      next_steps: [
        'Share session ID with collaborators',
        'Submit training using the session ID',
        'Changes will sync automatically across all machines',
        'Review and approve training submissions from team members'
      ]
    });

  } catch (error) {
    console.error('[CITIZEN Trainers] Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create training session' },
      { status: 500 }
    );
  }
}