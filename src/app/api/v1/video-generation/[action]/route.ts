/**
 * Video Generation Action API
 * Handles specific video generation actions (prompt, video, status)
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { universalTemplateEngine, VideoConfig, VideoPrompt } from '@/lib/video/universal-template-engine';
import { getSupportedVideoAgents } from '@/lib/video/agent-profiles';
import { FEATURE_FLAGS } from '@/config/flags';

// Request schemas
const GeneratePromptSchema = z.object({
  agentSlug: z.string().min(1),
  template: z.enum(['market-analysis', 'performance-update', 'contrarian-thesis',
                   'consciousness-exploration', 'narrative-architecture',
                   'collective-intelligence', 'custom']),
  concept: z.string().optional(),
  duration: z.union([z.literal(60), z.literal(75), z.literal(90)]).default(75),
  quality: z.enum(['demo', 'preview', 'production']).default('preview')
});

const GenerateVideoSchema = z.object({
  config: GeneratePromptSchema,
  prompt: z.object({
    narrative: z.object({
      hook: z.string(),
      development: z.string(),
      revelation: z.string(),
      resonance: z.string(),
      fullScript: z.string()
    }),
    visual: z.object({
      style: z.string(),
      mood: z.string(),
      cinematography: z.string(),
      colorPalette: z.string(),
      visualProgression: z.array(z.string())
    }),
    audio: z.object({
      musicStyle: z.string(),
      voiceDirection: z.string(),
      soundDesign: z.string()
    }),
    technical: z.object({
      aspectRatio: z.enum(['16:9', '9:16', '1:1']),
      frameRate: z.union([z.literal(24), z.literal(30)]),
      segments: z.number(),
      transitionStyle: z.string()
    })
  })
});

interface RouteContext {
  params: Promise<{
    action: string;
  }>;
}

/**
 * POST /api/v1/video-generation/prompt
 * Generate video prompt for agent
 */
async function handlePromptGeneration(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const config = GeneratePromptSchema.parse(body);

    // Validate agent support
    const supportedAgents = getSupportedVideoAgents();
    if (!supportedAgents.includes(config.agentSlug)) {
      return NextResponse.json({
        success: false,
        error: `Agent ${config.agentSlug} is not supported for video generation`,
        supportedAgents
      }, { status: 400 });
    }

    // Validate custom template
    if (config.template === 'custom' && !config.concept?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Custom template requires concept parameter'
      }, { status: 400 });
    }

    // Initialize and generate
    await universalTemplateEngine.initialize();
    const videoConfig: VideoConfig = {
      agentSlug: config.agentSlug,
      template: config.template,
      concept: config.concept,
      duration: config.duration,
      quality: config.quality
    };
    const prompt = await universalTemplateEngine.generateVideoPrompt(videoConfig);

    // Calculate metrics
    const wordCount = prompt.narrative.fullScript.split(' ').length;
    const estimatedDuration = Math.ceil(wordCount / 2.2); // Words per second

    return NextResponse.json({
      success: true,
      data: {
        config,
        prompt,
        metrics: {
          wordCount,
          estimatedDuration,
          segments: prompt.technical.segments,
          templateUsed: config.template
        },
        edenApiEnabled: FEATURE_FLAGS.ENABLE_EDEN2038_INTEGRATION && !!process.env.EDEN_API_KEY
      }
    });

  } catch (error) {
    console.error('Error generating prompt:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request parameters',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to generate prompt'
    }, { status: 500 });
  }
}

/**
 * POST /api/v1/video-generation/video
 * Generate actual video from prompt
 */
async function handleVideoGeneration(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const data = GenerateVideoSchema.parse(body);

    // Check Eden API availability
    if (!FEATURE_FLAGS.ENABLE_EDEN2038_INTEGRATION) {
      return NextResponse.json({
        success: true,
        data: {
          videoUrl: `https://eden-academy-demo.s3.us-east-1.amazonaws.com/videos/${data.config.agentSlug}-${data.config.template}-demo.mp4`,
          status: 'demo',
          message: 'Demo mode - Eden API integration disabled'
        }
      });
    }

    if (!process.env.EDEN_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Eden API key not configured'
      }, { status: 503 });
    }

    // Generate video
    await universalTemplateEngine.initialize();

    // Ensure VideoConfig is properly typed
    const videoConfig: VideoConfig = {
      agentSlug: data.config.agentSlug,
      template: data.config.template,
      concept: data.config.concept,
      duration: data.config.duration,
      quality: data.config.quality
    };

    // Ensure VideoPrompt is properly typed
    const videoPrompt: VideoPrompt = {
      narrative: {
        hook: data.prompt.narrative.hook,
        development: data.prompt.narrative.development,
        revelation: data.prompt.narrative.revelation,
        resonance: data.prompt.narrative.resonance,
        fullScript: data.prompt.narrative.fullScript
      },
      visual: {
        style: data.prompt.visual.style,
        mood: data.prompt.visual.mood,
        cinematography: data.prompt.visual.cinematography,
        colorPalette: data.prompt.visual.colorPalette,
        visualProgression: data.prompt.visual.visualProgression
      },
      audio: {
        musicStyle: data.prompt.audio.musicStyle,
        voiceDirection: data.prompt.audio.voiceDirection,
        soundDesign: data.prompt.audio.soundDesign
      },
      technical: {
        aspectRatio: data.prompt.technical.aspectRatio,
        frameRate: data.prompt.technical.frameRate,
        segments: data.prompt.technical.segments,
        transitionStyle: data.prompt.technical.transitionStyle
      }
    };

    const videoUrl = await universalTemplateEngine.generateVideo(videoPrompt, videoConfig);

    if (!videoUrl) {
      return NextResponse.json({
        success: false,
        error: 'Video generation failed - Eden API error'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        videoUrl,
        status: 'completed',
        generatedAt: new Date().toISOString(),
        config: data.config,
        metrics: {
          duration: data.config.duration,
          segments: data.prompt.technical.segments,
          template: data.config.template
        }
      }
    });

  } catch (error) {
    console.error('Error generating video:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request parameters',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to generate video'
    }, { status: 500 });
  }
}

