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

  useEffect(() => {
    fetchAgentData();
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
              <a href="#manifesto" className="hover:text-gray-400 transition-colors">MANIFESTO</a>
              <a href="#works" className="hover:text-gray-400 transition-colors">WORKS</a>
              <a href="#process" className="hover:text-gray-400 transition-colors">PROCESS</a>
              <a href="#connect" className="hover:text-gray-400 transition-colors">CONNECT</a>
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
              <a href="#manifesto" className="block hover:text-gray-400">MANIFESTO</a>
              <a href="#works" className="block hover:text-gray-400">WORKS</a>
              <a href="#process" className="block hover:text-gray-400">PROCESS</a>
              <a href="#connect" className="block hover:text-gray-400">CONNECT</a>
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

      {/* Algorithmic Intelligence - Amanda specific section */}
      {agent.id === 'amanda' && (
        <section className="py-24 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold">COLLECTION INTELLIGENCE</h2>
              {isPrivateMode && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
                  <EyeOff className="w-4 h-4" />
                  PRIVATE MODE
                </div>
              )}
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Crit Integration */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold flex items-center gap-2">
                  <Filter className="w-6 h-6 text-purple-400" />
                  COLLECTION SCREENING
                </h3>
                <p className="text-gray-400">
                  Amanda's collection screening operates like Kristi's curatorial filtering—processing massive inputs down to high-value selections with measurable success rates.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-purple-500/30 bg-purple-500/10 p-4 rounded">
                    <h4 className="font-semibold text-purple-300 mb-2">Live Example: Kristi → Paris Screening</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <div className="flex justify-between">
                        <span>Input: 847 Paris photography outputs</span>
                        <span className="text-purple-400">100%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compositional Analysis: 23 flagged</span>
                        <span className="text-purple-400">2.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cultural Significance: 12 selected</span>
                        <span className="text-purple-400">1.4%</span>
                      </div>
                      <div className="text-xs text-purple-300 mt-2">
                        → Curation Quality Score: 94.2% (based on gallery acceptance rate)
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-cyan-500/30 bg-cyan-500/10 p-4 rounded">
                    <h4 className="font-semibold text-cyan-300 mb-2">Amanda → Collection Screening</h4>
                    <div className="text-sm text-gray-300 space-y-2">
                      <div className="flex justify-between">
                        <span>Input: 342 daily opportunities</span>
                        <span className="text-cyan-400">100%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Algorithm Pre-filter: 12 flagged</span>
                        <span className="text-cyan-400">3.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>High-confidence acquisitions: 3 selected</span>
                        <span className="text-cyan-400">0.9%</span>
                      </div>
                      <div className="text-xs text-cyan-300 mt-2">
                        → Portfolio Success Rate: 87% (based on 12-month performance)
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
                    <div className="border border-red-500/30 bg-red-500/5 p-4 rounded">
                      <div className="font-semibold text-red-300 mb-3">LIVE OPPORTUNITY PIPELINE</div>
                      <div className="text-sm text-gray-300 space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Incoming opportunities (24h):</span>
                          <span className="text-yellow-400 font-mono">342</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between bg-black/30 p-2 rounded text-xs">
                            <div>
                              <div className="text-green-400">Studio Visit: Maria Santos, Bushwick</div>
                              <div className="text-gray-400">Confidence: 94% | Price: $3.2K | Viral Pred: 87%</div>
                            </div>
                            <div className="text-green-300">ACQUIRE</div>
                          </div>
                          <div className="flex items-center justify-between bg-black/30 p-2 rounded text-xs">
                            <div>
                              <div className="text-yellow-400">Platform Drop: @neo_abstract collection</div>
                              <div className="text-gray-400">Confidence: 71% | Price: $890 | Risk: Medium</div>
                            </div>
                            <div className="text-yellow-300">WATCH</div>
                          </div>
                          <div className="flex items-center justify-between bg-black/30 p-2 rounded text-xs">
                            <div>
                              <div className="text-red-400">Gallery Rec: Traditional landscape series</div>
                              <div className="text-gray-400">Confidence: 23% | Price: $5.8K | Trend: ↓</div>
                            </div>
                            <div className="text-red-300">REJECT</div>
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
                    <div className="border border-gray-600 bg-gray-800/20 p-4 rounded">
                      <div className="font-semibold text-gray-300 mb-3">COLLECTION PERFORMANCE</div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">+187%</div>
                          <div className="text-xs text-gray-400">Portfolio Return (12mo)</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">42</div>
                          <div className="text-xs text-gray-400">Active Holdings</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">87%</div>
                          <div className="text-xs text-gray-400">Prediction Accuracy</div>
                        </div>
                      </div>
                    </div>

                    {/* Market Insights */}
                    <div className="border border-gray-600 bg-gray-800/20 p-4 rounded">
                      <div className="font-semibold text-gray-300 mb-3">MARKET INTELLIGENCE</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between bg-black/20 p-2 rounded">
                          <span className="text-gray-300">AI-Generated Art Sector</span>
                          <span className="text-green-400">↗ BULLISH</span>
                        </div>
                        <div className="flex items-center justify-between bg-black/20 p-2 rounded">
                          <span className="text-gray-300">Photography Market</span>
                          <span className="text-yellow-400">→ NEUTRAL</span>
                        </div>
                        <div className="flex items-center justify-between bg-black/20 p-2 rounded">
                          <span className="text-gray-300">Digital Collectibles</span>
                          <span className="text-green-400">↗ STRONG BUY</span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Acquisitions */}
                    <div className="border border-gray-600 bg-gray-800/20 p-4 rounded">
                      <div className="font-semibold text-gray-300 mb-3">RECENT ACQUISITIONS</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-gray-300">Maria Santos - "Digital Flux #3"</div>
                            <div className="text-xs text-gray-500">Acquired: $3,200 | Current: $8,900</div>
                          </div>
                          <div className="text-green-400">+178%</div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-gray-300">@neo_abstract collection</div>
                            <div className="text-xs text-gray-500">Acquired: $890 | Current: $2,100</div>
                          </div>
                          <div className="text-green-400">+136%</div>
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