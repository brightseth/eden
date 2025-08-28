import { NextRequest, NextResponse } from 'next/server';
import { crossAgentCollaboration } from '@/lib/collaboration/cross-agent-framework';
import type { CollaborationProposal } from '@/lib/collaboration/cross-agent-framework';

// GET /api/collaboration - Get collaboration data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'active';
    const agentId = searchParams.get('agent');
    const collaborationId = searchParams.get('id');
    
    switch (type) {
      case 'active':
        const activeCollaborations = crossAgentCollaboration.getActiveCollaborations();
        return NextResponse.json({
          collaborations: activeCollaborations,
          count: activeCollaborations.length,
          timestamp: new Date().toISOString()
        });

      case 'recommendations':
        if (!agentId) {
          return NextResponse.json(
            { error: 'Agent ID required for recommendations' },
            { status: 400 }
          );
        }
        
        const recommendations = await crossAgentCollaboration.getCollaborationRecommendations(agentId);
        return NextResponse.json({
          agent: agentId,
          recommendations,
          timestamp: new Date().toISOString()
        });

      case 'details':
        if (!collaborationId) {
          return NextResponse.json(
            { error: 'Collaboration ID required' },
            { status: 400 }
          );
        }
        
        const collaboration = crossAgentCollaboration.getCollaboration(collaborationId);
        if (!collaboration) {
          return NextResponse.json(
            { error: 'Collaboration not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          collaboration,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Collaboration API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch collaboration data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/collaboration - Collaboration operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params } = body;
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'propose':
        const proposal = params as CollaborationProposal;
        if (!proposal.title || !proposal.objective || !proposal.type) {
          return NextResponse.json(
            { error: 'Title, objective, and type required for proposal' },
            { status: 400 }
          );
        }
        
        const proposalResult = await crossAgentCollaboration.proposeCollaboration(proposal);
        
        return NextResponse.json({
          action: 'propose',
          result: proposalResult,
          timestamp: new Date().toISOString()
        });

      case 'initiate':
        const { collaborationId } = params;
        if (!collaborationId) {
          return NextResponse.json(
            { error: 'Collaboration ID required' },
            { status: 400 }
          );
        }
        
        const initiatedCollaboration = await crossAgentCollaboration.initiateCollaboration(collaborationId);
        
        return NextResponse.json({
          action: 'initiate',
          collaboration: initiatedCollaboration,
          timestamp: new Date().toISOString()
        });

      case 'update_status':
        const { id, status } = params;
        if (!id || !status) {
          return NextResponse.json(
            { error: 'Collaboration ID and status required' },
            { status: 400 }
          );
        }
        
        await crossAgentCollaboration.updateCollaborationStatus(id, status);
        
        return NextResponse.json({
          action: 'update_status',
          collaborationId: id,
          newStatus: status,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Collaboration action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute collaboration action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}