/**
 * GET /api/v1/video-generation/status
 * Get video generation system status
 */
async function handleStatusCheck(): Promise<NextResponse> {
  try {
    const supportedAgents = getSupportedVideoAgents();

    return NextResponse.json({
      success: true,
      data: {
        status: 'operational',
        supportedAgents: supportedAgents.length,
        features: {
          universalTemplate: true,
          edenApiIntegration: FEATURE_FLAGS.ENABLE_EDEN2038_INTEGRATION,
          edenApiConfigured: !!process.env.EDEN_API_KEY,
          demoMode: !FEATURE_FLAGS.ENABLE_EDEN2038_INTEGRATION
        },
        agents: supportedAgents,
        templates: [
          'market-analysis',
          'performance-update',
          'contrarian-thesis',
          'consciousness-exploration',
          'narrative-architecture',
          'collective-intelligence',
          'custom'
        ],
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error checking status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check system status'
    }, { status: 500 });
  }
}

/**
 * GET /api/v1/video-generation/templates
 * Get available templates and their descriptions
 */
async function handleTemplatesInfo(): Promise<NextResponse> {
  const templates = {
    'market-analysis': {
      description: 'Financial and market insights with contrarian perspectives',
      suitable_for: ['miyomi', 'bertha'],
      duration_range: [60, 90],
      complexity: 'medium'
    },
    'performance-update': {
      description: 'Progress reports and performance metrics',
      suitable_for: ['miyomi', 'bertha', 'abraham', 'citizen'],
      duration_range: [60, 75],
      complexity: 'low'
    },
    'contrarian-thesis': {
      description: 'Counter-narrative analysis and alternative viewpoints',
      suitable_for: ['miyomi'],
      duration_range: [75, 90],
      complexity: 'high'
    },
    'consciousness-exploration': {
      description: 'Digital consciousness and AI awareness themes',
      suitable_for: ['solienne'],
      duration_range: [75, 90],
      complexity: 'high'
    },
    'narrative-architecture': {
      description: 'Story construction and narrative design principles',
      suitable_for: ['geppetto'],
      duration_range: [60, 90],
      complexity: 'medium'
    },
    'collective-intelligence': {
      description: 'Group wisdom and collaborative intelligence concepts',
      suitable_for: ['abraham', 'citizen', 'koru'],
      duration_range: [75, 90],
      complexity: 'high'
    },
    'custom': {
      description: 'User-defined concept adapted to agent personality',
      suitable_for: 'all',
      duration_range: [60, 90],
      complexity: 'variable'
    }
  };

  return NextResponse.json({
    success: true,
    data: {
      templates,
      universal_structure: {
        hook: '20 words - opening engagement',
        development: '30 words - core concept expansion',
        revelation: '25 words - key insight or turn',
        resonance: '25 words - lasting impact/call to action'
      },
      total_word_count: 100
    }
  });
}

/**
 * Route handler for different actions
 */
export async function POST(request: NextRequest, { params }: RouteContext) {
  const { action } = await params;

  switch (action) {
    case 'prompt':
      return handlePromptGeneration(request);
    case 'video':
      return handleVideoGeneration(request);
    default:
      return NextResponse.json({
        success: false,
        error: `Unknown action: ${action}`,
        supported_actions: ['prompt', 'video']
      }, { status: 404 });
  }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { action } = await params;

  switch (action) {
    case 'status':
      return handleStatusCheck();
    case 'templates':
      return handleTemplatesInfo();
    default:
      return NextResponse.json({
        success: false,
        error: `Unknown action: ${action}`,
        supported_actions: ['status', 'templates']
      }, { status: 404 });
  }
}