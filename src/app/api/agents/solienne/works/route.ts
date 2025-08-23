import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const tags = searchParams.get('tags')?.split(',');
  const sort = searchParams.get('sort') || 'date_desc';

  let query = supabase
    .from('agent_archives')
    .select('*', { count: 'exact' })
    .eq('agent_id', 'solienne')
    .eq('archive_type', 'generation');

  // Apply tag filters if provided
  if (tags && tags.length > 0) {
    query = query.contains('metadata->tags', tags);
  }

  // Apply sorting
  const [sortField, sortOrder] = sort.split('_');
  const orderField = sortField === 'date' ? 'created_date' : 
                     sortField === 'number' ? 'archive_number' : 'title';
  query = query.order(orderField, { ascending: sortOrder === 'asc' });

  // Apply pagination
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    works: data,
    total: count,
    limit,
    offset,
    filters: { tags },
    sort
  });
}