import { NextRequest, NextResponse } from 'next/server';
import { realTimeKnowledge } from '@/lib/agents/real-time-knowledge-integrator';

// GET /api/agents/real-time-knowledge - Access real-time knowledge data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent');
    const type = searchParams.get('type') || 'context';
    const query = searchParams.get('query');

    switch (type) {
      case 'context':
        if (!agent) {
          return NextResponse.json(
            { error: 'Agent parameter required for context' },
            { status: 400 }
          );
        }
        
        const context = await realTimeKnowledge.getRealTimeContext(agent, query || undefined);
        if (!context) {
          return NextResponse.json(
            { error: `No real-time context available for agent: ${agent}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          agent,
          type: 'real_time_context',
          query: query || null,
          context,
          timestamp: new Date().toISOString()
        });

      case 'status':
        const status = realTimeKnowledge.getStreamStatus(agent || undefined);
        return NextResponse.json({
          type: 'stream_status',
          agent: agent || 'all',
          status,
          timestamp: new Date().toISOString()
        });

      case 'streams':
        if (!agent) {
          return NextResponse.json(
            { error: 'Agent parameter required for streams' },
            { status: 400 }
          );
        }
        
        const agentStatus = realTimeKnowledge.getStreamStatus(agent);
        if (!agentStatus.streams || agentStatus.streams.length === 0) {
          return NextResponse.json(
            { error: `No streams found for agent: ${agent}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          agent,
          type: 'agent_streams',
          streams: agentStatus.streams,
          timestamp: new Date().toISOString()
        });

      case 'health':
        const overallStatus = realTimeKnowledge.getStreamStatus();
        const healthScore = overallStatus.activeStreams / Math.max(1, overallStatus.totalStreams);
        
        return NextResponse.json({
          type: 'system_health',
          health: {
            score: healthScore,
            status: healthScore > 0.8 ? 'healthy' : healthScore > 0.5 ? 'warning' : 'critical',
            totalStreams: overallStatus.totalStreams,
            activeStreams: overallStatus.activeStreams,
            cachedAgents: overallStatus.cachedAgents
          },
          streams: overallStatus.streams,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Real-time knowledge API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch real-time knowledge data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/real-time-knowledge - Real-time knowledge operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agent, streamType, frequency, streamKey } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create_stream':
        if (!agent || !streamType) {
          return NextResponse.json(
            { error: 'Agent and streamType required for create_stream' },
            { status: 400 }
          );
        }
        
        const stream = realTimeKnowledge.createKnowledgeStream(
          agent,
          streamType,
          frequency || 300 // Default 5 minutes
        );
        
        return NextResponse.json({
          action: 'create_stream',
          agent,
          stream: {
            agentId: stream.agentId,
            streamType: stream.streamType,
            updateFrequency: stream.updateFrequency,
            isActive: stream.isActive
          },
          timestamp: new Date().toISOString()
        });

      case 'stop_stream':
        if (!streamKey) {
          return NextResponse.json(
            { error: 'streamKey required for stop_stream' },
            { status: 400 }
          );
        }
        
        realTimeKnowledge.stopStream(streamKey);
        
        return NextResponse.json({
          action: 'stop_stream',
          streamKey,
          success: true,
          timestamp: new Date().toISOString()
        });

      case 'force_update':
        if (!agent) {
          return NextResponse.json(
            { error: 'Agent required for force_update' },
            { status: 400 }
          );
        }
        
        // Trigger immediate update for agent's streams
        const agentStreams = realTimeKnowledge.getStreamStatus(agent);
        let updatesTriggered = 0;
        
        // This would ideally trigger immediate updates
        // For now, return status
        if (agentStreams.streams) {
          updatesTriggered = agentStreams.streams.filter(s => s.active).length;
        }
        
        return NextResponse.json({
          action: 'force_update',
          agent,
          updatesTriggered,
          message: 'Force update requested (immediate execution would be implemented here)',
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Real-time knowledge action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute real-time knowledge operation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}