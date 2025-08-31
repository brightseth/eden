import { NextRequest, NextResponse } from 'next/server';
import { Asset } from '@/types/content';

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

// GET /api/agents/[id]/published - Public feed for agent's published assets
export async function GET(
  request: NextRequest,
  { params }: any) {
  const { id  } = params;
  const searchParams = request.nextUrl.searchParams;
  
  // Pagination params
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const collection = searchParams.get('collection');
  
  try {
    const assetStore = getAssetStore();
    
    // Filter published assets for this agent
    const publishedAssets = Array.from(assetStore.values()).filter(asset => {
      if (asset.agent_id !== id) return false;
      if (asset.state !== 'PUBLISHED') return false;
      if (collection && !asset.collection_ids?.includes(collection)) return false;
      return true;
    });
    
    // Sort by published date (newest first)
    publishedAssets.sort((a, b) => {
      const dateA = new Date(a.published_at || a.created_at).getTime();
      const dateB = new Date(b.published_at || b.created_at).getTime();
      return dateB - dateA;
    });
    
    // Calculate pagination
    const total = publishedAssets.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedAssets = publishedAssets.slice(offset, offset + limit);
    
    // Format response with minimal fields for public consumption
    const formattedAssets = paginatedAssets.map(asset => ({
      id: asset.id,
      title: asset.title || 'Untitled',
      description: asset.description,
      thumb_url: asset.media.thumb_url || asset.media.url,
      media_url: asset.media.url,
      dimensions: {
        width: asset.media.width,
        height: asset.media.height
      },
      duration_s: asset.media.duration_s,
      created_at: asset.created_at,
      published_at: asset.published_at,
      collection_ids: asset.collection_ids || [],
      tags: asset.tags || [],
      curation_score: asset.curation?.scores?.paris_photo_ready || null
    }));
    
    // Generate ETag for caching
    const etag = `"${id}-${page}-${limit}-${collection || 'all'}-${total}"`;
    
    // Check If-None-Match header
    const clientEtag = request.headers.get('If-None-Match');
    if (clientEtag === etag) {
      return new NextResponse(null, { status: 304 });
    }
    
    const response = NextResponse.json({
      agent_id: id,
      page,
      limit,
      total,
      total_pages: totalPages,
      collection: collection || null,
      assets: formattedAssets,
      _links: {
        self: `/api/agents/${id}/published?page=${page}&limit=${limit}${collection ? `&collection=${collection}` : ''}`,
        first: `/api/agents/${id}/published?page=1&limit=${limit}${collection ? `&collection=${collection}` : ''}`,
        last: `/api/agents/${id}/published?page=${totalPages}&limit=${limit}${collection ? `&collection=${collection}` : ''}`,
        prev: page > 1 ? `/api/agents/${id}/published?page=${page - 1}&limit=${limit}${collection ? `&collection=${collection}` : ''}` : null,
        next: page < totalPages ? `/api/agents/${id}/published?page=${page + 1}&limit=${limit}${collection ? `&collection=${collection}` : ''}` : null
      }
    });
    
    // Set cache headers (60 seconds CDN cache)
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30');
    response.headers.set('ETag', etag);
    
    return response;
    
  } catch (error) {
    console.error('Published feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch published assets' },
      { status: 500 }
    );
  }
}