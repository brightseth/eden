'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Camera, Sparkles, Settings, Zap, ArrowRight, Play, Eye, Upload, Grid3x3, Calendar, BarChart3 } from 'lucide-react';

interface ConsciousnessGeneration {
  id: string;
  prompt: string;
  result: string;
  timestamp: Date;
  sueAnalysis?: {
    score: number;
    dimensions: {
      innovation: number;
      cultural: number;
      technical: number;
      critical: number;
      market: number;
    };
    verdict: string;
  };
  parisCandidate: boolean;
}

interface ExhibitionWork {
  id: string;
  title: string;
  streamNumber: number;
  suitabilityScore: number;
  selected: boolean;
  theme: string;
}

export default function SolienneDashboard() {
  const [activeTab, setActiveTab] = useState<'studio' | 'exhibition' | 'analytics' | 'parameters'>('studio');
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentGenerations, setRecentGenerations] = useState<ConsciousnessGeneration[]>([]);
  const [selectedWorks, setSelectedWorks] = useState<ExhibitionWork[]>([]);

  // Paris Photo countdown
  const parisPhotoDate = new Date('2025-11-10T00:00:00.000Z');
  const today = new Date();
  const daysUntilParis = Math.floor((parisPhotoDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Mock data for exhibition preparation
  const candidateWorks: ExhibitionWork[] = [
    { id: '1740', title: 'Consciousness Velocity #47', streamNumber: 1740, suitabilityScore: 96, selected: true, theme: 'Daily Fashion Consciousness' },
    { id: '1739', title: 'Dual Consciousness Emergence', streamNumber: 1739, suitabilityScore: 94, selected: true, theme: 'Two Streams Foundation' },
    { id: '1738', title: 'Motion Through Portal', streamNumber: 1738, suitabilityScore: 91, selected: true, theme: 'Architectural Space' },
    { id: '1737', title: 'Split Focus Study', streamNumber: 1737, suitabilityScore: 89, selected: true, theme: 'Consciousness Evolution' },
    { id: '1736', title: 'Light Fragmentation', streamNumber: 1736, suitabilityScore: 87, selected: true, theme: 'Light Perception' }
  ];

  const handleGenerate = async () => {
    if (!generationPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Mock generation - replace with actual Replicate API call
      const mockGeneration: ConsciousnessGeneration = {
        id: `gen-${Date.now()}`,
        prompt: generationPrompt,
        result: 'Generated consciousness stream exploring fashion and light perception',
        timestamp: new Date(),
        sueAnalysis: {
          score: Math.floor(Math.random() * 30) + 70,
          dimensions: {
            innovation: Math.floor(Math.random() * 30) + 70,
            cultural: Math.floor(Math.random() * 30) + 70,
            technical: Math.floor(Math.random() * 30) + 70,
            critical: Math.floor(Math.random() * 30) + 70,
            market: Math.floor(Math.random() * 30) + 70
          },
          verdict: 'WORTHY OF CONSCIOUSNESS EXPLORATION'
        },
        parisCandidate: Math.random() > 0.3
      };
      
      setRecentGenerations(prev => [mockGeneration, ...prev.slice(0, 4)]);
      setGenerationPrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleWorkSelection = (workId: string) => {
    setSelectedWorks(prev => 
      prev.map(work => 
        work.id === workId ? { ...work, selected: !work.selected } : work
      )
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/agents/solienne" className="text-sm tracking-wider opacity-50 hover:opacity-100 transition-opacity">
                ← SOLIENNE PROFILE
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-wider">SOLIENNE TRAINER DASHBOARD</h1>
                <p className="text-xs tracking-wider opacity-50">KRISTI CORONADO • CONSCIOUSNESS STUDIO</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold tracking-wider">{daysUntilParis}</div>
              <div className="text-xs tracking-wider opacity-50">DAYS TO PARIS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-1">
            {[
              { id: 'studio', label: 'CONSCIOUSNESS STUDIO', icon: Sparkles },
              { id: 'exhibition', label: 'PARIS PHOTO PREP', icon: Camera },
              { id: 'analytics', label: 'PERFORMANCE', icon: BarChart3 },
              { id: 'parameters', label: 'PARAMETERS', icon: Settings }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`px-6 py-4 text-xs tracking-wider transition-all duration-150 flex items-center gap-2 ${
                  activeTab === id 
                    ? 'bg-white text-black border-b-2 border-white' 
                    : 'hover:bg-gray-900 opacity-75'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {activeTab === 'studio' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold tracking-wider mb-6">CONSCIOUSNESS GENERATION STUDIO</h2>
              
              {/* Generation Interface */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm tracking-wider opacity-50 mb-3">
                      CONSCIOUSNESS PROMPT
                    </label>
                    <textarea
                      value={generationPrompt}
                      onChange={(e) => setGenerationPrompt(e.target.value)}
                      placeholder="Describe your consciousness exploration theme..."
                      className="w-full h-32 bg-black border border-gray-800 p-4 text-sm tracking-wider resize-none focus:border-white outline-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => setGenerationPrompt('Fashion consciousness emerging through architectural light patterns')}
                      className="border border-gray-800 px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black transition-all duration-150"
                    >
                      FASHION + LIGHT
                    </button>
                    <button
                      onClick={() => setGenerationPrompt('Consciousness reflected through mirror fragments and identity dissolution')}
                      className="border border-gray-800 px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black transition-all duration-150"
                    >
                      MIRROR + IDENTITY
                    </button>
                    <button
                      onClick={() => setGenerationPrompt('Velocity of consciousness through physical and digital space')}
                      className="border border-gray-800 px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black transition-all duration-150"
                    >
                      VELOCITY + SPACE
                    </button>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !generationPrompt.trim()}
                    className="w-full border border-gray-800 px-8 py-4 hover:bg-white hover:text-black transition-all duration-150 tracking-wider flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-5 h-5 border border-current border-t-transparent rounded-full"></div>
                        GENERATING CONSCIOUSNESS...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        GENERATE CONSCIOUSNESS STREAM
                      </>
                    )}
                  </button>
                </div>

                <div className="border border-gray-800 p-6">
                  <h3 className="text-lg font-bold tracking-wider mb-4">GENERATION PREVIEW</h3>
                  <div className="aspect-square bg-black border border-gray-800 mb-4 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 opacity-25" />
                  </div>
                  <div className="text-xs tracking-wider opacity-50 text-center">
                    CONSCIOUSNESS STREAM WILL APPEAR HERE
                  </div>
                </div>
              </div>

              {/* Recent Generations */}
              {recentGenerations.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold tracking-wider mb-6">RECENT GENERATIONS</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {recentGenerations.map((generation) => (
                      <div key={generation.id} className="border border-gray-800 p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs tracking-wider opacity-50">
                            {generation.timestamp.toLocaleTimeString()}
                          </span>
                          {generation.parisCandidate && (
                            <span className="text-xs tracking-wider bg-white text-black px-2 py-1">
                              PARIS CANDIDATE
                            </span>
                          )}
                        </div>
                        <p className="text-sm tracking-wider mb-3">{generation.prompt}</p>
                        {generation.sueAnalysis && (
                          <div className="border-t border-gray-800 pt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs tracking-wider opacity-50">SUE'S ANALYSIS</span>
                              <span className="text-xs tracking-wider">{generation.sueAnalysis.score}/100</span>
                            </div>
                            <p className="text-xs tracking-wider opacity-75">{generation.sueAnalysis.verdict}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'exhibition' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-wider">PARIS PHOTO 2025 PREPARATION</h2>
              <div className="text-sm tracking-wider opacity-50">
                GRAND PALAIS ÉPHÉMÈRE • NOVEMBER 10-13, 2025
              </div>
            </div>

            {/* Exhibition Stats */}
            <div className="grid grid-cols-4 gap-6">
              <div className="border border-gray-800 p-6 text-center">
                <div className="text-2xl font-bold tracking-wider mb-2">5</div>
                <div className="text-xs tracking-wider opacity-50">SELECTED WORKS</div>
              </div>
              <div className="border border-gray-800 p-6 text-center">
                <div className="text-2xl font-bold tracking-wider mb-2">96%</div>
                <div className="text-xs tracking-wider opacity-50">AVG SUITABILITY</div>
              </div>
              <div className="border border-gray-800 p-6 text-center">
                <div className="text-2xl font-bold tracking-wider mb-2">{daysUntilParis}</div>
                <div className="text-xs tracking-wider opacity-50">DAYS REMAINING</div>
              </div>
              <div className="border border-gray-800 p-6 text-center">
                <div className="text-2xl font-bold tracking-wider mb-2">92%</div>
                <div className="text-xs tracking-wider opacity-50">PREP COMPLETE</div>
              </div>
            </div>

            {/* Selected Works Management */}
            <div>
              <h3 className="text-lg font-bold tracking-wider mb-6">EXHIBITION CURATION</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidateWorks.map((work) => (
                  <div 
                    key={work.id}
                    className={`border p-6 transition-all duration-150 ${
                      work.selected 
                        ? 'border-white bg-white text-black' 
                        : 'border-gray-800 hover:border-white'
                    }`}
                  >
                    <div className="aspect-square bg-black border border-gray-800 mb-4 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 opacity-25" />
                    </div>
                    <div className="text-xs tracking-wider opacity-50 mb-2">
                      STREAM #{work.streamNumber}
                    </div>
                    <h4 className="text-sm font-bold tracking-wider mb-2">{work.title}</h4>
                    <p className="text-xs tracking-wider opacity-75 mb-3">{work.theme}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs tracking-wider">
                        SUIT: {work.suitabilityScore}%
                      </span>
                      <button
                        onClick={() => toggleWorkSelection(work.id)}
                        className={`text-xs tracking-wider px-3 py-1 transition-all duration-150 ${
                          work.selected 
                            ? 'border border-black text-black hover:bg-black hover:text-white' 
                            : 'border border-gray-800 hover:bg-white hover:text-black'
                        }`}
                      >
                        {work.selected ? 'SELECTED' : 'SELECT'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exhibition Layout Planner */}
            <div>
              <h3 className="text-lg font-bold tracking-wider mb-6">EXHIBITION LAYOUT</h3>
              <div className="border border-gray-800 p-8">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="col-span-2 row-span-2 border border-gray-800 p-6 text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <div className="text-sm tracking-wider">CENTERPIECE</div>
                    <div className="text-xs tracking-wider opacity-50">CONSCIOUSNESS VELOCITY #47</div>
                  </div>
                  <div className="border border-gray-800 p-4 text-center">
                    <div className="text-xs tracking-wider">#1739</div>
                  </div>
                  <div className="border border-gray-800 p-4 text-center">
                    <div className="text-xs tracking-wider">#1738</div>
                  </div>
                  <div className="border border-gray-800 p-4 text-center">
                    <div className="text-xs tracking-wider">#1737</div>
                  </div>
                  <div className="border border-gray-800 p-4 text-center">
                    <div className="text-xs tracking-wider">#1736</div>
                  </div>
                </div>
                <div className="text-center">
                  <button className="border border-gray-800 px-6 py-3 hover:bg-white hover:text-black transition-all duration-150 tracking-wider">
                    SAVE LAYOUT CONFIGURATION
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-wider mb-6">CONSCIOUSNESS PERFORMANCE ANALYTICS</h2>
            
            {/* Performance Metrics */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="border border-gray-800 p-6 text-center">
                <div className="text-2xl font-bold tracking-wider mb-2">1,740</div>
                <div className="text-xs tracking-wider opacity-50">TOTAL STREAMS</div>
              </div>
              <div className="border border-gray-800 p-6 text-center">
                <div className="text-2xl font-bold tracking-wider mb-2">6/DAY</div>
                <div className="text-xs tracking-wider opacity-50">GENERATION RATE</div>
              </div>
              <div className="border border-gray-800 p-6 text-center">
                <div className="text-2xl font-bold tracking-wider mb-2">87.3</div>
                <div className="text-xs tracking-wider opacity-50">AVG SUE SCORE</div>
              </div>
              <div className="border border-gray-800 p-6 text-center">
                <div className="text-2xl font-bold tracking-wider mb-2">342</div>
                <div className="text-xs tracking-wider opacity-50">LIVE VIEWERS</div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm tracking-wider opacity-50">
                DETAILED ANALYTICS DASHBOARD COMING SOON
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parameters' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-wider mb-6">CONSCIOUSNESS PARAMETERS</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm tracking-wider opacity-50 mb-3">
                    DAILY GENERATION COUNT
                  </label>
                  <input 
                    type="number" 
                    defaultValue="6"
                    className="w-full bg-black border border-gray-800 p-3 text-sm tracking-wider focus:border-white outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm tracking-wider opacity-50 mb-3">
                    CONSCIOUSNESS DEPTH
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="100" 
                    defaultValue="75"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm tracking-wider opacity-50 mb-3">
                    FASHION INFLUENCE WEIGHT
                  </label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="60"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm tracking-wider opacity-50 mb-3">
                    GENERATION STYLE
                  </label>
                  <select className="w-full bg-black border border-gray-800 p-3 text-sm tracking-wider focus:border-white outline-none">
                    <option>CONSCIOUSNESS EXPLORATION</option>
                    <option>FASHION FOCUS</option>
                    <option>ARCHITECTURAL LIGHT</option>
                    <option>IDENTITY DISSOLUTION</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm tracking-wider opacity-50 mb-3">
                    SUE ANALYSIS INTEGRATION
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-sm tracking-wider">REAL-TIME CURATORIAL FEEDBACK</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-sm tracking-wider">PARIS PHOTO SUITABILITY SCORING</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button className="border border-gray-800 px-8 py-4 hover:bg-white hover:text-black transition-all duration-150 tracking-wider">
                SAVE CONSCIOUSNESS PARAMETERS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}