'use client';

import { useState, useEffect } from 'react';
import { 
  Activity,
  Target,
  Brain,
  Database,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Eye,
  EyeOff,
  Info
} from 'lucide-react';

interface AutonomyMetrics {
  agent_id: string;
  status: string;
  
  practice_discipline: {
    cadence_hit_rate: number;
    streak_days: number;
    missed_days: number;
    trend_7d: 'improving' | 'stable' | 'declining';
  };
  
  curatorial_fitness: {
    includes: number;
    maybes: number;
    excludes: number;
    gate_pass_rate: number;
    flags_per_10: number;
    nina_confidence_avg: number;
    trend_7d: 'improving' | 'stable' | 'declining';
  };
  
  independence: {
    self_patches: number;
    total_patches: number;
    pct_self_directed: number;
    self_iterations: number;
    trainer_interventions: number;
    trend_7d: 'improving' | 'stable' | 'declining';
  };
  
  memory: {
    triples: number;
    self_references_last30: number;
    reuse_rate: number;
    knowledge_graph_size: number;
    trend_7d: 'growing' | 'stable' | 'shrinking';
  };
  
  audience: {
    follows: number;
    inquiries: number;
    bids: number;
    sales_usd: number;
    engagement_rate: number;
  };
  
  bands: {
    practice_discipline: 'green' | 'yellow' | 'red';
    curatorial_fitness: 'green' | 'yellow' | 'red';
    independence: 'green' | 'yellow' | 'red';
    memory: 'green' | 'yellow' | 'red';
  };
  
  autonomy_score: number;
  recent_patches: Array<{ date: string; dimension: string; delta: number }>;
  milestones: Array<{ type: string; date: string; description: string }>;
}

