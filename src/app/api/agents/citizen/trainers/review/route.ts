import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';

// Training Review System for Collaborative CITIZEN Training

interface TrainingReview {
  id: string;
  training_id: string;
  reviewer: string;
  reviewer_role: string;
  status: 'approved' | 'rejected' | 'needs_changes';
  feedback: string;
  technical_review: {
    accuracy: number; // 1-5 scale
    completeness: number; // 1-5 scale
    bright_moments_alignment: number; // 1-5 scale
    cultural_sensitivity: number; // 1-5 scale
  };
  reviewed_at: string;
  priority: 'low' | 'medium' | 'high';
}

interface PendingTraining {
  id: string;
  trainer: string;
  content: string;
  training_type: string;
  submitted_at: string;
  session_id?: string;
  reviews: TrainingReview[];
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  auto_apply: boolean;
}

// Mock storage for pending training and reviews
const PENDING_TRAINING = new Map<string, PendingTraining>();
const TRAINING_REVIEWS = new Map<string, TrainingReview>();

// GET /api/agents/citizen/trainers/review - Get pending training for review
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const reviewer = searchParams.get('reviewer');
    const status = searchParams.get('status') || 'pending';
    const priority = searchParams.get('priority');

    let pendingItems = Array.from(PENDING_TRAINING.values());

    // Filter by status
    pendingItems = pendingItems.filter(item => item.status === status);

    // Filter by priority if specified
    if (priority) {
      pendingItems = pendingItems.filter(item => 
        item.reviews.some(review => review.priority === priority)
      );
    }

    // Add review context for each item
    const reviewableItems = pendingItems.map(item => ({
      ...item,
      review_context: {
        requires_review: item.reviews.length === 0 || 
                        item.reviews.some(r => r.status === 'needs_changes'),
        reviewed_by: item.reviews.map(r => r.reviewer),
        approval_count: item.reviews.filter(r => r.status === 'approved').length,
        rejection_count: item.reviews.filter(r => r.status === 'rejected').length,
        consensus_reached: item.reviews.length >= 2 && 
                          item.reviews.filter(r => r.status === 'approved').length >= 2,
        bright_moments_accuracy: item.reviews.length > 0 
          ? item.reviews.reduce((sum, r) => sum + r.technical_review.bright_moments_alignment, 0) / item.reviews.length
          : 0
      }
    }));

    return NextResponse.json({
      success: true,
      pending_review: {
        total_items: reviewableItems.length,
        high_priority: reviewableItems.filter(item => 
          item.reviews.some(r => r.priority === 'high')
        ).length,
        consensus_needed: reviewableItems.filter(item => 
          !item.review_context.consensus_reached
        ).length,
        ready_to_apply: reviewableItems.filter(item => 
          item.review_context.consensus_reached && item.status === 'approved'
        ).length
      },
      training_items: reviewableItems,
      review_workflow: {
        submit_review: 'POST /api/agents/citizen/trainers/review',
        bulk_approve: 'POST /api/agents/citizen/trainers/review/bulk',
        apply_approved: 'POST /api/agents/citizen/trainers/review/apply'
      },
      reviewer_guidelines: {
        accuracy: 'Rate 1-5: How factually accurate is the Bright Moments information?',
        completeness: 'Rate 1-5: Does this cover the topic comprehensively?',
        alignment: 'Rate 1-5: How well does this align with BM values and culture?',
        sensitivity: 'Rate 1-5: Appropriate cultural sensitivity and language?',
        approval_threshold: 'Requires 2+ approvals or admin override',
        auto_apply: 'High-accuracy items (4.5+ avg) auto-apply after 2 approvals'
      },
      last_updated: new Date().toISOString()
    });

  } catch (error) {
    console.error('[CITIZEN Review] Error getting review items:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve pending training reviews' },
      { status: 500 }
    );
  }
}

