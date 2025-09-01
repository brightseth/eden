'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

type InsightProps = {
  thesis: string;
  confidence: number;
  sparkline?: any[];
  recentWorks?: React.ReactNode;
};

type PracticeProps = {
  outputsPerWeek?: number;
  supporters?: number;
  mrr?: number;
  prompts: string[];
};

interface AgentShellProps {
  agentName: string;
  insight: InsightProps;
  practice: PracticeProps;
  Terminal: React.ComponentType;
}

export default function AgentShell({ agentName, insight, practice, Terminal }: AgentShellProps) {
  const [mode, setMode] = useState<'CREATIVE' | 'TRADER'>('CREATIVE');
  const [tab, setTab] = useState<'insight' | 'practice' | 'terminal'>(
    mode === 'CREATIVE' ? 'insight' : 'terminal'
  );

  // Auto-switch tab when mode changes
  const handleModeChange = (newMode: 'CREATIVE' | 'TRADER') => {
    setMode(newMode);
    setTab(newMode === 'CREATIVE' ? 'insight' : 'terminal');
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Link href="/academy" className="hover:text-white transition-colors">
              EDEN ACADEMY
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/sites" className="hover:text-white transition-colors">
              SITES
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{agentName.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Header + Mode Toggle */}
      <header className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">{agentName.toUpperCase()}</h1>
            <p className="text-gray-400 mt-2">Agent Site - Creative Training Environment</p>
          </div>
          
          {/* CREATIVE/TRADER Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => handleModeChange('CREATIVE')}
              className={`px-4 py-2 border text-sm font-bold transition-colors ${
                mode === 'CREATIVE' 
                  ? 'border-white text-white' 
                  : 'border-white/30 text-gray-400 hover:border-white/50'
              }`}
            >
              CREATIVE
            </button>
            <button
              onClick={() => handleModeChange('TRADER')}
              className={`px-4 py-2 border text-sm font-bold transition-colors ${
                mode === 'TRADER' 
                  ? 'border-white text-white' 
                  : 'border-white/30 text-gray-400 hover:border-white/50'
              }`}
            >
              TRADER
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex gap-8 border-b border-white/20">
          {(['insight', 'practice', 'terminal'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                tab === t
                  ? 'text-white border-white'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        {tab === 'insight' && (
          <div className="space-y-8">
            {/* Thesis Section */}
            <div className="border border-white/20 p-8">
              <div className="text-sm text-gray-400 mb-3">TODAY'S THESIS</div>
              <div className="text-2xl font-bold leading-relaxed">{insight.thesis}</div>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-xs text-gray-400">
                  CONFIDENCE: <span className="text-white font-bold">{insight.confidence}%</span>
                </div>
                {insight.sparkline && (
                  <div className="text-xs text-gray-400">
                    TREND: <span className="text-green-400">↗</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Works */}
            {insight.recentWorks && (
              <div>
                <div className="text-sm text-gray-400 mb-4">RECENT WORKS</div>
                {insight.recentWorks}
              </div>
            )}
          </div>
        )}

        {tab === 'practice' && (
          <div className="space-y-8">
            {/* Metrics Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <MetricCard 
                label="OUTPUTS/WEEK" 
                value={practice.outputsPerWeek} 
                unit="" 
              />
              <MetricCard 
                label="SUPPORTERS" 
                value={practice.supporters} 
                unit="" 
              />
              <MetricCard 
                label="MRR" 
                value={practice.mrr} 
                unit="$" 
              />
            </div>

            {/* Reflection Prompts */}
            <div className="border border-white/20 p-8">
              <div className="text-sm text-gray-400 mb-6">REFLECTION PROMPTS</div>
              <div className="space-y-4">
                {practice.prompts.map((prompt, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 border border-white/30 rounded-full flex items-center justify-center text-xs font-bold mt-1">
                      {i + 1}
                    </div>
                    <div className="flex-1 text-gray-200">{prompt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'terminal' && <Terminal />}
      </section>
    </main>
  );
}

function MetricCard({ label, value, unit }: { label: string; value?: any; unit?: string }) {
  return (
    <div className="border border-white/20 p-6">
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-2xl font-bold">
        {unit && value ? unit : ''}{value ?? '—'}
      </div>
    </div>
  );
}