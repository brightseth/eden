import { NextRequest, NextResponse } from 'next/server';
import { citizenDailyPractice } from '@/lib/agents/citizen-daily-practice';
import { citizenSocialCoordinator } from '@/lib/agents/citizen-social-integration';
import { FarcasterConnector } from '@/lib/agents/social-platforms/farcaster-connector';
import { DiscordConnector } from '@/lib/agents/social-platforms/discord-connector';
import { TwitterConnector } from '@/lib/agents/social-platforms/twitter-connector';
import { isFeatureEnabled, FLAGS } from '@/config/flags';

// GET /api/agents/citizen/social - Social integration status and community insights
export async function GET(request: NextRequest) {
  try {
    const socialEnabled = process.env.ENABLE_CITIZEN_SOCIAL_INTEGRATION === 'true';
    
    if (!socialEnabled) {
      return NextResponse.json({
        success: true,
        social_integration_enabled: false,
        message: 'CITIZEN social integration is currently disabled'
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const includeCommunityInsights = searchParams.get('insights') === 'true';
    const includeMetrics = searchParams.get('metrics') === 'true';
    
    console.log('[CITIZEN Social] Request:', { includeCommunityInsights, includeMetrics });

    // Get community insights
    const communityInsights = includeCommunityInsights ? 
      Object.fromEntries(citizenDailyPractice.getCommunityInsights()) : {};

    // Get progress metrics
    const progressMetrics = includeMetrics ? 
      citizenDailyPractice.getProgressMetrics() : undefined;

    // Check platform connection status
    const platformStatus = {
      farcaster: {
        connected: !!process.env.FARCASTER_API_KEY && process.env.FARCASTER_API_KEY !== 'your_neynar_api_key',
        channel: 'brightmoments',
        features: ['cast_publishing', 'community_analysis', 'engagement_tracking']
      },
      discord: {
        connected: !!process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN !== 'your_discord_bot_token',
        guild_id: process.env.DISCORD_GUILD_ID,
        features: ['message_posting', 'governance_announcements', 'community_moderation']
      },
      twitter: {
        connected: !!process.env.TWITTER_BEARER_TOKEN && process.env.TWITTER_BEARER_TOKEN !== 'your_twitter_bearer_token',
        features: ['tweet_publishing', 'thread_creation', 'community_monitoring']
      }
    };

    const response = {
      success: true,
      social_integration_enabled: true,
      platform_status: platformStatus,
      community_insights: communityInsights,
      progress_metrics: progressMetrics,
      features: {
        cross_platform_coordination: true,
        community_sentiment_analysis: true,
        governance_broadcasting: true,
        daily_practice_automation: true,
        re_engagement_campaigns: true
      },
      current_phase: 'listening', // Would be dynamically determined
      message: 'CITIZEN social integration active - community-first engagement ready'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('[CITIZEN Social] GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get social integration status' },
      { status: 500 }
    );
  }
}

// POST /api/agents/citizen/social - Execute social coordination actions
export async function POST(request: NextRequest) {
  try {
    const socialEnabled = process.env.ENABLE_CITIZEN_SOCIAL_INTEGRATION === 'true';
    
    if (!socialEnabled) {
      return NextResponse.json({
        success: false,
        error: 'CITIZEN social integration is disabled'
      }, { status: 403 });
    }

    const body = await request.json();
    const { action, ...params } = body;

    console.log('[CITIZEN Social] POST action:', action, params);

    switch (action) {
      case 'analyze_community':
        return await analyzeCommunityHealth(params);
      
      case 'execute_daily_practice':
        return await executeDailyPractice(params);
      
      case 'broadcast_governance':
        return await broadcastGovernanceProposal(params);
      
      case 'generate_content':
        return await generateSocialContent(params);
      
      case 'test_connections':
        return await testPlatformConnections(params);
      
      case 'start_re_engagement':
        return await startReEngagementCampaign(params);

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
          available_actions: [
            'analyze_community',
            'execute_daily_practice', 
            'broadcast_governance',
            'generate_content',
            'test_connections',
            'start_re_engagement'
          ]
        }, { status: 400 });
    }
  } catch (error) {
    console.error('[CITIZEN Social] POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Social coordination request failed' },
      { status: 500 }
    );
  }
}

