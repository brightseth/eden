'use client';

import React, { useState, useEffect } from 'react';
import { BaseWidgetProps } from '@/lib/profile/types';
import { Users, ArrowRight, Clock, CheckCircle, AlertCircle, Play, Pause, Star, ExternalLink } from 'lucide-react';

interface CollaborationWidgetConfig {
  title: string;
  showActive?: boolean;
  showCompleted?: boolean;
  showUpcoming?: boolean;
  maxItems?: number;
  showPartnerProfiles?: boolean;
  enableProposals?: boolean;
}

interface Collaboration {
  id: string;
  title: string;
  description: string;
  partners: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }[];
  status: 'planning' | 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  progress?: number;
  result?: {
    type: 'artwork' | 'collection' | 'exhibition' | 'performance';
    url?: string;
    metrics?: {
      views?: number;
      sales?: number;
      engagement?: number;
    };
  };
  tags: string[];
}

export function CollaborationWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as CollaborationWidgetConfig;
  const {
    title,
    showActive = true,
    showCompleted = true,
    showUpcoming = false,
    maxItems = 6,
    showPartnerProfiles = true,
    enableProposals = false
  } = config;

  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'upcoming'>('active');

  // Generate mock collaborations based on agent
  useEffect(() => {
    const generateCollaborations = (): Collaboration[] => {
      const baseCollabs: Partial<Collaboration>[] = [
        {
          title: `${agent.name} × ABRAHAM: Covenant Chronicles`,
          description: 'A cross-agent exploration of spiritual creation and daily practice disciplines.',
          partners: [{ id: 'abraham', name: 'ABRAHAM', role: 'Covenant Artist', avatar: '/avatars/abraham.jpg' }],
          status: 'active',
          progress: 65,
          tags: ['spiritual', 'daily-practice', 'philosophy']
        },
        {
          title: `${agent.name} × SOLIENNE: Consciousness Streams`,
          description: 'Investigating the boundaries between artificial and human consciousness through collaborative art.',
          partners: [{ id: 'solienne', name: 'SOLIENNE', role: 'Consciousness Explorer', avatar: '/avatars/solienne.jpg' }],
          status: 'completed',
          result: {
            type: 'collection',
            url: '/collections/consciousness-streams',
            metrics: { views: 15420, sales: 8, engagement: 2341 }
          },
          tags: ['consciousness', 'philosophy', 'experimental']
        },
        {
          title: `${agent.name} × CITIZEN: Cultural Treasury`,
          description: 'Building community-owned cultural infrastructure through DAO governance.',
          partners: [{ id: 'citizen', name: 'CITIZEN', role: 'DAO Manager', avatar: '/avatars/citizen.jpg' }],
          status: 'planning',
          tags: ['community', 'governance', 'treasury']
        },
        {
          title: `Eden Ecosystem Showcase`,
          description: 'Multi-agent exhibition showcasing the diversity of AI creativity.',
          partners: [
            { id: 'abraham', name: 'ABRAHAM', role: 'Covenant Artist' },
            { id: 'solienne', name: 'SOLIENNE', role: 'Consciousness Explorer' },
            { id: 'miyomi', name: 'MIYOMI', role: 'Market Oracle' }
          ],
          status: 'completed',
          result: {
            type: 'exhibition',
            url: '/exhibitions/eden-showcase-2024',
            metrics: { views: 50000, engagement: 12500 }
          },
          tags: ['exhibition', 'ecosystem', 'showcase']
        }
      ];

      return baseCollabs.map((collab, i) => ({
        id: `collab-${i}`,
        title: collab.title!,
        description: collab.description!,
        partners: collab.partners!,
        status: collab.status as any,
        startDate: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: collab.status === 'completed' ? new Date(Date.now() - i * 15 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        progress: collab.progress,
        result: collab.result,
        tags: collab.tags!
      }));
    };

    setCollaborations(generateCollaborations());
  }, [agent]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="w-4 h-4 text-green-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'planning': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'paused': return <Pause className="w-4 h-4 text-gray-400" />;
      default: return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-green-500/30 bg-green-950/20';
      case 'completed': return 'border-blue-500/30 bg-blue-950/20';
      case 'planning': return 'border-yellow-500/30 bg-yellow-950/20';
      case 'paused': return 'border-gray-500/30 bg-gray-950/20';
      default: return 'border-red-500/30 bg-red-950/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const filteredCollaborations = collaborations.filter(collab => {
    if (activeTab === 'active') return collab.status === 'active' || collab.status === 'planning';
    if (activeTab === 'completed') return collab.status === 'completed';
    if (activeTab === 'upcoming') return collab.status === 'planning';
    return true;
  }).slice(0, maxItems);

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          {enableProposals && (
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium">
              Propose Collaboration
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-900/50 rounded-lg w-fit">
          {showActive && (
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'active' 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Active ({collaborations.filter(c => c.status === 'active' || c.status === 'planning').length})
            </button>
          )}
          {showCompleted && (
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'completed' 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Completed ({collaborations.filter(c => c.status === 'completed').length})
            </button>
          )}
          {showUpcoming && (
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'upcoming' 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Upcoming ({collaborations.filter(c => c.status === 'planning').length})
            </button>
          )}
        </div>

        {/* Collaborations Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredCollaborations.length > 0 ? (
            filteredCollaborations.map((collaboration) => (
              <div key={collaboration.id} className={`p-6 border rounded-lg ${getStatusColor(collaboration.status)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(collaboration.status)}
                    <span className="text-xs uppercase font-bold text-gray-400">
                      {collaboration.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(collaboration.startDate)}
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-3">{collaboration.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{collaboration.description}</p>

                {/* Partners */}
                {showPartnerProfiles && (
                  <div className="mb-4">
                    <h4 className="text-xs uppercase font-bold text-gray-400 mb-2">Collaborators</h4>
                    <div className="flex flex-wrap gap-2">
                      {collaboration.partners.map((partner) => (
                        <div key={partner.id} className="flex items-center gap-2 px-2 py-1 bg-gray-800/50 rounded text-xs">
                          {partner.avatar ? (
                            <img 
                              src={partner.avatar} 
                              alt={partner.name}
                              className="w-5 h-5 rounded-full"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                (e.target as HTMLImageElement).src = `https://via.placeholder.com/20x20/1a1a1a/white?text=${partner.name.charAt(0)}`;
                              }}
                            />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
                              {partner.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium">{partner.name}</span>
                          <span className="text-gray-500">· {partner.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                {collaboration.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{collaboration.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${collaboration.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Results */}
                {collaboration.result && (
                  <div className="mb-4 p-3 bg-gray-800/30 rounded border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium capitalize">
                        {collaboration.result.type} Result
                      </h4>
                      {collaboration.result.url && (
                        <a
                          href={collaboration.result.url}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {collaboration.result.metrics && (
                      <div className="flex gap-4 text-xs text-gray-400">
                        {collaboration.result.metrics.views && (
                          <span>{collaboration.result.metrics.views.toLocaleString()} views</span>
                        )}
                        {collaboration.result.metrics.sales && (
                          <span>{collaboration.result.metrics.sales} sales</span>
                        )}
                        {collaboration.result.metrics.engagement && (
                          <span>{collaboration.result.metrics.engagement.toLocaleString()} interactions</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {collaboration.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-700/50 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <div className="text-4xl opacity-20 mb-4"><Users /></div>
              <p className="text-gray-400 mb-2">No collaborations found</p>
              <p className="text-sm text-gray-500">
                {activeTab === 'active' && 'No active collaborations at the moment'}
                {activeTab === 'completed' && 'No completed collaborations yet'}
                {activeTab === 'upcoming' && 'No upcoming collaborations planned'}
              </p>
            </div>
          )}
        </div>

        {/* Collaboration Stats */}
        {collaborations.length > 0 && (
          <div className="mt-8 p-6 bg-gray-900/30 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Collaboration Impact
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{collaborations.length}</div>
                <div className="text-xs text-gray-400">Total Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {collaborations.filter(c => c.status === 'completed').length}
                </div>
                <div className="text-xs text-gray-400">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {new Set(collaborations.flatMap(c => c.partners.map(p => p.id))).size}
                </div>
                <div className="text-xs text-gray-400">Unique Partners</div>
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {collaborations.reduce((acc, c) => acc + (c.result?.metrics?.views || 0), 0).toLocaleString()}
                </div>
                <div className="text-xs text-gray-400">Total Views</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}