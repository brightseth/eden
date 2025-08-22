'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Calendar, Users, TrendingUp, Award, Sparkles, 
  Twitter, Globe, Instagram, ExternalLink, 
  CheckCircle, Circle, AlertCircle
} from 'lucide-react';

interface AgentProfileData {
  agent: {
    id: string;
    name: string;
    tagline: string;
    status: 'training' | 'graduating' | 'spirit';
    day_count: number;
    trainer: {
      display: string;
      avatar: string;
      links: Record<string, string>;
    };
    statement: string;
    influences: string[];
    contract: {
      cadence: string;
      focus: string;
      season: string;
    };
    spirit: {
      symbol: string;
      supply: string;
      treasury: string;
      holders: number;
    } | null;
  };
  highlights: Array<{
    work_id: string;
    thumb_url: string;
    title: string;
    curated_at: string;
    collect_count: number;
    tags: Record<string, string>;
  }>;
  curation: {
    include: number;
    maybe: number;
    exclude: number;
    recent_rationales: string[];
    gate: {
      print_pass_rate: number;
      artifact_low_rate: number;
    };
  };
  social: {
    collect_total: number;
    recent_collectors: string[];
    follower_count: number;
  };
  spirit_path: {
    milestones: {
      foundation: boolean;
      midcourse: boolean;
      thesis: boolean;
    };
    projected_window: string;
  } | null;
}

interface EnrichedProfileProps {
  agentId: string;
}

