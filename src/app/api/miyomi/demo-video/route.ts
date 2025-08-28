/**
 * MIYOMI Demo Video Generation
 * Creates a mock video generation process for testing the dashboard
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface DemoRequest {
  prompt: string;
  style?: string;
  format?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = 'creative', format = 'short' }: DemoRequest = await request.json();
    
    console.log('[MIYOMI Demo] Generating demo video:', { prompt, style, format });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic demo response
    const videoId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const demoVideo = {
      id: videoId,
      url: generateDemoVideoUrl(prompt, style),
      thumbnail: generateDemoThumbnailUrl(prompt),
      status: 'completed',
      prompt,
      style,
      format,
      metadata: {
        title: generateDemoTitle(prompt),
        duration: format === 'short' ? 30 : 60,
        resolution: format === 'short' ? '1080x1920' : '1920x1080',
        processingTime: '2.3 seconds',
        cost: '$' + (Math.random() * 3 + 1).toFixed(2)
      },
      createdAt: new Date().toISOString()
    };
    
    // Generate some demo analytics
    const analytics = {
      estimatedViews: Math.floor(Math.random() * 100000) + 10000,
      engagementScore: Math.floor(Math.random() * 40) + 60,
      viralPotential: Math.random() > 0.7 ? 'high' : 'medium',
      platformOptimization: {
        tiktok: Math.random() > 0.5 ? 'high' : 'medium',
        youtube: Math.random() > 0.6 ? 'high' : 'medium',
        twitter: Math.random() > 0.4 ? 'high' : 'medium'
      }
    };

    return NextResponse.json({
      success: true,
      video: demoVideo,
      analytics,
      demo: true,
      message: 'Demo video generated successfully! This is a demonstration of the video generation workflow.'
    });

  } catch (error) {
    console.error('[MIYOMI Demo] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Demo generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions for demo content

function generateDemoVideoUrl(prompt: string, style: string): string {
  // Generate a realistic-looking video URL based on the prompt
  const baseUrl = 'https://demo-videos.eden-miyomi.app';
  const hash = btoa(prompt + style).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  return `${baseUrl}/videos/${style}/${hash}.mp4`;
}

function generateDemoThumbnailUrl(prompt: string): string {
  const baseUrl = 'https://demo-videos.eden-miyomi.app';
  const hash = btoa(prompt).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  return `${baseUrl}/thumbnails/${hash}.jpg`;
}

function generateDemoTitle(prompt: string): string {
  const keywords = prompt.split(' ').slice(0, 4);
  const templates = [
    `Market Analysis: ${keywords.slice(0, 2).join(' ')}`,
    `MIYOMI's Take: ${keywords.slice(0, 3).join(' ')}`,
    `Contrarian View: ${keywords.slice(0, 2).join(' ')} Reality`,
    `The Truth About ${keywords.slice(0, 3).join(' ')}`
  ];
  
  return templates[Math.floor(Math.random() * templates.length)];
}