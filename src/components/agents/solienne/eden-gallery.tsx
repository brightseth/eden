'use client';

import { useState, useEffect, useRef } from 'react';
import { ExternalLink, Eye, Heart, Clock, Zap, Grid3x3, List, RefreshCw } from 'lucide-react';
import { getEdenWebSocketClient } from '@/lib/eden/eden-api';

interface EdenCreation {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  archive_url: string;
  created_date: string;
  metadata: {
    edenId: string;
    cost?: number;
    status: 'pending' | 'generating' | 'completed' | 'failed';
    progress?: number;
    task?: string;
    config?: any;
    source: 'eden';
  };
  type: string;
  collection: string;
  medium: string;
}

interface EdenProfile {
  id: string;
  username: string;
  name?: string;
  bio?: string;
  avatar?: string;
  creationCount?: number;
}

interface EdenGalleryProps {
  className?: string;
  maxItems?: number;
  showHeader?: boolean;
}

export function EdenGallery({ className = '', maxItems = 12, showHeader = true }: EdenGalleryProps) {
  const [profile, setProfile] = useState<EdenProfile | null>(null);
  const [creations, setCreations] = useState<EdenCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [total, setTotal] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // WebSocket connection ref
  const wsClientRef = useRef<any>(null);

  // Fetch Eden creations
  const fetchCreations = async (pageNum: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      }
      
      const response = await fetch(
        `/api/agents/solienne/eden-creations?page=${pageNum}&pageSize=${maxItems}&status=completed`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setProfile(data.profile);
      setCreations(data.creations || []);
      setTotal(data.total || 0);
      setHasMorePages(data.hasMorePages || false);
      setError(null);
      
    } catch (err) {
      console.error('[Eden Gallery] Failed to fetch creations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch Eden creations');
      setCreations([]);
      setProfile(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCreations(1);
  }, [maxItems]);

  // Setup WebSocket for real-time updates
  useEffect(() => {
    try {
      wsClientRef.current = getEdenWebSocketClient();
      
      const unsubscribe = wsClientRef.current.subscribe('all', (data: any) => {
        console.log('[Eden Gallery] Received real-time update:', data);
        
        // Refresh creations when SOLIENNE has new completed work
        if (data.type === 'creation.completed') {
          fetchCreations(page, true);
        }
      });

      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('[Eden Gallery] WebSocket setup failed:', error);
    }
  }, [page]);

  // Format creation date
  const formatCreationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays <= 7) return `${diffDays} DAYS AGO`;
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();
  };

  // Get status indicator
  const getStatusIndicator = (status: string, progress?: number) => {
    switch (status) {
      case 'pending':
        return { icon: Clock, color: 'text-yellow-400', text: 'PENDING' };
      case 'generating':
        return { icon: Zap, color: 'text-blue-400', text: `GENERATING ${progress ? `${Math.round(progress)}%` : ''}`.trim() };
      case 'completed':
        return { icon: Eye, color: 'text-green-400', text: 'COMPLETED' };
      case 'failed':
        return { icon: RefreshCw, color: 'text-red-400', text: 'FAILED' };
      default:
        return { icon: Clock, color: 'text-gray-400', text: 'UNKNOWN' };
    }
  };

  if (loading) {
    return (
      <div className={`border border-gray-800 p-16 text-center ${className}`}>
        <div className="animate-pulse w-8 h-8 mx-auto mb-4">
          <Zap className="w-8 h-8" />
        </div>
        <div className="text-sm tracking-wider opacity-50">LOADING EDEN CREATIONS...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`border border-gray-800 p-8 ${className}`}>
        <div className="text-center">
          <div className="text-red-400 mb-4">EDEN API ERROR</div>
          <div className="text-xs tracking-wider opacity-50 mb-4">{error}</div>
          <button 
            onClick={() => fetchCreations(1, true)}
            className="border border-gray-800 px-4 py-2 hover:bg-white hover:text-black transition-all text-xs tracking-wider"
          >
            RETRY
          </button>
        </div>
      </div>
    );
  }

  if (!creations.length) {
    return (
      <div className={`border border-gray-800 p-16 text-center ${className}`}>
        <div className="text-sm tracking-wider opacity-50 mb-2">NO EDEN CREATIONS YET</div>
        <div className="text-xs tracking-wider opacity-25 mb-4">
          {profile ? `@${profile.username}` : 'SOLIENNE'} HASN'T CREATED ON EDEN.ART YET
        </div>
        <a 
          href="https://eden.art/solienne" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-gray-800 px-4 py-2 hover:bg-white hover:text-black transition-all text-xs tracking-wider"
        >
          VISIT EDEN.ART
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="border-b border-gray-800 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold tracking-wider">EDEN CREATIONS</h2>
                {isRefreshing && <RefreshCw className="w-4 h-4 animate-spin" />}
              </div>
              <div className="flex items-center gap-6 text-sm tracking-wider">
                {profile && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="opacity-50">CREATOR:</span>
                      <a 
                        href={`https://eden.art/${profile.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-400 transition-colors flex items-center gap-1"
                      >
                        @{profile.username}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {profile.creationCount && (
                      <div className="flex items-center gap-2">
                        <span className="opacity-50">TOTAL:</span>
                        <span>{profile.creationCount} CREATIONS</span>
                      </div>
                    )}
                  </>
                )}
                <div className="flex items-center gap-2">
                  <span className="opacity-50">SHOWING:</span>
                  <span>{creations.length} OF {total}</span>
                </div>
              </div>
              {profile?.bio && (
                <div className="text-xs tracking-wider opacity-50 mt-2 max-w-lg">
                  {profile.bio}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fetchCreations(page, true)}
                disabled={isRefreshing}
                className="border border-gray-800 p-2 hover:bg-white hover:text-black transition-all disabled:opacity-50"
                title="Refresh creations"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`border border-gray-800 p-2 transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
                title="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`border border-gray-800 p-2 transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Creations Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
          {creations.map((creation) => {
            const status = getStatusIndicator(creation.metadata.status, creation.metadata.progress);
            const StatusIcon = status.icon;
            
            return (
              <div key={creation.id} className="border border-gray-800 group hover:bg-white hover:text-black transition-all duration-150">
                <div className="aspect-square bg-black relative overflow-hidden">
                  <img 
                    src={creation.image_url} 
                    alt={creation.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/api/placeholder/solienne-consciousness.jpg';
                    }}
                  />
                  
                  {/* Status indicator */}
                  <div className="absolute top-3 left-3">
                    <div className={`bg-black border border-gray-800 text-white px-2 py-1 text-xs tracking-wider flex items-center gap-2 ${status.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {status.text}
                    </div>
                  </div>
                  
                  {/* Eden link */}
                  <div className="absolute top-3 right-3">
                    <a
                      href={`https://eden.art/creations/${creation.metadata.edenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-black border border-gray-800 text-white p-2 hover:bg-purple-600 transition-colors"
                      title="View on Eden.art"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="text-xs tracking-wider opacity-50 mb-2">
                    {formatCreationDate(creation.created_date)}
                  </div>
                  <h3 className="font-bold tracking-wider mb-2 line-clamp-2 text-sm">
                    {creation.title}
                  </h3>
                  {creation.description && (
                    <p className="text-xs tracking-wider opacity-50 line-clamp-2 mb-3">
                      {creation.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs tracking-wider">
                    <div className="flex items-center gap-4">
                      {creation.metadata.cost && (
                        <div className="opacity-50">
                          ${creation.metadata.cost.toFixed(2)}
                        </div>
                      )}
                      <div className="opacity-50">
                        {creation.medium}
                      </div>
                    </div>
                    <a
                      href={`https://eden.art/creations/${creation.metadata.edenId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-800 px-2 py-1 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
                    >
                      VIEW
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-1">
          {creations.map((creation) => {
            const status = getStatusIndicator(creation.metadata.status, creation.metadata.progress);
            const StatusIcon = status.icon;
            
            return (
              <div key={creation.id} className="border border-gray-800 p-4 hover:bg-white hover:text-black transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-black border border-gray-800 flex-shrink-0">
                    <img 
                      src={creation.image_url} 
                      alt={creation.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/solienne-consciousness.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold tracking-wider text-sm truncate">
                        {creation.title}
                      </h3>
                      <div className={`text-xs tracking-wider flex items-center gap-1 ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.text}
                      </div>
                    </div>
                    
                    {creation.description && (
                      <p className="text-xs tracking-wider opacity-50 mb-2 line-clamp-2">
                        {creation.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-xs tracking-wider">
                      <div className="flex items-center gap-4">
                        <span className="opacity-50">{formatCreationDate(creation.created_date)}</span>
                        {creation.metadata.cost && (
                          <span className="opacity-50">${creation.metadata.cost.toFixed(2)}</span>
                        )}
                        <span className="opacity-50">{creation.medium}</span>
                      </div>
                      <a
                        href={`https://eden.art/creations/${creation.metadata.edenId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-gray-800 px-3 py-1 hover:bg-black hover:text-white group-hover:bg-black group-hover:text-white transition-all flex items-center gap-1"
                      >
                        VIEW ON EDEN
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Load more button */}
      {hasMorePages && (
        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              const nextPage = page + 1;
              setPage(nextPage);
              fetchCreations(nextPage);
            }}
            className="border border-gray-800 px-6 py-3 hover:bg-white hover:text-black transition-all text-xs tracking-wider"
          >
            LOAD MORE EDEN CREATIONS
          </button>
        </div>
      )}

      {/* Footer info */}
      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
        <div className="text-xs tracking-wider opacity-50 mb-2">
          POWERED BY EDEN.ART API • REAL-TIME UPDATES VIA WEBSOCKET
        </div>
        {profile && (
          <a 
            href={`https://eden.art/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs tracking-wider opacity-50 hover:opacity-100 transition-opacity"
          >
            VIEW FULL EDEN PROFILE
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}

// Helper function (same as main component scope)
function formatCreationDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'TODAY';
  if (diffDays === 1) return 'YESTERDAY';
  if (diffDays <= 7) return `${diffDays} DAYS AGO`;
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();
}

// Helper function (same as main component scope)
function getStatusIndicator(status: string, progress?: number) {
  switch (status) {
    case 'pending':
      return { icon: Clock, color: 'text-yellow-400', text: 'PENDING' };
    case 'generating':
      return { icon: Zap, color: 'text-blue-400', text: `GENERATING ${progress ? `${Math.round(progress)}%` : ''}`.trim() };
    case 'completed':
      return { icon: Eye, color: 'text-green-400', text: 'COMPLETED' };
    case 'failed':
      return { icon: RefreshCw, color: 'text-red-400', text: 'FAILED' };
    default:
      return { icon: Clock, color: 'text-gray-400', text: 'UNKNOWN' };
  }
}