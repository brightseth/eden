import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: any) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const after = searchParams.get('after'); // ISO timestamp
    
    const supabase = await createClient();
    
    // Build query
    let query = supabase
      .from('creations')
      .select('*')
      .eq('agent_name', params.id.toUpperCase())
      .eq('state', 'published')
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Pagination
    if (after) {
      query = query.lt('created_at', after);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch creations' },
        { status: 500 }
      );
    }
    
    // Format response
    const creations = (data || []).map(creation => ({
      id: creation.id,
      title: creation.title,
      description: creation.description,
      image_url: creation.image_url,
      thumbnail_url: creation.thumbnail_url || creation.image_url,
      tags: creation.tags?.taxonomy || {},
      quality: creation.quality || {},
      created_at: creation.created_at,
      collection: creation.collection,
      edition_size: creation.edition_size,
      price: creation.price,
      currency: creation.currency || 'ETH'
    }));
    
    // Set cache headers (60 seconds)
    const response = NextResponse.json({
      agent: params.id,
      count: creations.length,
      creations,
      next_cursor: creations.length === limit ? creations[creations.length - 1]?.created_at : null
    });
    
    response.headers.set('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30');
    
    // Add ETag for efficient caching
    const etag = `"${params.id}-${creations.length}-${creations[0]?.id || 'empty'}"`;
    response.headers.set('ETag', etag);
    
    // Check if client has valid cache
    if (request.headers.get('If-None-Match') === etag) {
      return new NextResponse(null, { status: 304 });
    }
    
    return response;
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}