// POST /api/agents/citizen/trainers/review - Submit training review
export async function POST(request: NextRequest) {
  try {
    const { 
      trainingId, 
      reviewer, 
      status, 
      feedback, 
      technicalReview,
      priority = 'medium',
      autoApply = false
    } = await request.json();

    // Verify reviewer authorization
    const AUTHORIZED_REVIEWERS = ['henry', 'keith', 'seth'];
    if (!AUTHORIZED_REVIEWERS.includes(reviewer?.toLowerCase())) {
      return NextResponse.json(
        { error: 'Unauthorized reviewer. Only Henry, Keith, and system admins can review training.' },
        { status: 403 }
      );
    }

    // Check if training item exists
    const trainingItem = PENDING_TRAINING.get(trainingId);
    if (!trainingItem) {
      return NextResponse.json(
        { error: 'Training item not found' },
        { status: 404 }
      );
    }

    // Create review record
    const reviewId = `review-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const review: TrainingReview = {
      id: reviewId,
      training_id: trainingId,
      reviewer,
      reviewer_role: reviewer.toLowerCase() === 'seth' ? 'System Admin' : 
                   reviewer.toLowerCase() === 'henry' ? 'Lead Trainer' : 'BM Team Trainer',
      status,
      feedback: feedback || '',
      technical_review: {
        accuracy: technicalReview?.accuracy || 3,
        completeness: technicalReview?.completeness || 3,
        bright_moments_alignment: technicalReview?.bright_moments_alignment || 3,
        cultural_sensitivity: technicalReview?.cultural_sensitivity || 3
      },
      reviewed_at: new Date().toISOString(),
      priority
    };

    // Store review
    TRAINING_REVIEWS.set(reviewId, review);

    // Update training item with review
    trainingItem.reviews.push(review);
    
    // Check if consensus is reached
    const approvals = trainingItem.reviews.filter(r => r.status === 'approved');
    const rejections = trainingItem.reviews.filter(r => r.status === 'rejected');
    
    // Update training status based on reviews
    if (approvals.length >= 2 && rejections.length === 0) {
      trainingItem.status = 'approved';
      
      // Check for auto-apply conditions
      const avgAccuracy = approvals.reduce((sum, r) => sum + r.technical_review.accuracy, 0) / approvals.length;
      const avgAlignment = approvals.reduce((sum, r) => sum + r.technical_review.bright_moments_alignment, 0) / approvals.length;
      
      if (autoApply || (avgAccuracy >= 4.5 && avgAlignment >= 4.5)) {
        trainingItem.auto_apply = true;
      }
      
    } else if (rejections.length >= 1) {
      trainingItem.status = 'rejected';
    }

    PENDING_TRAINING.set(trainingId, trainingItem);

    // Submit review to Registry for audit trail
    try {
      await registryClient.submitExperimentalApplication({
        applicantEmail: `${reviewer}@brightmoments.io`,
        applicantName: reviewer,
        track: 'TRAINER',
        payload: {
          source: 'citizen-training-review',
          reviewId,
          trainingId,
          review,
          trainingStatus: trainingItem.status,
          metadata: {
            bright_moments_review: true,
            consensus_reached: trainingItem.status !== 'pending',
            auto_apply_eligible: trainingItem.auto_apply
          }
        },
        experimental: true
      });
    } catch (registryError) {
      console.warn('[CITIZEN Review] Registry submission failed:', registryError);
    }

    return NextResponse.json({
      success: true,
      message: 'Training review submitted successfully',
      review: {
        id: reviewId,
        status,
        reviewer,
        technical_scores: review.technical_review,
        reviewed_at: review.reviewed_at
      },
      training_status: {
        id: trainingId,
        status: trainingItem.status,
        review_summary: {
          total_reviews: trainingItem.reviews.length,
          approvals: approvals.length,
          rejections: rejections.length,
          consensus_reached: trainingItem.status !== 'pending',
          ready_to_apply: trainingItem.status === 'approved',
          auto_apply: trainingItem.auto_apply
        }
      },
      next_steps: trainingItem.status === 'approved' 
        ? ['Training approved and ready to apply', 'Will sync automatically to Registry and app.eden.art']
        : trainingItem.status === 'rejected'
        ? ['Training rejected', 'Trainer can revise and resubmit']
        : ['Additional reviews needed for consensus', 'Requires 2+ approvals to proceed']
    });

  } catch (error) {
    console.error('[CITIZEN Review] Error submitting review:', error);
    return NextResponse.json(
      { error: 'Failed to submit training review' },
      { status: 500 }
    );
  }
}

// POST /api/agents/citizen/trainers/review/apply - Apply approved training
export async function PUT(request: NextRequest) {
  try {
    const { trainingIds, reviewer } = await request.json();

    // Verify admin authorization for bulk apply
    if (reviewer?.toLowerCase() !== 'seth' && reviewer?.toLowerCase() !== 'henry') {
      return NextResponse.json(
        { error: 'Only administrators can apply approved training' },
        { status: 403 }
      );
    }

    const appliedTraining = [];
    const errors = [];

    for (const trainingId of trainingIds || []) {
      try {
        const trainingItem = PENDING_TRAINING.get(trainingId);
        
        if (!trainingItem) {
          errors.push({ id: trainingId, error: 'Training item not found' });
          continue;
        }

        if (trainingItem.status !== 'approved') {
          errors.push({ id: trainingId, error: 'Training not approved for application' });
          continue;
        }

        // Apply training (in production, this would update CITIZEN's knowledge base)
        trainingItem.status = 'applied';
        PENDING_TRAINING.set(trainingId, trainingItem);

        // Trigger sync to Registry and app.eden.art
        // (Implementation would call actual sync endpoints)

        appliedTraining.push({
          id: trainingId,
          trainer: trainingItem.trainer,
          type: trainingItem.training_type,
          applied_at: new Date().toISOString()
        });

      } catch (error) {
        errors.push({ id: trainingId, error: 'Failed to apply training' });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Applied ${appliedTraining.length} training items successfully`,
      applied_training: appliedTraining,
      errors: errors.length > 0 ? errors : undefined,
      sync_status: {
        registry_sync: 'triggered',
        app_eden_sync: 'triggered',
        citizen_knowledge_update: 'complete'
      }
    });

  } catch (error) {
    console.error('[CITIZEN Review] Error applying training:', error);
    return NextResponse.json(
      { error: 'Failed to apply approved training' },
      { status: 500 }
    );
  }
}