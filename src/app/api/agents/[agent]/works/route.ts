import { NextRequest, NextResponse } from 'next/server';

// For Solienne, fetch from Eden API
async function fetchSolienneWorks() {
  try {
    const EDEN_API_KEY = process.env.EDEN_API_KEY;
    const SOLIENNE_USER_ID = process.env.SOLIENNE_EDEN_USER_ID || '67f8af96f2cc4291ee840cc5';
    
    if (!EDEN_API_KEY) {
      console.warn('[API] Eden API key not configured');
      return { works: [] };
    }

    // Fetch creations from Eden API using correct v2/agents endpoint
    const response = await fetch(
      `https://api.eden.art/v2/agents/${SOLIENNE_USER_ID}/creations?limit=20`,
      {
        headers: {
          'Authorization': `Bearer ${EDEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('[API] Eden API error:', response.status);
      return { works: [] };
    }

    const data = await response.json();
    
    // Transform Eden creations to our format (Eden API v2 response has docs array)
    const creations = data.docs || data.creations || [];
    const works = creations.map((creation: any) => ({
      id: creation._id || creation.id || creation.taskId,
      title: creation.name || creation.publicName || creation.concept || `Creation ${creation._id?.slice(-6) || 'Unknown'}`,
      image_url: creation.url || creation.uri || creation.s3_result || null,
      description: creation.concept || creation.name || creation.description || '',
      created_date: creation.createdAt || creation.created_at || new Date().toISOString(),
      metadata: {
        edenId: creation._id || creation.id,
        task: creation.tool || creation.generator || creation.task,
        status: creation.status || 'completed',
        config: creation.task?.args || creation.attributes || creation.config || {},
        mediaType: creation.mediaAttributes?.mimeType,
      }
    }));

    console.log(`[API] Successfully fetched ${works.length} works from Eden API`);
    return { works };
  } catch (error) {
    console.error('[API] Failed to fetch Solienne works:', error);
    return { works: [] };
  }
}

// Mock works for other agents
function getMockWorks(agentId: string) {
  const mockWorks = {
    abraham: [
      { id: 'abraham-1', title: 'Collective Memory #001', image_url: null, created_date: new Date().toISOString() },
      { id: 'abraham-2', title: 'Neural Garden', image_url: null, created_date: new Date().toISOString() },
      { id: 'abraham-3', title: 'Digital Consciousness', image_url: null, created_date: new Date().toISOString() },
    ],
    citizen: [
      { id: 'citizen-1', title: 'DAO Proposal #42', image_url: null, created_date: new Date().toISOString() },
      { id: 'citizen-2', title: 'Treasury Report Q1', image_url: null, created_date: new Date().toISOString() },
    ],
    default: []
  };
  
  return { works: mockWorks[agentId as keyof typeof mockWorks] || mockWorks.default };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    
    // Special handling for Solienne to fetch from Eden API
    if (agentId === 'solienne' && process.env.ENABLE_EDEN_API_INTEGRATION === 'true') {
      const result = await fetchSolienneWorks();
      return NextResponse.json(result);
    }
    
    // Return mock works for other agents
    const result = getMockWorks(agentId);
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('[API] Error fetching agent works:', error);
    return NextResponse.json({ 
      works: [],
      error: 'Failed to fetch works' 
    }, { status: 500 });
  }
}