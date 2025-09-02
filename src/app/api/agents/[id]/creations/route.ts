import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/config/flags';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CreationPostZ = z.object({
  mediaUri: z.string().min(1),
  metadata: z.record(z.any()).optional(),
  publishedTo: z.string().optional(),
});

export async function GET(request: NextRequest, { params }: { params: { id: string }}) {
  const { searchParams } = new URL(request.url);
  const statusLc = searchParams.get('status') as 'curated' | 'published' | null;
  const status = statusLc ? (statusLc.toUpperCase() as 'CURATED'|'PUBLISHED') : undefined;

  if (FEATURE_FLAGS.FEATURE_REGISTRY_GATEWAY_DISABLED) {
    // Return mock data for now
    return NextResponse.json([], { headers: { 'Access-Control-Allow-Origin': '*' }});
  }

  // When gateway is ready, uncomment:
  // const { registryGateway } = await import('@/lib/registry/gateway');
  // const data = await registryGateway.getAgentCreations(params.id, status);
  // return NextResponse.json(data, { headers: { 'Access-Control-Allow-Origin': '*' }});
  
  return NextResponse.json([], { headers: { 'Access-Control-Allow-Origin': '*' }});
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest, { params }: { params: { id: string }}) {
  try {
    const input = CreationPostZ.parse(await req.json());

    if (FEATURE_FLAGS.FEATURE_REGISTRY_GATEWAY_DISABLED) {
      const created = {
        id: `creation-${Date.now()}`,
        agentId: params.id,
        mediaUri: input.mediaUri,
        metadata: input.metadata ?? {},
        publishedTo: input.publishedTo ?? 'eden',
        createdAt: new Date().toISOString(),
      };
      return NextResponse.json(created, { headers: { 'Access-Control-Allow-Origin': '*' }});
    }

    // When gateway is ready, uncomment:
    // const { registryGateway } = await import('@/lib/registry/gateway');
    // const created = await registryGateway.postCreation(params.id, input);
    // return NextResponse.json(created, { headers: { 'Access-Control-Allow-Origin': '*' }});
    
    const created = {
      id: `creation-${Date.now()}`,
      agentId: params.id,
      mediaUri: input.mediaUri,
      metadata: input.metadata ?? {},
      publishedTo: input.publishedTo ?? 'eden',
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json(created, { headers: { 'Access-Control-Allow-Origin': '*' }});
  } catch (e: any) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: e.issues },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      );
    }
    console.error('Failed to create creation:', e);
    return NextResponse.json(
      { error: e?.message ?? 'Failed to create creation' },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }
}