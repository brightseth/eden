/**
 * MIYOMI Video Generation API
 * Integrates with Eden API to create artistic market analysis videos using dynamic narrative framework
 */
import { NextRequest, NextResponse } from 'next/server';
import { miyomiSDK, MarketPick } from '@/lib/agents/miyomi-claude-sdk';
import { miyomiEdenVideoGenerator } from '@/lib/agents/miyomi-eden-video-generator';
import { miyomiEdenPromptGenerator } from '@/lib/agents/miyomi-eden-prompt-generator';
import { registryApi } from '@/lib/generated-sdk/registry-api';

export const runtime = 'nodejs';

interface VideoGenerationRequest {
  pickId?: string;
  prompt?: string;
  style?: 'fast' | 'creative' | 'analytical' | 'artistic' | 'cinematic';
  format?: 'short' | 'long';
  useArtisticFramework?: boolean;
  useDynamicFramework?: boolean;
  conceptId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VideoGenerationRequest = await request.json();
    const { 
      pickId, 
      prompt, 
      style = 'fast', 
      format = 'short', 
      useArtisticFramework = false,
      useDynamicFramework = false,
      conceptId
    } = body;

    console.log('[MIYOMI Video Generation] Request:', { 
      pickId, 
      style, 
      format, 
      useArtisticFramework, 
      useDynamicFramework,
      conceptId
    });

    let pick: MarketPick | null = null;
    let result: any;

    if (pickId) {
      // Fetch pick from database
      pick = await fetchPickFromDatabase(pickId);
      if (!pick) {
        return NextResponse.json(
          { error: 'Pick not found' },
          { status: 404 }
        );
      }

      if (useDynamicFramework || style === 'cinematic') {
        // Use the new Dynamic Narrative Video Framework
        console.log('🎬 Using Dynamic Narrative Video Framework for cinematic generation');
        const edenProject = await miyomiEdenPromptGenerator.generateEdenProject({
          market: pick.market,
          prediction: pick.reasoning,
          confidence: pick.confidence,
          timeframe: '24h',
          contrarian_angle: `Against consensus: ${pick.position}`,
          data_points: [`Current confidence: ${Math.round(pick.confidence * 100)}%`]
        });
        
        const edenPrompt = miyomiEdenPromptGenerator.generateEdenPrompt(edenProject);
        const video = await generateVideoWithEden(edenPrompt.text_input, style, format);
        
        result = { 
          video: video?.url, 
          poster: edenPrompt.poster_input,
          statement: edenProject.artisticStatement,
          metadata: {
            project: edenProject,
            prompt: edenPrompt,
            framework: 'dynamic-narrative'
          }
        };
      } else if (useArtisticFramework || style === 'artistic') {
        // Use legacy artistic framework
        console.log('🎬 Using artistic framework for video generation');
        result = await miyomiEdenVideoGenerator.generateArtisticVideo(pick);
      } else {
        // Use simpler generation
        const videoPrompt = await generatePromptFromPick(pick);
        const video = await generateVideoWithEden(videoPrompt, style, format);
        result = { video: video?.url, poster: null, statement: null, metadata: null };
      }
    } else if (conceptId) {
      // Generate from dynamic concept using the framework
      console.log('🎬 Generating video from concept using Dynamic Framework');
      const concept = await fetchConceptFromDatabase(conceptId);
      if (!concept) {
        return NextResponse.json(
          { error: 'Concept not found' },
          { status: 404 }
        );
      }
      
      const edenProject = await miyomiEdenPromptGenerator.generateEdenProject({
        market: concept.title,
        prediction: concept.coreConcept,
        confidence: concept.urgencyScore / 100,
        timeframe: '24h',
        contrarian_angle: concept.contrarian_angle,
        data_points: [concept.dataPoints.primary, ...concept.dataPoints.supporting]
      });
      
      const edenPrompt = miyomiEdenPromptGenerator.generateEdenPrompt(edenProject);
      const video = await generateVideoWithEden(edenPrompt.text_input, 'cinematic', format);
      
      result = { 
        video: video?.url, 
        poster: edenPrompt.poster_input,
        statement: edenProject.artisticStatement,
        metadata: {
          project: edenProject,
          prompt: edenPrompt,
          framework: 'dynamic-narrative',
          concept
        }
      };
    } else if (prompt) {
      // Generate from custom prompt
      if (useDynamicFramework || style === 'cinematic') {
        // Apply framework to custom prompt
        const edenProject = await miyomiEdenPromptGenerator.generateEdenProject({
          market: 'Custom Analysis',
          prediction: prompt,
          confidence: 0.8,
          timeframe: '24h',
          contrarian_angle: 'Unique perspective on market dynamics',
          data_points: ['Custom user prompt']
        });
        
        const edenPrompt = miyomiEdenPromptGenerator.generateEdenPrompt(edenProject);
        const video = await generateVideoWithEden(edenPrompt.text_input, style, format);
        
        result = { 
          video: video?.url, 
          poster: edenPrompt.poster_input,
          statement: edenProject.artisticStatement,
          metadata: {
            project: edenProject,
            prompt: edenPrompt,
            framework: 'dynamic-narrative'
          }
        };
      } else {
        const video = await generateVideoWithEden(prompt, style, format);
        result = { video: video?.url, poster: null, statement: null, metadata: null };
      }
    } else {
      return NextResponse.json(
        { error: 'Either pickId, conceptId, or prompt is required' },
        { status: 400 }
      );
    }
    
