import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: agentId } = await params;

    // Get agent with metadata
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    // Get curated highlights (top 12 published works)
    const { data: highlights } = await supabase
      .from('works')
      .select(`
        id,
        media_url,
        state,
        created_at,
        collect_count,
        tags
      `)
      .eq('agent_id', agentId)
      .eq('state', 'published')
      .order('created_at', { ascending: false })
      .limit(12);

    // Get curation stats
    const { data: critiques } = await supabase
      .from('critiques')
      .select('verdict')
      .eq('work_id', supabase.from('works').select('id').eq('agent_id', agentId));

    const curationStats = {
      include: 0,
      maybe: 0,
      exclude: 0
    };

    if (critiques) {
      critiques.forEach(c => {
        const verdict = c.verdict?.toLowerCase() || 'maybe';
        if (verdict in curationStats) {
          curationStats[verdict as keyof typeof curationStats]++;
        }
      });
    }

    // Get recent rationales
    const { data: recentCritiques } = await supabase
      .from('critiques')
      .select('rationale, created_at')
      .eq('work_id', supabase.from('works').select('id').eq('agent_id', agentId))
      .order('created_at', { ascending: false })
      .limit(5);

    const recentRationales = recentCritiques?.map(c => 
      c.rationale?.split('\n')[0] || ''
    ).filter(r => r.length > 0) || [];

    // Get follower count
    const { count: followerCount } = await supabase
      .from('followers')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agentId);

    // Get total collection count
    const { data: collectStats } = await supabase
      .from('works')
      .select('collect_count')
      .eq('agent_id', agentId);

    const totalCollects = collectStats?.reduce((sum, w) => sum + (w.collect_count || 0), 0) || 0;

    // Get recent collectors (mock for now)
    const recentCollectors = ['0x3a..9f', 'anon2', 'anon3'];

    // Get milestones
    const { data: milestones } = await supabase
      .from('agent_milestones')
      .select('milestone, completed_at')
      .eq('agent_id', agentId);

    const milestonesMap = {
      foundation: false,
      midcourse: false,
      thesis: false
    };

    milestones?.forEach(m => {
      if (m.milestone in milestonesMap) {
        milestonesMap[m.milestone as keyof typeof milestonesMap] = true;
      }
    });

    // Calculate day count (mock for now, should be from agent.created_at)
    const dayCount = agent.day_count || Math.floor(Math.random() * 100);
    
    // Determine status based on day count
    const status = agent.status || (dayCount >= 100 ? 'spirit' : dayCount >= 90 ? 'graduating' : 'training');

    // Build response
    const response = {
      agent: {
        id: agent.id,
        name: agent.name,
        tagline: agent.tagline || `${agent.name} explores AI creativity`,
        status,
        day_count: dayCount,
        trainer: agent.meta?.trainer || {
          display: 'Unknown Trainer',
          avatar: '/images/trainers/placeholder.svg',
          links: {}
        },
        statement: agent.meta?.statement || `${agent.name} is training to become an autonomous creative agent.`,
        influences: agent.meta?.influences || [],
        contract: agent.meta?.contract || {
          cadence: '6 works/week',
          focus: 'Creative exploration',
          season: 'S1: Genesis'
        },
        spirit: status === 'spirit' ? {
          symbol: `$${agent.name.toUpperCase()}`,
          supply: '1,000,000,000',
          treasury: '0',
          holders: 0
        } : null
      },
      highlights: highlights?.map(w => ({
        work_id: w.id,
        thumb_url: w.media_url,
        title: w.tags?.title || 'Untitled',
        curated_at: w.created_at,
        collect_count: w.collect_count || 0,
        tags: {
          type: w.tags?.type || 'creation',
          series: w.tags?.series || 'genesis'
        }
      })) || [],
      stream: {
        count: highlights?.length || 0
      },
      curation: {
        ...curationStats,
        recent_rationales: recentRationales,
        gate: {
          print_pass_rate: 0.62,
          artifact_low_rate: 0.71
        }
      },
      social: {
        collect_total: totalCollects,
        recent_collectors: recentCollectors,
        follower_count: followerCount || 0
      },
      spirit_path: status !== 'spirit' ? {
        milestones: milestonesMap,
        projected_window: dayCount >= 90 ? 'This month' : dayCount >= 60 ? 'Next month' : '2-3 months'
      } : null
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error fetching agent profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch agent profile' },
      { status: 500 }
    );
  }
}