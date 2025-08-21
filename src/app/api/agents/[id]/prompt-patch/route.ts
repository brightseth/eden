import { NextResponse } from 'next/server';

// Store for prompt patches - will connect to database later
const patchStore = new Map<string, Array<any>>();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const { patch, source_image_id, dimensions } = await request.json();
    
    if (!patch) {
      return NextResponse.json(
        { error: 'patch is required' },
        { status: 400 }
      );
    }
    
    // Create patch record
    const patchRecord = {
      id: crypto.randomUUID(),
      agent_id: agentId,
      patch,
      source_image_id,
      dimensions,
      applied_at: new Date().toISOString(),
      status: 'queued'
    };
    
    // Store patch
    if (!patchStore.has(agentId)) {
      patchStore.set(agentId, []);
    }
    patchStore.get(agentId)!.push(patchRecord);
    
    // In production, this would queue a generation job
    // queueJob('agent.generate', { agent_id: agentId, patch, source_image_id });
    
    // Emit event for tracking
    // emitEvent({ 
    //   type: 'PROMPT_PATCH_APPLIED', 
    //   agent_id: agentId, 
    //   payload: { patch, source_image_id, dimensions } 
    // });
    
    return NextResponse.json({
      success: true,
      patch_id: patchRecord.id,
      agent_id: agentId,
      status: 'queued',
      message: 'Prompt patch applied and generation queued'
    });
  } catch (error) {
    console.error('Prompt patch error:', error);
    return NextResponse.json(
      { error: 'Failed to apply prompt patch' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const patches = patchStore.get(agentId) || [];
    const recentPatches = patches.slice(-limit).reverse();
    
    return NextResponse.json({
      agent_id: agentId,
      count: patches.length,
      patches: recentPatches
    });
  } catch (error) {
    console.error('Get patches error:', error);
    return NextResponse.json(
      { error: 'Failed to get prompt patches' },
      { status: 500 }
    );
  }
}