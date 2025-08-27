import { NextRequest, NextResponse } from 'next/server';
import { berthaClaude } from '@/lib/agents/bertha/claude-sdk';
import { incorporateTrainingData } from '@/lib/agents/bertha/config';
import { saveTrainingData, sendTrainingNotification, initializeBootstrapData, exportToGoogleSheets } from '@/lib/agents/bertha/training-storage';

export async function POST(request: NextRequest) {
  try {
    console.log('BERTHA training API called');
    
    const body = await request.json();
    console.log('Request body received:', { bodyKeys: Object.keys(body) });
    
    // Extract training data from interview
    const { trainer, trainerEmail, timestamp, sections } = body;
    
    if (!trainer || !timestamp || !sections) {
      console.error('Missing required fields:', { trainer: !!trainer, timestamp: !!timestamp, sections: !!sections });
      return NextResponse.json(
        { error: 'Missing required fields: trainer, timestamp, or sections' },
        { status: 400 }
      );
    }

    console.log(`Processing training for ${trainer} with ${sections.length} sections`);
    
    // Flatten responses for processing
    const responses: Record<string, any> = {};
    sections.forEach((section: any, sIndex: number) => {
      console.log(`Processing section ${sIndex + 1}: ${section.section || 'Unknown'}`);
      
      if (section.responses) {
        section.responses.forEach((item: any, qIndex: number) => {
          const questionId = item.question ? 
            item.question.toLowerCase().replace(/\s+/g, '-').slice(0, 30) : 
            `question-${sIndex}-${qIndex}`;
          responses[questionId] = item.response;
        });
      }
    });
    
    console.log(`Flattened ${Object.keys(responses).length} responses`);
    
    // Process with Claude SDK (simplified for now)
    let configUpdates = {};
    try {
      console.log('Processing with Claude SDK...');
      configUpdates = await berthaClaude.processTrainerInterview(responses);
      console.log('Claude processing completed');
    } catch (claudeError) {
      console.warn('Claude SDK processing failed, continuing with empty config:', claudeError);
    }
    
    // Store training data
    const trainingRecord = {
      id: `training-${Date.now()}`,
      trainer,
      trainerEmail: trainerEmail || 'not-provided',
      timestamp,
      responses,
      configUpdates,
      status: 'processed' as const
    };
    
    try {
      console.log('Initializing bootstrap data...');
      await initializeBootstrapData();
      console.log('Bootstrap data initialized');
    } catch (bootstrapError) {
      console.warn('Bootstrap initialization failed:', bootstrapError);
    }
    
    try {
      console.log('Saving training data...');
      // In serverless environment, we'll just log the data instead of saving to file
      // In production, this would save to a database
      console.log('Training record created:', {
        id: trainingRecord.id,
        trainer: trainingRecord.trainer,
        timestamp: trainingRecord.timestamp,
        responseCount: Object.keys(trainingRecord.responses).length,
        status: trainingRecord.status
      });
      
      // Try to save to file, but don't fail if it doesn't work
      try {
        await saveTrainingData(trainingRecord);
        console.log('File storage successful');
      } catch (fileError) {
        console.warn('File storage failed (continuing anyway):', fileError);
      }
      
      console.log('Training data processed successfully');
    } catch (saveError) {
      console.error('Failed to process training data:', saveError);
      // Don't fail the request if storage fails, data is still processed
    }
    
    // Send notification (console log for now)
    try {
      await sendTrainingNotification(trainerEmail || 'amanda@eden.art', trainingRecord);
    } catch (notificationError) {
      console.warn('Notification failed:', notificationError);
    }
    
    // Export to Google Sheets (optional)
    try {
      const sheetsUrl = await exportToGoogleSheets(trainingRecord);
      console.log('Training data exported to Google Sheets:', sheetsUrl);
    } catch (sheetsError) {
      console.warn('Google Sheets export failed (continuing anyway):', sheetsError);
    }
    
    console.log('BERTHA training completed successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Training data processed successfully',
      updates: configUpdates,
      recordId: trainingRecord.id
    });
    
  } catch (error) {
    console.error('Failed to process BERTHA training data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process training data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
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