    if (!result || !result.video) {
      return NextResponse.json(
        { error: 'Video generation failed' },
        { status: 500 }
      );
    }

    // Store video reference in database
    const videoRecord = await storeVideoRecord({
      pickId,
      conceptId,
      videoUrl: result.video,
      taskId: 'dynamic-generation',
      prompt: prompt || (pick ? `Market analysis for ${pick.market}` : conceptId ? 'Generated from concept' : 'Custom prompt'),
      style,
      format,
      pick,
      isDynamic: useDynamicFramework || style === 'cinematic',
      isArtistic: useArtisticFramework || style === 'artistic',
      poster: result.poster,
      statement: result.statement,
      metadata: result.metadata
    });

    return NextResponse.json({
      success: true,
      video: {
        id: videoRecord.id,
        url: result.video,
        poster: result.poster,
        statement: result.statement,
        metadata: result.metadata,
        taskId: videoRecord.taskId,
        status: 'completed',
        prompt: videoRecord.prompt,
        style,
        format,
        isDynamic: useDynamicFramework || style === 'cinematic',
        isArtistic: useArtisticFramework || style === 'artistic',
        createdAt: videoRecord.createdAt
      }
    });

  } catch (error) {
    console.error('[MIYOMI Video Generation] Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get('taskId');
    const videoId = searchParams.get('videoId');

    if (taskId) {
      // Check status of Eden API task
      const status = await checkEdenTaskStatus(taskId);
      return NextResponse.json({ taskId, status });
    }

    if (videoId) {
      // Get video record from database
      const video = await getVideoRecord(videoId);
      return NextResponse.json({ video });
    }

    // Get all recent videos
    const recentVideos = await getRecentVideos();
    return NextResponse.json({ videos: recentVideos });

  } catch (error) {
    console.error('[MIYOMI Video Generation] GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions

async function generateVideoWithEden(prompt: string, style: string, format: string) {
  const edenApiKey = process.env.EDEN_API_KEY;
  const edenBaseUrl = process.env.EDEN_BASE_URL || 'https://api.eden.art';

  if (!edenApiKey) {
    console.warn('Eden API key not configured');
    return null;
  }

  try {
    // Choose the appropriate tool based on style
    const toolKey = style === 'creative' ? 'txt2vid' : 'txt2vid_fast';
    
    // Create task with Eden API
    const response = await fetch(`${edenBaseUrl}/v2/tasks/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${edenApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tool: toolKey,
        args: {
          text_input: prompt,
          width: format === 'short' ? 576 : 1024,
          height: format === 'short' ? 1024 : 576,
          n_frames: format === 'short' ? 16 : 24,
          guidance_scale: 7.5,
          steps: style === 'creative' ? 50 : 25,
          fps: 8,
          motion_bucket_id: 127,
          noise_aug_strength: 0.1
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Eden API error: ${response.status}`);
    }

    const task = await response.json();
    console.log('[Eden API] Task created:', task.id);

    // Poll for completion (simplified - in production use webhooks)
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max wait
    
    while (attempts < maxAttempts) {
      const statusResponse = await fetch(`${edenBaseUrl}/v2/tasks/${task.id}`, {
        headers: { 'Authorization': `Bearer ${edenApiKey}` }
      });
      
      const status = await statusResponse.json();
      
      if (status.status === 'completed' && status.output?.output_video) {
        return {
          url: status.output.output_video,
          taskId: task.id,
          status: 'completed'
        };
      } else if (status.status === 'failed') {
        throw new Error(`Eden task failed: ${status.error}`);
      }
      
      // Wait 5 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 5000));
      attempts++;
    }

    // Return pending task for longer processing
    return {
      url: null,
      taskId: task.id,
      status: 'processing'
    };

  } catch (error) {
    console.error('Eden video generation failed:', error);
    return null;
  }
}

async function generatePromptFromPick(pick: MarketPick): Promise<string> {
  // Use Claude SDK to create engaging video prompt
  const script = await miyomiSDK.generateVideoScript(pick);
  
  // Convert script to video prompt
  const visualPrompt = `
Create an engaging market analysis video showing:
- Dynamic text overlay: "${script.title}"
- Market data visualization for "${pick.market}"
- Trending graphics showing ${pick.position} position
- Confidence meter at ${Math.round(pick.confidence * 100)}%
- Clean, modern design with red/black color scheme
- Fast-paced editing with data animations
- NYC financial district vibes
Style: Professional yet edgy, contrarian energy, data-driven visuals
`;

  return visualPrompt.trim();
}

async function fetchPickFromDatabase(pickId: string): Promise<MarketPick | null> {
  // Mock implementation - replace with actual database query
  console.log(`Fetching pick ${pickId} from database`);
  return null; // Would return actual pick data
}

async function storeVideoRecord(data: any) {
  const id = `video_${Date.now()}`;
  console.log(`[Registry Integration] Storing video record ${id}:`, data);
  
  // Try to store in Registry as a Creation
  try {
    const registryCreation = await registryApi.createAgentCreation('miyomi', {
      title: data.prompt || `Video: ${data.pick?.market || 'Market Analysis'}`,
      mediaUri: data.videoUrl || '',
      status: 'PUBLISHED',
      metadata: {
        type: 'video',
        framework: data.metadata?.framework || 'standard',
        pickId: data.pickId,
        conceptId: data.conceptId,
        style: data.style,
        format: data.format,
        poster: data.poster,
        statement: data.statement,
        generatedAt: new Date().toISOString(),
        source: 'miyomi-video-generator'
      }
    });
    
    console.log('[Registry Integration] ✅ Video stored in Registry:', registryCreation.id);
    
    return {
      id: registryCreation.id,
      registryId: registryCreation.id,
      createdAt: new Date().toISOString(),
      source: 'registry',
      ...data
    };
  } catch (registryError) {
    console.warn('[Registry Integration] ⚠️ Registry storage failed, using fallback:', registryError);
    
    // Fallback to local storage
    return {
      id,
      registryId: null,
      createdAt: new Date().toISOString(),
      source: 'fallback',
      registryError: registryError instanceof Error ? registryError.message : 'Unknown error',
      ...data
    };
  }
}

async function checkEdenTaskStatus(taskId: string) {
  const edenApiKey = process.env.EDEN_API_KEY;
  const edenBaseUrl = process.env.EDEN_BASE_URL || 'https://api.eden.art';

  if (!edenApiKey) return null;

  try {
    const response = await fetch(`${edenBaseUrl}/v2/tasks/${taskId}`, {
      headers: { 'Authorization': `Bearer ${edenApiKey}` }
    });
    
    const data = await response.json();
    return {
      status: data.status,
      output: data.output,
      progress: data.progress || 0
    };
  } catch (error) {
    console.error('Error checking Eden task status:', error);
    return null;
  }
}

async function getVideoRecord(videoId: string) {
  // Mock implementation
  console.log(`Getting video record ${videoId}`);
  return null;
}

async function getRecentVideos() {
  // Mock implementation
  console.log('Getting recent videos');
  return [];
}

async function fetchConceptFromDatabase(conceptId: string): Promise<any | null> {
  // Mock implementation - replace with actual database query
  console.log(`Fetching concept ${conceptId} from database`);
  return null; // Would return actual concept data
}