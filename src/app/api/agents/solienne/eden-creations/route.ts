import { NextResponse } from 'next/server';
import { fetchSolienneCreations } from '@/lib/eden/eden-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '24');
  const mediaType = (searchParams.get('mediaType') as 'all' | 'image' | 'video') || 'all';
  const sortBy = (searchParams.get('sortBy') as 'date_desc' | 'date_asc') || 'date_desc';

  try {
    const result = await fetchSolienneCreations({
      page,
      pageSize,
      mediaType,
      sortBy
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching SOLIENNE creations:', error);
    return NextResponse.json(
      { 
        creations: [], 
        total: 0, 
        error: 'Failed to fetch creations' 
      },
      { status: 500 }
    );
  }
}