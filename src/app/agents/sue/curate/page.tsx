'use client';

import { useState, useEffect } from 'react';
import { Upload, Search, ExternalLink, ChevronRight, Star, Download, Eye } from 'lucide-react';

interface Work {
  id: string;
  title: string;
  imageUrl: string;
  agent: string;
  createdAt: string;
  description?: string;
  curationScore?: number;
  criticalAnalysis?: string;
}

interface CurationResult {
  score: number;
  analysis: string;
  strengths: string[];
  improvements: string[];
  culturalRelevance: number;
  technicalExecution: number;
  conceptualDepth: number;
  emotionalResonance: number;
  innovationIndex: number;
}

export default function SUECuratorialInterface() {
  const [activeTab, setActiveTab] = useState<'eden-feed' | 'upload' | 'history'>('eden-feed');
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<'all' | 'abraham' | 'solienne'>('all');
  const [curationResult, setCurationResult] = useState<CurationResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Fetch works from Eden API
  useEffect(() => {
    fetchEdenWorks();
  }, [selectedAgent]);

  const fetchEdenWorks = async () => {
    setLoading(true);
    try {
      const works: Work[] = [];
      
      // Fetch Abraham works if selected
      if (selectedAgent === 'all' || selectedAgent === 'abraham') {
        const abrahamResponse = await fetch('/api/agents/abraham/works?limit=20');
        if (abrahamResponse.ok) {
          const abrahamData = await abrahamResponse.json();
          const abrahamWorks = abrahamData.works?.map((w: any) => ({
            id: w.id,
            title: w.title || `Abraham Work #${w.id}`,
            imageUrl: w.image_url || '',
            agent: 'abraham',
            createdAt: w.created_date || new Date().toISOString(),
            description: w.description
          })) || [];
          works.push(...abrahamWorks);
        }
      }

      // Fetch Solienne works if selected
      if (selectedAgent === 'all' || selectedAgent === 'solienne') {
        const solienneResponse = await fetch('/api/agents/solienne/works?limit=20');
        if (solienneResponse.ok) {
          const solienneData = await solienneResponse.json();
          const solienneWorks = solienneData.works?.map((w: any) => ({
            id: w.id,
            title: w.title || `Solienne Stream #${w.id}`,
            imageUrl: w.image_url || '',
            agent: 'solienne',
            createdAt: w.created_date || w.created_at || new Date().toISOString(),
            description: w.description
          })) || [];
          works.push(...solienneWorks);
        }
      }

      // Sort by date, newest first
      works.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setWorks(works);
    } catch (error) {
      console.error('Failed to fetch Eden works:', error);
    } finally {
      setLoading(false);
    }
  };

  const performCuration = async (work: Work) => {
    setLoading(true);
    setCurationResult(null);
    
    try {
      // Simulate AI curation analysis (would call actual Eden API in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const result: CurationResult = {
        score: Math.floor(Math.random() * 30) + 70, // 70-100 score
        analysis: `This ${work.agent === 'abraham' ? 'collective intelligence synthesis' : 'consciousness exploration'} demonstrates sophisticated understanding of digital aesthetics and contemporary art discourse. The work engages with themes of artificial consciousness, human-machine collaboration, and the evolution of creative expression in the age of AI.`,
        strengths: [
          'Strong conceptual foundation rooted in contemporary discourse',
          'Technical excellence in execution and presentation',
          'Innovative approach to AI-human collaboration',
          'Cultural relevance and timely thematic exploration'
        ],
        improvements: [
          'Could explore deeper narrative structures',
          'Consider expanding color palette for emotional range',
          'Potential for more interactive elements'
        ],
        culturalRelevance: Math.floor(Math.random() * 20) + 80,
        technicalExecution: Math.floor(Math.random() * 20) + 80,
        conceptualDepth: Math.floor(Math.random() * 20) + 80,
        emotionalResonance: Math.floor(Math.random() * 30) + 70,
        innovationIndex: Math.floor(Math.random() * 20) + 80
      };
      
      setCurationResult(result);
    } catch (error) {
      console.error('Curation failed:', error);
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
    
    setLoading(true);
    try {
      // Would upload to Eden API and get analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const uploadedWork: Work = {
        id: `upload-${Date.now()}`,
        title: uploadedFile.name.replace(/\.[^/.]+$/, ''),
        imageUrl: uploadPreview!,
        agent: 'user',
        createdAt: new Date().toISOString(),
        description: 'User-uploaded work for curatorial analysis'
      };
      
      setSelectedWork(uploadedWork);
      await performCuration(uploadedWork);
      setActiveTab('history');
    } catch (error) {
      console.error('Upload analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWorks = works.filter(w => 
    w.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold uppercase tracking-wider">SUE CURATORIAL INTERFACE</h1>
              <p className="text-gray-400 mt-2">AI-Powered Art Curation & Critical Analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://eden.art"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                EDEN.ART
              </a>
              <a
                href="https://design-critic-agent.vercel.app/nina-unified.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                NINA BOT
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
              onClick={() => setActiveTab('eden-feed')}
              className={`py-4 border-b-2 transition-all ${
                activeTab === 'eden-feed' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              EDEN FEED
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 border-b-2 transition-all ${
                activeTab === 'upload' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              UPLOAD
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 border-b-2 transition-all ${
                activeTab === 'history' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              CURATION HISTORY
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === 'eden-feed' && (
          <>
            {/* Filters */}
            <div className="mb-8 flex gap-4">
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
              <button
                onClick={fetchEdenWorks}
                className="px-6 py-3 border border-white hover:bg-white hover:text-black transition-all"
              >
                REFRESH
              </button>
            </div>

            {/* Works Grid */}
            {loading ? (
              <div className="text-center py-16">
                <div className="text-2xl">LOADING EDEN WORKS...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWorks.map((work) => (
                  <div
                    key={work.id}
                    className="border border-gray-600 hover:border-white transition-all cursor-pointer group"
                    onClick={() => {
                      setSelectedWork(work);
                      performCuration(work);
                    }}
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
                        {work.agent}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-4 left-4 right-4">
                          <button className="w-full bg-white text-black py-2 font-bold uppercase text-sm">
                            CURATE THIS WORK
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold uppercase mb-2 line-clamp-1">{work.title}</h3>
                      <p className="text-sm text-gray-400 line-clamp-2">{work.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-dashed border-gray-600 p-12 text-center">
              {uploadPreview ? (
                <div className="space-y-6">
                  <img
                    src={uploadPreview}
                    alt="Upload preview"
                    className="max-w-full max-h-96 mx-auto"
                  />
                  <div>
                    <p className="text-lg mb-4">{uploadedFile?.name}</p>
                    <button
                      onClick={analyzeUploadedWork}
                      disabled={loading}
                      className="px-8 py-3 bg-white text-black font-bold uppercase hover:bg-gray-200 disabled:opacity-50"
                    >
                      {loading ? 'ANALYZING...' : 'ANALYZE WITH SUE'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-bold mb-2">UPLOAD ARTWORK FOR CURATION</h3>
                  <p className="text-gray-400 mb-6">Drop an image here or click to browse</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 border border-white hover:bg-white hover:text-black transition-all cursor-pointer"
                  >
                    CHOOSE FILE
                  </label>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && selectedWork && curationResult && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Selected Work */}
            <div>
              <h2 className="text-2xl font-bold mb-6">SELECTED WORK</h2>
              <div className="border border-gray-600">
                <img
                  src={selectedWork.imageUrl}
                  alt={selectedWork.title}
                  className="w-full"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold uppercase mb-2">{selectedWork.title}</h3>
                  <p className="text-gray-400 mb-4">{selectedWork.description}</p>
                  <div className="text-sm text-gray-500">
                    Agent: {selectedWork.agent.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Curation Results */}
            <div>
              <h2 className="text-2xl font-bold mb-6">CURATORIAL ANALYSIS</h2>
              
              {/* Overall Score */}
              <div className="mb-8 p-6 border border-white">
                <div className="text-center">
                  <div className="text-5xl font-bold mb-2">{curationResult.score}</div>
                  <div className="text-gray-400">CURATION SCORE</div>
                  <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(curationResult.score / 20) 
                            ? 'fill-white text-white' 
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="space-y-4 mb-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Cultural Relevance</span>
                    <span>{curationResult.culturalRelevance}%</span>
                  </div>
                  <div className="bg-gray-900 h-2">
                    <div 
                      className="bg-white h-full"
                      style={{ width: `${curationResult.culturalRelevance}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Technical Execution</span>
                    <span>{curationResult.technicalExecution}%</span>
                  </div>
                  <div className="bg-gray-900 h-2">
                    <div 
                      className="bg-white h-full"
                      style={{ width: `${curationResult.technicalExecution}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Conceptual Depth</span>
                    <span>{curationResult.conceptualDepth}%</span>
                  </div>
                  <div className="bg-gray-900 h-2">
                    <div 
                      className="bg-white h-full"
                      style={{ width: `${curationResult.conceptualDepth}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Emotional Resonance</span>
                    <span>{curationResult.emotionalResonance}%</span>
                  </div>
                  <div className="bg-gray-900 h-2">
                    <div 
                      className="bg-white h-full"
                      style={{ width: `${curationResult.emotionalResonance}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Innovation Index</span>
                    <span>{curationResult.innovationIndex}%</span>
                  </div>
                  <div className="bg-gray-900 h-2">
                    <div 
                      className="bg-white h-full"
                      style={{ width: `${curationResult.innovationIndex}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Analysis Text */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-3">CRITICAL ANALYSIS</h3>
                  <p className="text-gray-300 leading-relaxed">{curationResult.analysis}</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">STRENGTHS</h3>
                  <ul className="space-y-2">
                    {curationResult.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-green-400" />
                        <span className="text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold mb-3">AREAS FOR EXPLORATION</h3>
                  <ul className="space-y-2">
                    {curationResult.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-yellow-400" />
                        <span className="text-gray-300">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button className="flex-1 px-4 py-3 border border-white hover:bg-white hover:text-black transition-all">
                  <Download className="w-4 h-4 inline mr-2" />
                  EXPORT REPORT
                </button>
                <button className="flex-1 px-4 py-3 border border-white hover:bg-white hover:text-black transition-all">
                  <Eye className="w-4 h-4 inline mr-2" />
                  SHARE CURATION
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}