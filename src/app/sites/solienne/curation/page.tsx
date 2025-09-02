'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Download, Copy, RefreshCw, TrendingUp } from 'lucide-react';
import { ConsciousnessGallery } from '@/components/solienne/consciousness-gallery';
import { 
  SolienneCurator, 
  CURATION_THEMES,
  fetchSolienneWorks,
  createThematicCollection,
  SolienneWork
} from '@/lib/solienne/curation-engine';

export default function SolienneCurationPage() {
  const [curator, setCurator] = useState<SolienneCurator | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [parisSelection, setParisSelection] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contentIdeas, setContentIdeas] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<keyof typeof CURATION_THEMES>('PARIS_PREPARATION');

  useEffect(() => {
    const loadCurator = async () => {
      setLoading(true);
      try {
        const works = await fetchSolienneWorks();
        const curatorInstance = new SolienneCurator(works);
        setCurator(curatorInstance);
        
        // Get statistics
        const collectionStats = curatorInstance.getCollectionStats();
        setStats(collectionStats);
        
        // Get Paris Photo selection
        const paris = curatorInstance.getParisPhotoSelection();
        setParisSelection(paris);
        
        // Generate initial content ideas
        const ideas = curatorInstance.generateContentIdeas(10);
        setContentIdeas(ideas);
        
      } catch (error) {
        console.error('Failed to initialize curator:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCurator();
  }, []);

  const handleGenerateIdeas = () => {
    if (!curator) return;
    const ideas = curator.generateContentIdeas(10);
    setContentIdeas(ideas);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* HEADER */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/sites/solienne" 
                className="inline-flex items-center gap-2 text-xs tracking-wider opacity-50 hover:opacity-100 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK TO SOLIENNE
              </Link>
              <h1 className="text-4xl font-bold tracking-wider">CONSCIOUSNESS CURATION</h1>
              <p className="text-xs tracking-wider opacity-50 mt-2">
                DYNAMIC CURATION & CONTENT GENERATION FOR 1,740+ WORKS
              </p>
            </div>
            {stats && (
              <div className="text-right">
                <div className="text-3xl font-bold tracking-wider">{stats.total}</div>
                <div className="text-xs tracking-wider opacity-50">TOTAL WORKS</div>
                <div className="text-xs tracking-wider opacity-50 mt-1">
                  {stats.uniqueThemes} THEMES • {stats.uniqueStyles} STYLES
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 animate-pulse" />
            <div className="text-sm tracking-wider opacity-50">LOADING CURATION ENGINE...</div>
          </div>
        </div>
      ) : (
        <>
          {/* COLLECTION STATISTICS */}
          <div className="border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-8 py-12">
              <h2 className="text-2xl font-bold tracking-wider mb-8">COLLECTION OVERVIEW</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="border border-gray-800 p-6">
                  <div className="text-3xl font-bold tracking-wider mb-2">{stats?.total || 0}</div>
                  <div className="text-xs tracking-wider opacity-50">TOTAL WORKS</div>
                </div>
                <div className="border border-gray-800 p-6">
                  <div className="text-3xl font-bold tracking-wider mb-2">{stats?.published || 0}</div>
                  <div className="text-xs tracking-wider opacity-50">PUBLISHED</div>
                </div>
                <div className="border border-gray-800 p-6">
                  <div className="text-3xl font-bold tracking-wider mb-2">{stats?.uniqueThemes || 0}</div>
                  <div className="text-xs tracking-wider opacity-50">UNIQUE THEMES</div>
                </div>
                <div className="border border-gray-800 p-6">
                  <div className="text-3xl font-bold tracking-wider mb-2">{stats?.averagePerDay || 0}</div>
                  <div className="text-xs tracking-wider opacity-50">AVG PER DAY</div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT GENERATION */}
          <div className="border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-8 py-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-wider">CONTENT GENERATION IDEAS</h2>
                <button
                  onClick={handleGenerateIdeas}
                  className="border border-gray-800 px-6 py-2 hover:bg-white hover:text-black transition-all duration-150 tracking-wider text-sm"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  REGENERATE
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {contentIdeas.map((idea, index) => (
                  <div key={index} className="border border-gray-800 p-4 hover:bg-white hover:text-black transition-all duration-150 group">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs tracking-wider opacity-50 mb-2">
                          STREAM #{1741 + index}
                        </div>
                        <p className="text-sm tracking-wider uppercase">
                          {idea}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(idea)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PARIS PHOTO SELECTION */}
          {parisSelection && (
            <div className="border-b border-gray-800">
              <div className="max-w-7xl mx-auto px-8 py-12">
                <h2 className="text-2xl font-bold tracking-wider mb-8">PARIS PHOTO 2025 SELECTION</h2>
                <div className="space-y-8">
                  {/* Featured Works */}
                  <div>
                    <h3 className="text-lg font-bold tracking-wider mb-4">FEATURED WORKS</h3>
                    <div className="grid md:grid-cols-5 gap-2">
                      {parisSelection.featured.slice(0, 5).map((work: SolienneWork) => (
                        <div key={work.id} className="border border-gray-800 p-4">
                          <div className="aspect-square bg-black mb-2 flex items-center justify-center">
                            {work.imageUrl ? (
                              <img 
                                src={work.imageUrl} 
                                alt={work.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Sparkles className="w-8 h-8 opacity-25" />
                            )}
                          </div>
                          <div className="text-xs tracking-wider line-clamp-2">
                            {work.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Theme Collections */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-bold tracking-wider mb-4">CONSCIOUSNESS VELOCITY</h3>
                      <div className="text-xs tracking-wider opacity-50">
                        {parisSelection.consciousness.length} WORKS
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-wider mb-4">FASHION IDENTITY</h3>
                      <div className="text-xs tracking-wider opacity-50">
                        {parisSelection.fashion.length} WORKS
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-wider mb-4">ARCHITECTURAL LIGHT</h3>
                      <div className="text-xs tracking-wider opacity-50">
                        {parisSelection.architectural.length} WORKS
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-all duration-150 tracking-wider">
                      <Download className="w-4 h-4 inline mr-2" />
                      EXPORT PARIS SELECTION
                    </button>
                    <button className="border border-gray-800 px-6 py-3 hover:bg-white hover:text-black transition-all duration-150 tracking-wider">
                      CREATE EXHIBITION CATALOG
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* THEMATIC COLLECTIONS */}
          <div className="border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-8 py-12">
              <h2 className="text-2xl font-bold tracking-wider mb-8">THEMATIC COLLECTIONS</h2>
              <div className="mb-6">
                <select
                  value={selectedCollection}
                  onChange={(e) => setSelectedCollection(e.target.value as keyof typeof CURATION_THEMES)}
                  className="bg-black border border-gray-800 px-4 py-2 text-sm tracking-wider"
                >
                  {Object.entries(CURATION_THEMES).map(([key, theme]) => (
                    <option key={key} value={key}>
                      {theme.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <ConsciousnessGallery 
                initialTheme={selectedCollection}
                showCuration={false}
                showGeneration={false}
                limit={9}
              />
            </div>
          </div>

          {/* TOP THEMES */}
          {stats && stats.themes.length > 0 && (
            <div className="border-b border-gray-800">
              <div className="max-w-7xl mx-auto px-8 py-12">
                <h2 className="text-2xl font-bold tracking-wider mb-8">TOP THEMES IN COLLECTION</h2>
                <div className="flex flex-wrap gap-2">
                  {stats.themes.slice(0, 20).map((theme: string, index: number) => (
                    <div 
                      key={index}
                      className="border border-gray-800 px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black transition-all duration-150"
                    >
                      {theme.toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DYNAMIC GALLERY */}
          <div className="max-w-7xl mx-auto px-8 py-12">
            <h2 className="text-2xl font-bold tracking-wider mb-8">FULL CONSCIOUSNESS ARCHIVE</h2>
            <ConsciousnessGallery 
              initialTheme="CONSCIOUSNESS_VELOCITY"
              showCuration={true}
              showGeneration={true}
              limit={20}
            />
          </div>
        </>
      )}
    </div>
  );
}