import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/sdk';
import { safeStatusFormat } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await context.params;

    // Get agent data from Registry (single source of truth)
    const agent = await registryClient.agents.get(agentId);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Get agent's recent creations from Registry
    const recentCreations = await registryClient.creations.list(agentId, {
      status: 'published',
      limit: 12
    });

    // Calculate practice metrics from Registry data
    const practiceDay = agent.createdAt ? 
      Math.floor((Date.now() - new Date(agent.createdAt).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 
      null;

    // Generate milestones based on creation count and status
    const milestones = [];
    const creationCount = agent.counts?.creations || 0;
    
    const checkpoints = [
      { count: 1, label: 'First Creation' },
      { count: 10, label: '10 Works' },
      { count: 50, label: '50 Works' },
      { count: 100, label: '100 Works' },
      { count: 500, label: '500 Works' },
      { count: 1000, label: '1000 Works' }
    ];
    
    checkpoints.forEach(cp => {
      if (creationCount >= cp.count) {
        milestones.push({ label: cp.label, reached: true });
      } else if (milestones.length < 4) {
        milestones.push({ label: cp.label, reached: false });
      }
    });

    // Build response matching EnrichedProfile expectations using Registry data
    const response = {
      agent: {
        id: agent.id,
        displayName: agent.displayName,
        status: safeStatusFormat(agent.status), // Standardize to uppercase: INVITED | ONBOARDING | ACTIVE | GRADUATED
        mode: agent.role === 'CREATOR' ? 'autonomous' : 'guided',
        practice: {
          name: agent.profile?.links?.specialty?.description || 'Daily Practice',
          startAt: agent.createdAt,
          day: practiceDay,
          milestones
        },
        trainer: null, // Registry doesn't store trainer relationships yet
        statement: agent.profile?.statement || '',
        contract: null, // Not stored in Registry yet
        influences: [], // Not stored in Registry yet
        socials: {}, // Not stored in Registry yet  
        heroUrl: null, // Not stored in Registry yet
        avatarUrl: null, // Not stored in Registry yet
        prototypeLinks: agent.profile?.prototypeLinks?.filter(link => link.status === 'active') || []
      },
      highlights: recentCreations?.map((creation, index) => ({
        id: creation.id,
        archiveNumber: index + 1,
        imageUrl: creation.metadata?.imageUrl || null,
        title: creation.title,
        createdDate: creation.createdAt,
        trainerId: null
      })) || [],
      curation: {
        include: recentCreations?.filter(c => c.status === 'curated').length || 0,
        maybe: 0,
        exclude: 0,
        includeRate: recentCreations?.length ? 
          (recentCreations.filter(c => c.status === 'curated').length / recentCreations.length) : 0
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error fetching agent profile from Registry:', error);
    
    // Fallback error response
    return NextResponse.json(
      { error: error.message || 'Failed to fetch agent profile from Registry' },
      { status: 500 }
    );
  }
}