// Action handlers
async function analyzeCommunityHealth(params: any) {
  try {
    console.log('[CITIZEN Social] Analyzing community health across platforms');
    
    await citizenDailyPractice.analyzeCommunityReadiness();
    const insights = Object.fromEntries(citizenDailyPractice.getCommunityInsights());
    
    return NextResponse.json({
      success: true,
      action: 'analyze_community',
      result: {
        community_insights: insights,
        analysis_timestamp: new Date().toISOString(),
        recommendations: generateCommunityRecommendations(insights)
      },
      message: 'Community analysis completed'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Community analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function executeDailyPractice(params: any) {
  try {
    console.log('[CITIZEN Social] Executing daily practice routine');
    
    await citizenDailyPractice.executeDailyPractice();
    
    return NextResponse.json({
      success: true,
      action: 'execute_daily_practice',
      result: {
        executed_at: new Date().toISOString(),
        content_posted: 'Daily practice content executed',
        next_scheduled: 'Tomorrow at optimal posting times'
      },
      message: 'Daily practice executed successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Daily practice execution failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function broadcastGovernanceProposal(params: any) {
  try {
    const { proposal, platforms = ['farcaster', 'discord', 'twitter'] } = params;
    
    if (!proposal) {
      return NextResponse.json({
        success: false,
        error: 'Proposal data required'
      }, { status: 400 });
    }

    console.log('[CITIZEN Social] Broadcasting governance proposal:', proposal.title);
    
    const results = await citizenSocialCoordinator.broadcastGovernanceProposal(
      proposal,
      platforms
    );
    
    return NextResponse.json({
      success: true,
      action: 'broadcast_governance',
      result: {
        proposal_title: proposal.title,
        broadcast_results: results,
        platforms_reached: results.filter(r => r.success).length,
        total_platforms: results.length
      },
      message: `Governance proposal broadcast to ${results.filter(r => r.success).length}/${results.length} platforms`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Governance broadcast failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function generateSocialContent(params: any) {
  try {
    const { type, topic, platform, tone = 'conversational' } = params;
    
    if (!type || !topic) {
      return NextResponse.json({
        success: false,
        error: 'Content type and topic required'
      }, { status: 400 });
    }

    console.log('[CITIZEN Social] Generating content:', { type, topic, platform });
    
    // Generate content using the social coordinator
    const content = await citizenSocialCoordinator.generateReEngagementContent(
      'value_sharing', // Default phase
      platform || 'farcaster',
      {
        communityName: 'BrightMoments',
        recentActivity: ['governance discussions', 'community updates'],
        sentiment: 0.5
      }
    );
    
    return NextResponse.json({
      success: true,
      action: 'generate_content',
      result: {
        type,
        topic,
        platform: platform || 'multi-platform',
        content: content.content,
        tone: content.tone,
        requires_approval: content.requiresApproval,
        scheduled_time: content.scheduledTime
      },
      message: 'Social content generated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Content generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function testPlatformConnections(params: any) {
  try {
    console.log('[CITIZEN Social] Testing platform connections');
    
    const connections = {
      farcaster: {
        configured: !!process.env.FARCASTER_API_KEY && process.env.FARCASTER_API_KEY !== 'your_neynar_api_key',
        tested: false,
        error: null as string | null
      },
      discord: {
        configured: !!process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_BOT_TOKEN !== 'your_discord_bot_token',
        tested: false,
        error: null as string | null
      },
      twitter: {
        configured: !!process.env.TWITTER_BEARER_TOKEN && process.env.TWITTER_BEARER_TOKEN !== 'your_twitter_bearer_token',
        tested: false,
        error: null as string | null
      }
    };

    // Test each configured platform
    if (connections.farcaster.configured) {
      try {
        const connector = new FarcasterConnector({
          apiKey: process.env.FARCASTER_API_KEY!,
          signerUuid: process.env.FARCASTER_SIGNER_UUID!,
          baseUrl: 'https://api.neynar.com/v2'
        });
        connections.farcaster.tested = await connector.testConnection();
      } catch (error) {
        connections.farcaster.error = error instanceof Error ? error.message : 'Connection failed';
      }
    }

    if (connections.discord.configured) {
      try {
        const connector = new DiscordConnector({
          botToken: process.env.DISCORD_BOT_TOKEN!,
          guildId: process.env.DISCORD_GUILD_ID!,
          governanceChannelId: process.env.DISCORD_GOVERNANCE_CHANNEL_ID
        });
        connections.discord.tested = await connector.testConnection();
      } catch (error) {
        connections.discord.error = error instanceof Error ? error.message : 'Connection failed';
      }
    }

    if (connections.twitter.configured) {
      try {
        const connector = new TwitterConnector({
          bearerToken: process.env.TWITTER_BEARER_TOKEN!,
          apiKey: process.env.TWITTER_API_KEY!,
          apiSecretKey: process.env.TWITTER_API_SECRET!,
          accessToken: process.env.TWITTER_ACCESS_TOKEN!,
          accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!
        });
        connections.twitter.tested = await connector.testConnection();
      } catch (error) {
        connections.twitter.error = error instanceof Error ? error.message : 'Connection failed';
      }
    }
    
    const successfulConnections = Object.values(connections).filter(c => c.configured && c.tested).length;
    const totalConfigured = Object.values(connections).filter(c => c.configured).length;
    
    return NextResponse.json({
      success: true,
      action: 'test_connections',
      result: {
        connections,
        summary: {
          total_platforms: 3,
          configured_platforms: totalConfigured,
          successful_connections: successfulConnections,
          ready_for_deployment: successfulConnections > 0
        }
      },
      message: `${successfulConnections}/${totalConfigured} configured platforms connected successfully`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Connection testing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

async function startReEngagementCampaign(params: any) {
  try {
    const { community = 'brightmoments', duration = 30 } = params;
    
    console.log('[CITIZEN Social] Starting re-engagement campaign:', { community, duration });
    
    // This would initialize the re-engagement campaign
    // For now, return a mock response showing the campaign plan
    
    return NextResponse.json({
      success: true,
      action: 'start_re_engagement',
      result: {
        campaign_name: `${community} Re-engagement`,
        duration_days: duration,
        phases: [
          { name: 'Listening', duration: 7, status: 'starting' },
          { name: 'Acknowledgment', duration: 3, status: 'pending' },
          { name: 'Value Sharing', duration: 14, status: 'pending' },
          { name: 'Governance Introduction', duration: 6, status: 'pending' }
        ],
        content_schedule: '28 pieces of content scheduled across 4 weeks',
        platforms: ['farcaster', 'discord', 'twitter'],
        started_at: new Date().toISOString()
      },
      message: `Re-engagement campaign started for ${community} community`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Re-engagement campaign failed to start',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions
function generateCommunityRecommendations(insights: Record<string, any>): string[] {
  const recommendations = [];
  
  for (const [platform, insight] of Object.entries(insights)) {
    if (insight.sentiment < 0.3) {
      recommendations.push(`Focus on listening and acknowledgment on ${platform}`);
    } else if (insight.engagementRate < 0.1) {
      recommendations.push(`Increase value-driven content frequency on ${platform}`);
    } else if (insight.readinessScore > 0.7) {
      recommendations.push(`${platform} community ready for governance introduction`);
    }
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Continue current engagement strategy');
  }
  
  return recommendations;
}