const getBandColor = (band: 'green' | 'yellow' | 'red') => {
  switch(band) {
    case 'green': return 'bg-green-500';
    case 'yellow': return 'bg-yellow-500';
    case 'red': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const getBandIcon = (band: 'green' | 'yellow' | 'red') => {
  switch(band) {
    case 'green': return '✅';
    case 'yellow': return '⚠️';
    case 'red': return '❌';
    default: return '◯';
  }
};

const getTrendIcon = (trend: string) => {
  if (trend === 'improving' || trend === 'growing') {
    return <TrendingUp className="w-4 h-4 text-green-400" />;
  } else if (trend === 'declining' || trend === 'shrinking') {
    return <TrendingDown className="w-4 h-4 text-red-400" />;
  } else {
    return <Minus className="w-4 h-4 text-gray-500" />;
  }
};

interface StudioHealthProps {
  agentId: string;
  agentName: string;
}

export function StudioHealth({ agentId, agentName }: StudioHealthProps) {
  const [metrics, setMetrics] = useState<AutonomyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEconomics, setShowEconomics] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, [agentId]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agents/${agentId}/autonomy`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch autonomy metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-800 rounded-lg mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-800 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const formatPercentage = (value: number) => `${Math.round(value * 100)}%`;

  return (
    <div className="space-y-6">
      {/* Header with overall autonomy */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Studio Health</h2>
            <p className="text-gray-400 text-sm">
              Tracking {agentName}'s journey toward autonomous practice
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {formatPercentage(metrics.autonomy_score)}
            </div>
            <div className="text-xs text-gray-500">SELF-DIRECTED</div>
          </div>
        </div>

        {/* Quick status indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {Object.entries(metrics.bands).map(([key, band]) => (
            <div key={key} className="text-center p-3 bg-gray-950 rounded-lg">
              <div className="text-3xl mb-2">{getBandIcon(band)}</div>
              <div className="text-sm text-gray-400 capitalize">
                {key.replace('_', ' ').replace('discipline', 'Practice')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Discipline */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'practice' ? null : 'practice')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-medium">Practice Discipline</div>
              <div className="text-sm text-gray-400">
                {formatPercentage(metrics.practice_discipline.cadence_hit_rate)} cadence · 
                {metrics.practice_discipline.streak_days} day streak
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getBandColor(metrics.bands.practice_discipline)}`} />
            {getTrendIcon(metrics.practice_discipline.trend_7d)}
            <ChevronRight className={`w-5 h-5 transition-transform ${expandedSection === 'practice' ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {expandedSection === 'practice' && (
          <div className="px-6 pb-6 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="p-4 bg-gray-950 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">CADENCE HIT RATE</div>
                <div className="text-2xl md:text-3xl font-bold">{formatPercentage(metrics.practice_discipline.cadence_hit_rate)}</div>
              </div>
              <div className="p-4 bg-gray-950 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">CURRENT STREAK</div>
                <div className="text-2xl md:text-3xl font-bold">{metrics.practice_discipline.streak_days} days</div>
              </div>
              <div className="p-4 bg-gray-950 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">MISSED DAYS (30D)</div>
                <div className="text-2xl md:text-3xl font-bold">{metrics.practice_discipline.missed_days}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Curatorial Fitness */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'curatorial' ? null : 'curatorial')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-medium">Curatorial Fitness</div>
              <div className="text-sm text-gray-400">
                {metrics.curatorial_fitness.includes} includes · 
                {formatPercentage(metrics.curatorial_fitness.gate_pass_rate)} gate pass
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getBandColor(metrics.bands.curatorial_fitness)}`} />
            {getTrendIcon(metrics.curatorial_fitness.trend_7d)}
            <ChevronRight className={`w-5 h-5 transition-transform ${expandedSection === 'curatorial' ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {expandedSection === 'curatorial' && (
          <div className="px-4 pb-4 border-t border-gray-800">
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">NINA VERDICTS</div>
                <div className="flex gap-2">
                  <span className="text-green-400">{metrics.curatorial_fitness.includes} ✓</span>
                  <span className="text-yellow-400">{metrics.curatorial_fitness.maybes} ?</span>
                  <span className="text-red-400">{metrics.curatorial_fitness.excludes} ✗</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">GATE PASS RATE</div>
                <div className="text-2xl font-bold">{formatPercentage(metrics.curatorial_fitness.gate_pass_rate)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">FLAGS PER 10</div>
                <div className="text-2xl font-bold">{metrics.curatorial_fitness.flags_per_10}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Independence */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'independence' ? null : 'independence')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-medium">Independence</div>
              <div className="text-sm text-gray-400">
                {formatPercentage(metrics.independence.pct_self_directed)} self-directed · 
                {metrics.independence.self_iterations} iterations
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getBandColor(metrics.bands.independence)}`} />
            {getTrendIcon(metrics.independence.trend_7d)}
            <ChevronRight className={`w-5 h-5 transition-transform ${expandedSection === 'independence' ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {expandedSection === 'independence' && (
          <div className="px-4 pb-4 border-t border-gray-800">
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">SELF PATCHES</div>
                <div className="text-2xl font-bold">
                  {metrics.independence.self_patches}/{metrics.independence.total_patches}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">SELF-DIRECTED</div>
                <div className="text-2xl font-bold">{formatPercentage(metrics.independence.pct_self_directed)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">TRAINER HELP</div>
                <div className="text-2xl font-bold">{metrics.independence.trainer_interventions}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Memory & Learning */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'memory' ? null : 'memory')}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-medium">Memory & Self-Reference</div>
              <div className="text-sm text-gray-400">
                {metrics.memory.triples} knowledge nodes · 
                {metrics.memory.self_references_last30} references
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${getBandColor(metrics.bands.memory)}`} />
            {getTrendIcon(metrics.memory.trend_7d)}
            <ChevronRight className={`w-5 h-5 transition-transform ${expandedSection === 'memory' ? 'rotate-90' : ''}`} />
          </div>
        </button>
        
        {expandedSection === 'memory' && (
          <div className="px-4 pb-4 border-t border-gray-800">
            <div className="grid grid-cols-3 gap-6 pt-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">KNOWLEDGE GRAPH</div>
                <div className="text-2xl font-bold">{metrics.memory.knowledge_graph_size}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">SELF-REFERENCES</div>
                <div className="text-2xl font-bold">{metrics.memory.self_references_last30}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">REUSE RATE</div>
                <div className="text-2xl font-bold">{formatPercentage(metrics.memory.reuse_rate)}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audience Signals (Optional) */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setShowEconomics(!showEconomics)}
          className="w-full p-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-gray-400" />
            <div className="text-left">
              <div className="font-medium">Audience Signals</div>
              <div className="text-sm text-gray-400">
                {showEconomics ? 'Economics visible' : 'Economics hidden'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {showEconomics ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </div>
        </button>
        
        {showEconomics && (
          <div className="px-4 pb-4 border-t border-gray-800">
            <div className="grid grid-cols-4 gap-6 pt-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">FOLLOWS</div>
                <div className="text-2xl font-bold">{metrics.audience.follows}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">INQUIRIES</div>
                <div className="text-2xl font-bold">{metrics.audience.inquiries}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">BIDS</div>
                <div className="text-2xl font-bold">{metrics.audience.bids}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">SALES</div>
                <div className="text-2xl font-bold">${metrics.audience.sales_usd}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Improvements */}
      {metrics.recent_patches.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <h3 className="font-medium mb-3">Recent Improvements</h3>
          <div className="space-y-2">
            {metrics.recent_patches.map((patch, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <span className="text-gray-400">{patch.date}</span>
                <span className="capitalize">{patch.dimension}</span>
                <span className={patch.delta > 0 ? 'text-green-400' : 'text-red-400'}>
                  {patch.delta > 0 ? '+' : ''}{(patch.delta * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}