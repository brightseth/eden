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

  // Check if Registry integration is enabled
  const useRegistry = featureFlags.isEnabled(FLAGS.ENABLE_ABRAHAM_REGISTRY_INTEGRATION);

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
      
      // Check if Registry has works data
      if (!registryData.works || registryData.works.length === 0) {
        console.log('[Abraham Works API] Registry has no works data, falling back to Supabase/mock');
        throw new Error('Registry has no works data');
      }
      
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

  if (error || !data || data.length === 0) {
    console.warn('[Abraham Works API] Supabase fallback failed or empty, using mock data:', error?.message || 'No data');
    
    // Generate comprehensive mock data for Abraham's 3,693 historical works
    const TOTAL_EARLY_WORKS = 3693;
    const COVENANT_START_DAY = 2523; // Day 2523 is when covenant period begins
    
    // Generate mock works based on pagination
    const mockWorks = [];
    const startIndex = offset;
    const endIndex = Math.min(offset + limit, TOTAL_EARLY_WORKS);
    
    // Knowledge synthesis themes for variety
    const themes = [
      'Collective Intelligence Synthesis',
      'Community Knowledge Mapping', 
      'Collaborative Learning Documentation',
      'Wisdom Aggregation Process',
      'Distributed Cognition Study',
      'Social Learning Patterns',
      'Knowledge Graph Construction',
      'Collective Problem Solving',
      'Community-Driven Insights',
      'Participatory Research',
      'Crowdsourced Understanding',
      'Collaborative Discovery',
      'Shared Intelligence Networks',
      'Collective Memory Formation',
      'Community Wisdom Capture'
    ];
    
    const descriptions = [
      'Documentation of collective intelligence synthesis from community interactions and shared learning processes.',
      'Mapping the emergence of knowledge through collaborative community engagement and participatory research.',
      'Analysis of distributed cognition patterns in community-driven learning environments.',
      'Synthesis of collective wisdom aggregated from diverse community perspectives and experiences.',
      'Study of social learning dynamics and knowledge transfer mechanisms in collaborative networks.',
      'Documentation of community problem-solving approaches and collective decision-making processes.',
      'Exploration of participatory research methods and their impact on knowledge creation.',
      'Analysis of knowledge graph construction through community collaboration and shared understanding.',
      'Investigation of collective memory formation and its role in community wisdom preservation.',
      'Documentation of emergent intelligence patterns from community interactions and shared insights.'
    ];

    for (let i = startIndex; i < endIndex; i++) {
      const dayNumber = i + 1; // Day numbers start from 1
      const theme = themes[i % themes.length];
      const description = descriptions[i % descriptions.length];
      
      // Create date progression from Summer 2021 (June-August 2021)
      const baseDate = new Date('2021-06-01');
      const daysOffset = Math.floor((i / TOTAL_EARLY_WORKS) * 90); // Spread over ~90 days of summer
      const workDate = new Date(baseDate.getTime() + (daysOffset * 24 * 60 * 60 * 1000));
      
      // Filter by period if specified
      const isEarlyWork = dayNumber <= 2522;
      if (period === 'early-works' && !isEarlyWork) continue;
      if (period === 'covenant' && isEarlyWork) continue;
      
      mockWorks.push({
        id: `abraham-work-${dayNumber}`,
        agent_id: 'abraham',
        archive_type: isEarlyWork ? 'early-work' : 'covenant',
        title: `${theme} #${dayNumber}`,
        image_url: `https://imagedelivery.net/XRJKGFdhw7_YKn4MrE-ruw/abraham-synthesis-${dayNumber}/thumbnail`, // Placeholder image URL pattern
        archive_url: `https://imagedelivery.net/XRJKGFdhw7_YKn4MrE-ruw/abraham-synthesis-${dayNumber}/public`,
        created_date: workDate.toISOString(),
        archive_number: dayNumber,
        description: description,
        metadata: {
          dayNumber: dayNumber,
          period: isEarlyWork ? 'early-works' : 'covenant',
          theme: theme.toLowerCase().replace(/\s+/g, '-'),
          generatedMock: true
        }
      });
    }

    // Apply sorting to mock works
    const sortedWorks = applySortingAndPagination(mockWorks, sort, mockWorks.length, 0);

    // Calculate total based on period filter
    let totalCount = TOTAL_EARLY_WORKS;
    if (period === 'early-works') {
      totalCount = 2522; // Early works are days 1-2522
    } else if (period === 'covenant') {
      totalCount = TOTAL_EARLY_WORKS - 2522; // Covenant works are days 2523+
    }

    return NextResponse.json({
      works: sortedWorks,
      total: totalCount,
      limit,
      offset,
      filters: { period },
      sort,
      source: 'mock-generated'
    });
  }

  // If Supabase data exists, transform and return it
  const transformedWorks = data.map((creation: any, index: number) => ({
    id: creation.id,
    agent_id: 'abraham',
    archive_type: 'early-work',
    title: creation.prompt || `Abraham Creation #${index + 1}`,
    image_url: creation.image_url,
    archive_url: creation.image_url,
    created_date: creation.created_at,
    archive_number: index + offset + 1,
    description: creation.prompt || creation.description || 'Early work by Abraham',
    metadata: {
      state: creation.state,
      agent_name: creation.agent_name
    }
  }));

  return NextResponse.json({
    works: transformedWorks,
    total: count || transformedWorks.length,
    limit,
    offset,
    filters: { period },
    sort,
    source: 'supabase'
  });
}