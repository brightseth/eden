import { NextRequest, NextResponse } from 'next/server';

// Training Session Management for Multi-Trainer Collaboration

interface TrainingSession {
  id: string;
  agent: string;
  created_by: string;
  collaborators: string[];
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  last_activity: string;
  training_submissions: TrainingSubmission[];
  sync_status: {
    registry_synced: boolean;
    app_eden_synced: boolean;
    last_sync: string | null;
  };
}

interface TrainingSubmission {
  id: string;
  session_id: string;
  trainer: string;
  content: string;
  training_type: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  reviews: TrainingReview[];
}

interface TrainingReview {
  reviewer: string;
  status: 'approved' | 'rejected' | 'needs_changes';
  feedback: string;
  reviewed_at: string;
}

// Mock training sessions storage (in production, this would be in a database)
const TRAINING_SESSIONS = new Map<string, TrainingSession>();
const TRAINING_SUBMISSIONS = new Map<string, TrainingSubmission>();

// GET /api/agents/citizen/trainers/sessions - List all training sessions
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const trainer = searchParams.get('trainer');
    const status = searchParams.get('status');
    const includeSubmissions = searchParams.get('submissions') === 'true';

    let sessions = Array.from(TRAINING_SESSIONS.values());

    // Filter by trainer if specified
    if (trainer) {
      sessions = sessions.filter(session => 
        session.created_by.toLowerCase() === trainer.toLowerCase() ||
        session.collaborators.some(collab => collab.toLowerCase() === trainer.toLowerCase())
      );
    }

    // Filter by status if specified
    if (status) {
      sessions = sessions.filter(session => session.status === status);
    }

    // Add submission details if requested
    if (includeSubmissions) {
      sessions = sessions.map(session => ({
        ...session,
        training_submissions: Array.from(TRAINING_SUBMISSIONS.values())
          .filter(submission => submission.session_id === session.id)
      }));
    }

    return NextResponse.json({
      success: true,
      sessions: {
        total: sessions.length,
        active: sessions.filter(s => s.status === 'active').length,
        completed: sessions.filter(s => s.status === 'completed').length
      },
      training_sessions: sessions,
      collaboration_summary: {
        multi_trainer_sessions: sessions.filter(s => s.collaborators.length > 0).length,
        henry_sessions: sessions.filter(s => 
          s.created_by.toLowerCase().includes('henry') || 
          s.collaborators.some(c => c.toLowerCase().includes('henry'))
        ).length,
        keith_sessions: sessions.filter(s => 
          s.created_by.toLowerCase().includes('keith') || 
          s.collaborators.some(c => c.toLowerCase().includes('keith'))
        ).length,
        pending_reviews: Array.from(TRAINING_SUBMISSIONS.values())
          .filter(sub => sub.status === 'pending').length
      },
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('[CITIZEN Sessions] Error listing sessions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve training sessions' },
      { status: 500 }
    );
  }
}

// POST /api/agents/citizen/trainers/sessions - Create new training session
export async function POST(request: NextRequest) {
  try {
    const { trainer, sessionType, collaborators, description, duration } = await request.json();

    // Verify trainer authorization
    const AUTHORIZED_TRAINERS = ['henry', 'keith', 'seth'];
    if (!AUTHORIZED_TRAINERS.includes(trainer?.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unauthorized trainer. Only Henry, Keith, and system admins can create sessions.' },
        { status: 403 }
      );
    }

    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const session: TrainingSession = {
      id: sessionId,
      agent: 'CITIZEN',
      created_by: trainer,
      collaborators: collaborators || [],
      status: 'active',
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      training_submissions: [],
      sync_status: {
        registry_synced: false,
        app_eden_synced: false,
        last_sync: null
      }
    };

    // Store session
    TRAINING_SESSIONS.set(sessionId, session);

    // Auto-expire session if duration specified
    if (duration && duration > 0) {
      setTimeout(() => {
        const currentSession = TRAINING_SESSIONS.get(sessionId);
        if (currentSession && currentSession.status === 'active') {
          currentSession.status = 'completed';
          TRAINING_SESSIONS.set(sessionId, currentSession);
        }
      }, duration * 60000); // duration in minutes
    }

    return NextResponse.json({
      success: true,
      message: 'Training session created successfully',
      session,
      usage_instructions: {
        submit_training: {
          endpoint: 'POST /api/agents/citizen/training',
          required_headers: { 'Content-Type': 'application/json' },
          required_body: {
            trainer: 'Your trainer name (henry/keith)',
            sessionId: sessionId,
            content: 'Training content here',
            trainingType: 'lore_update | governance_update | community_insight | general'
          }
        },
        collaborate: {
          share_session_id: sessionId,
          invite_collaborators: 'Add collaborator names to session',
          review_submissions: 'GET /api/agents/citizen/trainers/sessions?submissions=true',
          approve_changes: 'POST /api/agents/citizen/trainers/review'
        }
      },
      collaboration_features: [
        'Real-time synchronization across all trainer machines',
        'Training review and approval workflow',
        'Automatic Registry and app.eden.art sync',
        'Activity logging and audit trail',
        'Cross-trainer visibility and communication'
      ]
    });

  } catch (error) {
    console.error('[CITIZEN Sessions] Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create training session' },
      { status: 500 }
    );
  }
}

// PUT /api/agents/citizen/trainers/sessions - Update session status
export async function PUT(request: NextRequest) {
  try {
    const { sessionId, action, trainer } = await request.json();

    const session = TRAINING_SESSIONS.get(sessionId);
    if (!session) {
      return NextResponse.json(
        { error: 'Training session not found' },
        { status: 404 }
      );
    }

    // Verify trainer has permission to modify session
    if (session.created_by.toLowerCase() !== trainer?.toLowerCase() && 
        !session.collaborators.some(c => c.toLowerCase() === trainer?.toLowerCase()) &&
        trainer?.toLowerCase() !== 'seth') {
      return NextResponse.json(
        { error: 'Unauthorized to modify this training session' },
        { status: 403 }
      );
    }

    // Update session based on action
    switch (action) {
      case 'pause':
        session.status = 'paused';
        break;
      case 'resume':
        session.status = 'active';
        break;
      case 'complete':
        session.status = 'completed';
        break;
      case 'add_collaborator':
        const newCollaborator = request.nextUrl.searchParams.get('collaborator');
        if (newCollaborator && !session.collaborators.includes(newCollaborator)) {
          session.collaborators.push(newCollaborator);
        }
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: pause, resume, complete, add_collaborator' },
          { status: 400 }
        );
    }

    session.last_activity = new Date().toISOString();
    TRAINING_SESSIONS.set(sessionId, session);

    return NextResponse.json({
      success: true,
      message: `Session ${action} completed successfully`,
      session,
      status: session.status
    });

  } catch (error) {
    console.error('[CITIZEN Sessions] Error updating session:', error);
    return NextResponse.json(
      { error: 'Failed to update training session' },
      { status: 500 }
    );
  }
}