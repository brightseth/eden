'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import { Star, Download, Eye, Calendar } from 'lucide-react';

interface CuratedWork {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url: string;
  archive_number: number;
  created_date: string;
  metadata?: {
    tags?: string[];
  };
  is_curated?: boolean;
  curation_notes?: string;
}

interface ParisPhotoCurationProps {
  agentId: string;
}

export function ParisPhotoCuration({ agentId }: ParisPhotoCurationProps) {
  const [works, setWorks] = useState<CuratedWork[]>([]);
  const [curatedWorks, setCuratedWorks] = useState<CuratedWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'all' | 'curated'>('all');
  
  const supabase = createClientComponentClient();
  
  const categories = [
    'CONSCIOUSNESS STREAMS',
    'VELOCITY FIELDS', 
    'ARCHITECTURAL LIGHT',
    'DIGITAL SUBLIME',
    'PORTRAITURE',
    'LANDSCAPE',
    'ABSTRACT'
  ];

  useEffect(() => {
    fetchWorks();
  }, [agentId]);

  async function fetchWorks() {
    setLoading(true);
    
    // Fetch high-quality works (recent and diverse)
    const { data, error } = await supabase
      .from('agent_archives')
      .select('*')
      .eq('agent_id', agentId)
      .eq('archive_type', 'generation')
      .gte('archive_number', 1200) // Focus on more recent works
      .order('archive_number', { ascending: false })
      .limit(200);
    
    if (error) {
      console.error('Error fetching works:', error);
    } else {
      setWorks(data || []);
      // Load any existing curation from localStorage
      const saved = localStorage.getItem(`paris-photo-curation-${agentId}`);
      if (saved) {
        setCuratedWorks(JSON.parse(saved));
      }
    }
    
    setLoading(false);
  }

  const toggleCuration = (work: CuratedWork) => {
    const isCurrentlyCurated = curatedWorks.some(w => w.id === work.id);
    
    if (isCurrentlyCurated) {
      // Remove from curation
      const updated = curatedWorks.filter(w => w.id !== work.id);
      setCuratedWorks(updated);
      localStorage.setItem(`paris-photo-curation-${agentId}`, JSON.stringify(updated));
    } else if (curatedWorks.length < 20) {
      // Add to curation (max 20)
      const updated = [...curatedWorks, { ...work, is_curated: true }];
      setCuratedWorks(updated);
      localStorage.setItem(`paris-photo-curation-${agentId}`, JSON.stringify(updated));
    }
  };

  const addCurationNote = (workId: string, note: string) => {
    const updated = curatedWorks.map(work =>
      work.id === workId ? { ...work, curation_notes: note } : work
    );
    setCuratedWorks(updated);
    localStorage.setItem(`paris-photo-curation-${agentId}`, JSON.stringify(updated));
  };

  const exportCuration = () => {
    const exportData = {
      agent: agentId.toUpperCase(),
      exhibition: 'Paris Photo 2025',
      curator: 'Nina & Team',
      date: new Date().toISOString(),
      total_selected: curatedWorks.length,
      works: curatedWorks.map(work => ({
        archive_number: work.archive_number,
        title: work.title,
        image_url: work.image_url,
        tags: work.metadata?.tags || [],
        notes: work.curation_notes || ''
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentId}-paris-photo-curation.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredWorks = viewMode === 'curated' 
    ? curatedWorks 
    : works.filter(work => 
        selectedCategories.length === 0 || 
        selectedCategories.some(cat => 
          work.metadata?.tags?.some(tag => 
            tag.toLowerCase().includes(cat.toLowerCase().replace(' ', '_'))
          )
        )
      );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div>LOADING CURATION INTERFACE...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl mb-2">PARIS PHOTO 2025 CURATION</h1>
              <p className="text-lg">{agentId.toUpperCase()} • GRAND PALAIS • NOV 10-13, 2025</p>
            </div>
            <div className="text-right">
              <div className="text-2xl mb-1">{curatedWorks.length}/20</div>
              <div className="text-sm">SELECTED WORKS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* View Mode */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode('all')}
                className={`px-4 py-2 transition-colors ${
                  viewMode === 'all' 
                    ? 'bg-white text-black' 
                    : 'border border-white hover:bg-white hover:text-black'
                }`}
              >
                ALL WORKS ({works.length})
              </button>
              <button
                onClick={() => setViewMode('curated')}
                className={`px-4 py-2 transition-colors ${
                  viewMode === 'curated' 
                    ? 'bg-white text-black' 
                    : 'border border-white hover:bg-white hover:text-black'
                }`}
              >
                CURATED ({curatedWorks.length})
              </button>
            </div>

            {/* Export */}
            {curatedWorks.length > 0 && (
              <button
                onClick={exportCuration}
                className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                EXPORT SELECTION
              </button>
            )}
          </div>

          {/* Category Filters */}
          {viewMode === 'all' && (
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    if (selectedCategories.includes(category)) {
                      setSelectedCategories(prev => prev.filter(c => c !== category));
                    } else {
                      setSelectedCategories(prev => [...prev, category]);
                    }
                  }}
                  className={`px-3 py-1 text-xs transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-white text-black'
                      : 'border border-white hover:bg-white hover:text-black'
                  }`}
                >
                  {category}
                </button>
              ))}
              {selectedCategories.length > 0 && (
                <button
                  onClick={() => setSelectedCategories([])}
                  className="px-3 py-1 text-xs border border-white hover:bg-white hover:text-black"
                >
                  CLEAR FILTERS
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Works Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredWorks.map(work => {
            const isCurated = curatedWorks.some(w => w.id === work.id);
            
            return (
              <div key={work.id} className="group relative">
                <div className="aspect-square relative bg-gray-900 border border-white">
                  <Image
                    src={work.thumbnail_url || work.image_url}
                    alt={work.title}
                    fill
                    className="object-cover"
                    unoptimized
                    priority={false}
                    loading="lazy"
                  />
                  
                  {/* Archive Number */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 text-xs">
                    #{work.archive_number}
                  </div>
                  
                  {/* Curation Toggle */}
                  <button
                    onClick={() => toggleCuration(work)}
                    disabled={!isCurated && curatedWorks.length >= 20}
                    className={`absolute top-2 right-2 p-2 transition-all ${
                      isCurated 
                        ? 'bg-white text-black' 
                        : curatedWorks.length >= 20 
                          ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                          : 'bg-black/80 text-white hover:bg-white hover:text-black'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isCurated ? 'fill-current' : ''}`} />
                  </button>
                  
                  {/* Hover Info */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div>
                      <div className="text-sm mb-1">{work.title?.substring(0, 60)}...</div>
                      <div className="text-xs flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {work.created_date}
                      </div>
                      {work.metadata?.tags && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {work.metadata.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs px-1 py-0.5 bg-white/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Curation Notes */}
                {isCurated && viewMode === 'curated' && (
                  <div className="mt-2">
                    <textarea
                      placeholder="CURATION NOTES..."
                      value={work.curation_notes || ''}
                      onChange={(e) => addCurationNote(work.id, e.target.value)}
                      className="w-full p-2 bg-black border border-white text-white text-xs placeholder-gray-500 resize-none"
                      rows={2}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <p>NO WORKS MATCH THE CURRENT FILTERS</p>
          </div>
        )}
      </div>
    </div>
  );
}