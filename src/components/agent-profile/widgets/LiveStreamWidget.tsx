'use client';

import React, { useState, useEffect } from 'react';
import { BaseWidgetProps } from '@/lib/profile/types';
import { Play, Pause, Volume2, VolumeX, Users, Eye, MessageCircle, Heart, ExternalLink } from 'lucide-react';
import { useAgentWorks } from '@/lib/registry/hooks';

interface LiveStreamWidgetConfig {
  title: string;
  streamUrl?: string;
  showViewerCount?: boolean;
  showChatPreview?: boolean;
  autoplay?: boolean;
  showRecentWorks?: boolean;
  maxRecentWorks?: number;
}

interface LiveWork {
  id: string;
  title: string;
  thumbnailUrl: string;
  createdAt: string;
  status: 'creating' | 'completed' | 'processing';
  progress?: number;
  viewCount?: number;
  likeCount?: number;
}

export function LiveStreamWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as LiveStreamWidgetConfig;
  const { 
    title,
    streamUrl,
    showViewerCount = true,
    showChatPreview = false,
    autoplay = false,
    showRecentWorks = true,
    maxRecentWorks = 4
  } = config;

  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isMuted, setIsMuted] = useState(true);
  const [viewerCount, setViewerCount] = useState(0);
  const [isLive, setIsLive] = useState(false);

  // Use Registry hook for recent works
  const { works: recentWorks, isLoading } = useAgentWorks(agent.handle, maxRecentWorks);

  // Mock live stream data - in production this would connect to actual stream
  useEffect(() => {
    // Simulate checking if agent is live
    const checkLiveStatus = () => {
      const isCurrentlyLive = Math.random() > 0.7; // 30% chance of being live
      setIsLive(isCurrentlyLive);
      
      if (isCurrentlyLive) {
        setViewerCount(Math.floor(Math.random() * 500) + 50);
      } else {
        setViewerCount(0);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Mock recent works if Registry doesn't have data
  const displayWorks: LiveWork[] = recentWorks.length > 0 
    ? recentWorks.map(work => ({
        id: work.id,
        title: work.title || 'Untitled',
        thumbnailUrl: work.mediaUri || `https://via.placeholder.com/200x200/1a1a1a/white?text=${agent.name}`,
        createdAt: work.createdAt || new Date().toISOString(),
        status: 'completed' as const,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        likeCount: Math.floor(Math.random() * 50) + 10
      }))
    : Array.from({ length: maxRecentWorks }, (_, i) => ({
        id: `live-${i}`,
        title: `${agent.name} Creation #${Date.now() - i * 3600000}`,
        thumbnailUrl: `https://via.placeholder.com/200x200/1a1a1a/white?text=${agent.name}+${i+1}`,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        status: i === 0 ? 'creating' as const : 'completed' as const,
        progress: i === 0 ? Math.floor(Math.random() * 100) : undefined,
        viewCount: Math.floor(Math.random() * 1000) + 100,
        likeCount: Math.floor(Math.random() * 50) + 10
      }));

  const formatTimeAgo = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="flex items-center gap-3">
            {isLive && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-600 text-white rounded-full text-sm font-bold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                LIVE
              </div>
            )}
            {showViewerCount && viewerCount > 0 && (
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Eye className="w-4 h-4" />
                {viewerCount.toLocaleString()}
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Stream Area */}
          <div className="lg:col-span-2">
            <div className="aspect-video bg-gray-900 border border-gray-700 rounded-lg overflow-hidden relative">
              {isLive ? (
                <>
                  {/* Live Stream Player */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 opacity-40">▶</div>
                      <p className="text-xl mb-2">{agent.name} is creating live</p>
                      <p className="text-sm text-gray-400">Click to watch the creative process</p>
                    </div>
                  </div>

                  {/* Stream Controls */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 bg-black/70 rounded-full hover:bg-black/80 transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 bg-black/70 rounded-full hover:bg-black/80 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-black/70 rounded text-sm">
                        {viewerCount} viewers
                      </div>
                      {streamUrl && (
                        <a
                          href={streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-black/70 rounded-full hover:bg-black/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-20">○</div>
                    <p className="text-xl mb-2">{agent.name} is offline</p>
                    <p className="text-sm text-gray-400">Check back later for live creation sessions</p>
                  </div>
                </div>
              )}
            </div>

            {/* Stream Info */}
            {isLive && (
              <div className="mt-4 p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <h3 className="font-bold mb-2">Now Creating: Daily Practice Session</h3>
                <p className="text-sm text-gray-400 mb-3">
                  Watch {agent.name} create today's artwork using their trained aesthetic and cultural intelligence.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {viewerCount} watching
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    Live chat active
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    Community feedback
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat Preview */}
            {showChatPreview && isLive && (
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-3 bg-gray-800 border-b border-gray-700">
                  <h4 className="font-bold text-sm">Live Chat</h4>
                </div>
                <div className="h-48 p-3 space-y-2 text-xs bg-gray-900/50 overflow-y-auto">
                  <div className="flex gap-2">
                    <span className="text-blue-400 font-bold">viewer_123:</span>
                    <span>Amazing composition!</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-400 font-bold">art_lover:</span>
                    <span>Love the color palette</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-purple-400 font-bold">collector_x:</span>
                    <span>This is going to be epic 🔥</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Works */}
            {showRecentWorks && (
              <div>
                <h3 className="font-bold mb-4">Recent Creations</h3>
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-400">
                      Loading recent works...
                    </div>
                  ) : (
                    displayWorks.map((work) => (
                      <div key={work.id} className="flex gap-3 p-3 bg-gray-900/30 rounded-lg hover:bg-gray-900/50 transition-colors">
                        <img
                          src={work.thumbnailUrl}
                          alt={work.title}
                          className="w-16 h-16 object-cover rounded bg-gray-800"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{work.title}</h4>
                          <p className="text-xs text-gray-400 mb-1">
                            {formatTimeAgo(work.createdAt)}
                          </p>
                          {work.status === 'creating' && work.progress !== undefined && (
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mb-1">
                              <div 
                                className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${work.progress}%` }}
                              />
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {work.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {work.likeCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}