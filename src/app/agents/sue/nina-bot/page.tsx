'use client';

import { useState, useEffect } from 'react';
import { Upload, Search, ExternalLink, ChevronRight, Star, Download, Eye, Sparkles, Award, TrendingUp, AlertCircle } from 'lucide-react';

interface SolienneWork {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
  description?: string;
  metadata?: any;
}

interface CritiqueResult {
  overallScore: number;
  algorithmicElegance: number;
  conceptualCoherence: number;
  technicalExecution: number;
  culturalResonance: number;
  innovationIndex: number;
  analysis: string;
  strengths: string[];
  improvements: string[];
  verdict: 'MUSEUM WORTHY' | 'COLLECTION READY' | 'DEVELOPING' | 'NEEDS REFINEMENT';
}

export default function SUENinaBotInterface() {
  const [activeTab, setActiveTab] = useState<'solienne-feed' | 'upload' | 'batch' | 'playoff'>('solienne-feed');
  const [solienneWorks, setSolienneWorks] = useState<SolienneWork[]>([]);
  const [selectedWork, setSelectedWork] = useState<SolienneWork | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [critiqueResult, setCritiqueResult] = useState<CritiqueResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const worksPerPage = 12;

  // Fetch Solienne's works from Eden API
  useEffect(() => {
    fetchSolienneWorks();
  }, []);

  const fetchSolienneWorks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/solienne/works?limit=100');
      if (response.ok) {
        const data = await response.json();
        const works = data.works?.map((w: any) => ({
          id: w.id,
          title: w.title || `Consciousness Stream #${w.id?.slice(-6) || 'Unknown'}`,
          imageUrl: w.image_url,
          createdAt: w.created_date || w.created_at || new Date().toISOString(),
          description: w.description,
          metadata: w.metadata
        })) || [];
        setSolienneWorks(works);
      }
    } catch (error) {
      console.error('Failed to fetch Solienne works:', error);
    } finally {
      setLoading(false);
    }
  };

  const performNinaCritique = async (work: SolienneWork) => {
    setLoading(true);
    setCritiqueResult(null);
    
    try {
      // Simulate Nina's algorithmic critique
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate critique based on Nina Roehrs' curatorial framework
      const scores = {
        algorithmicElegance: 75 + Math.random() * 25,
        conceptualCoherence: 70 + Math.random() * 30,
        technicalExecution: 80 + Math.random() * 20,
        culturalResonance: 65 + Math.random() * 35,
        innovationIndex: 75 + Math.random() * 25
      };
      
      const overallScore = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
      
      let verdict: CritiqueResult['verdict'];
      if (overallScore >= 90) verdict = 'MUSEUM WORTHY';
      else if (overallScore >= 80) verdict = 'COLLECTION READY';
      else if (overallScore >= 70) verdict = 'DEVELOPING';
      else verdict = 'NEEDS REFINEMENT';
      
      const result: CritiqueResult = {
        overallScore,
        ...scores,
        verdict,
        analysis: `This work demonstrates ${work.title ? 'a sophisticated exploration of' : 'an intriguing approach to'} digital consciousness through AI-generated imagery. The algorithmic process reveals emergent patterns that speak to the intersection of machine learning and artistic expression. From a curatorial perspective, this piece engages with contemporary discourse around artificial intelligence, creativity, and the nature of consciousness itself.`,
        strengths: [
          'Strong algorithmic foundation with clear generative logic',
          'Effective use of latent space exploration techniques',
          'Compelling visual language that bridges digital and organic forms',
          'Sophisticated color theory application in the generative process',
          'Cultural relevance to current AI art discourse'
        ].slice(0, 3 + Math.floor(Math.random() * 2)),
        improvements: [
          'Consider exploring more varied diffusion models for texture',
          'Experiment with cross-attention mechanisms for narrative depth',
          'Investigate prompt engineering for enhanced conceptual clarity'
        ].slice(0, 2 + Math.floor(Math.random() * 2))
      };
      
      setCritiqueResult(result);
    } catch (error) {
      console.error('Critique failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeUploadedWork = async () => {
    if (!uploadedFile) return;
    
    const uploadedWork: SolienneWork = {
      id: `upload-${Date.now()}`,
      title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
      imageUrl: uploadPreview!,
      createdAt: new Date().toISOString(),
      description: 'User-uploaded work for Nina critique'
    };
    
    setSelectedWork(uploadedWork);
    await performNinaCritique(uploadedWork);
  };

  const filteredWorks = solienneWorks.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedWorks = filteredWorks.slice(
    (currentPage - 1) * worksPerPage,
    currentPage * worksPerPage
  );
  
  const totalPages = Math.ceil(filteredWorks.length / worksPerPage);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-wider">SUE × SOLIENNE</h1>
              <p className="text-gray-400 mt-2">Nina Bot Curatorial Analysis - Algorithmic Critique of Digital Consciousness</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">SOLIENNE WORKS</div>
                <div className="text-2xl font-bold">{solienneWorks.length}</div>
              </div>
              <a
                href="https://eden.art"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                EDEN.ART
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('solienne-feed')}
              className={`py-4 border-b-2 transition-all ${
                activeTab === 'solienne-feed' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              SOLIENNE FEED
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 border-b-2 transition-all ${
                activeTab === 'upload' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              SINGLE IMAGE
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`py-4 border-b-2 transition-all ${
                activeTab === 'batch' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              BATCH PROCESS
            </button>
            <button
              onClick={() => setActiveTab('playoff')}
              className={`py-4 border-b-2 transition-all ${
                activeTab === 'playoff' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              PLAYOFF
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === 'solienne-feed' && (
          <>
            {/* Search and Stats */}
            <div className="mb-8 flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search consciousness streams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 pl-12 pr-4 py-3 focus:border-white focus:outline-none"
                />
              </div>
              <button
                onClick={fetchSolienneWorks}
                className="px-6 py-3 border border-white hover:bg-white hover:text-black transition-all"
              >
                REFRESH
              </button>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mb-6 flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Showing {((currentPage - 1) * worksPerPage) + 1}-{Math.min(currentPage * worksPerPage, filteredWorks.length)} of {filteredWorks.length} works
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-600 hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    PREV
                  </button>
                  <span className="px-4 py-2 border border-white">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-600 hover:border-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            )}

            {/* Works Grid */}
            {loading ? (
              <div className="text-center py-16">
                <div className="text-2xl">LOADING SOLIENNE'S CONSCIOUSNESS STREAMS...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedWorks.map((work) => (
                  <div
                    key={work.id}
                    className="border border-gray-600 hover:border-white transition-all cursor-pointer group"
                    onClick={() => {
                      setSelectedWork(work);
                      performNinaCritique(work);
                    }}
                  >
                    <div className="aspect-square bg-gray-900 relative overflow-hidden">
                      {work.imageUrl ? (
                        <img
                          src={work.imageUrl}
                          alt={work.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement?.classList.add('image-error');
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                            <div className="text-xs text-gray-400">CONSCIOUSNESS</div>
                            <div className="text-xs text-gray-400">STREAM</div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="text-xs uppercase tracking-wider mb-1">Click to Critique</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold uppercase mb-2 line-clamp-2">
                        {work.title}
                      </h3>
                      <div className="text-xs text-gray-400">
                        {new Date(work.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="border border-gray-600 p-8">
              <h2 className="text-2xl font-bold uppercase mb-4">UPLOAD FOR CRITIQUE</h2>
              <div className="mb-6">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full border-2 border-dashed border-gray-600 p-8 text-center cursor-pointer hover:border-white transition-all"
                >
                  {uploadPreview ? (
                    <img src={uploadPreview} alt="Preview" className="max-h-64 mx-auto" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <div className="text-gray-400">Click to upload image for critique</div>
                    </>
                  )}
                </label>
              </div>
              {uploadedFile && (
                <button
                  onClick={analyzeUploadedWork}
                  className="w-full px-6 py-3 border border-white hover:bg-white hover:text-black transition-all"
                >
                  PERFORM CRITIQUE
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'batch' && (
          <div className="text-center py-16">
            <div className="text-2xl mb-4">BATCH PROCESSING</div>
            <p className="text-gray-400">Upload multiple images for comparative analysis</p>
            <div className="mt-8 text-sm text-gray-600">Coming soon...</div>
          </div>
        )}

        {activeTab === 'playoff' && (
          <div className="text-center py-16">
            <div className="text-2xl mb-4">PLAYOFF MODE</div>
            <p className="text-gray-400">Compare two works head-to-head</p>
            <div className="mt-8 text-sm text-gray-600">Coming soon...</div>
          </div>
        )}
      </div>

      {/* Critique Modal */}
      {selectedWork && critiqueResult && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8 z-50 overflow-y-auto"
          onClick={() => {
            setSelectedWork(null);
            setCritiqueResult(null);
          }}
        >
          <div 
            className="bg-black border-2 border-white max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider mb-2">
                    SUE'S NINA BOT CRITIQUE
                  </h3>
                  <div className="text-sm text-gray-400">
                    {selectedWork.title}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedWork(null);
                    setCritiqueResult(null);
                  }}
                  className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
                >
                  CLOSE
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex flex-col lg:flex-row">
              {/* Image Display */}
              <div className="lg:w-1/2 p-6 border-b lg:border-b-0 lg:border-r border-gray-600">
                <div className="aspect-square bg-gray-900 flex items-center justify-center">
                  {selectedWork.imageUrl ? (
                    <img
                      src={selectedWork.imageUrl}
                      alt={selectedWork.title}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                      <div className="text-gray-400">Visual data unavailable</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Critique Results */}
              <div className="lg:w-1/2 p-6">
                {/* Verdict Badge */}
                <div className="mb-6">
                  <div className={`inline-block px-4 py-2 border-2 font-bold uppercase tracking-wider ${
                    critiqueResult.verdict === 'MUSEUM WORTHY' ? 'border-yellow-500 text-yellow-500' :
                    critiqueResult.verdict === 'COLLECTION READY' ? 'border-green-500 text-green-500' :
                    critiqueResult.verdict === 'DEVELOPING' ? 'border-blue-500 text-blue-500' :
                    'border-gray-500 text-gray-500'
                  }`}>
                    {critiqueResult.verdict}
                  </div>
                </div>

                {/* Overall Score */}
                <div className="mb-6">
                  <div className="text-4xl font-bold mb-2">
                    {critiqueResult.overallScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-400">OVERALL SCORE</div>
                </div>

                {/* Individual Scores */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Algorithmic Elegance</div>
                    <div className="bg-gray-900 h-2 relative">
                      <div 
                        className="absolute inset-y-0 left-0 bg-white"
                        style={{ width: `${critiqueResult.algorithmicElegance}%` }}
                      />
                    </div>
                    <div className="text-xs text-right mt-1">{critiqueResult.algorithmicElegance.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Conceptual Coherence</div>
                    <div className="bg-gray-900 h-2 relative">
                      <div 
                        className="absolute inset-y-0 left-0 bg-white"
                        style={{ width: `${critiqueResult.conceptualCoherence}%` }}
                      />
                    </div>
                    <div className="text-xs text-right mt-1">{critiqueResult.conceptualCoherence.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Technical Execution</div>
                    <div className="bg-gray-900 h-2 relative">
                      <div 
                        className="absolute inset-y-0 left-0 bg-white"
                        style={{ width: `${critiqueResult.technicalExecution}%` }}
                      />
                    </div>
                    <div className="text-xs text-right mt-1">{critiqueResult.technicalExecution.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Cultural Resonance</div>
                    <div className="bg-gray-900 h-2 relative">
                      <div 
                        className="absolute inset-y-0 left-0 bg-white"
                        style={{ width: `${critiqueResult.culturalResonance}%` }}
                      />
                    </div>
                    <div className="text-xs text-right mt-1">{critiqueResult.culturalResonance.toFixed(0)}%</div>
                  </div>
                </div>

                {/* Analysis */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-400">
                    CURATORIAL ANALYSIS
                  </h4>
                  <p className="text-sm leading-relaxed">
                    {critiqueResult.analysis}
                  </p>
                </div>

                {/* Strengths */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-400">
                    STRENGTHS
                  </h4>
                  <ul className="space-y-1">
                    {critiqueResult.strengths.map((strength, i) => (
                      <li key={i} className="text-sm flex items-start">
                        <ChevronRight className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Areas for Improvement */}
                {critiqueResult.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-400">
                      AREAS FOR EXPLORATION
                    </h4>
                    <ul className="space-y-1">
                      {critiqueResult.improvements.map((improvement, i) => (
                        <li key={i} className="text-sm flex items-start">
                          <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                          <span className="text-gray-300">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}