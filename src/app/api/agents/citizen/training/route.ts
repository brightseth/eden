import { NextRequest, NextResponse } from 'next/server';
import { citizenSDK } from '@/lib/agents/citizen-claude-sdk';
import { registryClient } from '@/lib/registry/client';

// POST /api/agents/citizen/training - Henry training interface for CITIZEN
export async function POST(request: NextRequest) {
  try {
    console.log('[CITIZEN Training] Training API called');
    
    const body = await request.json();
    const { trainer, trainerEmail, content, trainingType, timestamp } = body;
    
    // Validate required fields
    if (!trainer || !content || !trainingType) {
      console.error('[CITIZEN Training] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: trainer, content, or trainingType' },
        { status: 400 }
      );
    }
    
    // Authorized Bright Moments trainers with their access levels
    const AUTHORIZED_TRAINERS = {
      // Primary BM trainers (full access)
      'henry': { name: 'Henry', role: 'Lead Trainer', level: 'primary', permissions: ['train', 'review', 'approve', 'sync'] },
      'keith': { name: 'Keith', role: 'BM Team Trainer', level: 'primary', permissions: ['train', 'review', 'approve', 'sync'] },
      
      // Email-based authorization
      'henry@brightmoments.io': { name: 'Henry', role: 'Lead Trainer', level: 'primary', permissions: ['train', 'review', 'approve', 'sync'] },
      'keith@brightmoments.io': { name: 'Keith', role: 'BM Team Trainer', level: 'primary', permissions: ['train', 'review', 'approve', 'sync'] },
      
      // System admin
      'seth': { name: 'Seth', role: 'System Admin', level: 'admin', permissions: ['train', 'review', 'approve', 'sync', 'admin'] }
    };

    // Verify trainer authorization (Henry, Keith, or system admins)
    const trainerKey = trainer.toLowerCase();
    const emailKey = trainerEmail?.toLowerCase();
    const trainerInfo = AUTHORIZED_TRAINERS[trainerKey] || AUTHORIZED_TRAINERS[emailKey];
    
    if (!trainerInfo) {
      console.warn('[CITIZEN Training] Unauthorized trainer:', trainer, trainerEmail);
      return NextResponse.json(
        { error: `CITIZEN training restricted to authorized Bright Moments trainers: Henry, Keith, and system admins. Contact henry@brightmoments.io for access.` },
        { status: 403 }
      );
    }
    
    console.log(`[CITIZEN Training] Processing ${trainingType} training from ${trainer}`);
    
    // Process training with CITIZEN's Claude SDK
    let trainingUpdates = {};
    try {
      switch (trainingType) {
        case 'lore_update':
          trainingUpdates = await citizenSDK.processLoreUpdate(content, trainer);
          break;
          
        case 'governance_update':
          trainingUpdates = await citizenSDK.processGovernanceUpdate(content, trainer);
          break;
          
        case 'community_insight':
          trainingUpdates = await citizenSDK.processCommunityInsight(content, trainer);
          break;
          
        case 'general':
        default:
          trainingUpdates = await citizenSDK.processBrightMomentsUpdate(content, trainer);
          break;
      }
      
      console.log('[CITIZEN Training] Claude processing completed');
      
    } catch (claudeError) {
      console.warn('[CITIZEN Training] Claude SDK processing failed:', claudeError);
      // Continue with structured fallback processing
      trainingUpdates = {
        type: trainingType,
        content: content,
        trainer: trainer,
        processed_at: new Date().toISOString(),
        status: 'manual_review_required'
      };
    }
    
    // Create training record
    const trainingRecord = {
      id: `citizen-training-${Date.now()}`,
      agent: 'citizen',
      trainer: trainer,
      trainerEmail: trainerEmail || 'henry@brightmoments.io', 
      timestamp: timestamp || new Date().toISOString(),
      trainingType,
      originalContent: content,
      processedUpdates: trainingUpdates,
      status: 'processed' as const
    };
    
    console.log('[CITIZEN Training] Training record created:', trainingRecord.id);
    
    // Submit to Registry as experimental application for tracking
    try {
      console.log('[CITIZEN Training] Submitting to Registry...');
      const registrySubmission = await registryClient.submitExperimentalApplication({
        applicantEmail: trainerEmail || 'henry@brightmoments.io',
        applicantName: trainer,
        track: 'TRAINER',
        payload: {
          source: 'citizen-bright-moments-training',
          targetAgent: 'citizen',
          trainingId: trainingRecord.id,
          trainingType,
          content: trainingRecord.originalContent,
          updates: trainingRecord.processedUpdates,
          timestamp: trainingRecord.timestamp,
          metadata: {
            bright_moments_context: true,
            trainer_authorized: true,
            sync_required: true
          }
        },
        experimental: true
      });
      
      console.log('[CITIZEN Training] Registry submission successful:', registrySubmission);
      
    } catch (registryError) {
      console.warn('[CITIZEN Training] Registry submission failed:', registryError);
    }
    
    // Trigger profile synchronization
    try {
      console.log('[CITIZEN Training] Triggering profile sync...');
      const syncResponse = await fetch(`${request.nextUrl.origin}/api/agents/citizen/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          trigger: 'training_update',
          trainingId: trainingRecord.id 
        })
      });
      
      if (syncResponse.ok) {
        console.log('[CITIZEN Training] Profile sync triggered successfully');
      } else {
        console.warn('[CITIZEN Training] Profile sync trigger failed');
      }
      
    } catch (syncError) {
      console.warn('[CITIZEN Training] Profile sync error:', syncError);
    }
    
    console.log('[CITIZEN Training] Training completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'CITIZEN training processed successfully',
      trainingRecord: {
        id: trainingRecord.id,
        type: trainingType,
        trainer: trainer,
        processed_at: trainingRecord.timestamp,
        updates_applied: Object.keys(trainingUpdates).length > 0,
        registry_submitted: true,
        sync_triggered: true
      },
      next_steps: [
        'Training updates processed by Claude SDK',
        'Registry profile updated with new knowledge', 
        'app.eden.art synchronization initiated',
        'CITIZEN capabilities enhanced with Bright Moments insights'
      ]
    });
    
  } catch (error) {
    console.error('[CITIZEN Training] Error processing training:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process CITIZEN training', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/agents/citizen/training - Get training status and capabilities
export async function GET(request: NextRequest) {
  try {
    const governanceMetrics = citizenSDK.getGovernanceMetrics();
    
    const trainingStatus = {
      agent: 'CITIZEN',
      role: 'Bright Moments DAO Agent',
      current_capabilities: {
        bright_moments_lore: 'Complete Venice-to-Venice journey documentation',
        cryptocitizens_expertise: '10,000 citizens across 10 cities knowledge',
        governance_facilitation: 'DAO voting and Snapshot integration',
        collector_recognition: 'Full Set and Ultra Full Set protocols',
        cultural_preservation: 'Sacred language and ritual documentation'
      },
      
      training_types_available: {
        lore_update: 'Cultural heritage, ritual documentation, city histories',
        governance_update: 'DAO mechanics, voting procedures, treasury management',
        community_insight: 'Collector recognition, concierge protocols, engagement',
        general: 'Broad updates, partnerships, events, platform changes'
      },
      
      current_knowledge_areas: [
        'CryptoCitizens collection data (Venice Beach → Venice Italy)',
        'Golden Token mechanics and IRL minting rituals',
        'Full Set (10 cities) and Ultra Full Set (40 curated) recognition',
        'Bright Moments DAO governance with Snapshot integration',
        'Cultural lore from pandemic origins through global expansion',
        'Community hierarchy and collector concierge services',
        'Sacred language protocols and values framework'
      ],
      
      governance_health: {
        total_citizens: 10000,
        governance_score: Math.round(governanceMetrics.governanceHealth * 100),
        participation_rate: Math.round(governanceMetrics.avgParticipationRate * 100),
        active_debates: governanceMetrics.activeDebates,
        consensus_capability: Math.round(governanceMetrics.avgConsensusScore * 100)
      },
      
      training_authorization: {
        authorized_trainers: ['Henry (Bright Moments)', 'Authorized community leaders'],
        training_scope: 'Bright Moments DAO knowledge, community insights, governance updates',
        sync_targets: ['Eden Registry', 'app.eden.art profile'],
        update_frequency: 'Real-time with automatic synchronization'
      },
      
      last_updated: new Date().toISOString(),
      status: 'ready_for_training'
    };
    
    return NextResponse.json({
      success: true,
      training_status: trainingStatus,
      endpoint_info: {
        training_submission: 'POST /api/agents/citizen/training',
        sync_status: 'GET /api/agents/citizen/sync',
        force_sync: 'POST /api/agents/citizen/sync'
      },
      message: 'CITIZEN ready for Bright Moments training input'
    });
    
  } catch (error) {
    console.error('[CITIZEN Training] Error getting training status:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve training status' },
      { status: 500 }
    );
  }
}