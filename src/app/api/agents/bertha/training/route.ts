import { NextRequest, NextResponse } from 'next/server';
import { berthaClaude } from '@/lib/agents/bertha/claude-sdk';
import { incorporateTrainingData } from '@/lib/agents/bertha/config';
import { saveTrainingData, sendTrainingNotification, initializeBootstrapData } from '@/lib/agents/bertha/training-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract training data from interview
    const { trainer, timestamp, sections } = body;
    
    // Flatten responses for processing
    const responses: Record<string, any> = {};
    sections.forEach((section: any) => {
      section.responses.forEach((item: any) => {
        const questionId = item.question.toLowerCase().replace(/\s+/g, '-').slice(0, 30);
        responses[questionId] = item.response;
      });
    });
    
    // Process with Claude SDK
    const configUpdates = await berthaClaude.processTrainerInterview(responses);
    
    // Store training data
    const trainingRecord = {
      id: `training-${Date.now()}`,
      trainer,
      timestamp,
      responses,
      configUpdates,
      status: 'processed' as const
    };
    
    // Initialize bootstrap data if needed
    await initializeBootstrapData();
    
    // Save to file storage
    await saveTrainingData(trainingRecord);
    
    // Send notification (console log for now)
    await sendTrainingNotification('amanda@eden.art', trainingRecord);
    
    console.log('BERTHA training data processed and saved:', trainingRecord);
    
    return NextResponse.json({
      success: true,
      message: 'Training data processed successfully',
      updates: configUpdates
    });
    
  } catch (error) {
    console.error('Failed to process BERTHA training data:', error);
    return NextResponse.json(
      { error: 'Failed to process training data' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve current training status
export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database
    const trainingStatus = {
      agent: 'bertha',
      trainer: 'Amanda Schmitt',
      lastUpdated: new Date().toISOString(),
      completedSections: 4,
      totalSections: 4,
      status: 'ready',
      capabilities: [
        'Market analysis',
        'Price prediction',
        'Taste modeling',
        'Risk assessment',
        'Portfolio optimization'
      ]
    };
    
    return NextResponse.json(trainingStatus);
    
  } catch (error) {
    console.error('Failed to get training status:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve training status' },
      { status: 500 }
    );
  }
}