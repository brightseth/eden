'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Eye, ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface Critique {
  id: string;
  work_id: string;
  critic: string;
  verdict: 'INCLUDE' | 'MAYBE' | 'EXCLUDE';
  scores: any;
  rationale: string;
  flags: any;
  created_at: string;
  work?: {
    id: string;
    agent_id: string;
    day: number;
    media_url: string;
    state: string;
  };
}

interface CritiquePanelProps {
  agentId: string;
  onCountChange?: (count: number) => void;
}

export function CritiquePanel({ agentId, onCountChange }: CritiquePanelProps) {
  const [critiques, setCritiques] = useState<Critique[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'INCLUDE' | 'MAYBE' | 'EXCLUDE'>('all');

  useEffect(() => {
    fetchCritiques();
  }, [agentId]);

  const fetchCritiques = async () => {
    try {
      const res = await fetch(`/api/critiques?agent_id=${agentId}`);
      const data = await res.json();
      const agentCritiques = data.critiques?.filter(
        (c: Critique) => c.work?.agent_id === agentId
      ) || [];
      setCritiques(agentCritiques);
      onCountChange?.(agentCritiques.filter((c: Critique) => c.work?.state !== 'published').length);
    } catch (error) {
      console.error('Error fetching critiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCritiques = filter === 'all' 
    ? critiques 
    : critiques.filter(c => c.verdict === filter);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'INCLUDE': return 'text-green-400 border-green-400';
      case 'MAYBE': return 'text-yellow-400 border-yellow-400';
      case 'EXCLUDE': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'INCLUDE': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'MAYBE': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'EXCLUDE': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  const handlePublish = async (critique: Critique) => {
    if (!critique.work_id) return;
    
    const res = await fetch(`/api/works/${critique.work_id}/publish`, {
      method: 'POST'
    });
    if (res.ok) {
      fetchCritiques();
    } else {
      console.error('Failed to publish work');
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          All ({critiques.length})
        </button>
        <button
          onClick={() => setFilter('INCLUDE')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'INCLUDE' 
              ? 'bg-green-900 text-green-400' 
              : 'bg-gray-900 text-gray-400 hover:text-green-400'
          }`}
        >
          Include ({critiques.filter(c => c.verdict === 'INCLUDE').length})
        </button>
        <button
          onClick={() => setFilter('MAYBE')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'MAYBE' 
              ? 'bg-yellow-900 text-yellow-400' 
              : 'bg-gray-900 text-gray-400 hover:text-yellow-400'
          }`}
        >
          Maybe ({critiques.filter(c => c.verdict === 'MAYBE').length})
        </button>
        <button
          onClick={() => setFilter('EXCLUDE')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'EXCLUDE' 
              ? 'bg-red-900 text-red-400' 
              : 'bg-gray-900 text-gray-400 hover:text-red-400'
          }`}
        >
          Exclude ({critiques.filter(c => c.verdict === 'EXCLUDE').length})
        </button>
      </div>

      {/* Critiques Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading critiques...</div>
      ) : filteredCritiques.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No critiques found</p>
          <p className="text-sm mt-2">Send works from the Inbox tab for AI critique</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCritiques.map((critique) => (
            <div 
              key={critique.id}
              className="bg-gray-950 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors"
            >
              <div className="flex gap-4">
                {/* Image Preview */}
                {critique.work?.media_url && (
                  <div className="w-24 h-24 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={critique.work.media_url}
                      alt="Work"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  </div>
                )}
                
                {/* Critique Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getVerdictIcon(critique.verdict)}
                      <span className={`font-bold ${getVerdictColor(critique.verdict).split(' ')[0]}`}>
                        {critique.verdict}
                      </span>
                      <span className="text-sm text-gray-400">
                        Day {critique.work?.day}
                      </span>
                    </div>
                    
                    {critique.scores?.weighted_total !== undefined && (
                      <div className="text-right">
                        <span className="text-lg font-bold text-white">
                          {(critique.scores.weighted_total * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 line-clamp-2">
                    {critique.rationale.split('\n')[0]}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {critique.verdict === 'INCLUDE' && critique.work?.state !== 'published' && (
                      <button
                        onClick={() => handlePublish(critique)}
                        className="px-3 py-1 bg-green-900 text-green-400 hover:bg-green-800 rounded text-sm font-medium flex items-center gap-1"
                      >
                        <ArrowRight className="w-3 h-3" />
                        Publish
                      </button>
                    )}
                    
                    {critique.work?.state === 'published' && (
                      <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-sm">
                        ✓ Published
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}