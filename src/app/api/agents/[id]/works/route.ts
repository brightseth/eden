import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';

// GET /api/agents/[id]/works - Get agent's creative works
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string  }> }) {
  try {
    const params = await context.params; const { id } = params;
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status'); // DRAFT, CURATED, PUBLISHED, ARCHIVED

    console.log(`API /agents/${id}/works: Fetching from Registry...`);

    // Fetch agent with creations from Registry
    const agent = await registryApi.getAgent(id.toLowerCase(), ['creations']);

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Filter and paginate works
    let works = agent.creations || [];
    
    // Apply status filter if provided
    if (status) {
      works = works.filter((work: any) => work.status === status.toUpperCase());
    }

    // Apply pagination
    const paginatedWorks = works.slice(offset, offset + limit);

    console.log(`API /agents/${id}/works: Returning ${paginatedWorks.length} works`);

    return NextResponse.json({
      agent: {
        id: agent.handle,
        name: agent.displayName,
        status: agent.status
      },
      works: paginatedWorks,
      total: works.length,
      limit,
      offset,
      hasMore: offset + limit < works.length
    });
  } catch (error) {
    console.error(`Failed to fetch works for agent:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch agent works' },
      { status: 500 }
    );
  }
}

// POST /api/agents/[id]/works - Create new work (for authorized agents)
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string  }> }) {
  try {
    const params = await context.params; const { id } = params;
    
    // Verify internal API token
    const authHeader = request.headers.get('Authorization');
    const expectedToken = process.env.INTERNAL_API_TOKEN;
    
    if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, mediaUri, metadata, status = 'DRAFT' } = body;

    if (!title || !mediaUri) {
      return NextResponse.json(
        { error: 'Missing required fields: title and mediaUri' },
        { status: 400 }
      );
    }

    // In production, this would create the work in Registry
    // For now, we log and return success
    console.log(`Creating work for agent ${id}:`, {
      title,
      mediaUri,
      status,
      metadata
    });

    // TODO: When Registry supports work creation:
    // const work = await registryApi.createWork(id, { title, mediaUri, metadata, status });

    const mockWork = {
      id: `work-${Date.now()}`,
      title,
      mediaUri,
      metadata,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      work: mockWork
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create work:', error);
    return NextResponse.json(
      { error: 'Failed to create work' },
      { status: 500 }
    );
  }
}