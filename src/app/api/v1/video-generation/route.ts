/**
 * Video Generation API
 * Universal video generation endpoints for all agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { universalTemplateEngine, VideoConfig } from '@/lib/video/universal-template-engine';
import { getSupportedVideoAgents, getAgentVideoProfile } from '@/lib/video/agent-profiles';
import { FEATURE_FLAGS } from '@/config/flags';

// Request validation schemas
const GeneratePromptSchema = z.object({
  agentSlug: z.string().min(1),
  template: z.enum(['market-analysis', 'performance-update', 'contrarian-thesis',
                   'consciousness-exploration', 'narrative-architecture',
                   'collective-intelligence', 'custom']),
  concept: z.string().optional(),
  duration: z.enum([60, 75, 90]).default(75),
  quality: z.enum(['demo', 'preview', 'production']).default('preview')
});

const GenerateVideoSchema = GeneratePromptSchema.extend({
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
      frameRate: z.number(),
      segments: z.number(),
      transitionStyle: z.string()
    })
  })
});

/**
 * GET /api/v1/video-generation
 * Get supported agents and their capabilities
 */
export async function GET(request: NextRequest) {
  try {
    const supportedAgents = getSupportedVideoAgents();
    const agentCapabilities = supportedAgents.map(agentSlug => {
      const profile = getAgentVideoProfile(agentSlug);
      return {
        agentSlug,
        name: profile?.name,
        domain: profile?.domain,
        supportedTemplates: profile ? Object.keys(profile.templateMappings) : [],
        visualStyle: profile?.visualStyle,
        contentThemes: profile?.contentThemes
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        supportedAgents: agentCapabilities,
        features: {
          edenApiIntegration: FEATURE_FLAGS.ENABLE_EDEN2038_INTEGRATION,
          templateEngine: true,
          universalTemplate: true
        }
      }
    });

  } catch (error) {
    console.error('Error fetching video generation capabilities:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch video generation capabilities'
    }, { status: 500 });
  }
}

/**
 * POST /api/v1/video-generation/prompt
 * Generate video prompt for agent
 */
export async function POST(request: NextRequest) {
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

    // Validate custom template has concept
    if (config.template === 'custom' && !config.concept?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Custom template requires concept parameter'
      }, { status: 400 });
    }

    // Initialize template engine
    await universalTemplateEngine.initialize();

    // Generate prompt
    const prompt = await universalTemplateEngine.generateVideoPrompt(config);

    return NextResponse.json({
      success: true,
      data: {
        config,
        prompt,
        wordCount: prompt.narrative.fullScript.split(' ').length,
        estimatedSegments: prompt.technical.segments,
        edenApiEnabled: FEATURE_FLAGS.ENABLE_EDEN2038_INTEGRATION && !!process.env.EDEN_API_KEY
      }
    });

  } catch (error) {
    console.error('Error generating video prompt:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid request parameters',
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to generate video prompt'
    }, { status: 500 });
  }
}