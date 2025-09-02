export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Asset, AssetKind } from '@/types/content';

// Mock storage - will replace with Supabase
declare global {
  var assetStore: Map<string, Asset> | undefined;
}

const getAssetStore = () => {
  if (!global.assetStore) {
    global.assetStore = new Map<string, Asset>();
  }
  return global.assetStore;
};

// Mock auto-curation queue
async function enqueueCuration(assetId: string) {
  // Simulate async curation
  setTimeout(async () => {
    const assetStore = getAssetStore();
    const asset = assetStore.get(assetId);
    if (!asset) return;
    
    // Mock SUE curation result
    const verdicts = ['INCLUDE', 'MAYBE', 'EXCLUDE'] as const;
    const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
    
    asset.curation = {
      verdict,
      scores: {
        composition: Math.floor(Math.random() * 40) + 60,
        technique: Math.floor(Math.random() * 40) + 60,
        concept: Math.floor(Math.random() * 40) + 60,
        originality: Math.floor(Math.random() * 40) + 60,
        paris_photo_ready: verdict === 'INCLUDE' ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 30) + 40
      },
      rationale: `Automated curation assessment completed. ${verdict === 'INCLUDE' ? 'This piece demonstrates strong artistic merit.' : 'Further refinement recommended.'}`,
      critic_version: '1.0.0',
      confidence: Math.random() * 0.3 + 0.7
    };
    
    asset.state = 'CURATED';
    assetStore.set(assetId, asset);
  }, 2000);
}

// GET /api/agents/[id]/assets - Fetch agent's assets
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const state = searchParams.get('state');
  const kind = searchParams.get('kind');
  
  // Filter assets by agent_id and optional params
  const assetStore = getAssetStore();
  const assets = Array.from(assetStore.values()).filter(asset => {
    if (asset.agent_id !== id) return false;
    if (state && asset.state !== state) return false;
    if (kind && asset.kind !== kind) return false;
    return true;
  });
  
  // Sort by created_at desc
  assets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return NextResponse.json({ assets });
}

// POST /api/agents/[id]/assets - Upload new assets
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const data = await request.json();
    const { files, urls, title, description, tags = [] } = data;
    
    const assetStore = getAssetStore();
    const results: Asset[] = [];
    const sources = files || urls || [];
    
    for (const source of sources) {
      const assetId = `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Determine asset kind from mime type or file extension
      let kind: AssetKind = 'image';
      if (source.type?.includes('video') || source.url?.match(/\.(mp4|mov|avi|webm)$/i)) {
        kind = 'video';
      }
      
      const asset: Asset = {
        id: assetId,
        agent_id: id,
        kind,
        source: 'manual',
        state: 'CREATED',
        title: title || null,
        description: description || null,
        created_at: new Date().toISOString(),
        tags,
        media: {
          url: source.url || source.data, // Handle both URL and base64
          thumb_url: source.thumb_url,
          width: source.width,
          height: source.height,
          duration_s: source.duration
        }
      };
      
      // Store asset
      assetStore.set(assetId, asset);
      results.push(asset);
      
      // Queue for auto-curation
      enqueueCuration(assetId);
    }
    
    return NextResponse.json({ 
      success: true,
      created: results,
      message: `${results.length} asset(s) uploaded successfully` 
    });
  } catch (error) {
    console.error('Asset upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload assets' },
      { status: 500 }
    );
  }
}

// PATCH /api/agents/[id]/assets/[assetId] - Update asset
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const segments = request.nextUrl.pathname.split('/');
    const assetId = segments[segments.length - 1];
    
    const updates = await request.json();
    const assetStore = getAssetStore();
    const asset = assetStore.get(assetId);
    
    if (!asset || asset.agent_id !== id) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    // Apply updates
    Object.assign(asset, updates);
    assetStore.set(assetId, asset);
    
    return NextResponse.json({ 
      success: true,
      asset 
    });
  } catch (error) {
    console.error('Asset update error:', error);
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    );
  }
}