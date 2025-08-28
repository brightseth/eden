import { NextRequest, NextResponse } from 'next/server';
import { agentCommunication } from '@/lib/collaboration/agent-communication-enhancer';

// GET /api/agents/communication - Access agent communication system
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'analytics';
    const agentId = searchParams.get('agent');
    const channelId = searchParams.get('channel');

    switch (type) {
      case 'messages':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID required for messages' },
            { status: 400 }
          );
        }
        
        const messages = agentCommunication.getMessagesForAgent(agentId);
        return NextResponse.json({
          type: 'messages',
          agent: agentId,
          messages,
          count: messages.length,
          timestamp: new Date().toISOString()
        });

      case 'analytics':
        const analytics = agentCommunication.getCommunicationAnalytics();
        return NextResponse.json({
          type: 'communication_analytics',
          analytics,
          timestamp: new Date().toISOString()
        });

      case 'channels':
        // Return list of active channels
        const channels = Array.from((agentCommunication as any).activeChannels.entries()).map(
          ([id, channel]: [string, any]) => ({
            id,
            name: channel.name,
            type: channel.type,
            participants: channel.participants,
            isActive: channel.isActive,
            messageCount: channel.messageHistory.length,
            knowledgeSharing: channel.knowledgeSharing,
            realTimeSync: channel.realTimeSync
          })
        );
        
        return NextResponse.json({
          type: 'channels',
          channels,
          count: channels.length,
          timestamp: new Date().toISOString()
        });

      case 'channel_history':
        if (!channelId) {
          return NextResponse.json(
            { error: 'Channel ID required for channel history' },
            { status: 400 }
          );
        }
        
        const channel = (agentCommunication as any).activeChannels.get(channelId);
        if (!channel) {
          return NextResponse.json(
            { error: `Channel not found: ${channelId}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          type: 'channel_history',
          channelId,
          channel: {
            id: channelId,
            name: channel.name,
            participants: channel.participants,
            type: channel.type
          },
          messages: channel.messageHistory,
          timestamp: new Date().toISOString()
        });

      case 'knowledge_exchanges':
        const exchanges = (agentCommunication as any).knowledgeExchanges || [];
        return NextResponse.json({
          type: 'knowledge_exchanges',
          exchanges,
          count: exchanges.length,
          timestamp: new Date().toISOString()
        });

      case 'agent_profile':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID required for profile' },
            { status: 400 }
          );
        }
        
        const profile = (agentCommunication as any).communicationProfiles.get(agentId);
        if (!profile) {
          return NextResponse.json(
            { error: `Communication profile not found for agent: ${agentId}` },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          type: 'agent_profile',
          agent: agentId,
          profile,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Agent communication API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch communication data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/communication - Agent communication operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'send_message':
        const { from, to, content, messageType, context } = body;
        if (!from || !to || !content || !messageType) {
          return NextResponse.json(
            { error: 'from, to, content, and messageType required for send_message' },
            { status: 400 }
          );
        }
        
        const message = await agentCommunication.sendEnhancedMessage(
          from,
          Array.isArray(to) ? to : [to],
          content,
          messageType,
          context || {
            topic: 'general',
            domain: 'collaboration',
            requiresResponse: false
          }
        );
        
        return NextResponse.json({
          action: 'send_message',
          message: {
            id: message.id,
            from: message.from,
            to: message.to,
            messageType: message.messageType,
            priority: message.priority,
            timestamp: message.timestamp
          },
          success: true,
          timestamp: new Date().toISOString()
        });

      case 'generate_response':
        const { messageId, respondingAgent } = body;
        if (!messageId || !respondingAgent) {
          return NextResponse.json(
            { error: 'messageId and respondingAgent required for generate_response' },
            { status: 400 }
          );
        }
        
        // Find the message in history
        const messageHistory = (agentCommunication as any).messageHistory || [];
        const targetMessage = messageHistory.find((m: any) => m.id === messageId);
        
        if (!targetMessage) {
          return NextResponse.json(
            { error: `Message not found: ${messageId}` },
            { status: 404 }
          );
        }
        
        const response = await agentCommunication.generateIntelligentResponse(
          targetMessage,
          respondingAgent
        );
        
        return NextResponse.json({
          action: 'generate_response',
          messageId,
          respondingAgent,
          response,
          timestamp: new Date().toISOString()
        });

      case 'create_knowledge_exchange':
        const { fromAgent, toAgents, knowledgeType, knowledgeContent, applications } = body;
        if (!fromAgent || !toAgents || !knowledgeType || !knowledgeContent) {
          return NextResponse.json(
            { error: 'fromAgent, toAgents, knowledgeType, and knowledgeContent required' },
            { status: 400 }
          );
        }
        
        const exchange = await agentCommunication.createKnowledgeExchange(
          fromAgent,
          Array.isArray(toAgents) ? toAgents : [toAgents],
          knowledgeType,
          knowledgeContent,
          applications || []
        );
        
        return NextResponse.json({
          action: 'create_knowledge_exchange',
          exchange: {
            id: exchange.id,
            from: exchange.from,
            to: exchange.to,
            knowledgeType: exchange.knowledgeType,
            relevanceScore: exchange.relevanceScore,
            timestamp: exchange.timestamp
          },
          success: true,
          timestamp: new Date().toISOString()
        });

      case 'setup_collaboration_workspace':
        const { collaborationId, participants, workspaceConfig } = body;
        if (!collaborationId || !participants) {
          return NextResponse.json(
            { error: 'collaborationId and participants required for workspace setup' },
            { status: 400 }
          );
        }
        
        const workspace = await agentCommunication.setupCollaborationWorkspace(
          collaborationId,
          Array.isArray(participants) ? participants : [participants],
          workspaceConfig || {
            enableRealTimeSync: true,
            enableKnowledgeSharing: true,
            communicationFrequency: 'realtime'
          }
        );
        
        return NextResponse.json({
          action: 'setup_collaboration_workspace',
          workspace: {
            id: workspace.id,
            name: workspace.name,
            participants: workspace.participants,
            type: workspace.type,
            knowledgeSharing: workspace.knowledgeSharing,
            realTimeSync: workspace.realTimeSync
          },
          success: true,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Agent communication action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute communication operation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}