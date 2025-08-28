'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, Users, TrendingUp, Award, Sparkles, 
  Twitter, Globe, Instagram, ExternalLink, 
  CheckCircle, Circle, AlertCircle, ArrowRight, Play
} from 'lucide-react';
import { getAgentConfig } from '@/lib/agent-config';

interface PrototypeLink {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'demo' | 'prototype' | 'interface' | 'dashboard';
  status: 'active' | 'maintenance' | 'deprecated';
  featured?: boolean;
}

interface AgentProfileData {
  agent: {
    id: string;
    displayName: string;
    status: 'LAUNCHING' | 'DEVELOPING' | 'LIVE';
    practice: {
      name: string;
      startAt?: string;
      day?: number | null;
      milestones?: Array<{ name: string; completed: boolean }>;
    };
    trainer?: {
      id: string;
      displayName: string;
      avatarUrl?: string;
      socials?: Record<string, string>;
    };
    statement?: string;
    contract?: string;
    influences?: string[];
    socials?: Record<string, string>;
    heroUrl?: string;
    avatarUrl?: string;
    prototypeLinks?: PrototypeLink[];
  };
  highlights: Array<{
    id: string;
    archiveNumber?: number;
    imageUrl: string;
    title?: string;
    createdDate?: string;
    trainerId?: string;
  }>;
  curation: {
    include: number;
    maybe: number;
    exclude: number;
    includeRate: number;
  };
  social: {
    followers?: number;
    collectors?: number;
  };
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

  const { agent, highlights, curation, social } = profile;
  const agentConfig = getAgentConfig(agentId.toLowerCase());

  const statusColors = {
    LAUNCHING: 'bg-green-500/20 text-green-400 border-green-500/30',
    DEVELOPING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    LIVE: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
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
                {agent.avatarUrl ? (
                  <Image
                    src={agent.avatarUrl}
                    alt={agent.displayName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                    {agent.displayName[0]}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold mb-1">{agent.displayName}</h1>
                <p className="text-gray-400 mb-3">{agent.practice.name}</p>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[agent.status]}`}>
                    {agent.status}
                  </span>
                  {agent.practice.day !== null && (
                    <span className="text-sm text-gray-500">
                      Day {agent.practice.day}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Special links for Abraham */}
              {agentId.toLowerCase() === 'abraham' && (
                <>
                  <Link 
                    href="/academy/abraham/early-works"
                    className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded hover:bg-purple-600/30 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    View 3,689 Early Works
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    href="/academy/abraham/covenant"
                    className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded hover:bg-green-600/30 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    The Covenant (Oct 19)
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
              
              {/* Special links for Solienne */}
              {agentId.toLowerCase() === 'solienne' && (
                <>
                  <Link 
                    href="/academy/solienne/generations"
                    className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded hover:bg-purple-600/30 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    View Generations
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link 
                    href="/academy/solienne/paris-photo"
                    className="px-4 py-2 bg-green-600/20 text-green-400 border border-green-600/30 rounded hover:bg-green-600/30 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    Paris Photo (Nov 10)
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
              
              {/* External site link if configured */}
              {agentConfig?.special_features?.includes('external_site') && (
                <button className="p-2 rounded bg-gray-800 hover:bg-gray-700">
                  <ExternalLink className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Prototype Links */}
          {agent.prototypeLinks && agent.prototypeLinks.length > 0 && (
            <div className="mt-6 p-4 bg-gray-950 border border-gray-800 rounded-lg">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Play className="w-4 h-4" />
                Live Prototypes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {agent.prototypeLinks
                  .filter(link => link.status === 'active')
                  .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
                  .map(link => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 border rounded-lg hover:bg-gray-900 transition-colors group ${
                        link.featured 
                          ? 'border-blue-500/50 bg-blue-500/10' 
                          : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{link.title}</h4>
                          <p className="text-xs text-gray-400 mt-1">{link.description}</p>
                          <span className="text-xs text-gray-500 mt-1 capitalize">{link.type}</span>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white flex-shrink-0 ml-2" />
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          )}

          {/* Practice Milestones */}
          {agent.practice.milestones && agent.practice.milestones.length > 0 && (
            <div className="mt-6 p-4 bg-gray-950 border border-gray-800 rounded-lg">
              <h3 className="font-bold mb-2">Practice Milestones</h3>
              <div className="flex items-center gap-6">
                {agent.practice.milestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {milestone.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-600" />
                    )}
                    <span className="text-sm">{milestone.name}</span>
                  </div>
                ))}
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
                  {agent.trainer.avatarUrl && agent.trainer.avatarUrl !== '/images/trainers/placeholder.svg' ? (
                    <Image
                      src={agent.trainer.avatarUrl}
                      alt={agent.trainer.displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                      {agent.trainer.displayName.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold">{agent.trainer.displayName}</h3>
                  <p className="text-sm text-gray-400">Trainer & Guide</p>
                </div>
              </div>
              <div className="flex gap-2">
                {agent.trainer.socials?.x && (
                  <a href={`https://x.com/${agent.trainer.socials.x}`} target="_blank" rel="noopener noreferrer" 
                     className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                {agent.trainer.socials?.site && (
                  <a href={agent.trainer.socials.site} target="_blank" rel="noopener noreferrer"
                     className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {agent.trainer.socials?.instagram && (
                  <a href={`https://instagram.com/${agent.trainer.socials.instagram}`} target="_blank" rel="noopener noreferrer"
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
                  key={work.id}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedWork(work)}
                >
                  <div className="aspect-square relative bg-gray-900 rounded-lg overflow-hidden">
                    <Image
                      src={work.imageUrl}
                      alt={work.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-sm font-bold">{work.title}</p>
                        <p className="text-xs text-gray-400">{work.trainerId ? 'Curated' : 'Highlighted'}</p>
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
                  <span className="font-mono">{(curation.includeRate * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Low Artifact</span>
                  <span className="font-mono">{((curation.include / (curation.include + curation.maybe + curation.exclude)) * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Curation Stats */}
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
              <h3 className="font-bold mb-4">Curation Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Included</span>
                  <span className="font-mono">{curation.include}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Maybe</span>
                  <span className="font-mono">{curation.maybe}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Excluded</span>
                  <span className="font-mono">{curation.exclude}</span>
                </div>
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
                <h3 className="text-2xl font-bold">{social.collectors || 0}</h3>
                <p className="text-sm text-gray-400">Total Collectors</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{social.followers || 0}</h3>
                <p className="text-sm text-gray-400">Followers</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center">
                  <Users className="w-4 h-4" />
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