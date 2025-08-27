import { NextRequest, NextResponse } from 'next/server';
import { loadTrainingData } from '@/lib/agents/bertha/training-storage';

// Simple in-memory store for demo purposes
// In production, this would be a proper database
let trainingSubmissions: any[] = [];

export async function GET(request: NextRequest) {
  try {
    console.log('Admin: Fetching BERTHA training submissions');
    
    // Try to load from file storage first
    let submissions = [];
    try {
      submissions = await loadTrainingData();
      console.log(`Loaded ${submissions.length} submissions from storage`);
    } catch (storageError) {
      console.warn('Storage not available, using in-memory data:', storageError);
      submissions = trainingSubmissions;
    }
    
    return NextResponse.json({
      success: true,
      submissions: submissions.map(sub => ({
        id: sub.id,
        trainer: sub.trainer,
        timestamp: sub.timestamp,
        responseCount: Object.keys(sub.responses || {}).length,
        status: sub.status,
        responses: sub.responses
      }))
    });
    
  } catch (error) {
    console.error('Failed to fetch training submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to manually add training data for testing
    const submission = await request.json();
    
    trainingSubmissions.push({
      ...submission,
      id: submission.id || `manual-${Date.now()}`,
      timestamp: submission.timestamp || new Date().toISOString()
    });
    
    console.log('Manual training submission added:', submission.id);
    
    return NextResponse.json({
      success: true,
      message: 'Submission added successfully'
    });
    
  } catch (error) {
    console.error('Failed to add training submission:', error);
    return NextResponse.json(
      { error: 'Failed to add submission' },
      { status: 500 }
    );
  }
}