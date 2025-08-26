import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const tags = searchParams.get('tags')?.split(',');
    const sort = searchParams.get('sort') || 'date_desc';
    const search = searchParams.get('search');

    // Use Registry API instead of direct Supabase query
    const registryUrl = process.env.REGISTRY_URL || 'http://localhost:3005';
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    });

    // Add search filter if present
    if (search) {
      params.append('search', search);
    }

    // Convert sort format from Academy to Registry format
    const [sortField, sortOrder] = sort.split('_');
    const registrySortParam = sortField === 'date' ? 'createdAt' : 
                             sortField === 'number' ? 'dayNumber' : 'title';
    params.append('sort', registrySortParam);
    params.append('order', sortOrder === 'desc' ? 'desc' : 'asc');

    const response = await fetch(`${registryUrl}/api/v1/agents/solienne/works?${params}`);

    if (!response.ok) {
      throw new Error(`Registry API error: ${response.status}`);
    }

    const registryData = await response.json();

    // Transform Registry works to match Academy Archive interface
    const transformedWorks = registryData.works.map((work: any) => ({
      id: work.id,
      agent_id: 'solienne',
      archive_type: 'generation',
      title: work.title || 'Untitled',
      description: work.description,
      image_url: work.imageUrl || work.mediaUri,
      thumbnail_url: work.imageUrl || work.mediaUri,
      created_date: work.createdAt,
      archive_number: work.metadata?.dayNumber || null,
      tags: [
        work.theme,
        work.style, 
        work.medium,
        ...(work.metadata?.tags || [])
      ].filter(Boolean),
      metadata: {
        ...work.metadata,
        tags: [work.theme, work.style, work.medium].filter(Boolean),
        themes: work.theme,
        style: work.style,
        medium: work.medium
      },
      trainer_id: null
    }));

    return NextResponse.json({
      works: transformedWorks,
      total: registryData.total,
      limit,
      offset,
      filters: { tags },
      sort
    });

  } catch (error) {
    console.error('Error fetching from Registry API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch works from Registry',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}