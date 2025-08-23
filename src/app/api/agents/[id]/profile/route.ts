import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: agentId } = await context.params;
    const supabase = await createClient();

    // Get agent with trainer info
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

    // Get trainer if exists (handle missing foreign key gracefully)
    let trainer = null;
    if (agent.primary_trainer_id) {
      const { data: trainerData } = await supabase
        .from('trainers')
        .select('id, display_name, avatar_url, socials')
        .eq('id', agent.primary_trainer_id)
        .single();
      trainer = trainerData;
    }

    // Calculate practice day (LA timezone)
    let practiceDay = null;
    if (agent.practice_start) {
      const start = new Date(agent.practice_start);
      const now = new Date();
      const diffTime = now.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      practiceDay = diffDays > 0 ? diffDays + 1 : null; // Day 1 = start day
    }

    // Get highlights (last 12 works)
    const { data: highlights } = await supabase
      .from('agent_archives')
      .select('id, archive_number, image_url, title, created_date, trainer_id')
      .eq('agent_id', agentId)
      .in('archive_type', ['generation', 'early_work'])
      .order('created_date', { ascending: false, nullsFirst: false })
      .limit(12);

    // Get curation stats from archives metadata
    const { data: archives } = await supabase
      .from('agent_archives')
      .select('metadata')
      .eq('agent_id', agentId);

    let curationStats = {
      include: 0,
      maybe: 0,
      exclude: 0,
      includeRate: 0
    };

    if (archives) {
      archives.forEach(a => {
        const verdict = a.metadata?.verdict?.toUpperCase();
        if (verdict === 'INCLUDE') curationStats.include++;
        else if (verdict === 'MAYBE') curationStats.maybe++;
        else if (verdict === 'EXCLUDE') curationStats.exclude++;
      });
      
      const total = curationStats.include + curationStats.maybe + curationStats.exclude;
      if (total > 0) {
        curationStats.includeRate = Math.round((curationStats.include / total) * 100) / 100;
      }
    }

    // Determine milestones based on practice day and mode
    const milestones = [];
    if (practiceDay !== null) {
      // Common milestones
      const checkpoints = [
        { day: 1, label: 'Day 1' },
        { day: 7, label: 'Week 1' },
        { day: 30, label: 'Month 1' },
        { day: 50, label: 'Day 50' },
        { day: 100, label: 'Day 100' },
        { day: 365, label: 'Year 1' }
      ];
      
      // For Abraham's 13-year covenant, add special milestones
      if (agent.mode === 'autonomous' && agent.id === 'abraham') {
        checkpoints.push(
          { day: 1000, label: 'Day 1000' },
          { day: 2372, label: 'Halfway' },
          { day: 4745, label: 'Covenant Complete' }
        );
      }
      
      checkpoints.forEach(cp => {
        if (practiceDay >= cp.day) {
          milestones.push({ label: cp.label, reached: true });
        } else if (milestones.length < 4) {
          milestones.push({ label: cp.label, reached: false });
        }
      });
    }

    // Build response matching EnrichedProfile expectations (per directive)
    const response = {
      agent: {
        id: agent.id,
        displayName: agent.display_name || agent.id,
        status: agent.status || 'DEVELOPING',
        mode: agent.mode || 'guided', // autonomous or guided
        practice: {
          name: agent.practice_name || 'Daily Practice',
          startAt: agent.practice_start,
          day: practiceDay,
          milestones
        },
        trainer: trainer ? {
          id: trainer.id,
          displayName: trainer.display_name,
          avatarUrl: trainer.avatar_url,
          socials: trainer.socials
        } : null,
        statement: agent.statement,
        contract: agent.contract,
        influences: agent.influences || [],
        socials: agent.socials || {},
        heroUrl: agent.hero_url,
        avatarUrl: agent.avatar_url
      },
      highlights: highlights?.map(h => ({
        id: h.id,
        archiveNumber: h.archive_number,
        imageUrl: h.image_url || h.thumbnail_url,
        title: h.title || `Work #${h.archive_number}`,
        createdDate: h.created_date,
        trainerId: h.trainer_id
      })) || [],
      curation: curationStats
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