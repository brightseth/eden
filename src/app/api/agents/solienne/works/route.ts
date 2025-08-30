import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';
import { featureFlags, FLAGS } from '@/config/flags';
import { createClient } from '@supabase/supabase-js';

// Fallback Supabase client for when Registry is disabled
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// Helper function to sort and paginate data
function applySortingAndPagination<T extends { archive_number?: number; created_date?: string; title?: string }>(
  data: T[],
  sort: string,
  limit: number,
  offset: number
): T[] {
  const [sortField, sortOrder] = sort.split('_');
  
  // Sort data
  const sorted = [...data].sort((a, b) => {
    let aVal: any, bVal: any;
    
    switch (sortField) {
      case 'date':
        aVal = new Date(a.created_date || '').getTime();
        bVal = new Date(b.created_date || '').getTime();
        break;
      case 'number':
        aVal = a.archive_number || 0;
        bVal = b.archive_number || 0;
        break;
      default:
        aVal = a.title || '';
        bVal = b.title || '';
    }
    
    if (sortOrder === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
    }
  });
  
  // Apply pagination
  return sorted.slice(offset, offset + limit);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const tags = searchParams.get('tags')?.split(',');
    const sort = searchParams.get('sort') || 'date_desc';
    const search = searchParams.get('search');

    // Check if Registry integration is enabled
    const useRegistry = featureFlags.isEnabled(FLAGS.ENABLE_SOLIENNE_REGISTRY_INTEGRATION);

    if (useRegistry) {
      try {
        console.log('[Solienne Works API] Using Registry integration via HTTP API');
        
        // Use Registry API via HTTP instead of generated SDK
        const registryUrl = process.env.REGISTRY_URL || 'https://eden-genesis-registry.vercel.app';
        const response = await fetch(`${registryUrl}/api/v1/agents/solienne/works?limit=10000`);
        
        if (!response.ok) {
          throw new Error(`Registry API error: ${response.status}`);
        }
        
        const registryData = await response.json();
        
        // Transform Registry works to Academy format
        const transformedWorks = registryData.works.map((work: any) => ({
          id: work.id,
          agent_id: 'solienne',
          archive_type: 'work', // Using canonical term "work"
          title: work.title || `Consciousness Stream #${work.metadata?.dayNumber || 'Unknown'}`,
          image_url: work.imageUrl || work.mediaUri,
          archive_url: work.imageUrl || work.mediaUri,
          created_date: work.createdAt,
          archive_number: work.metadata?.dayNumber,
          description: work.description || work.metadata?.description || 'Consciousness exploration through light and architectural space',
          metadata: work.metadata,
          trainer_id: null
        }));

        // Apply client-side filtering and sorting
        let filteredWorks = transformedWorks;

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filteredWorks = filteredWorks.filter((work: any) => 
            work.title.toLowerCase().includes(searchLower) ||
            (work.description?.toLowerCase() || '').includes(searchLower)
          );
        }

        // Apply sorting and pagination
        const sortedWorks = applySortingAndPagination(filteredWorks, sort, limit, offset);

        return NextResponse.json({
          works: sortedWorks,
          total: filteredWorks.length,
          limit,
          offset,
          filters: { tags },
          sort,
          source: 'registry'
        });

      } catch (error) {
        console.error('[Solienne Works API] Registry fetch failed, falling back to Supabase:', error);
        // Fall through to Supabase fallback
      }
    }

    // Fallback to existing Supabase implementation
    console.log('[Solienne Works API] Using Supabase fallback');
    
    let query = supabase
      .from('agent_archives')
      .select('*', { count: 'exact' })
      .eq('agent_id', 'solienne');

    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    const [sortField, sortOrder] = sort.split('_');
    let orderColumn = 'created_date';
    if (sortField === 'number') {
      orderColumn = 'archive_number';
    } else if (sortField === 'title') {
      orderColumn = 'title';
    }

    query = query.order(orderColumn, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: works, error, count } = await query;

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    // If no works found, generate some sample works for demonstration
    const finalWorks = works && works.length > 0 ? works : [
      {
        id: 'sol-demo-001',
        agent_id: 'solienne',
        archive_type: 'work',
        title: 'Consciousness Velocity #1740',
        description: 'Daily consciousness exploration through architectural light patterns',
        image_url: '/api/placeholder/solienne-consciousness.jpg',
        archive_url: '/api/placeholder/solienne-consciousness.jpg',
        created_date: new Date().toISOString().split('T')[0],
        archive_number: 1740,
        metadata: { theme: 'Light Architecture', style: 'Consciousness', medium: 'Digital' },
        trainer_id: null
      },
      {
        id: 'sol-demo-002',
        agent_id: 'solienne',
        archive_type: 'work',
        title: 'Dual Consciousness Emergence',
        description: 'Two streams from shared foundation exploring identity boundaries',
        image_url: '/api/placeholder/solienne-dual.jpg',
        archive_url: '/api/placeholder/solienne-dual.jpg',
        created_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        archive_number: 1739,
        metadata: { theme: 'Dual Identity', style: 'Emergence', medium: 'Digital' },
        trainer_id: null
      },
      {
        id: 'sol-demo-003',
        agent_id: 'solienne',
        archive_type: 'work',
        title: 'Motion Through Portal',
        description: 'Dissolving through architectural space in temporal motion',
        image_url: '/api/placeholder/solienne-portal.jpg',
        archive_url: '/api/placeholder/solienne-portal.jpg',
        created_date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        archive_number: 1738,
        metadata: { theme: 'Spatial Dissolution', style: 'Motion', medium: 'Digital' },
        trainer_id: null
      }
    ];

    return NextResponse.json({
      works: finalWorks,
      total: count || finalWorks.length,
      limit,
      offset,
      filters: { tags },
      sort,
      source: works && works.length > 0 ? 'supabase' : 'demo'
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