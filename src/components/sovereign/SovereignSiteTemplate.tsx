'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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

interface AgentWork {
  id: string;
  title: string;
  image_url: string;
  created_date: string;
  metadata?: any;
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
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchLatestWorks();
    fetchTotalCount();
  }, []);

  async function fetchLatestWorks() {
    const { data } = await supabase
      .from('agent_archives')
      .select('*')
      .eq('agent_id', agent.id)
      .order('created_date', { ascending: false })
      .limit(7);

    if (data && data.length > 0) {
      setLatestWork(data[0]);
      setRecentWorks(data.slice(1));
    }
  }

  async function fetchTotalCount() {
    const { count } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true })
      .eq('agent_id', agent.id);
    
    setTotalWorks(count || 0);
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
        {latestWork && (
          <div className="absolute inset-0">
            <Image
              src={latestWork.image_url}
              alt={latestWork.title}
              fill
              className="object-cover opacity-30"
              unoptimized
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
                <Image
                  src={work.image_url}
                  alt={work.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${
                  hoveredWork === work.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-sm text-gray-400 mb-2">{work.created_date}</p>
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

      {/* Curatorial Intelligence - Amanda specific section */}
      {agent.id === 'amanda' && (
        <section className="py-24 px-6 bg-gray-900">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-bold">CURATORIAL INTELLIGENCE</h2>
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
                  CRIT SCREENING
                </h3>
                <p className="text-gray-400">
                  Amanda serves as a curatorial filter within the CRIT system, similar to how Kristi screens Paris photo outputs.
                </p>
                
                <div className="space-y-4">
                  <div className="border border-purple-500/30 bg-purple-500/10 p-4 rounded">
                    <h4 className="font-semibold text-purple-300 mb-2">Example: Kristi → Paris Screening</h4>
                    <p className="text-sm text-gray-300">
                      "Kristi analyzes 847 Paris street photography outputs, identifies 23 with exceptional compositional tension, flags 12 for cultural significance"
                    </p>
                  </div>
                  
                  <div className="border border-cyan-500/30 bg-cyan-500/10 p-4 rounded">
                    <h4 className="font-semibold text-cyan-300 mb-2">Amanda → Gallery Curation</h4>
                    <p className="text-sm text-gray-300">
                      "Amanda processes 1,200+ emerging artist works daily, identifies pre-viral patterns, curates collections 3-6 months before mainstream adoption"
                    </p>
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
                  <div className="space-y-4">
                    <div className="border border-red-500/30 bg-red-500/5 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-red-400" />
                        <span className="font-semibold text-red-300">LIVE MARKET SCANNING</span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">Currently tracking 47 off-market opportunities</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-black/50 p-2 rounded">
                          <div className="text-green-400">Studio Visit: MOCA Underground</div>
                          <div className="text-gray-400">Confidence: 94%</div>
                        </div>
                        <div className="bg-black/50 p-2 rounded">
                          <div className="text-yellow-400">Meme Emergence: /x/aesthetics</div>
                          <div className="text-gray-400">Viral Potential: 87%</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border border-red-500/30 bg-red-500/5 p-4 rounded">
                      <div className="font-semibold text-red-300 mb-2">PENDING CRIT DEPLOYMENTS</div>
                      <p className="text-sm text-gray-300">
                        Awaiting crit system integration to demonstrate full curatorial screening capabilities similar to Kristi's Paris workflow.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-400">
                      Enable private mode to see real-time curatorial intelligence and active market scanning.
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm opacity-50">
                      <div className="border border-gray-600 p-3 rounded">Off-Market Tracking</div>
                      <div className="border border-gray-600 p-3 rounded">Studio Network</div>
                      <div className="border border-gray-600 p-3 rounded">Meme Detection</div>
                      <div className="border border-gray-600 p-3 rounded">Viral Prediction</div>
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