export function EnrichedProfile({ agentId }: EnrichedProfileProps) {
  const [profile, setProfile] = useState<AgentProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, [agentId]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/agents/${agentId}/profile`);
      const data = await res.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleCollect = (workId: string) => {
    // TODO: Implement collection
    console.log('Collecting work:', workId);
  };

  if (loading) {
    return <div className="text-center py-12">Loading agent profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12">Agent not found</div>;
  }

  const { agent, highlights, curation, social, spirit_path } = profile;

  const statusColors = {
    training: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    graduating: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    spirit: 'bg-green-500/20 text-green-400 border-green-500/30'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header Strip */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                {agent.trainer.avatar && agent.trainer.avatar !== '/images/trainers/placeholder.svg' ? (
                  <Image
                    src={agent.trainer.avatar}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                    {agent.name[0]}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold mb-1">{agent.name}</h1>
                <p className="text-gray-400 mb-3">{agent.tagline}</p>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[agent.status]}`}>
                    {agent.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">
                    Day {agent.day_count} • {agent.status === 'spirit' ? 'Graduated' : 'On track for Elevation'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded bg-gray-800 hover:bg-gray-700">
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Spirit Panel or Path */}
          {agent.spirit ? (
            <div className="mt-6 p-4 bg-green-950/30 border border-green-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-green-400 mb-1">SPIRIT STATUS</h3>
                  <p className="text-sm text-gray-400">
                    Token: {agent.spirit.symbol} • Supply: {agent.spirit.supply} • Treasury: {agent.spirit.treasury} • Holders: {agent.spirit.holders}
                  </p>
                </div>
                <Award className="w-8 h-8 text-green-400" />
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-gray-950 border border-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Path to Spirit</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {spirit_path?.milestones.foundation ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-600" />}
                  <span className="text-sm">Foundation</span>
                </div>
                <div className="flex items-center gap-2">
                  {spirit_path?.milestones.midcourse ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-600" />}
                  <span className="text-sm">Mid-course</span>
                </div>
                <div className="flex items-center gap-2">
                  {spirit_path?.milestones.thesis ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Circle className="w-5 h-5 text-gray-600" />}
                  <span className="text-sm">Thesis</span>
                </div>
                <div className="ml-auto text-sm text-gray-400">
                  Projected elevation: {spirit_path?.projected_window}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-12">
        {/* About the Creator */}
        <section>
          <h2 className="text-xl font-bold mb-6">About the Creator</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Trainer Card */}
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                  {agent.trainer.avatar && agent.trainer.avatar !== '/images/trainers/placeholder.svg' ? (
                    <Image
                      src={agent.trainer.avatar}
                      alt={agent.trainer.display}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                      {agent.trainer.display.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold">{agent.trainer.display}</h3>
                  <p className="text-sm text-gray-400">Trainer & Guide</p>
                </div>
              </div>
              <div className="flex gap-2">
                {agent.trainer.links.x && (
                  <a href={`https://x.com/${agent.trainer.links.x}`} target="_blank" rel="noopener noreferrer" 
                     className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {agent.trainer.links.site && (
                  <a href={agent.trainer.links.site} target="_blank" rel="noopener noreferrer"
                     className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {agent.trainer.links.instagram && (
                  <a href={`https://instagram.com/${agent.trainer.links.instagram}`} target="_blank" rel="noopener noreferrer"
                     className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Statement & Contract */}
            <div className="space-y-4">
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="font-bold mb-2">Statement</h3>
                <p className="text-sm text-gray-300">{agent.statement}</p>
              </div>
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
                <h3 className="font-bold mb-2">Practice Contract</h3>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>Cadence: {agent.contract.cadence}</p>
                  <p>Focus: {agent.contract.focus}</p>
                  <p>Season: {agent.contract.season}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Influences */}
          {agent.influences.length > 0 && (
            <div className="mt-4">
              <h3 className="font-bold mb-2">Influences</h3>
              <div className="flex flex-wrap gap-2">
                {agent.influences.map((influence, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-800 rounded text-sm">
                    {influence}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Curated Highlights */}
        {highlights.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6">Curated Highlights</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {highlights.map((work) => (
                <div 
                  key={work.work_id}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedWork(work)}
                >
                  <div className="aspect-square relative bg-gray-900 rounded-lg overflow-hidden">
                    <Image
                      src={work.thumb_url}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-bold">{work.title}</p>
                        <p className="text-xs text-gray-400">{work.collect_count} collected</p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded border border-green-500/30">
                        INCLUDE
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Curatorial Lens */}
        <section>
          <h2 className="text-xl font-bold mb-6">Curatorial Lens</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Verdict Mix */}
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <h3 className="font-bold mb-4">Verdict Distribution</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-green-400">INCLUDE</span>
                  <span className="font-mono">{curation.include}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-400">MAYBE</span>
                  <span className="font-mono">{curation.maybe}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-red-400">EXCLUDE</span>
                  <span className="font-mono">{curation.exclude}</span>
                </div>
              </div>
            </div>

            {/* Gate Stats */}
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <h3 className="font-bold mb-4">Quality Gates</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Print Ready</span>
                  <span className="font-mono">{(curation.gate.print_pass_rate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Low Artifact</span>
                  <span className="font-mono">{(curation.gate.artifact_low_rate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Recent Rationales */}
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <h3 className="font-bold mb-4">Recent Feedback</h3>
              <div className="space-y-2">
                {curation.recent_rationales.slice(0, 3).map((rationale, i) => (
                  <p key={i} className="text-sm text-gray-400 line-clamp-1">
                    • {rationale}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Collectors & Social Proof */}
        <section>
          <h2 className="text-xl font-bold mb-6">Collectors & Community</h2>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold">{social.collect_total}</h3>
                <p className="text-sm text-gray-400">Total Collections</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{social.follower_count}</h3>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              <div className="flex -space-x-2">
                {social.recent_collectors.map((collector, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 border-2 border-black flex items-center justify-center">
                    <span className="text-xs">{collector.slice(0, 2)}</span>
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center">
                  <span className="text-xs">+</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Trending this week</span>
            </div>
          </div>
        </section>
      </div>

      {/* Work Detail Modal */}
      {selectedWork && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedWork(null)}
        >
          <div className="max-w-4xl w-full bg-gray-950 border border-gray-800 rounded-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="aspect-video relative bg-gray-900">
              <Image
                src={selectedWork.thumb_url}
                alt={selectedWork.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{selectedWork.title}</h2>
              <p className="text-gray-400 mb-4">{selectedWork.collect_count} collectors</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleCollect(selectedWork.work_id)}
                  className="px-6 py-2 bg-white text-black font-bold rounded hover:bg-gray-200"
                >
                  Collect
                </button>
                <button 
                  onClick={() => setSelectedWork(null)}
                  className="px-6 py-2 bg-gray-800 text-white font-bold rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}