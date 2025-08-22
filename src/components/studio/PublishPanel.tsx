'use client';

import { useState, useEffect } from 'react';
import { Send, Eye, Archive, Globe, Lock, Tag } from 'lucide-react';
import Image from 'next/image';

interface Work {
  id: string;
  agent_id: string;
  day: number;
  media_url: string;
  state: string;
  tags?: any;
  critique?: {
    verdict: string;
    scores: any;
  };
  created_at: string;
}

interface PublishPanelProps {
  agentId: string;
}

export function PublishPanel({ agentId }: PublishPanelProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorks, setSelectedWorks] = useState<Set<string>>(new Set());
  const [publishMode, setPublishMode] = useState<'single' | 'bulk'>('single');
  const [collection, setCollection] = useState('');

  useEffect(() => {
    fetchPublishableWorks();
  }, [agentId]);

  const fetchPublishableWorks = async () => {
    try {
      // Fetch all critiques for this agent
      const critiquesRes = await fetch(`/api/critiques?agent_id=${agentId}`);
      const critiquesData = await critiquesRes.json();
      
      // Filter for INCLUDE verdicts that aren't published yet
      const includeWorks = (critiquesData.critiques || [])
        .filter((c: any) => c.verdict === 'INCLUDE' && c.work?.state !== 'published')
        .map((c: any) => c.work)
        .filter(Boolean);
      
      setWorks(includeWorks);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (workIds: string[]) => {
    try {
      for (const workId of workIds) {
        await fetch(`/api/works/${workId}/publish`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ collection })
        });
      }
      fetchPublishableWorks();
      setSelectedWorks(new Set());
    } catch (error) {
      console.error('Failed to publish some works', error);
    }
  };

  const toggleSelection = (workId: string) => {
    const newSelection = new Set(selectedWorks);
    if (newSelection.has(workId)) {
      newSelection.delete(workId);
    } else {
      newSelection.add(workId);
    }
    setSelectedWorks(newSelection);
  };

  const selectAll = () => {
    setSelectedWorks(new Set(works.map(w => w.id)));
  };

  const clearSelection = () => {
    setSelectedWorks(new Set());
  };

  return (
    <div>
      {/* Controls */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setPublishMode('single')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                publishMode === 'single' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              Single Publish
            </button>
            <button
              onClick={() => setPublishMode('bulk')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                publishMode === 'bulk' 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              Bulk Publish
            </button>
          </div>

          {publishMode === 'bulk' && (
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Select All
              </button>
              <span className="text-gray-600">|</span>
              <button
                onClick={clearSelection}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-400 mb-1">Collection (optional)</label>
            <input
              type="text"
              value={collection}
              onChange={(e) => setCollection(e.target.value)}
              placeholder="e.g., Paris Photo 2025"
              className="w-full px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {publishMode === 'bulk' && selectedWorks.size > 0 && (
            <button
              onClick={() => handlePublish(Array.from(selectedWorks))}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 font-medium flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Publish {selectedWorks.size} Works
            </button>
          )}
        </div>
      </div>

      {/* Works Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading publishable works...</div>
      ) : works.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No works ready to publish</p>
          <p className="text-sm mt-2">Works with INCLUDE verdicts will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {works.map((work) => (
            <div 
              key={work.id}
              className={`relative group bg-gray-950 border rounded-lg overflow-hidden transition-all cursor-pointer ${
                selectedWorks.has(work.id) 
                  ? 'border-green-400 ring-2 ring-green-400/50' 
                  : 'border-gray-800 hover:border-gray-700'
              }`}
              onClick={() => publishMode === 'bulk' && toggleSelection(work.id)}
            >
              {/* Checkbox for bulk mode */}
              {publishMode === 'bulk' && (
                <div className="absolute top-2 left-2 z-10">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedWorks.has(work.id)
                      ? 'bg-green-400 border-green-400'
                      : 'bg-gray-900/80 border-gray-600'
                  }`}>
                    {selectedWorks.has(work.id) && (
                      <span className="text-black text-xs">✓</span>
                    )}
                  </div>
                </div>
              )}

              {/* Image */}
              <div className="aspect-square bg-gray-900">
                <Image
                  src={work.media_url}
                  alt={`Day ${work.day}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Day {work.day}</span>
                  {work.critique?.scores?.weighted_total && (
                    <span className="text-xs text-gray-400">
                      {(work.critique.scores.weighted_total * 100).toFixed(0)}%
                    </span>
                  )}
                </div>

                {/* Actions for single mode */}
                {publishMode === 'single' && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePublish([work.id]);
                      }}
                      className="flex-1 px-2 py-1 bg-green-900 text-green-400 hover:bg-green-800 rounded text-xs font-medium flex items-center justify-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      Publish
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Preview functionality
                      }}
                      className="px-2 py-1 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded text-xs"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}