'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Inbox, Eye, CheckCircle, Archive, Share2, Sparkles } from 'lucide-react';
import { ShareBuilder } from '@/components/share-builder/ShareBuilder';

interface Creation {
  id: string;
  agent_name: string;
  title: string;
  image_url: string;
  state: 'inbox' | 'review' | 'published' | 'archive';
  created_at: string;
  tags?: any;
  quality?: any;
  curation?: any;
}

interface ReviewBoardProps {
  agentName: string;
}

export function ReviewBoard({ agentName }: ReviewBoardProps) {
  const [creations, setCreations] = useState<Creation[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeColumn, setActiveColumn] = useState<'inbox' | 'review' | 'published'>('inbox');
  const [isLoading, setIsLoading] = useState(true);
  const [shareCreation, setShareCreation] = useState<Creation | null>(null);

  // Load creations
  useEffect(() => {
    loadCreations();
  }, [agentName]);

  async function loadCreations() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/agents/${agentName.toLowerCase()}/creations?all=true`);
      const data = await response.json();
      setCreations(data.creations || []);
    } catch (error) {
      console.error('Failed to load creations:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Move creation to new state
  async function moveCreation(id: string, newState: 'inbox' | 'review' | 'published' | 'archive') {
    try {
      await fetch(`/api/creations/${id}/state`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: newState })
      });
      
      // Update local state
      setCreations(prev => prev.map(c => 
        c.id === id ? { ...c, state: newState } : c
      ));
    } catch (error) {
      console.error('Failed to update creation state:', error);
    }
  }

  // Batch operations
  async function batchMove(newState: 'inbox' | 'review' | 'published' | 'archive') {
    const promises = Array.from(selectedIds).map(id => moveCreation(id, newState));
    await Promise.all(promises);
    setSelectedIds(new Set());
  }

  // Select all in column
  function selectAllInColumn(state: string) {
    const columnCreations = getColumnCreations(state);
    const ids = new Set(columnCreations.map(c => c.id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      // Toggle - if all selected, deselect all
      const allSelected = columnCreations.every(c => prev.has(c.id));
      if (allSelected) {
        columnCreations.forEach(c => next.delete(c.id));
      } else {
        columnCreations.forEach(c => next.add(c.id));
      }
      return next;
    });
  }

  // Filter by column
  const getColumnCreations = (state: string) => 
    creations.filter(c => c.state === state);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyPress(e: KeyboardEvent) {
      // J/K navigation
      if (e.key === 'j' || e.key === 'k') {
        // Implementation for navigation
      }
      // P to publish selected
      if (e.key === 'p' && selectedIds.size > 0) {
        batchMove('published');
      }
      // R to review selected
      if (e.key === 'r' && selectedIds.size > 0) {
        batchMove('review');
      }
    }
    
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [selectedIds]);

  const columns = [
    { 
      id: 'inbox' as const, 
      title: 'Inbox', 
      icon: Inbox,
      color: 'text-gray-400',
      bgColor: 'bg-gray-900'
    },
    { 
      id: 'review' as const, 
      title: 'Review', 
      icon: Eye,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20'
    },
    { 
      id: 'published' as const, 
      title: 'Published', 
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    }
  ];

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Review Board</h2>
        
        {/* Batch Actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{selectedIds.size} selected</span>
            <button
              onClick={() => batchMove('review')}
              className="px-3 py-1 bg-yellow-900 text-yellow-400 rounded text-sm hover:bg-yellow-800"
            >
              Review
            </button>
            <button
              onClick={() => batchMove('published')}
              className="px-3 py-1 bg-green-900 text-green-400 rounded text-sm hover:bg-green-800"
            >
              Publish
            </button>
            <button
              onClick={() => batchMove('archive')}
              className="px-3 py-1 bg-red-900 text-red-400 rounded text-sm hover:bg-red-800"
            >
              Archive
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="px-3 py-1 bg-gray-800 rounded text-sm hover:bg-gray-700"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {columns.map(column => {
          const columnCreations = getColumnCreations(column.id);
          const Icon = column.icon;
          
          return (
            <div
              key={column.id}
              className={`${column.bgColor} border border-gray-800 rounded-lg overflow-hidden`}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 ${column.color}`} />
                    <h3 className="font-bold">{column.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {columnCreations.length}
                    </span>
                    {columnCreations.length > 0 && (
                      <button
                        onClick={() => selectAllInColumn(column.id)}
                        className="text-xs px-2 py-0.5 bg-gray-800 rounded hover:bg-gray-700"
                        title="Select all"
                      >
                        All
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Column Content */}
              <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
                {columnCreations.map(creation => (
                  <div
                    key={creation.id}
                    className={`bg-gray-950 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-500 transition-all ${
                      selectedIds.has(creation.id) ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedIds(prev => {
                        const next = new Set(prev);
                        if (next.has(creation.id)) {
                          next.delete(creation.id);
                        } else {
                          next.add(creation.id);
                        }
                        return next;
                      });
                    }}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-video bg-gray-800 rounded mb-2 overflow-hidden">
                      {creation.image_url && (
                        <img 
                          src={creation.image_url} 
                          alt={creation.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Title & Time */}
                    <div className="mb-2">
                      <h4 className="text-sm font-bold truncate">{creation.title}</h4>
                      <p className="text-xs text-gray-400">
                        {new Date(creation.created_at).toRelativeTimeString()}
                      </p>
                    </div>

                    {/* Tags */}
                    {creation.tags && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {Object.entries(creation.tags.taxonomy || {}).slice(0, 3).map(([key, value]) => (
                          <span key={key} className="px-2 py-0.5 bg-gray-800 text-xs rounded">
                            {value as string}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quality Badge */}
                    {creation.quality?.print_readiness && (
                      <div className="flex items-center gap-1 text-xs">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        <span>Print Ready: {(creation.quality.print_readiness * 100).toFixed(0)}%</span>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex gap-1 mt-2">
                      {column.id === 'inbox' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveCreation(creation.id, 'review');
                            }}
                            className="flex-1 px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded text-xs hover:bg-yellow-900"
                          >
                            Review
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveCreation(creation.id, 'published');
                            }}
                            className="flex-1 px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs hover:bg-green-900"
                          >
                            Publish
                          </button>
                        </>
                      )}
                      {column.id === 'review' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveCreation(creation.id, 'inbox');
                            }}
                            className="flex-1 px-2 py-1 bg-gray-800 rounded text-xs hover:bg-gray-700"
                          >
                            Back
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              moveCreation(creation.id, 'published');
                            }}
                            className="flex-1 px-2 py-1 bg-green-900/50 text-green-400 rounded text-xs hover:bg-green-900"
                          >
                            Publish
                          </button>
                        </>
                      )}
                      {column.id === 'published' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareCreation(creation);
                          }}
                          className="flex-1 px-2 py-1 bg-purple-900/50 text-purple-400 rounded text-xs hover:bg-purple-900 flex items-center justify-center gap-1"
                        >
                          <Share2 className="w-3 h-3" />
                          Share
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-4 text-xs text-gray-500 flex items-center gap-4">
        <span>Keyboard shortcuts:</span>
        <span><kbd>J</kbd>/<kbd>K</kbd> Navigate</span>
        <span><kbd>X</kbd> Select</span>
        <span><kbd>R</kbd> Review</span>
        <span><kbd>P</kbd> Publish</span>
      </div>

      {/* Share Builder Modal */}
      {shareCreation && (
        <ShareBuilder
          creation={shareCreation}
          onClose={() => setShareCreation(null)}
        />
      )}
    </div>
  );
}

// Helper for relative time
declare global {
  interface Date {
    toRelativeTimeString(): string;
  }
}

Date.prototype.toRelativeTimeString = function() {
  const seconds = Math.floor((Date.now() - this.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};