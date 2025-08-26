import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';
import { featureFlags, FLAGS } from '@/config/flags';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const tags = searchParams.get('tags')?.split(',');
    const sort = searchParams.get('sort') || 'date_desc';
    const search = searchParams.get('search');

    // Feature flag check for Registry integration
    if (!featureFlags.isEnabled(FLAGS.ENABLE_SOLIENNE_REGISTRY_INTEGRATION)) {
      // Fallback to empty response when feature is disabled
      console.log('[Solienne] Registry integration disabled, returning empty works');
      return NextResponse.json({
        works: [],
        total: 0,
        limit,
        offset,
        filters: { tags },
        sort,
        message: 'Registry integration disabled'
      });
    }

    // Use generated SDK as required by ADR-019
    const registryData = await registryApi.getAgentWorks('solienne', { 
      limit: Math.min(limit * 5, 100) // Fetch more for filtering, but cap at reasonable limit
    });
    
    if (!registryData.works) {
      return NextResponse.json({
        works: [],
        total: 0,
        limit,
        offset,
        filters: { tags },
        sort
      });
    }

    // Apply client-side filtering and sorting until Registry API supports query params
    let works = registryData.works.filter(creation => 
      creation.status === 'PUBLISHED' || creation.status === 'CURATED'
    );

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      works = works.filter(work => 
        work.title.toLowerCase().includes(searchLower) ||
        (work.metadata?.description?.toLowerCase() || '').includes(searchLower)
      );
    }

    // Apply sorting using the original data structure
    const [sortField, sortOrder] = sort.split('_');
    works.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case 'date':
          aVal = new Date(a.createdAt || '').getTime();
          bVal = new Date(b.createdAt || '').getTime();
          break;
        case 'number':
          aVal = a.metadata?.dayNumber || 0;
          bVal = b.metadata?.dayNumber || 0;
          break;
        default:
          aVal = a.title;
          bVal = b.title;
      }
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    // Apply pagination
    const paginatedWorks = works.slice(offset, offset + limit);

    // Transform Registry works to Academy format
    const transformedWorks = paginatedWorks.map((work: any) => ({
      id: work.id,
      agent_id: 'solienne',
      archive_type: 'work', // Using canonical term "work" not "generation"
      title: work.title || 'Untitled Work',
      description: work.metadata?.description,
      image_url: work.imageUrl || work.mediaUri,
      thumbnail_url: work.imageUrl || work.mediaUri,
      created_date: work.createdAt,
      archive_number: work.metadata?.dayNumber || null,
      tags: [
        work.metadata?.theme,
        work.metadata?.style,
        work.metadata?.medium,
        ...(work.metadata?.tags || [])
      ].filter(Boolean),
      metadata: {
        ...work.metadata,
        theme: work.metadata?.theme,
        style: work.metadata?.style,
        medium: work.metadata?.medium
      },
      trainer_id: null
    }));

    return NextResponse.json({
      works: transformedWorks,
      total: works.length,
      limit,
      offset,
      filters: { tags },
      sort,
      source: 'registry'
    });

  } catch (error) {
    const traceId = `solienne-works-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.error(`[Registry] Failed to fetch Solienne works - trace: ${traceId}`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch works from Registry',
        details: error instanceof Error ? error.message : 'Unknown error',
        traceId
      },
      { status: 500 }
    );
  }
}