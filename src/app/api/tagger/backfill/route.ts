import { NextRequest, NextResponse } from 'next/server';

export const runtime = "nodejs";

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return getSupabase();
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    // Simple auth check - only allow in development or with secret
    const authHeader = request.headers.get('authorization');
    const isDev = process.env.NODE_ENV === 'development';
    const hasValidAuth = authHeader === `Bearer ${process.env.TAGGER_ADMIN_SECRET}`;
    
    if (!isDev && !hasValidAuth) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const supabase = await getSupabase();
    
    // Get all works that don't have tags yet
    const { data: works, error: worksError } = await supabase
      .from('works')
      .select(`
        id,
        media_url,
        filename,
        agent_id,
        created_at
      `)
      .not('media_url', 'is', null)
      .order('created_at', { ascending: false });

    if (worksError) {
      throw worksError;
    }

    // Check which ones already have tags
    const workIds = works.map(w => w.id);
    const { data: existingTags } = await supabase
      .from('tags')
      .select('work_id')
      .in('work_id', workIds);

    const taggedWorkIds = new Set(existingTags?.map(t => t.work_id) || []);
    
    // Find works that need tagging
    const worksToTag = works.filter(w => !taggedWorkIds.has(w.id));
    
    console.log(`Backfill: ${worksToTag.length} works need tagging out of ${works.length} total`);

    // Process in smaller batches to avoid overwhelming the API
    const batchSize = 5;
    let processed = 0;
    let errors = 0;

    for (let i = 0; i < worksToTag.length; i += batchSize) {
      const batch = worksToTag.slice(i, i + batchSize);
      
      // Process batch in parallel
      const promises = batch.map(async (work) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/tagger`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              work_id: work.id,
              media_url: work.media_url,
              agent_id: work.agent_id,
              filename: work.filename
            })
          });

          if (response.ok) {
            processed++;
            console.log(`Tagged work ${work.id} (${processed}/${worksToTag.length})`);
          } else {
            const errorData = await response.json();
            console.error(`Failed to tag work ${work.id}:`, errorData.error);
            errors++;
          }
        } catch (error) {
          console.error(`Error tagging work ${work.id}:`, error);
          errors++;
        }
      });

      await Promise.all(promises);
      
      // Small delay between batches to be respectful
      if (i + batchSize < worksToTag.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return NextResponse.json({
      success: true,
      total_works: works.length,
      already_tagged: works.length - worksToTag.length,
      queued_for_tagging: worksToTag.length,
      processed,
      errors,
      message: `Backfill complete: ${processed} tagged, ${errors} errors`
    });

  } catch (error: any) {
    console.error('Backfill error:', error);
    return NextResponse.json(
      { error: error.message || 'Backfill failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: 'POST /api/tagger/backfill',
    description: 'Tag all works that don\'t have tags yet',
    auth: 'Requires TAGGER_ADMIN_SECRET header or development mode',
    example: 'curl -X POST -H "Authorization: Bearer your-secret" /api/tagger/backfill'
  });
}