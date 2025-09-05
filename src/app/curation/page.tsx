'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, Search, Grid, List, Filter, Play, Trophy, 
  Sparkles, Settings, ChevronRight, Download, Eye, 
  Plus, Folder, BarChart3, Zap, Users, Brain,
  ArrowRight, CheckCircle, XCircle, AlertCircle, Star, ExternalLink
} from 'lucide-react';
import { FEATURE_FLAGS } from '../../../config/flags';
import { Work, Collection, CurationResult, CuratorAgent, SessionType } from '@/lib/types/curation';

interface CurationSession {
  id: string;
  name: string;
  type: SessionType;
  curator: CuratorAgent;
  status: 'active' | 'completed' | 'paused';
  works: Work[];
  results?: CurationResult[];
  createdAt: string;
}

export default function UnifiedCurationDashboard() {
  // Feature flag check
  if (!FEATURE_FLAGS.ART_CURATION_SYSTEM_ENABLED) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">ART CURATION SYSTEM</h1>
          <p className="text-gray-400">System currently disabled</p>
        </div>
      </div>
    );
  }

  // State management
  const [activeView, setActiveView] = useState<'feed' | 'collections' | 'analyze' | 'tournament' | 'sessions'>('feed');
  const [works, setWorks] = useState<Work[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedWorks, setSelectedWorks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<'all' | 'abraham' | 'solienne'>('all');
  const [selectedCurator, setSelectedCurator] = useState<CuratorAgent>('sue');
  const [sessions, setSessions] = useState<CurationSession[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<CurationResult[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch Eden works (from existing agents)
  useEffect(() => {
    fetchEdenWorks();
    fetchCollections();
  }, [selectedAgent]);

  const fetchEdenWorks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const works: Work[] = [];
      const fetchPromises: Promise<any>[] = [];
      
      // Fetch Abraham works if selected
      if (selectedAgent === 'all' || selectedAgent === 'abraham') {
        fetchPromises.push(
          fetch('/api/agents/abraham/works?limit=20', {
            headers: { 'Content-Type': 'application/json' }
          }).then(async (response) => {
            if (!response.ok) {
              throw new Error(`Abraham API error: ${response.status}`);
            }
            const data = await response.json();
            return { source: 'abraham', data };
          }).catch((err) => {
            console.warn('Abraham works fetch failed:', err);
            return { source: 'abraham', data: { works: [] } };
          })
        );
      }

      // Fetch Solienne works if selected
      if (selectedAgent === 'all' || selectedAgent === 'solienne') {
        fetchPromises.push(
          fetch('/api/agents/solienne/works?limit=20', {
            headers: { 'Content-Type': 'application/json' }
          }).then(async (response) => {
            if (!response.ok) {
              throw new Error(`Solienne API error: ${response.status}`);
            }
            const data = await response.json();
            return { source: 'solienne', data };
          }).catch((err) => {
            console.warn('Solienne works fetch failed:', err);
            return { source: 'solienne', data: { works: [] } };
          })
        );
      }

      // Wait for all fetches to complete
      const results = await Promise.allSettled(fetchPromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          const { source, data } = result.value;
          
          if (data.works?.length > 0) {
            const agentWorks = data.works.map((w: any) => ({
              id: w.id || `${source}-${Date.now()}-${Math.random()}`,
              externalId: w.id,
              title: w.title || `${source === 'abraham' ? 'Abraham Work' : 'Solienne Stream'} #${w.id?.slice(-4) || 'New'}`,
              imageUrl: w.image_url || w.imageUrl || '/api/placeholder/400/400',
              agentSource: source,
              description: w.description || `${source === 'abraham' ? 'Collective intelligence exploration' : 'Consciousness exploration'}`,
              createdAt: w.created_date || w.created_at || w.createdAt || new Date().toISOString(),
              updatedAt: w.updated_date || w.updated_at || w.updatedAt || new Date().toISOString(),
            }));
            works.push(...agentWorks);
          }
        }
      });

      // Sort by date, newest first
      works.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setWorks(works);
      
      // Show success message if no works found
      if (works.length === 0) {
        setError('No works found. Try refreshing or check if Eden API endpoints are available.');
      }
      
    } catch (error) {
      console.error('Failed to fetch Eden works:', error);
      setError(`Failed to fetch works: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/curation/collections');
      if (response.ok) {
        const data = await response.json();
        setCollections(data.collections || []);
      }
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    }
  };

  const performAnalysis = async (workIds: string[], sessionType: SessionType = 'single') => {
    setLoading(true);
    try {
      const response = await fetch('/api/curation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workIds,
          curatorAgent: selectedCurator,
          sessionType,
          sessionName: `${selectedCurator.toUpperCase()} ${sessionType} ${new Date().toLocaleDateString()}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentAnalysis(data.data.results);
        
        if (sessionType === 'batch') {
          setSessions(prev => [...prev, {
            id: data.data.session.id,
            name: data.data.session.name,
            type: 'batch',
            curator: selectedCurator,
            status: 'completed',
            works: works.filter(w => workIds.includes(w.id)),
            results: data.data.results,
            createdAt: data.data.session.createdAt
          }]);
        }
        
        setActiveView('analyze');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkSelection = (workId: string) => {
    const newSelected = new Set(selectedWorks);
    if (newSelected.has(workId)) {
      newSelected.delete(workId);
    } else {
      newSelected.add(workId);
    }
    setSelectedWorks(newSelected);
  };

  const clearSelection = () => setSelectedWorks(new Set());

  const filteredWorks = works.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVerdictColor = (verdict?: string) => {
    switch (verdict) {
      case 'MASTERWORK': return 'text-purple-400 border-purple-400 bg-purple-950/20';
      case 'INCLUDE': return 'text-green-400 border-green-400 bg-green-950/20';
      case 'MAYBE': return 'text-yellow-400 border-yellow-400 bg-yellow-950/20';
      case 'EXCLUDE': return 'text-red-400 border-red-400 bg-red-950/20';
      default: return 'text-gray-400 border-gray-400 bg-gray-950/20';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-wider">EDEN CURATION SYSTEM</h1>
              <p className="text-gray-400 mt-2">Unified AI-Powered Art Analysis & Collection Management</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedCurator}
                onChange={(e) => setSelectedCurator(e.target.value as CuratorAgent)}
                className="bg-gray-900 border border-gray-600 px-4 py-2 focus:border-white focus:outline-none"
              >
                <option value="sue">SUE - Cultural Critic</option>
                <option value="nina">NINA - Aesthetic Curator</option>
              </select>
              <a
                href="/agents/sue/curate"
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                SUE CURATE
              </a>
              <button
                onClick={clearSelection}
                disabled={selectedWorks.size === 0}
                className="px-4 py-2 border border-gray-600 hover:border-white transition-all disabled:opacity-50"
              >
                CLEAR ({selectedWorks.size})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveView('feed')}
              className={`py-4 border-b-2 transition-all ${
                activeView === 'feed' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4 inline mr-2" />
              EDEN FEED
            </button>
            <button
              onClick={() => setActiveView('collections')}
              className={`py-4 border-b-2 transition-all ${
                activeView === 'collections' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Folder className="w-4 h-4 inline mr-2" />
              COLLECTIONS
            </button>
            <button
              onClick={() => setActiveView('analyze')}
              className={`py-4 border-b-2 transition-all ${
                activeView === 'analyze' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              ANALYSIS
            </button>
            {FEATURE_FLAGS.TOURNAMENT_MODE_ENABLED && (
              <button
                onClick={() => setActiveView('tournament')}
                className={`py-4 border-b-2 transition-all ${
                  activeView === 'tournament' 
                    ? 'border-white text-white' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 inline mr-2" />
                TOURNAMENT
              </button>
            )}
            <button
              onClick={() => setActiveView('sessions')}
              className={`py-4 border-b-2 transition-all ${
                activeView === 'sessions' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              SESSIONS
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeView === 'feed' && (
          <>
            {/* Controls */}
            <div className="mb-8 flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search works..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 pl-12 pr-4 py-3 focus:border-white focus:outline-none"
                />
              </div>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value as any)}
                className="bg-gray-900 border border-gray-600 px-4 py-3 focus:border-white focus:outline-none"
              >
                <option value="all">All Agents</option>
                <option value="abraham">Abraham</option>
                <option value="solienne">Solienne</option>
              </select>
              <div className="flex border border-gray-600">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-transparent'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-3 ${viewMode === 'list' ? 'bg-white text-black' : 'bg-transparent'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={fetchEdenWorks}
                className="px-6 py-3 border border-white hover:bg-white hover:text-black transition-all"
              >
                REFRESH
              </button>
            </div>

            {/* Selection Actions */}
            {selectedWorks.size > 0 && (
              <div className="mb-8 p-4 border border-white">
                <div className="flex flex-wrap gap-4 items-center">
                  <span className="font-bold">{selectedWorks.size} WORKS SELECTED</span>
                  <button
                    onClick={() => performAnalysis(Array.from(selectedWorks), 'single')}
                    disabled={loading}
                    className="px-4 py-2 bg-white text-black font-bold hover:bg-gray-200 disabled:opacity-50"
                  >
                    <Brain className="w-4 h-4 inline mr-2" />
                    ANALYZE SINGLE
                  </button>
                  {FEATURE_FLAGS.BATCH_CURATION_ENABLED && (
                    <button
                      onClick={() => performAnalysis(Array.from(selectedWorks), 'batch')}
                      disabled={loading || selectedWorks.size < 2}
                      className="px-4 py-2 border border-white hover:bg-white hover:text-black disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4 inline mr-2" />
                      BATCH ANALYZE
                    </button>
                  )}
                  {FEATURE_FLAGS.TOURNAMENT_MODE_ENABLED && (
                    <button
                      onClick={() => performAnalysis(Array.from(selectedWorks), 'tournament')}
                      disabled={loading || selectedWorks.size < 4}
                      className="px-4 py-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black disabled:opacity-50"
                    >
                      <Trophy className="w-4 h-4 inline mr-2" />
                      TOURNAMENT
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-8 p-4 border border-red-600 bg-red-950/20 text-red-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-bold">Error</span>
                </div>
                <p className="mt-2">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    fetchEdenWorks();
                  }}
                  className="mt-3 px-4 py-2 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Works Display */}
            {loading ? (
              <div className="text-center py-16">
                <div className="text-2xl">LOADING EDEN WORKS...</div>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWorks.map((work) => (
                  <div
                    key={work.id}
                    className={`border cursor-pointer group transition-all ${
                      selectedWorks.has(work.id) 
                        ? 'border-white bg-white/5' 
                        : 'border-gray-600 hover:border-white'
                    }`}
                    onClick={() => handleWorkSelection(work.id)}
                  >
                    <div className="aspect-square bg-gray-900 relative overflow-hidden">
                      <img
                        src={work.imageUrl}
                        alt={work.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          img.src = '/api/placeholder/400/400';
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/80 px-2 py-1 text-xs uppercase">
                        {work.agentSource}
                      </div>
                      {selectedWorks.has(work.id) && (
                        <div className="absolute top-2 left-2 bg-white text-black p-1 rounded">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                      )}
                      {work.curationScore && (
                        <div className={`absolute bottom-2 right-2 px-2 py-1 text-xs ${getVerdictColor(work.curationVerdict)}`}>
                          {work.curationScore}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold uppercase mb-2 line-clamp-1">{work.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWorks.map((work) => (
                  <div
                    key={work.id}
                    className={`border p-6 cursor-pointer transition-all ${
                      selectedWorks.has(work.id) 
                        ? 'border-white bg-white/5' 
                        : 'border-gray-600 hover:border-white'
                    }`}
                    onClick={() => handleWorkSelection(work.id)}
                  >
                    <div className="flex gap-6">
                      <div className="w-24 h-24 bg-gray-900 relative overflow-hidden">
                        <img
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = '/api/placeholder/400/400';
                          }}
                        />
                        {selectedWorks.has(work.id) && (
                          <div className="absolute top-1 left-1 bg-white text-black p-0.5 rounded">
                            <CheckCircle className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold uppercase mb-2">{work.title}</h3>
                            <p className="text-gray-400 mb-2">{work.description}</p>
                            <div className="text-sm text-gray-500">
                              Agent: {work.agentSource.toUpperCase()}
                            </div>
                          </div>
                          {work.curationScore && (
                            <div className={`px-3 py-1 border ${getVerdictColor(work.curationVerdict)}`}>
                              <div className="text-center">
                                <div className="font-bold">{work.curationScore}</div>
                                <div className="text-xs">{work.curationVerdict}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeView === 'collections' && FEATURE_FLAGS.COLLECTION_MANAGEMENT_ENABLED && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">CURATED COLLECTIONS</h2>
              <button className="px-6 py-3 border border-white hover:bg-white hover:text-black transition-all">
                <Plus className="w-4 h-4 inline mr-2" />
                NEW COLLECTION
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <div key={collection.id} className="border border-gray-600 hover:border-white transition-all">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold uppercase">{collection.name}</h3>
                      <span className="text-sm bg-gray-800 px-2 py-1">
                        {collection.curatorAgent.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4 line-clamp-3">{collection.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {collection.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-900 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{collection.workCount} works</span>
                      <span>{collection.isPublic ? 'PUBLIC' : 'PRIVATE'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'analyze' && currentAnalysis.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-8">CURATION ANALYSIS - {selectedCurator.toUpperCase()}</h2>
            <div className="space-y-8">
              {currentAnalysis.map((result, index) => (
                <div key={index} className="border border-gray-600 p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Overall Score */}
                    <div>
                      <div className={`p-6 border ${getVerdictColor(result.verdict)} mb-6`}>
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-2">{result.score}</div>
                          <div className="text-xl font-bold">{result.verdict}</div>
                          <div className="flex justify-center gap-1 mt-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-6 h-6 ${
                                  i < Math.floor(result.score / 20) 
                                    ? 'fill-current' 
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Detailed Metrics */}
                      <div className="space-y-4">
                        {[
                          { key: 'culturalRelevance', label: 'Cultural Relevance' },
                          { key: 'technicalExecution', label: 'Technical Execution' },
                          { key: 'conceptualDepth', label: 'Conceptual Depth' },
                          { key: 'emotionalResonance', label: 'Emotional Resonance' },
                          { key: 'innovationIndex', label: 'Innovation Index' }
                        ].map(({ key, label }) => (
                          <div key={key}>
                            <div className="flex justify-between mb-2">
                              <span>{label}</span>
                              <span>{result[key as keyof CurationResult]}%</span>
                            </div>
                            <div className="bg-gray-900 h-2">
                              <div 
                                className="bg-white h-full"
                                style={{ width: `${result[key as keyof CurationResult]}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Analysis Details */}
                    <div>
                      <div className="mb-6">
                        <h3 className="font-bold mb-3">CRITICAL ANALYSIS</h3>
                        <p className="text-gray-300 leading-relaxed">{result.analysis}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-bold mb-3">STRENGTHS</h3>
                        <ul className="space-y-2">
                          {result.strengths.map((strength, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 text-green-400" />
                              <span className="text-gray-300">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-bold mb-3">AREAS FOR EXPLORATION</h3>
                        <ul className="space-y-2">
                          {result.improvements.map((improvement, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 mt-0.5 text-yellow-400" />
                              <span className="text-gray-300">{improvement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Reverse Engineering */}
                      {FEATURE_FLAGS.REVERSE_ENGINEERING_ENABLED && result.reversePrompt && (
                        <div className="bg-blue-950/30 border border-blue-800 p-4">
                          <h3 className="font-bold mb-3 text-blue-400">REVERSE ENGINEERING PROMPT</h3>
                          <p className="text-sm text-gray-300">{result.reversePrompt}</p>
                          <button className="mt-3 px-3 py-1 text-xs border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all">
                            COPY PROMPT
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'tournament' && FEATURE_FLAGS.TOURNAMENT_MODE_ENABLED && (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-400" />
            <h2 className="text-2xl font-bold mb-4">TOURNAMENT MODE</h2>
            <p className="text-gray-400 mb-8">
              Select 4+ works from the feed to begin a curation tournament
            </p>
            <p className="text-sm text-gray-500">
              AI curators will compare works head-to-head to determine the ultimate winner
            </p>
          </div>
        )}

        {activeView === 'sessions' && (
          <div>
            <h2 className="text-2xl font-bold mb-8">CURATION SESSIONS</h2>
            {sessions.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <p>No curation sessions yet</p>
                <p className="text-sm">Run batch or tournament analysis to create sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="border border-gray-600 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold">{session.name}</h3>
                        <p className="text-gray-400">
                          {session.works.length} works • {session.curator.toUpperCase()} • {session.type.toUpperCase()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-sm border ${
                        session.status === 'completed' ? 'border-green-400 text-green-400' :
                        session.status === 'active' ? 'border-yellow-400 text-yellow-400' :
                        'border-gray-400 text-gray-400'
                      }`}>
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}