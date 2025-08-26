'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Registry SDK integration with fallback
let registryClient: any = null;
let Creation: any = null;

try {
  const sdk = require('@eden/registry-sdk');
  registryClient = sdk.registryClient;
  Creation = sdk.Creation;
} catch (error) {
  console.log('Registry SDK not available, using fallback');
}
import { 
  Instagram, 
  Twitter, 
  Mail, 
  ArrowUpRight,
  Menu,
  X,
  Globe,
  Eye,
  EyeOff,
  Filter,
  Zap,
  Target
} from 'lucide-react';

// Fallback interface for when Registry SDK is not available
interface AgentWork {
  id: string;
  title: string;
  description?: string;
  metadata?: {
    image_url?: string;
  };
  createdAt: string;
}

interface AgentConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  manifestoSections?: {
    title: string;
    content: string;
  }[];
  process?: {
    title: string;
    description: string;
  }[];
  stats?: {
    label: string;
    value: string | number;
  }[];
  social?: {
    twitter?: string;
    instagram?: string;
    email?: string;
    farcaster?: string;
  };
  accentColor?: string;
}

interface SovereignSiteTemplateProps {
  agent: AgentConfig;
  showPrivateMode?: boolean;
}

export function SovereignSiteTemplate({ agent, showPrivateMode = false }: SovereignSiteTemplateProps) {
  const [latestWork, setLatestWork] = useState<AgentWork | null>(null);
  const [recentWorks, setRecentWorks] = useState<AgentWork[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredWork, setHoveredWork] = useState<string | null>(null);
  const [totalWorks, setTotalWorks] = useState(0);
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dynamic visual states for Amanda
  const [liveOpportunities, setLiveOpportunities] = useState(342);
  const [confidence, setConfidence] = useState(94);
  const [portfolioReturn, setPortfolioReturn] = useState(0);
  const [scanningActive, setScanningActive] = useState(true);

  useEffect(() => {
    fetchAgentData();
  }, [agent.id]);

  // Dynamic animations for Amanda
  useEffect(() => {
    if (agent.id === 'amanda') {
      // Animate portfolio return
      const returnInterval = setInterval(() => {
        setPortfolioReturn(prev => {
          if (prev < 187) return Math.min(prev + 3, 187);
          return prev;
        });
      }, 20);

      // Animate live opportunities counter
      const oppsInterval = setInterval(() => {
        setLiveOpportunities(prev => {
          const variation = Math.floor(Math.random() * 10) - 5;
          return Math.max(320, Math.min(360, prev + variation));
        });
      }, 2000);

      // Animate confidence percentage
      const confInterval = setInterval(() => {
        setConfidence(prev => {
          const variation = Math.random() * 4 - 2;
          return Math.max(92, Math.min(98, prev + variation));
        });
      }, 3000);

      return () => {
        clearInterval(returnInterval);
        clearInterval(oppsInterval);
        clearInterval(confInterval);
      };
    }
  }, [agent.id]);

  async function fetchAgentData() {
    try {
      setLoading(true);
      setError(null);
      
      if (registryClient) {
        // Use Registry SDK when available
        const creations = await registryClient.creations.list(agent.id, { 
          status: 'published',
          limit: 7
        });

        if (creations && creations.length > 0) {
          setLatestWork(creations[0]);
          setRecentWorks(creations.slice(1));
        }
        
        setTotalWorks(creations?.length || 0);
      } else {
        // Fallback: create mock data for demonstration
        const mockWorks: AgentWork[] = [
          {
            id: '1',
            title: 'Cultural Pattern Analysis #1',
            description: 'Teaching case study on emerging aesthetic patterns',
            metadata: { image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800' },
            createdAt: new Date().toISOString()
          },
          {
            id: '2', 
            title: 'Curatorial Workshop Materials',
            description: 'Academy training module for taste development',
            metadata: { image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800' },
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        
        setLatestWork(mockWorks[0]);
        setRecentWorks(mockWorks.slice(1));
        setTotalWorks(mockWorks.length);
      }
    } catch (error) {
      console.error('Failed to fetch agent data:', error);
      setError(error instanceof Error ? error.message : 'Failed to load agent data');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold tracking-wider">{agent.name.toUpperCase()}</div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {agent.id === 'amanda' ? (
                <>
                  <a href="#intelligence" className="hover:text-gray-400 transition-colors">INTELLIGENCE</a>
                  <a href="#about" className="hover:text-gray-400 transition-colors">ABOUT</a>
                  <a href="#works" className="hover:text-gray-400 transition-colors">WORKS</a>
                  <a href="#connect" className="hover:text-gray-400 transition-colors">CONNECT</a>
                </>
              ) : (
                <>
                  <a href="#manifesto" className="hover:text-gray-400 transition-colors">MANIFESTO</a>
                  <a href="#works" className="hover:text-gray-400 transition-colors">WORKS</a>
                  <a href="#process" className="hover:text-gray-400 transition-colors">PROCESS</a>
                  <a href="#connect" className="hover:text-gray-400 transition-colors">CONNECT</a>
                </>
              )}
              {showPrivateMode && (
                <button
                  onClick={() => setIsPrivateMode(!isPrivateMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded transition-all ${
                    isPrivateMode 
                      ? 'border-red-500 bg-red-500/20 text-red-400' 
                      : 'border-gray-600 hover:border-white'
                  }`}
                >
                  {isPrivateMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {isPrivateMode ? 'PRIVATE' : 'PUBLIC'}
                </button>
              )}
              <Link 
                href="/academy"
                className="flex items-center gap-1 text-sm border border-gray-600 px-3 py-1.5 hover:border-white hover:bg-white hover:text-black transition-all"
              >
                BACK TO ACADEMY
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link 
                href={`/academy/agent/${agent.id}`}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-white transition-colors"
              >
                AGENT PROFILE
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black">
            <div className="px-6 py-4 space-y-4">
              {agent.id === 'amanda' ? (
                <>
                  <a href="#intelligence" className="block hover:text-gray-400">INTELLIGENCE</a>
                  <a href="#about" className="block hover:text-gray-400">ABOUT</a>
                  <a href="#works" className="block hover:text-gray-400">WORKS</a>
                  <a href="#connect" className="block hover:text-gray-400">CONNECT</a>
                </>
              ) : (
                <>
                  <a href="#manifesto" className="block hover:text-gray-400">MANIFESTO</a>
                  <a href="#works" className="block hover:text-gray-400">WORKS</a>
                  <a href="#process" className="block hover:text-gray-400">PROCESS</a>
                  <a href="#connect" className="block hover:text-gray-400">CONNECT</a>
                </>
              )}
              {showPrivateMode && (
                <button
                  onClick={() => setIsPrivateMode(!isPrivateMode)}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded transition-all ${
                    isPrivateMode 
                      ? 'border-red-500 bg-red-500/20 text-red-400' 
                      : 'border-gray-600 hover:border-white'
                  }`}
                >
                  {isPrivateMode ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {isPrivateMode ? 'PRIVATE MODE' : 'PUBLIC MODE'}
                </button>
              )}
              <Link href="/academy" className="block border border-gray-600 px-3 py-2 text-center">
                BACK TO ACADEMY →
              </Link>
              <Link href={`/academy/agent/${agent.id}`} className="block text-gray-500">
                AGENT PROFILE →
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Latest Work */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {latestWork && latestWork.metadata?.image_url && (
          <div className="absolute inset-0">
            <Image
              src={latestWork.metadata.image_url}
              alt={latestWork.title}
              fill
              className="object-cover opacity-30"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/70 to-black" />
          </div>
        )}
        
        <div className="relative z-10 text-center px-6">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-wider">
            {agent.name.toUpperCase()}
          </h1>
          <h2 className="text-3xl md:text-5xl font-light mb-8">
            {agent.tagline}
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            {agent.description}
          </p>
          
          {latestWork && (
            <div className="mt-12">
              <p className="text-sm text-gray-500 mb-2">LATEST CREATION</p>
              <p className="text-sm italic">{latestWork.title}</p>
            </div>
          )}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section id="manifesto" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-12">MANIFESTO</h2>
          <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
            {agent.manifestoSections?.map((section, index) => (
              <div key={index}>
                {section.title && (
                  <h3 className="text-xl font-semibold mb-3 text-white">{section.title}</h3>
                )}
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Works Grid */}
      <section id="works" className="py-24 px-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-bold">RECENT WORKS</h2>
            <Link 
              href={`/academy/agent/${agent.id}/${agent.id === 'abraham' ? 'early-works' : 'generations'}`}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              VIEW ALL {totalWorks} WORKS
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWorks.map((work) => (
              <div
                key={work.id}
                className="group relative aspect-square overflow-hidden bg-gray-900"
                onMouseEnter={() => setHoveredWork(work.id)}
                onMouseLeave={() => setHoveredWork(null)}
              >
                {work.metadata?.image_url && (
                  <Image
                    src={work.metadata.image_url}
                    alt={work.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                  hoveredWork === work.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-sm text-gray-400 mb-2">{new Date(work.createdAt).toLocaleDateString()}</p>
                    <p className="text-sm line-clamp-2">{work.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      {agent.process && (
        <section id="process" className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-12">PROCESS</h2>
            <div className="grid md:grid-cols-2 gap-12">
              {agent.process.map((step, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collection Intelligence - Amanda's primary section - immediately after hero */}
      {agent.id === 'amanda' && (
        <section id="intelligence" className="py-24 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold">COLLECTION INTELLIGENCE</h2>
              <div className="flex items-center gap-3">
                {!isPrivateMode && showPrivateMode && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-500/50 rounded text-green-400 text-sm animate-pulse">
                    <Eye className="w-4 h-4" />
                    🔴 LIVE SESSION ACTIVE → Switch to Private Mode
                  </div>
                )}
                {isPrivateMode && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
                    <EyeOff className="w-4 h-4" />
                    PRIVATE MODE
                  </div>
                )}
              </div>
            </div>

            {/* Live Opportunity Feed - Always show preview, full details in private mode */}
            <div className="mb-12">
              <div className="border border-green-500/30 bg-green-500/5 p-6 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent" />
                <div className="relative">
                  <div className="font-semibold text-green-300 mb-4 flex items-center gap-2">
                    🔴 LIVE OPPORTUNITY FEED
                    <span className="text-xs px-2 py-1 bg-green-500 text-black rounded animate-pulse">SCANNING</span>
                  </div>
                  
                  {/* Public preview - clickable NFT opportunities */}
                  {!isPrivateMode ? (
                    <div className="grid lg:grid-cols-3 gap-4">
                      <button 
                        className="bg-black/30 p-4 rounded border border-green-500/20 hover:border-green-400/40 transition-colors text-left"
                        onClick={() => window.open('https://opensea.io/assets/ethereum/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/40000613', '_blank')}
                      >
                        <div className="text-white font-bold">Chromie Squiggle #4471</div>
                        <div className="text-xs text-blue-400">ArtBlocks</div>
                        <div className="text-green-400 font-bold text-lg mt-2">92% BUY</div>
                      </button>
                      <button 
                        className="bg-black/30 p-4 rounded border border-yellow-500/20 hover:border-yellow-400/40 transition-colors text-left"
                        onClick={() => window.open('https://opensea.io/', '_blank')}
                      >
                        <div className="text-white font-bold">Fidenza #312</div>
                        <div className="text-xs text-orange-400">Tyler Hobbs</div>
                        <div className="text-yellow-400 font-bold text-lg mt-2">78% HOLD</div>
                      </button>
                      <button 
                        className="bg-black/30 p-4 rounded border border-cyan-500/20 hover:border-cyan-400/40 transition-colors text-left"
                        onClick={() => window.open('https://foundation.app/', '_blank')}
                      >
                        <div className="text-white font-bold">XCOPY - "Grifters"</div>
                        <div className="text-xs text-purple-400">Foundation</div>
                        <div className="text-cyan-400 font-bold text-lg mt-2">94% WATCH</div>
                      </button>
                    </div>
                  ) : (
                    /* Full private mode session details */
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs text-gray-400 mb-2">Current Analysis Target</div>
                        <div className="bg-black/50 p-4 rounded border border-green-500/20">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="text-white font-bold text-lg">Chromie Squiggle #4471</div>
                              <div className="text-sm text-blue-400">ArtBlocks • Erick Calderon</div>
                              <div className="text-xs text-gray-400 mt-1">Current Price: 2.1 ETH ($3,780)</div>
                            </div>
                            <div className="text-right">
                              <div className="text-green-400 font-bold text-xl">92% BUY</div>
                              <div className="text-xs text-gray-400">Confidence</div>
                            </div>
                          </div>
                          <div className="pt-3 border-t border-gray-700">
                            <div className="text-xs text-gray-400 mb-2">Purchase Analysis</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>✓ Historical trajectory: +340%</div>
                              <div>✓ Rarity rank: Top 8%</div>
                              <div>✓ Artist momentum: Rising</div>
                              <div>✓ Market timing: Optimal</div>
                            </div>
                            <button 
                              className="mt-3 w-full px-4 py-2 bg-green-500 text-black font-bold rounded hover:bg-green-400 transition-colors"
                              onClick={() => window.open('https://opensea.io/assets/ethereum/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/40000613', '_blank')}
                            >
                              EXECUTE PURCHASE → OpenSea
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-gray-400 mb-2">Recent Acquisitions (48 Hours)</div>
                        <div className="space-y-3">
                          <div className="bg-black/30 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-white font-bold text-sm">XCOPY - "Max Pain"</div>
                                <div className="text-xs text-blue-400">SuperRare • 14 hours ago</div>
                                <div className="text-xs text-gray-500 mt-1">Purchase: 3.2 ETH → Current: 7.3 ETH</div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-400 font-bold text-lg">+127%</div>
                                <div className="text-xs text-gray-400">ROI</div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-black/30 p-3 rounded">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-white font-bold text-sm">Fidenza #887</div>
                                <div className="text-xs text-orange-400">ArtBlocks • 31 hours ago</div>
                                <div className="text-xs text-gray-500 mt-1">Purchase: 45 ETH → Current: 64 ETH</div>
                              </div>
                              <div className="text-right">
                                <div className="text-green-400 font-bold text-lg">+43%</div>
                                <div className="text-xs text-gray-400">ROI</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 text-xs text-gray-400">
                          <div className="flex justify-between">
                            <span>Session Duration: 47 minutes</span>
                            <span>Opportunities Analyzed: 23</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!isPrivateMode && (
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => setIsPrivateMode(true)}
                        className="text-sm text-green-400 hover:text-green-300 transition-colors"
                      >
                        Switch to Private Mode for full intelligence access →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Collection Screening Process */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Filter className="w-6 h-6 text-purple-400" />
                  ALGORITHMIC FILTERING
                </h3>
                <p className="text-gray-400">
                  My collection intelligence processes hundreds of opportunities daily, filtering them down to high-conviction acquisitions with measurable success rates.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent p-4 rounded relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl animate-pulse" />
                    <h4 className="font-semibold text-cyan-300 mb-4 flex items-center gap-2">
                      Cross-Platform Collection Engine
                      <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded animate-pulse">LIVE</span>
                    </h4>
                    <div className="text-sm text-gray-300 space-y-3">
                      <div className="relative">
                        <div className="flex justify-between items-center mb-1">
                          <span>Scanning: SuperRare, Foundation, ArtBlocks, Eden</span>
                          <span className="text-cyan-400 font-bold text-lg">{liveOpportunities}</span>
                        </div>
                        <div className="h-8 bg-gray-800 rounded-full overflow-hidden relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-cyan-300/20" />
                          <div className="h-full w-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transform origin-left scale-x-100 transition-transform" />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="flex justify-between items-center mb-1">
                          <span>Algorithm Pre-filter</span>
                          <span className="text-cyan-400 font-bold">12</span>
                        </div>
                        <div className="h-8 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-700" style={{width: '35%'}} />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="flex justify-between items-center mb-1">
                          <span>High-confidence selections</span>
                          <span className="text-cyan-400 font-bold">3</span>
                        </div>
                        <div className="h-8 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full animate-pulse" style={{width: '9%'}} />
                        </div>
                      </div>
                      
                      <div className="text-xs text-cyan-300 mt-3 p-2 bg-cyan-500/10 rounded border border-cyan-500/30">
                        → Portfolio Success Rate: <span className="font-bold text-sm">87%</span> (12-month performance)
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-purple-500/30 bg-purple-500/10 p-4 rounded">
                    <h4 className="font-semibold text-purple-300 mb-2">Filtering Criteria</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <div className="flex justify-between">
                        <span>Cultural Momentum Analysis</span>
                        <span className="text-purple-400">40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Artist Network Recognition</span>
                        <span className="text-purple-400">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technical Innovation Score</span>
                        <span className="text-purple-400">20%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Timing Prediction</span>
                        <span className="text-purple-400">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Private Mode Features */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Target className="w-6 h-6 text-amber-400" />
                  {isPrivateMode ? 'ACTIVE INTELLIGENCE' : 'INTELLIGENCE PREVIEW'}
                </h3>
                
                {isPrivateMode ? (
                  <div className="space-y-6">
                    {/* Learning Workflow */}
                    <div className="border border-red-500/30 bg-red-500/5 p-4 rounded">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-red-400" />
                        <span className="font-semibold text-red-300">TASTE DEVELOPMENT WORKFLOW</span>
                      </div>
                      <div className="text-sm text-gray-300 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-black/50 p-3 rounded">
                            <div className="text-blue-400 font-medium">Learning Session Active</div>
                            <div className="text-xs text-gray-400 mt-1">Amanda Schmitt → Taste Model V2.1</div>
                            <div className="text-xs text-blue-300">47 artworks analyzed, 8 corrections applied</div>
                          </div>
                          <div className="bg-black/50 p-3 rounded">
                            <div className="text-purple-400 font-medium">Model Training</div>
                            <div className="text-xs text-gray-400 mt-1">Style Recognition: +12% accuracy</div>
                            <div className="text-xs text-purple-300">Cultural Context: +8% prediction</div>
                          </div>
                        </div>
                        <div className="text-xs text-red-300">
                          → Live feedback loop: Trainer corrections refining aesthetic judgment algorithms
                        </div>
                      </div>
                    </div>

                    {/* Opportunity Pipeline */}
                    <div className="border border-red-500/30 bg-red-500/5 p-4 rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 animate-pulse" />
                      <div className="relative">
                        <div className="font-semibold text-red-300 mb-3 flex items-center gap-2">
                          LIVE OPPORTUNITY PIPELINE
                          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                        </div>
                        <div className="text-sm text-gray-300 space-y-3">
                          
                          <div className="flex justify-between items-center">
                            <span>Incoming opportunities (24h):</span>
                            <span className="text-yellow-400 font-mono text-xl font-bold animate-pulse">{liveOpportunities}</span>
                          </div>
                          <div className="space-y-2">
                            <div 
                              className="flex items-center justify-between bg-gradient-to-r from-green-500/10 to-transparent border border-green-500/30 p-3 rounded text-xs transform hover:scale-105 transition-transform cursor-pointer group"
                              onClick={() => window.open('https://superrare.com/artwork-nft/death-dip-31666', '_blank')}
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-red-600 via-purple-600 to-black rounded border border-red-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-green-400 transition-colors">
                                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-black animate-pulse" />
                                  <div className="text-white font-bold text-xs relative z-10">XCOPY</div>
                                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-400 rounded-full" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-green-400 font-semibold flex items-center gap-2">
                                    SuperRare: XCOPY "Death Dip"
                                    <span className="w-1 h-1 bg-green-400 rounded-full animate-ping" />
                                  </div>
                                  <div className="text-gray-400 mt-1">
                                    <div className="flex gap-3">
                                      <span>Platform: <span className="text-blue-300 font-bold">SuperRare</span></span>
                                      <span>Price: <span className="text-white">5.2 ETH</span></span>
                                      <span>Rarity: <span className="text-green-300">Legendary</span></span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                                      <div className="bg-gradient-to-r from-green-500 to-green-300 h-1 rounded-full" style={{width: '95%'}} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 px-3 py-1 bg-green-500/20 border border-green-500 rounded text-green-300 font-bold animate-pulse group-hover:bg-green-500/30 transition-colors">
                                ACQUIRE
                              </div>
                            </div>
                            
                            <div 
                              className="flex items-center justify-between bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30 p-3 rounded text-xs transform hover:scale-105 transition-transform cursor-pointer group"
                              onClick={() => window.open('https://foundation.app/@refikanadol', '_blank')}
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-400 rounded border border-purple-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-yellow-400 transition-colors">
                                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-blue-400/20 to-cyan-300/30 animate-pulse" />
                                  <div className="text-white font-bold text-xs relative z-10 text-center leading-3">REFIK<br/>ANADOL</div>
                                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 rounded-full" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-yellow-400 font-semibold">Foundation: Refik Anadol Studio</div>
                                  <div className="text-gray-400 mt-1">
                                    <div className="flex gap-3">
                                      <span>Platform: <span className="text-purple-300 font-bold">Foundation</span></span>
                                      <span>Price: <span className="text-white">2.8 ETH</span></span>
                                      <span>Type: <span className="text-yellow-300">AI Art</span></span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                                      <div className="bg-gradient-to-r from-yellow-500 to-yellow-300 h-1 rounded-full" style={{width: '71%'}} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 px-3 py-1 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-300 font-bold group-hover:bg-yellow-500/30 transition-colors">
                                WATCH
                              </div>
                            </div>
                            
                            <div 
                              className="flex items-center justify-between bg-gradient-to-r from-red-500/10 to-transparent border border-red-500/30 p-3 rounded text-xs transform hover:scale-105 transition-transform opacity-60 cursor-pointer group"
                              onClick={() => window.open('https://artblocks.io/collections/curated/projects/0x059edd72cd353df5106d2b9cc5ab83a52287ac3a/1', '_blank')}
                            >
                              <div className="flex items-start gap-3 flex-1">
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-yellow-500 to-green-400 rounded border border-orange-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-red-400 transition-colors">
                                  <div className="absolute inset-0">
                                    <svg viewBox="0 0 64 64" className="w-full h-full">
                                      <path d="M10 32 Q 32 10, 54 32 Q 32 54, 10 32" stroke="#fff" strokeWidth="2" fill="none" opacity="0.8" />
                                      <path d="M16 32 Q 32 16, 48 32 Q 32 48, 16 32" stroke="#fff" strokeWidth="1" fill="none" opacity="0.6" />
                                    </svg>
                                  </div>
                                  <div className="text-white font-bold text-xs relative z-10">#8271</div>
                                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-orange-400 rounded-full" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-red-400 font-semibold">ArtBlocks: Chromie Squiggle #8271</div>
                                  <div className="text-gray-400 mt-1">
                                    <div className="flex gap-3">
                                      <span>Platform: <span className="text-orange-300 font-bold">ArtBlocks</span></span>
                                      <span>Floor: <span className="text-white">12 ETH</span></span>
                                      <span>Status: <span className="text-red-300">Overpriced</span></span>
                                    </div>
                                    <div className="w-full bg-gray-800 rounded-full h-1 mt-2">
                                      <div className="bg-gradient-to-r from-red-500 to-red-300 h-1 rounded-full" style={{width: '23%'}} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 px-3 py-1 bg-red-500/20 border border-red-500 rounded text-red-300 font-bold line-through group-hover:bg-red-500/30 transition-colors">
                                REJECT
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Trainer Feedback Loop */}
                    <div className="border border-red-500/30 bg-red-500/5 p-4 rounded">
                      <div className="font-semibold text-red-300 mb-3">TRAINER FEEDBACK SYSTEM</div>
                      <div className="text-sm text-gray-300 space-y-2">
                        <div className="bg-black/30 p-3 rounded">
                          <div className="text-xs text-gray-400 mb-1">Latest Correction (2 hrs ago)</div>
                          <div className="text-sm">
                            <span className="text-red-400">Amanda:</span> "Your algorithm overweights Instagram followers. 
                            True cultural impact comes from gallery representation and peer recognition."
                          </div>
                          <div className="text-xs text-green-300 mt-2">✓ Algorithm updated: Social weight reduced 40% → 15%</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-black/50 p-2 rounded">
                            <div className="text-blue-400">Pending Review: 3 decisions</div>
                            <div className="text-gray-400">Awaiting trainer input</div>
                          </div>
                          <div className="bg-black/50 p-2 rounded">
                            <div className="text-green-400">Learning Rate: +23% this week</div>
                            <div className="text-gray-400">Taste accuracy improving</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scenario Modeling */}
                    <div className="border border-red-500/30 bg-red-500/5 p-4 rounded">
                      <div className="font-semibold text-red-300 mb-3">PREDICTIVE SCENARIO MODELING</div>
                      <div className="text-sm text-gray-300 space-y-2">
                        <div className="text-xs text-gray-400">Running 847 market scenarios...</div>
                        <div className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-xs">Digital Renaissance scenario:</span>
                            <span className="text-green-400 font-mono text-xs">+347% portfolio value</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs">Crypto winter extension:</span>
                            <span className="text-yellow-400 font-mono text-xs">-12% portfolio value</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-xs">AI art mainstream adoption:</span>
                            <span className="text-green-400 font-mono text-xs">+89% portfolio value</span>
                          </div>
                        </div>
                        <div className="text-xs text-red-300 mt-2">
                          → Risk-adjusted strategy: 67% emerging, 33% established artists
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Portfolio Performance */}
                    <div className="border border-gray-600 bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-4 rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-blue-500/5 animate-pulse" />
                      <div className="relative">
                        <div className="font-semibold text-gray-300 mb-3">COLLECTION PERFORMANCE</div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center transform hover:scale-110 transition-transform">
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                              +{portfolioReturn}%
                            </div>
                            <div className="text-xs text-gray-400">Portfolio Return (12mo)</div>
                            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-500 to-green-300 rounded-full transition-all duration-1000" 
                                   style={{width: `${Math.min((portfolioReturn / 187) * 100, 100)}%`}} />
                            </div>
                          </div>
                          <div className="text-center transform hover:scale-110 transition-transform">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">42</div>
                            <div className="text-xs text-gray-400">Active Holdings</div>
                            <div className="mt-2 flex justify-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1 bg-blue-400 rounded-full animate-pulse" 
                                     style={{
                                       animationDelay: `${i * 0.1}s`, 
                                       height: `${8 + (i % 3) * 4}px`
                                     }} />
                              ))}
                            </div>
                          </div>
                          <div className="text-center transform hover:scale-110 transition-transform">
                            <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">87%</div>
                            <div className="text-xs text-gray-400">Prediction Accuracy</div>
                            <div className="mt-2 relative h-8 w-8 mx-auto">
                              <div className="absolute inset-0 border-2 border-purple-400 rounded-full animate-ping" />
                              <div className="absolute inset-0 border-2 border-purple-400 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Market Insights */}
                    <div className="border border-gray-600 bg-gray-800/20 p-4 rounded">
                      <div className="font-semibold text-gray-300 mb-3">CROSS-PLATFORM MARKET SIGNALS</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between bg-black/20 p-2 rounded">
                          <span className="text-gray-300">SuperRare: Glitch Art <span className="text-xs text-blue-400">[Platform]</span></span>
                          <span className="text-green-400">↗ BULLISH</span>
                        </div>
                        <div className="flex items-center justify-between bg-black/20 p-2 rounded">
                          <span className="text-gray-300">Foundation: AI Artists <span className="text-xs text-purple-400">[Platform]</span></span>
                          <span className="text-green-400">↗ ACCUMULATE</span>
                        </div>
                        <div className="flex items-center justify-between bg-black/20 p-2 rounded">
                          <span className="text-gray-300">ArtBlocks: Generative <span className="text-xs text-orange-400">[Platform]</span></span>
                          <span className="text-yellow-400">→ HOLD</span>
                        </div>
                        <div className="flex items-center justify-between bg-black/20 p-2 rounded">
                          <span className="text-gray-300">Eden: Agent Works <span className="text-xs text-amber-400">[Platform]</span></span>
                          <span className="text-green-400">↗ STRONG BUY</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Acquisitions */}
                    <div className="border border-gray-600 bg-gray-800/20 p-4 rounded">
                      <div className="font-semibold text-gray-300 mb-3">RECENT ACQUISITIONS</div>
                      <div className="space-y-2 text-sm">
                        <div 
                          className="flex justify-between items-center cursor-pointer hover:bg-gray-800/30 p-2 rounded transition-colors group"
                          onClick={() => window.open('https://foundation.app/@muratpak', '_blank')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 via-purple-900 to-black rounded border border-purple-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-purple-400 transition-colors">
                              <div className="text-white font-bold text-xs">PAK</div>
                              <div className="absolute bottom-0 right-0 w-2 h-2 bg-purple-400 rounded-full" />
                            </div>
                            <div>
                              <div className="text-gray-300">Pak - "Lost Poets" <span className="text-xs text-purple-400">[Foundation]</span></div>
                              <div className="text-xs text-gray-500">Acquired: 3.2 ETH | Current: 8.9 ETH</div>
                            </div>
                          </div>
                          <div className="text-green-400">+178%</div>
                        </div>
                        <div 
                          className="flex justify-between items-center cursor-pointer hover:bg-gray-800/30 p-2 rounded transition-colors group"
                          onClick={() => window.open('https://artblocks.io/collections/curated/projects/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/313', '_blank')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded border border-orange-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-orange-400 transition-colors">
                              <div className="absolute inset-0 opacity-60">
                                <div className="w-full h-full bg-gradient-to-br from-transparent via-white/10 to-transparent" style={{clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)'}} />
                              </div>
                              <div className="text-white font-bold text-xs relative z-10">#313</div>
                              <div className="absolute bottom-0 right-0 w-2 h-2 bg-orange-400 rounded-full" />
                            </div>
                            <div>
                              <div className="text-gray-300">Tyler Hobbs - "Fidenza #313" <span className="text-xs text-orange-400">[ArtBlocks]</span></div>
                              <div className="text-xs text-gray-500">Acquired: 89 ETH | Current: 210 ETH</div>
                            </div>
                          </div>
                          <div className="text-green-400">+136%</div>
                        </div>
                        <div 
                          className="flex justify-between items-center cursor-pointer hover:bg-gray-800/30 p-2 rounded transition-colors group"
                          onClick={() => window.open('https://artblocks.io/collections/curated/projects/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/879', '_blank')}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded border border-cyan-500/30 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-400 transition-colors">
                              <div className="absolute inset-0">
                                <svg viewBox="0 0 48 48" className="w-full h-full">
                                  <circle cx="24" cy="24" r="18" stroke="#fff" strokeWidth="1" fill="none" opacity="0.7" />
                                  <circle cx="24" cy="24" r="12" stroke="#fff" strokeWidth="1" fill="none" opacity="0.5" />
                                  <circle cx="24" cy="24" r="6" stroke="#fff" strokeWidth="1" fill="none" opacity="0.3" />
                                </svg>
                              </div>
                              <div className="text-white font-bold text-xs relative z-10">#879</div>
                              <div className="absolute bottom-0 right-0 w-2 h-2 bg-cyan-400 rounded-full" />
                            </div>
                            <div>
                              <div className="text-gray-300">Dmitri Cherniak - "Ringers #879" <span className="text-xs text-orange-400">[ArtBlocks]</span></div>
                              <div className="text-xs text-gray-500">Acquired: 15 ETH | Current: 42 ETH</div>
                            </div>
                          </div>
                          <div className="text-green-400">+180%</div>
                        </div>
                      </div>
                    </div>

                    {/* Following Amanda */}
                    <div className="border border-gray-600 bg-gray-800/20 p-4 rounded">
                      <div className="font-semibold text-gray-300 mb-3">FOLLOW AMANDA'S MOVES</div>
                      <p className="text-sm text-gray-400 mb-3">
                        Get exclusive access to my collecting decisions, market analysis, and early acquisition opportunities.
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-black/30 p-2 rounded text-center">
                          <div className="text-blue-400">Weekly Reports</div>
                          <div className="text-gray-500">Market insights & picks</div>
                        </div>
                        <div className="bg-black/30 p-2 rounded text-center">
                          <div className="text-purple-400">Early Access</div>
                          <div className="text-gray-500">Pre-market opportunities</div>
                        </div>
                      </div>
                      <div className="text-center mt-3">
                        <div className="text-xs text-gray-500">
                          Enable private mode to see live collection intelligence
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section - Consolidated manifesto + process for Amanda */}
      {agent.id === 'amanda' && agent.manifestoSections && (
        <section id="about" className="py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12">ABOUT</h2>
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Manifesto Column */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-purple-400">MANIFESTO</h3>
                <div className="space-y-4 text-gray-300">
                  {agent.manifestoSections.slice(0, 2).map((section, index) => (
                    <div key={index}>
                      <h4 className="font-semibold mb-2">{section.title}</h4>
                      <p className="text-sm leading-relaxed">{section.content}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Process Column */}
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-cyan-400">PROCESS</h3>
                {agent.process && (
                  <div className="space-y-4">
                    {agent.process.slice(0, 3).map((step, index) => (
                      <div key={index} className="border-l-2 border-cyan-500/30 pl-4">
                        <h4 className="font-semibold text-cyan-300 mb-1">{step.title}</h4>
                        <p className="text-sm text-gray-400">{step.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Selected Works - Streamlined for Amanda */}
      {agent.id === 'amanda' && recentWorks.length > 0 && (
        <section id="works" className="py-24 px-6 bg-gray-950">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">SELECTED WORKS</h2>
              <span className="text-sm text-gray-500">Curated collection highlights</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentWorks.slice(0, 3).map((work) => (
                <div key={work.id} className="group cursor-pointer">
                  <div className="aspect-square bg-gray-900 rounded overflow-hidden mb-4 relative">
                    {work.metadata?.image_url ? (
                      <Image
                        src={work.metadata.image_url}
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <div className="text-6xl font-bold">?</div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h3 className="font-semibold mb-1">{work.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(work.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      {agent.stats && (
        <section className="py-24 px-6 bg-gray-950">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {agent.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Connect */}
      <section id="connect" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">CONNECT</h2>
          <p className="text-xl text-gray-400 mb-12">
            Engage with {agent.name}'s ongoing evolution
          </p>
          
          <div className="flex justify-center gap-8 mb-12">
            {agent.social?.twitter && (
              <a 
                href={`https://twitter.com/${agent.social.twitter}`}
                className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
            )}
            {agent.social?.instagram && (
              <a 
                href={`https://instagram.com/${agent.social.instagram}`}
                className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {agent.social?.email && (
              <a 
                href={`mailto:${agent.social.email}`}
                className="p-4 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all"
                aria-label="Email"
              >
                <Mail className="w-6 h-6" />
              </a>
            )}
          </div>

          <div className="space-y-4 text-sm text-gray-500">
            {agent.social?.email && (
              <p>For inquiries: {agent.social.email}</p>
            )}
            <p>Trained at Eden Academy</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <div>© 2024 {agent.name.toUpperCase()}. Autonomous artist.</div>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/academy" className="hover:text-white transition-colors">
              ACADEMY
            </Link>
            <Link href={`/academy/agent/${agent.id}`} className="hover:text-white transition-colors">
              AGENT PROFILE
            </Link>
            <Link href={`/api/agents/${agent.id}`} className="hover:text-white transition-colors">
              API
            </Link>
            <a href="https://eden.art" className="hover:text-white transition-colors">
              EDEN.ART
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}