import { NextResponse } from 'next/server';

// Agent autonomy tracker - measures maturation, not competition
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id  } = params;
  
  // Mock data - will connect to real metrics later
  const mockAutonomy = generateAutonomyMetrics(id);
  
  return NextResponse.json(mockAutonomy);
}

function generateAutonomyMetrics(agentId: string) {
  // Different baseline metrics per agent status
  const agentProfiles: Record<string, any> = {
    abraham: {
      status: 'GRADUATED',
      baseDiscipline: 0.92,
      baseFitness: 0.78,
      baseIndependence: 0.85,
      baseMemory: 0.72
    },
    solienne: {
      status: 'IN ACADEMY',
      baseDiscipline: 0.85,
      baseFitness: 0.65,
      baseIndependence: 0.60,
      baseMemory: 0.45
    },
    geppetto: {
      status: 'PRE-ACADEMY',
      baseDiscipline: 0,
      baseFitness: 0,
      baseIndependence: 0,
      baseMemory: 0
    },
    koru: {
      status: 'PRE-ACADEMY',
      baseDiscipline: 0,
      baseFitness: 0,
      baseIndependence: 0,
      baseMemory: 0
    }
  };
  
  const profile = agentProfiles[agentId] || agentProfiles.geppetto;
  const isActive = profile.status !== 'PRE-ACADEMY';
  
  // Add realistic variance
  const variance = () => Math.random() * 0.1 - 0.05; // ±5%
  
  // Practice Discipline
  const cadence_hit_rate = Math.max(0, Math.min(1, profile.baseDiscipline + variance()));
  const streak_days = isActive ? Math.floor(profile.baseDiscipline * 50 + Math.random() * 10) : 0;
  const missed_days = isActive ? Math.floor((1 - cadence_hit_rate) * 30) : 0;
  
  // Curatorial Fitness
  const includes = isActive ? Math.floor(profile.baseFitness * 30 + Math.random() * 5) : 0;
  const maybes = isActive ? Math.floor(Math.random() * 20 + 10) : 0;
  const excludes = isActive ? Math.floor((1 - profile.baseFitness) * 60 + Math.random() * 10) : 0;
  const gate_pass_rate = Math.max(0, Math.min(1, profile.baseFitness + variance()));
  const flags_per_10 = isActive ? Math.max(0, Math.floor((1 - gate_pass_rate) * 10)) : 0;
  
  // Independence
  const self_patches = isActive ? Math.floor(profile.baseIndependence * 30) : 0;
  const total_patches = isActive ? 30 : 0;
  const pct_self_directed = total_patches > 0 ? self_patches / total_patches : 0;
  const self_iterations = isActive ? Math.floor(profile.baseIndependence * 15) : 0;
  
  // Memory & Self-Reference
  const memory_triples = isActive ? Math.floor(profile.baseMemory * 500 + Math.random() * 100) : 0;
  const self_references_last30 = isActive ? Math.floor(profile.baseMemory * 30 + Math.random() * 10) : 0;
  const reuse_rate = memory_triples > 0 ? self_references_last30 / 30 : 0;
  
  // Audience signals (optional)
  const follows = isActive ? Math.floor(Math.random() * 200 + 100) : 0;
  const inquiries = isActive ? Math.floor(Math.random() * 10 + 5) : 0;
  const bids = isActive ? Math.floor(Math.random() * 5 + 2) : 0;
  const sales_usd = isActive ? Math.floor(Math.random() * 2000 + 500) : 0;
  
  // Calculate bands (traffic lights)
  const getBand = (value: number, thresholds: { green: number, yellow: number }) => {
    if (value >= thresholds.green) return 'green';
    if (value >= thresholds.yellow) return 'yellow';
    return 'red';
  };
  
  const bands = {
    practice_discipline: getBand(cadence_hit_rate, { green: 0.8, yellow: 0.6 }),
    curatorial_fitness: getBand(gate_pass_rate, { green: 0.65, yellow: 0.5 }),
    independence: getBand(pct_self_directed, { green: 0.7, yellow: 0.5 }),
    memory: getBand(reuse_rate, { green: 0.6, yellow: 0.3 })
  };
  
  // Calculate overall autonomy score (not for ranking, just for tracking)
  const autonomy_score = (
    cadence_hit_rate * 0.25 +
    gate_pass_rate * 0.30 +
    pct_self_directed * 0.25 +
    reuse_rate * 0.20
  );
  
  return {
    agent_id: agentId,
    status: profile.status,
    
    practice_discipline: {
      cadence_hit_rate,
      streak_days,
      missed_days,
      trend_7d: Math.random() > 0.5 ? 'improving' : 'stable'
    },
    
    curatorial_fitness: {
      includes,
      maybes,
      excludes,
      gate_pass_rate,
      flags_per_10,
      nina_confidence_avg: gate_pass_rate * 0.8 + 0.1,
      trend_7d: Math.random() > 0.6 ? 'improving' : 'stable'
    },
    
    independence: {
      self_patches,
      total_patches,
      pct_self_directed,
      self_iterations,
      trainer_interventions: Math.max(0, total_patches - self_patches),
      trend_7d: Math.random() > 0.5 ? 'improving' : 'declining'
    },
    
    memory: {
      triples: memory_triples,
      self_references_last30,
      reuse_rate,
      knowledge_graph_size: memory_triples,
      trend_7d: 'growing'
    },
    
    audience: {
      follows,
      inquiries,
      bids,
      sales_usd,
      engagement_rate: follows > 0 ? (inquiries + bids) / follows : 0
    },
    
    bands,
    
    autonomy_score: Number(autonomy_score.toFixed(3)),
    
    // Recent improvements/patches
    recent_patches: isActive ? [
      { date: '2025-01-20', dimension: 'composition', delta: +0.12 },
      { date: '2025-01-19', dimension: 'technique', delta: +0.08 },
      { date: '2025-01-18', dimension: 'concept', delta: -0.03 }
    ] : [],
    
    // Milestones
    milestones: isActive ? [
      profile.status === 'GRADUATED' && { type: 'graduation', date: '2024-10-19', description: 'Academy Graduation' },
      includes > 10 && { type: 'curatorial', date: '2025-01-15', description: 'First Museum-Grade Include' },
      streak_days > 30 && { type: 'practice', date: '2025-01-10', description: '30-Day Practice Streak' }
    ].filter(Boolean) : []
  };
}