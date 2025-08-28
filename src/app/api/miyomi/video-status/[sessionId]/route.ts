/**
 * MIYOMI Video Generation Status Check
 * Polls Eden API session for video generation completion
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface SessionStatusParams {
  params: {
    sessionId: string;
  };
}

export async function GET(request: NextRequest, { params }: SessionStatusParams) {
  try {
    const { sessionId } = params;
    console.log('[MIYOMI Status] Checking session:', sessionId);

    // Check if this is a demo session
    if (sessionId.startsWith('demo_')) {
      console.log('[MIYOMI Status] Demo session detected, simulating completion');
      
      // Simulate completion after a short delay
      const createdTime = parseInt(sessionId.split('_')[1]);
      const currentTime = Date.now();
      const elapsed = currentTime - createdTime;
      
      if (elapsed > 10000) { // 10 seconds for demo
        // Return completed demo video
        return NextResponse.json({
          status: 'completed',
          videoUrl: 'https://demo-videos.eden-miyomi.app/cinematic/demo-video.mp4',
          posterUrl: 'https://demo-videos.eden-miyomi.app/posters/demo-poster.jpg',
          artisticStatement: 'This is a demo of the Dynamic Narrative Video Framework. The 9-phase cinematic approach transforms market analysis into compelling visual narratives.',
          demoMode: true,
          sessionData: {
            framework: 'Dynamic Narrative (9-phase)',
            message: 'Demo video generation completed successfully'
          }
        });
      } else {
        // Still "generating" in demo mode
        const progress = Math.min(90, (elapsed / 10000) * 100);
        return NextResponse.json({
          status: 'generating',
          progress,
          message: 'Creating your cinematic video with Dynamic Narrative Framework...',
          demoMode: true
        });
      }
    }

    // Step 1: Get session messages/responses from Eden
    const sessionData = await getEdenSessionData(sessionId);
    if (!sessionData.success) {
      return NextResponse.json({
        status: 'failed',
        error: sessionData.error
      }, { status: 500 });
    }

    // Step 2: Parse response for video content
    const videoResult = extractVideoFromSessionData(sessionData.data);
    
    if (videoResult.videoUrl) {
      // Video generation completed
      await updateSessionStatus(sessionId, 'completed', {
        videoUrl: videoResult.videoUrl,
        posterUrl: videoResult.posterUrl,
        artisticStatement: videoResult.artisticStatement
      });

      return NextResponse.json({
        status: 'completed',
        videoUrl: videoResult.videoUrl,
        posterUrl: videoResult.posterUrl,
        artisticStatement: videoResult.artisticStatement,
        sessionData: sessionData.data
      });
    }
    
    if (videoResult.error) {
      // Generation failed
      await updateSessionStatus(sessionId, 'failed', { error: videoResult.error });
      return NextResponse.json({
        status: 'failed',
        error: videoResult.error
      });
    }

    // Still generating
    return NextResponse.json({
      status: 'generating',
      progress: videoResult.progress || 50,
      message: videoResult.message || 'Processing your cinematic video...'
    });

  } catch (error) {
    console.error('[MIYOMI Status] Error:', error);
    return NextResponse.json({
      status: 'failed',
      error: error instanceof Error ? error.message : 'Status check failed'
    }, { status: 500 });
  }
}

// Helper functions

async function getEdenSessionData(sessionId: string): Promise<{ success: boolean; data?: any; error?: string }> {
  const edenApiKey = process.env.EDEN_API_KEY;
  const edenBaseUrl = process.env.EDEN_BASE_URL || 'https://api.eden.art';
  
  if (!edenApiKey) {
    return { success: false, error: 'Eden API key not configured' };
  }

  try {
    // Check if there's a specific endpoint for getting session data
    // This might be /v2/sessions/{sessionId} or similar
    const response = await fetch(`${edenBaseUrl}/v2/sessions/${sessionId}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': edenApiKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Session not found' };
      }
      const errorText = await response.text();
      throw new Error(`Eden API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { success: true, data };
    
  } catch (error) {
    console.error('[Eden API] Get session data failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Session data retrieval failed' 
    };
  }
}

function extractVideoFromSessionData(sessionData: any): {
  videoUrl?: string;
  posterUrl?: string;
  artisticStatement?: string;
  error?: string;
  progress?: number;
  message?: string;
} {
  try {
    // Parse Eden session response to extract video URLs
    // This will depend on Eden's actual response format
    
    if (sessionData.messages) {
      // Look for messages with video content
      for (const message of sessionData.messages) {
        if (message.attachments) {
          for (const attachment of message.attachments) {
            if (attachment.type === 'video' || attachment.mime_type?.includes('video')) {
              return {
                videoUrl: attachment.url,
                posterUrl: attachment.thumbnail_url,
                artisticStatement: message.content
              };
            }
          }
        }
        
        // Check if message content contains video URLs
        if (message.content && (message.content.includes('.mp4') || message.content.includes('video'))) {
          const videoUrlMatch = message.content.match(/https?:\/\/[^\s]+\.mp4/);
          if (videoUrlMatch) {
            return {
              videoUrl: videoUrlMatch[0],
              artisticStatement: message.content
            };
          }
        }
      }
    }

    // Check for status indicators
    if (sessionData.status === 'failed' || sessionData.error) {
      return {
        error: sessionData.error || 'Video generation failed'
      };
    }

    if (sessionData.status === 'processing' || sessionData.status === 'generating') {
      return {
        progress: sessionData.progress || 75,
        message: 'Your cinematic video is being crafted...'
      };
    }

    // Still waiting for response
    return {
      progress: 25,
      message: 'Analyzing your concept with Dynamic Narrative Framework...'
    };
    
  } catch (error) {
    console.error('[Video Extraction] Error:', error);
    return {
      error: 'Failed to parse session response'
    };
  }
}

async function updateSessionStatus(sessionId: string, status: string, data: any = {}) {
  // Mock implementation - update database record
  console.log(`[MIYOMI Status] Updating session ${sessionId}:`, { status, ...data });
  return {
    sessionId,
    status,
    updatedAt: new Date().toISOString(),
    ...data
  };
}