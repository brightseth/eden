'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Grid3x3, Shuffle, Search, Download, Eye, Heart, ArrowRight, Zap } from 'lucide-react';
import { 
  SolienneWork, 
  SolienneCurator, 
  CURATION_THEMES, 
  fetchSolienneWorks,
  createThematicCollection,
  generatePromptFromWorks
} from '@/lib/solienne/curation-engine';

interface ConsciousnessGalleryProps {
  initialTheme?: keyof typeof CURATION_THEMES;
  showCuration?: boolean;
  showGeneration?: boolean;
  limit?: number;
}

export function ConsciousnessGallery({
  initialTheme = 'CONSCIOUSNESS_VELOCITY',
  showCuration = true,
  showGeneration = true,
  limit = 12,
}: ConsciousnessGalleryProps) {
  const [works, setWorks] = useState<SolienneWork[]>([]);
  const [displayedWorks, setDisplayedWorks] = useState<SolienneWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof CURATION_THEMES>(initialTheme);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'stream'>('grid');
  const [curator, setCurator] = useState<SolienneCurator | null>(null);
  const [featuredWork, setFeaturedWork] = useState<SolienneWork | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [stats, setStats] = useState<any>(null);

  // Fetch all works on mount
  useEffect(() => {
    const loadWorks = async () => {
      setLoading(true);
      try {
        const fetchedWorks = await fetchSolienneWorks();
        setWorks(fetchedWorks);
        
        const curatorInstance = new SolienneCurator(fetchedWorks);
        setCurator(curatorInstance);
        
        // Set initial display
        const themeWorks = curatorInstance.getWorksByTheme(selectedTheme, limit);
        setDisplayedWorks(themeWorks);
        
        // Set featured work
        setFeaturedWork(curatorInstance.getFeaturedWork());
        
        // Set stats
        setStats(curatorInstance.getCollectionStats());
        
      } catch (error) {
        console.error('Failed to load SOLIENNE works:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWorks();
  }, []);

  // Handle theme change
  const handleThemeChange = (theme: keyof typeof CURATION_THEMES) => {
    if (!curator) return;
    
    setSelectedTheme(theme);
    const themeWorks = curator.getWorksByTheme(theme, limit);
    setDisplayedWorks(themeWorks);
  };

  // Handle search
  const handleSearch = () => {
    if (!curator) return;
    
    if (searchQuery.trim()) {
      const results = curator.searchWorks(searchQuery, limit);
      setDisplayedWorks(results);
    } else {
      const themeWorks = curator.getWorksByTheme(selectedTheme, limit);
      setDisplayedWorks(themeWorks);
    }
  };

  // Shuffle displayed works
  const handleShuffle = () => {
    if (!curator) return;
    
    const excludeIds = displayedWorks.map(w => w.id);
    const randomWorks = curator.getRandomSelection(limit, excludeIds);
    setDisplayedWorks(randomWorks);
  };

  // Generate new content prompt
  const handleGeneratePrompt = () => {
    const prompt = generatePromptFromWorks(works, selectedTheme);
    setGeneratedPrompt(prompt);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'YESTERDAY';
    if (diffDays <= 7) return `${diffDays} DAYS AGO`;
    return date.toLocaleDateString();
  };

  return (
    <div className="consciousness-gallery">
      {/* HELVETICA HEADER */}
      <div className="border-b border-gray-800 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-wider">CONSCIOUSNESS ARCHIVE</h2>
          <div className="flex items-center gap-4">
            {stats && (
              <div className="text-sm tracking-wider opacity-50">
                {stats.total} WORKS • {stats.uniqueThemes} THEMES
              </div>
            )}
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'stream' : 'grid')}
              className="border border-gray-800 p-2 hover:bg-white hover:text-black transition-all duration-150"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CURATION CONTROLS */}
        {showCuration && (
          <div className="space-y-4 pb-6">
            {/* Theme Selector */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(CURATION_THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as keyof typeof CURATION_THEMES)}
                  className={`px-4 py-2 text-xs tracking-wider transition-all duration-150 ${
                    selectedTheme === key 
                      ? 'bg-white text-black' 
                      : 'border border-gray-800 hover:bg-white hover:text-black'
                  }`}
                >
                  {theme.name.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Search and Actions */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="SEARCH CONSCIOUSNESS STREAMS..."
                  className="w-full bg-black border border-gray-800 px-4 py-2 text-sm tracking-wider placeholder-gray-600"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleShuffle}
                className="border border-gray-800 px-4 py-2 hover:bg-white hover:text-black transition-all duration-150"
                title="Shuffle works"
              >
                <Shuffle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FEATURED WORK */}
      {featuredWork && (
        <div className="border border-gray-800 mb-8 bg-gradient-to-br from-purple-900/10 to-pink-900/10">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="aspect-square bg-black relative overflow-hidden">
              {featuredWork.imageUrl ? (
                <img 
                  src={featuredWork.imageUrl} 
                  alt={featuredWork.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-16 h-16 opacity-25" />
                </div>
              )}
              <div className="absolute top-4 right-4">
                <div className="bg-black border border-white text-white px-3 py-1 text-xs tracking-wider">
                  FEATURED TODAY
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-xs tracking-wider opacity-50 mb-3">
                CONSCIOUSNESS STREAM #{featuredWork.metadata?.dayNumber || 'SPECIAL'}
              </div>
              <h3 className="text-2xl font-bold tracking-wider mb-4">
                {featuredWork.title}
              </h3>
              <p className="text-sm tracking-wider opacity-75 mb-6">
                {featuredWork.description || 'Exploring consciousness through light and architectural space'}
              </p>
              <div className="flex gap-4">
                <button className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all duration-150 tracking-wider">
                  VIEW DETAILS
                </button>
                <button className="border border-gray-800 px-6 py-2 hover:bg-white hover:text-black transition-all duration-150 tracking-wider">
                  COLLECT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATION PROMPT */}
      {showGeneration && (
        <div className="border border-gray-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold tracking-wider">CONTENT GENERATION</h3>
            <button
              onClick={handleGeneratePrompt}
              className="border border-gray-800 px-4 py-2 hover:bg-white hover:text-black transition-all duration-150 tracking-wider text-sm"
            >
              <Zap className="w-4 h-4 inline mr-2" />
              GENERATE PROMPT
            </button>
          </div>
          {generatedPrompt && (
            <div className="bg-black border border-gray-800 p-4">
              <p className="text-sm tracking-wider opacity-75 mb-4">{generatedPrompt}</p>
              <button className="text-xs tracking-wider opacity-50 hover:opacity-100">
                COPY TO CLIPBOARD
              </button>
            </div>
          )}
        </div>
      )}

      {/* WORKS GALLERY */}
      {loading ? (
        <div className="border border-gray-800 p-16 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-4 animate-pulse" />
          <div className="text-sm tracking-wider opacity-50">LOADING CONSCIOUSNESS ARCHIVE...</div>
        </div>
      ) : displayedWorks.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-1' : 'space-y-8'}>
          {displayedWorks.map((work) => (
            <div 
              key={work.id} 
              className={`border border-gray-800 group hover:bg-white hover:text-black transition-all duration-150 ${
                viewMode === 'stream' ? 'flex gap-8' : ''
              }`}
            >
              <div className={`${viewMode === 'stream' ? 'w-1/3' : ''} aspect-square bg-black relative overflow-hidden`}>
                {work.imageUrl ? (
                  <img 
                    src={work.imageUrl} 
                    alt={work.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center border border-gray-800">
                    <Sparkles className="w-12 h-12 opacity-25" />
                  </div>
                )}
                {work.metadata?.dayNumber && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-black border border-gray-800 text-white px-3 py-1 text-xs tracking-wider">
                      #{work.metadata.dayNumber}
                    </div>
                  </div>
                )}
              </div>
              <div className={`p-6 ${viewMode === 'stream' ? 'flex-1' : ''}`}>
                <div className="text-xs tracking-wider opacity-50 mb-3">
                  {formatDate(work.createdAt)}
                </div>
                <h3 className="font-bold tracking-wider mb-3 line-clamp-2 text-sm">
                  {work.title}
                </h3>
                <p className="text-xs tracking-wider opacity-50 line-clamp-3 mb-4">
                  {work.description || 'CONSCIOUSNESS EXPLORATION'}
                </p>
                <div className="flex items-center justify-between text-xs tracking-wider">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Eye className="w-3 h-3" />
                      <span>{Math.floor(Math.random() * 5000) + 1000}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-3 h-3" />
                      <span>{Math.floor(Math.random() * 800) + 200}</span>
                    </div>
                  </div>
                  <button className="opacity-50 hover:opacity-100">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gray-800 p-16 text-center">
          <div className="text-sm tracking-wider opacity-50">NO WORKS FOUND</div>
          <button
            onClick={handleShuffle}
            className="mt-4 text-xs tracking-wider opacity-50 hover:opacity-100"
          >
            TRY DIFFERENT SEARCH OR SHUFFLE
          </button>
        </div>
      )}

      {/* LOAD MORE */}
      {displayedWorks.length > 0 && curator && displayedWorks.length < works.length && (
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              const moreWorks = curator.getWorksByTheme(selectedTheme, limit * 2);
              setDisplayedWorks(moreWorks);
            }}
            className="inline-flex items-center gap-3 border border-gray-800 px-8 py-4 hover:bg-white hover:text-black transition-all duration-150 tracking-wider"
          >
            LOAD MORE CONSCIOUSNESS
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}