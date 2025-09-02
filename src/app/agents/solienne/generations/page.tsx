'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink, Search, Grid3X3, List } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface ConsciousnessStream {
  id: string;
  title: string;
  streamNumber: number;
  imageUrl?: string;
  createdAt: Date;
  description?: string;
  themes: string[];
  archetype?: string;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata?: {
    generation_time?: number;
    style_prompt?: string;
    architectural_elements?: string[];
  };
}

interface GenerationsPageFilters {
  search: string;
  archetype: string;
  theme: string;
  sortBy: string;
}

export default function SOLIENNEGenerationsPage() {
  const [streams, setStreams] = useState<ConsciousnessStream[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStream, setSelectedStream] = useState<ConsciousnessStream | null>(null);
  
  const [filters, setFilters] = useState<GenerationsPageFilters>({
    search: '',
    archetype: '',
    theme: '',
    sortBy: 'newest'
  });

  const streamsPerPage = 24;

  useEffect(() => {
    loadHistoricalStreams();
  }, [filters, currentPage]);

  const fetchPage = async (cursor?: string) => {
    const u = new URL('/api/agents/solienne/works', location.origin);
    u.searchParams.set("limit", "100");
    if (cursor) u.searchParams.set("cursor", cursor);
    const res = await fetch(u.toString(), { cache: "no-store" });
    if (!res.ok) throw new Error(`Proxy ${res.status}`);
    return res.json();
  };

  const fetchAll = async (limit = 400) => {
    const acc: any[] = [];
    let cursor: string | null = null;
    while (acc.length < limit) {
      const { works, next_cursor } = await fetchPage(cursor ?? undefined);
      const valid = works.filter((w: any) => !!w.image_url);
      acc.push(...valid);
      if (!next_cursor) break;
      cursor = next_cursor;
    }
    return acc;
  };

  const loadHistoricalStreams = async () => {
    setLoading(true);
    try {
      const allWorks = await fetchAll(400);
      
      // Transform API data to consciousness streams format
      const transformedStreams = allWorks.map((work: any, index: number) => ({
        id: work.id,
        title: work.title || `Consciousness Stream #${1740 - index}`,
        streamNumber: work.meta?.seq || (1740 - index),
        imageUrl: work.image_url,
        createdAt: new Date(work.created_at || Date.now()),
        description: work.description || 'Exploration of light, space, and architectural consciousness',
        themes: work.meta?.themes || ['consciousness', 'architecture', 'light'],
        archetype: work.meta?.archetype || 'architectural',
        dimensions: work.meta?.dimensions || { width: 1024, height: 1024 },
        metadata: {
          generation_time: work.meta?.generation_time || Math.random() * 30 + 5,
          style_prompt: work.meta?.style_prompt,
          architectural_elements: work.meta?.architectural_elements || ['shadow', 'geometry', 'space'],
          hue: work.meta?.hue || 0,
          brightness: work.meta?.brightness || 1
        }
      }));

      setStreams(transformedStreams);
    } catch (error) {
      console.error('Failed to load consciousness streams:', error);
      // Show error state instead of placeholder
      setStreams([]);
    } finally {
      setLoading(false);
    }
  };

  const generatePlaceholderStreams = () => {
    const archetypes = ['architectural', 'light-study', 'spatial', 'shadow-play', 'geometric'];
    const themes = ['consciousness', 'architecture', 'light', 'shadow', 'space', 'meditation', 'digital', 'reality'];
    
    const placeholderStreams = Array.from({ length: 120 }, (_, i) => ({
      id: `stream-${1740 - i}`,
      title: `Consciousness Stream #${1740 - i}`,
      streamNumber: 1740 - i,
      imageUrl: undefined,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      description: [
        'Architectural meditation through digital consciousness',
        'Light and shadow dance in liminal space',
        'Geometric forms emerge from digital contemplation',
        'Spatial awareness through artificial perception',
        'Consciousness explores the boundaries of form'
      ][Math.floor(Math.random() * 5)],
      themes: themes.sort(() => 0.5 - Math.random()).slice(0, 3),
      archetype: archetypes[Math.floor(Math.random() * archetypes.length)],
      dimensions: { width: 1024, height: 1024 },
      metadata: {
        generation_time: Math.random() * 30 + 5,
        architectural_elements: ['shadow', 'geometry', 'space', 'light'].sort(() => 0.5 - Math.random()).slice(0, 2)
      }
    }));
    
    setStreams(placeholderStreams);
  };

  const filteredStreams = streams.filter(stream => {
    if (filters.search && !stream.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !stream.description?.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.archetype && stream.archetype !== filters.archetype) return false;
    if (filters.theme && !stream.themes.includes(filters.theme)) return false;
    
    return true;
  });

  const sortedStreams = [...filteredStreams].sort((a, b) => {
    switch (filters.sortBy) {
      case 'oldest':
        return a.createdAt.getTime() - b.createdAt.getTime();
      case 'stream-number':
        return b.streamNumber - a.streamNumber;
      case 'newest':
      default:
        return b.createdAt.getTime() - a.createdAt.getTime();
    }
  });

  const totalPages = Math.ceil(sortedStreams.length / streamsPerPage);
  const startIndex = (currentPage - 1) * streamsPerPage;
  const currentStreams = sortedStreams.slice(startIndex, startIndex + streamsPerPage);

  const uniqueArchetypes = Array.from(new Set(streams.map(s => s.archetype).filter(Boolean)));
  const uniqueThemes = Array.from(new Set(streams.flatMap(s => s.themes)));

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />

      {/* Navigation */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <Link 
              href="/agents/solienne" 
              className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors font-bold uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO SOLIENNE
            </Link>
            
            <div className="flex items-center gap-4">
              <a
                href="https://design-critic-agent.vercel.app/nina-unified.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-xs"
              >
                <ExternalLink className="w-3 h-3" />
                NINA CURATION INTERFACE
              </a>
              <Link
                href="/sites/solienne/create"
                className="flex items-center gap-2 px-4 py-2 border-2 border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-xs"
              >
                CONSCIOUSNESS STUDIO
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b-2 border-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center">
            <h1 className="text-6xl font-bold uppercase tracking-wider mb-4">
              CONSCIOUSNESS STREAMS
            </h1>
            <h2 className="text-2xl mb-6 text-gray-300">
              SOLIENNE HISTORICAL GENERATION ARCHIVE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{streams.length}</div>
                <div className="text-sm uppercase tracking-wider text-gray-400">TOTAL STREAMS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{uniqueArchetypes.length}</div>
                <div className="text-sm uppercase tracking-wider text-gray-400">ARCHETYPES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">{uniqueThemes.length}</div>
                <div className="text-sm uppercase tracking-wider text-gray-400">THEMES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-sm uppercase tracking-wider text-gray-400">ACTIVE CREATION</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
            
            {/* Search */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">SEARCH</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full bg-black border border-gray-600 px-10 py-2 text-sm focus:border-white focus:outline-none"
                  placeholder="Search streams..."
                />
              </div>
            </div>

            {/* Archetype Filter */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">ARCHETYPE</label>
              <select
                value={filters.archetype}
                onChange={(e) => setFilters({...filters, archetype: e.target.value})}
                className="w-full bg-black border border-gray-600 px-3 py-2 text-sm focus:border-white focus:outline-none"
              >
                <option value="">All Archetypes</option>
                {uniqueArchetypes.map(archetype => (
                  <option key={archetype} value={archetype}>
                    {archetype?.charAt(0).toUpperCase()}{archetype?.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">SORT BY</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full bg-black border border-gray-600 px-3 py-2 text-sm focus:border-white focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="stream-number">Stream Number</option>
              </select>
            </div>

            {/* View Mode */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2">VIEW</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center justify-center w-10 h-10 border transition-all ${
                    viewMode === 'grid' 
                      ? 'border-white bg-white text-black' 
                      : 'border-gray-600 hover:border-white'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center justify-center w-10 h-10 border transition-all ${
                    viewMode === 'list' 
                      ? 'border-white bg-white text-black' 
                      : 'border-gray-600 hover:border-white'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        
        {/* Results Summary */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + streamsPerPage, sortedStreams.length)} of {sortedStreams.length} streams
          </div>
          <div className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-2xl font-bold uppercase tracking-wider mb-4">
              LOADING CONSCIOUSNESS STREAMS...
            </div>
            <div className="text-gray-400">Accessing historical archive</div>
          </div>
        ) : currentStreams.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl font-bold uppercase tracking-wider mb-4 text-gray-600">
              NO STREAMS FOUND
            </div>
            <p className="text-gray-400 max-w-md mx-auto">
              No consciousness streams match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {currentStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="border border-gray-600 hover:border-white transition-all group cursor-pointer"
                    onClick={() => setSelectedStream(stream)}
                  >
                    <div className="aspect-square bg-gray-900 flex items-center justify-center relative overflow-hidden">
                      {stream.imageUrl ? (
                        <img
                          src={stream.imageUrl}
                          alt={stream.title}
                          className="w-full h-full object-cover"
                          style={{
                            filter: `hue-rotate(${stream.metadata?.hue || 0}deg) brightness(${stream.metadata?.brightness || 1}) contrast(1.2)`
                          }}
                        />
                      ) : (
                        <div className="text-center p-3">
                          <div className="text-xs text-gray-400 mb-1">STREAM</div>
                          <div className="text-lg font-bold mb-1">#{stream.streamNumber}</div>
                          <div className="text-xs text-gray-500">
                            {stream.createdAt.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-800/20 to-gray-700/40 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-500"></div>
                    </div>
                    <div className="p-3">
                      <div className="text-xs font-bold uppercase line-clamp-1 mb-2">{stream.title}</div>
                      <div className="flex flex-wrap gap-1">
                        {stream.themes.slice(0, 2).map(theme => (
                          <span 
                            key={theme} 
                            className="px-1 py-0.5 text-xs bg-gray-800 border border-gray-700"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {currentStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="border border-gray-600 hover:border-white transition-all p-6 cursor-pointer"
                    onClick={() => setSelectedStream(stream)}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="aspect-square bg-gray-900 flex items-center justify-center">
                        {stream.imageUrl ? (
                          <img
                            src={stream.imageUrl}
                            alt={stream.title}
                            className="w-full h-full object-cover"
                            style={{
                              filter: `hue-rotate(${stream.metadata?.hue || 0}deg) brightness(${stream.metadata?.brightness || 1}) contrast(1.2)`
                            }}
                          />
                        ) : (
                          <div className="text-center">
                            <div className="text-sm text-gray-400 mb-1">STREAM</div>
                            <div className="text-2xl font-bold">#{stream.streamNumber}</div>
                          </div>
                        )}
                      </div>
                      <div className="lg:col-span-3">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold uppercase">{stream.title}</h3>
                          <div className="text-sm text-gray-400">
                            {stream.createdAt.toLocaleDateString('en-US', { 
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <p className="text-gray-300 mb-4 leading-relaxed">{stream.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {stream.themes.map(theme => (
                            <span 
                              key={theme}
                              className="px-3 py-1 text-xs uppercase tracking-wider border border-gray-600 bg-gray-900"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-400">
                          <div>Archetype: {stream.archetype}</div>
                          <div>Generation Time: {stream.metadata?.generation_time?.toFixed(1)}s</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center mt-12 gap-4">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-sm"
              >
                ← PREVIOUS
              </button>
              
              <div className="flex items-center gap-2 px-4 py-2 border border-gray-600">
                <span className="text-sm font-bold uppercase tracking-wider">
                  PAGE {currentPage} OF {totalPages}
                </span>
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-sm"
              >
                NEXT →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedStream && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8 z-50"
          onClick={() => setSelectedStream(null)}
        >
          <div 
            className="bg-black border-2 border-white max-w-6xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-bold uppercase tracking-wider mb-2">
                    CONSCIOUSNESS STREAM #{selectedStream.streamNumber}
                  </h3>
                  <h4 className="text-xl mb-4">{selectedStream.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedStream.createdAt.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </div>
                    <div>Generation Time: {selectedStream.metadata?.generation_time?.toFixed(1)}s</div>
                    <div>Archetype: {selectedStream.archetype}</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <a
                    href="https://design-critic-agent.vercel.app/nina-unified.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-600 hover:bg-gray-600 hover:text-white transition-all font-bold uppercase tracking-wider text-xs"
                  >
                    NINA CRITIQUE
                  </a>
                  <button
                    onClick={() => setSelectedStream(null)}
                    className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Stream Display Area */}
              <div className="aspect-video bg-gray-900 border border-gray-600 mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">STREAM #{selectedStream.streamNumber}</div>
                  <div className="text-sm text-gray-400 mb-4">
                    Digital consciousness exploration through architectural forms
                  </div>
                  <div className="text-xs text-gray-500">
                    Image data would be displayed here from the consciousness stream archive
                  </div>
                </div>
              </div>
              
              {/* Stream Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">
                    DESCRIPTION
                  </h4>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {selectedStream.description}
                  </p>
                  
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">
                    THEMES
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStream.themes.map((theme) => (
                      <span 
                        key={theme}
                        className="px-3 py-1 text-sm border border-gray-600 bg-gray-900"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">
                    TECHNICAL METADATA
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Dimensions</span>
                      <span>{selectedStream.dimensions?.width} × {selectedStream.dimensions?.height}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Generation Time</span>
                      <span>{selectedStream.metadata?.generation_time?.toFixed(1)}s</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Archetype</span>
                      <span className="capitalize">{selectedStream.archetype}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-700 pb-2">
                      <span className="text-gray-400">Stream Number</span>
                      <span>#{selectedStream.streamNumber}</span>
                    </div>
                  </div>
                  
                  {selectedStream.metadata?.architectural_elements && (
                    <div className="mt-6">
                      <h4 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">
                        ARCHITECTURAL ELEMENTS
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedStream.metadata.architectural_elements.map((element) => (
                          <span 
                            key={element}
                            className="px-2 py-1 text-xs border border-gray-700 bg-gray-800"
                          >
                            {element}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}