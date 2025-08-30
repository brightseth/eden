import { NextRequest, NextResponse } from 'next/server';
import { registryApi, Creation } from '@/lib/generated-sdk';
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

// Helper function to transform Registry Creation to Academy work format
function transformCreationToWork(creation: Creation, index?: number): any {
  return {
    id: creation.id,
    agent_id: 'abraham',
    archive_type: (creation.metadata?.dayNumber && creation.metadata.dayNumber <= 2522) ? 'early-work' : 'covenant',
    title: creation.title || `Knowledge Synthesis #${creation.metadata?.dayNumber || 'Unknown'}`,
    image_url: creation.mediaUri,
    archive_url: creation.mediaUri,
    created_date: creation.createdAt,
    archive_number: creation.metadata?.dayNumber,
    description: creation.metadata?.description || 'Knowledge synthesis and collective intelligence documentation',
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const period = searchParams.get('period'); // 'early-works' or 'covenant'
  const sort = searchParams.get('sort') || 'date_desc';

  // Check if Registry integration is enabled - temporarily disabled to fix early works
  const useRegistry = false; // featureFlags.isEnabled(FLAGS.ENABLE_ABRAHAM_REGISTRY_INTEGRATION);

  if (useRegistry) {
    try {
      console.log('[Abraham Works API] Using Registry integration via HTTP API');
      
      // Use Registry API via HTTP instead of generated SDK
      const registryUrl = process.env.REGISTRY_URL || 'https://eden-genesis-registry.vercel.app';
      const response = await fetch(`${registryUrl}/api/v1/agents/abraham/works?limit=10000`);
      
      if (!response.ok) {
        throw new Error(`Registry API error: ${response.status}`);
      }
      
      const registryData = await response.json();
      
      // Transform Registry works to Academy format
      const transformedWorks = registryData.works.map((work: any) => ({
        id: work.id,
        agent_id: 'abraham',
        archive_type: (work.metadata?.dayNumber && work.metadata.dayNumber <= 2522) ? 'early-work' : 'covenant',
        title: work.title || `Knowledge Synthesis #${work.metadata?.dayNumber || 'Unknown'}`,
        image_url: work.imageUrl || work.mediaUri,
        archive_url: work.imageUrl || work.mediaUri,
        created_date: work.createdAt,
        archive_number: work.metadata?.dayNumber,
        description: work.description || work.metadata?.description || 'Knowledge synthesis and collective intelligence documentation',
        metadata: work.metadata,
        trainer_id: null
      }));

      // Apply client-side filtering by period
      let filteredWorks = transformedWorks;
      if (period === 'early-works') {
        filteredWorks = transformedWorks.filter(work => 
          work.archive_number && work.archive_number <= 2522
        );
      } else if (period === 'covenant') {
        filteredWorks = transformedWorks.filter(work => 
          work.archive_number && work.archive_number > 2522
        );
      }

      // Apply sorting and pagination
      const sortedWorks = applySortingAndPagination(filteredWorks, sort, limit, offset);

      return NextResponse.json({
        works: sortedWorks,
        total: filteredWorks.length,
        limit,
        offset,
        filters: { period },
        sort,
        source: 'registry'
      });

    } catch (error) {
      console.error('[Abraham Works API] Registry fetch failed, falling back to Supabase:', error);
      // Fall through to Supabase fallback
    }
  }

  // Fallback to existing Supabase implementation
  console.log('[Abraham Works API] Using Supabase fallback');
  
  // First try the creations table where historical data is likely stored
  let query = supabase
    .from('creations')
    .select('*', { count: 'exact' })
    .eq('agent_name', 'abraham');

  // Filter by period if specified - creations table might have different structure
  if (period === 'early-works') {
    // Filter for early works - might use different criteria
    query = query.not('id', 'is', null); // Get all for now, filter in transform
  } else if (period === 'covenant') {
    // Covenant works are future works
    query = query.gt('created_at', '2025-01-01');
  }

  // Apply sorting - map to creations table columns
  const [sortField, sortOrder] = sort.split('_');
  const orderField = sortField === 'date' ? 'created_at' : 
                     sortField === 'number' ? 'created_at' : 'id';
  query = query.order(orderField, { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Transform creations table data to expected format
  const transformedWorks = (data || []).map((creation: any, index: number) => ({
    id: creation.id,
    agent_id: 'abraham',
    archive_type: 'early-work', // Most Abraham creations are early works
    title: creation.prompt || `Abraham Creation #${index + 1}`,
    image_url: creation.image_url,
    archive_url: creation.image_url,
    created_date: creation.created_at,
    archive_number: index + 1, // Use index as archive number if not available
    description: creation.prompt || creation.description || 'Early work by Abraham',
    metadata: {
      state: creation.state,
      agent_name: creation.agent_name
    }
  }));

  return NextResponse.json({
    works: transformedWorks,
    total: count,
    limit,
    offset,
    filters: { period },
    sort,
    source: 'supabase'
  });
}