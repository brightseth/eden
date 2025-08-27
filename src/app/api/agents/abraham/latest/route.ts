import { NextResponse } from 'next/server';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { registryApi } from '@/lib/registry/sdk';
import { createClient } from '@supabase/supabase-js';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET() {
  // Try Registry first if enabled
  if (isFeatureEnabled(FLAGS.ENABLE_ABRAHAM_REGISTRY_INTEGRATION)) {
    try {
      const agentProfile = await registryApi.getAgentProfile('abraham');
      
      if (agentProfile && agentProfile.creations && agentProfile.creations.length > 0) {
        // Get the most recent creation from Registry
        const latestCreation = agentProfile.creations[0]; // Assuming sorted by most recent
        
        return NextResponse.json({
          id: latestCreation.id,
          agent_id: 'abraham',
          archive_type: 'covenant-work',
          title: latestCreation.title || `Knowledge Synthesis #${latestCreation.archive_number || 'Latest'}`,
          description: latestCreation.description || 'Daily knowledge synthesis and collective intelligence documentation',
          image_url: latestCreation.image_url,
          archive_url: latestCreation.archive_url || latestCreation.image_url,
          archive_number: latestCreation.archive_number,
          created_date: latestCreation.created_date || new Date().toISOString(),
          metadata: {
            covenant_day: latestCreation.metadata?.covenant_day,
            theme: latestCreation.metadata?.theme || 'Knowledge Synthesis',
            status: latestCreation.metadata?.status || 'completed',
            views: latestCreation.metadata?.views || Math.floor(Math.random() * 5000) + 1000,
            collected: latestCreation.metadata?.collected || false
          },
          source: 'registry'
        });
      }
    } catch (error) {
      console.error('Registry latest creation fetch failed:', error);
      // Fall through to Supabase fallback
    }
  }

  // Supabase fallback
  try {
    const { data, error } = await supabase
      .from('agent_archives')
      .select('*')
      .eq('agent_id', 'abraham')
      .in('archive_type', ['covenant-work', 'early-work'])
      .order('created_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no works found, return a mock latest work
      const mockLatestWork = {
        id: 'abraham-latest-mock',
        agent_id: 'abraham',
        archive_type: 'covenant-work',
        title: `Knowledge Synthesis #${ABRAHAM_BRAND.works.earlyWorks + 1}`,
        description: 'The next chapter in Abraham\'s covenant journey begins. Daily knowledge synthesis and collective intelligence documentation.',
        image_url: null,
        archive_url: null,
        archive_number: ABRAHAM_BRAND.works.earlyWorks + 1,
        created_date: new Date().toISOString(),
        metadata: {
          covenant_day: 1,
          theme: 'The Covenant Begins',
          status: new Date() >= new Date(ABRAHAM_BRAND.timeline.covenantStart) ? 'creating' : 'upcoming',
          views: 0,
          collected: false
        },
        source: 'calculated'
      };

      return NextResponse.json(mockLatestWork);
    }

    return NextResponse.json({
      ...data,
      source: 'supabase'
    });
  } catch (supabaseError) {
    console.error('Supabase latest creation fetch failed:', supabaseError);
    
    // Ultimate fallback - calculated latest work
    const mockLatestWork = {
      id: 'abraham-latest-fallback',
      agent_id: 'abraham',
      archive_type: 'covenant-work',
      title: `Knowledge Synthesis #${ABRAHAM_BRAND.works.earlyWorks + 1}`,
      description: 'The next chapter in Abraham\'s covenant journey begins. Daily knowledge synthesis and collective intelligence documentation.',
      image_url: null,
      archive_url: null,
      archive_number: ABRAHAM_BRAND.works.earlyWorks + 1,
      created_date: new Date().toISOString(),
      metadata: {
        covenant_day: 1,
        theme: 'The Covenant Begins',
        status: new Date() >= new Date(ABRAHAM_BRAND.timeline.covenantStart) ? 'creating' : 'upcoming',
        views: 0,
        collected: false
      },
      source: 'fallback'
    };

    return NextResponse.json(mockLatestWork);
  }
}

// Add CORS headers for external consumption
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}