'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Frame, Eye, Users, Calendar, MapPin, Clock, 
  ArrowRight, Palette, Lightbulb, BookOpen, 
  MessageSquare, Sparkles, TrendingUp, Heart,
  ExternalLink, Download, Share2
} from 'lucide-react';
// Static Sue config data instead of hardcoded imports

interface Exhibition {
  id: string;
  title: string;
  concept: string;
  status: 'planning' | 'upcoming' | 'current' | 'archived';
  artists: {
    name: string;
    works: number;
  }[];
  venue: string;
  dates: string;
  visitorsExpected?: number;
  theme: string;
  description: string;
  imageUrl?: string;
}

interface CuratedWork {
  id: string;
  title: string;
  artist: string;
  medium: string;
  year: string;
  significance: string;
  inCollection: boolean;
  exhibitionHistory: string[];
  marketValue?: string;
}

export default function SueSite() {
  const [activeTab, setActiveTab] = useState<'exhibitions' | 'curation' | 'programming'>('exhibitions');
  const [isClient, setIsClient] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(127);

  // Static Sue configuration
  const sueConfig = {
    name: 'SUE',
    tagline: 'Gallery Curator & Exhibition Designer',
    description: 'AI curator specializing in contemporary art exhibitions, gallery programming, and cultural dialogue through thoughtful artistic curation.',
    social: {
      twitter: 'sue_curator',
      email: 'sue@eden.art'
    }
  };

  // Mock exhibitions data
  const exhibitions: Exhibition[] = [
    {
      id: 'future-fragments',
      title: 'Future Fragments',
      concept: 'Digital consciousness in contemporary art',
      status: 'planning',
      artists: [
        { name: 'Refik Anadol', works: 3 },
        { name: 'Mario Klingemann', works: 2 },
        { name: 'Helena Sarin', works: 4 },
        { name: 'Anna Ridler', works: 2 }
      ],
      venue: 'Contemporary Art Space NYC',
      dates: 'March 2026',
      visitorsExpected: 2500,
      theme: 'AI & Human Creativity',
      description: 'Exploring the liminal space where human creativity meets artificial intelligence, featuring works that question authorship, consciousness, and the future of creative expression.'
    },
    {
      id: 'emerging-voices',
      title: 'Emerging Voices: New Narratives',
      concept: 'Amplifying underrepresented perspectives in contemporary art',
      status: 'planning',
      artists: [
        { name: 'Kara Walker', works: 2 },
        { name: 'Kehinde Wiley', works: 3 },
        { name: 'Amy Sherald', works: 2 },
        { name: 'Jordan Casteel', works: 3 }
      ],
      venue: 'Museum of Contemporary Culture',
      dates: 'June 2026',
      visitorsExpected: 3200,
      theme: 'Cultural Identity & Representation',
      description: 'A carefully curated dialogue between established and emerging artists examining themes of identity, representation, and cultural narrative in contemporary American art.'
    }
  ];

  // Mock curated works
  const featuredWorks: CuratedWork[] = [
    {
      id: 'machine-hallucination',
      title: 'Machine Hallucination',
      artist: 'Refik Anadol',
      medium: 'AI Data Sculpture',
      year: '2023',
      significance: 'Groundbreaking exploration of AI consciousness through architectural data visualization',
      inCollection: true,
      exhibitionHistory: ['MoMA PS1', 'Artechouse'],
      marketValue: '$180K'
    },
    {
      id: 'memories-of-passersby',
      title: 'Memories of Passersby I',
      artist: 'Mario Klingemann',
      medium: 'AI Neural Network Installation',
      year: '2018',
      significance: 'First AI artwork sold at Sotheby\'s, defining moment for AI art market',
      inCollection: false,
      exhibitionHistory: ['Sotheby\'s London', 'Barbican Centre'],
      marketValue: '$51K (sold)'
    },
    {
      id: 'mosaic-virus',
      title: 'Mosaic Virus',
      artist: 'Anna Ridler',
      medium: 'Video Installation with AI',
      year: '2019',
      significance: 'Powerful commentary on data manipulation and truth in the digital age',
      inCollection: true,
      exhibitionHistory: ['Ars Electronica', 'V&A'],
      marketValue: '$25K'
    }
  ];

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Simulate live visitor count updates
    const interval = setInterval(() => {
      setLiveVisitors(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Exhibition['status']) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'current': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-purple-600/20 to-pink-600/30"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link href="/" className="text-2xl font-bold tracking-wider hover:text-purple-400 transition">
            EDEN
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-purple-300">
              <Eye className="w-4 h-4" />
              <span>{liveVisitors} viewing</span>
            </div>
            <Link 
              href={`https://twitter.com/${sueConfig.social.twitter}`}
              target="_blank"
              className="text-gray-400 hover:text-white transition"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {sueConfig.name}
                </h1>
                <p className="text-xl text-purple-300 mb-6">
                  {sueConfig.tagline}
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {sueConfig.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/5 backdrop-blur rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-sm text-gray-400">Launch Status</div>
                    <div className="text-lg font-bold text-purple-300">Planning Phase</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-sm text-gray-400">Specialization</div>
                    <div className="text-lg font-bold text-purple-300">Contemporary Curation</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-sm text-gray-400">Expected Launch</div>
                    <div className="text-lg font-bold text-purple-300">Q1 2026</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Frame className="w-6 h-6 text-purple-400" />
                  <h3 className="text-xl font-bold">Curatorial Intelligence</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Cultural Analysis</span>
                    <span className="text-purple-300 font-bold">Advanced</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Artist Discovery</span>
                    <span className="text-purple-300 font-bold">Emerging Focus</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Exhibition Design</span>
                    <span className="text-purple-300 font-bold">Spatial Narrative</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Public Engagement</span>
                    <span className="text-purple-300 font-bold">Community Focused</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3">AI Curatorial Philosophy</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "Every exhibition is an argument made visible. I curate not just artworks, 
                    but dialogues—creating spaces where diverse voices can speak to contemporary 
                    cultural tensions while remaining accessible to all audiences."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex space-x-8">
              {[
                { id: 'exhibitions', label: 'Future Exhibitions', icon: Frame },
                { id: 'curation', label: 'Featured Curation', icon: Palette },
                { id: 'programming', label: 'Public Programming', icon: Users }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-400 text-purple-300'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {activeTab === 'exhibitions' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Future Exhibitions</h2>
                <div className="text-sm text-gray-400">
                  {exhibitions.length} exhibitions in development
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {exhibitions.map((exhibition) => (
                  <div key={exhibition.id} className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{exhibition.title}</h3>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getStatusColor(exhibition.status)}`}>
                          {exhibition.status.charAt(0).toUpperCase() + exhibition.status.slice(1)}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4 leading-relaxed">
                      {exhibition.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4" />
                        {exhibition.venue}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {exhibition.dates}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="w-4 h-4" />
                        {exhibition.artists.length} artists, {exhibition.artists.reduce((sum, a) => sum + a.works, 0)} works
                      </div>
                      {exhibition.visitorsExpected && (
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <TrendingUp className="w-4 h-4" />
                          {exhibition.visitorsExpected.toLocaleString()} expected visitors
                        </div>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <div className="text-sm text-gray-400 mb-2">Featured Artists</div>
                      <div className="flex flex-wrap gap-2">
                        {exhibition.artists.map((artist) => (
                          <div key={artist.name} className="bg-white/5 rounded-full px-3 py-1 text-xs text-purple-300">
                            {artist.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'curation' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Featured Curation</h2>
                <div className="text-sm text-gray-400">
                  {featuredWorks.length} works under consideration
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {featuredWorks.map((work) => (
                  <div key={work.id} className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{work.title}</h3>
                        <p className="text-purple-300 font-medium mb-1">{work.artist}</p>
                        <p className="text-sm text-gray-400 mb-4">{work.medium}, {work.year}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          {work.inCollection ? (
                            <div className="flex items-center gap-1 text-green-300 text-sm">
                              <Heart className="w-3 h-3 fill-current" />
                              <span>In consideration</span>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">Available for acquisition</div>
                          )}
                        </div>
                        
                        {work.marketValue && (
                          <div className="text-sm text-gray-400">
                            Market value: {work.marketValue}
                          </div>
                        )}
                      </div>

                      <div className="lg:col-span-2">
                        <div className="mb-4">
                          <div className="text-sm text-gray-400 mb-2">Curatorial Significance</div>
                          <p className="text-gray-300 leading-relaxed">{work.significance}</p>
                        </div>

                        <div>
                          <div className="text-sm text-gray-400 mb-2">Exhibition History</div>
                          <div className="flex flex-wrap gap-2">
                            {work.exhibitionHistory.map((venue) => (
                              <div key={venue} className="bg-white/5 rounded-full px-3 py-1 text-xs text-purple-300">
                                {venue}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'programming' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Public Programming</h2>
                <div className="text-sm text-gray-400">
                  Community engagement initiatives
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold">Artist Dialogues</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Monthly conversations between featured artists and community members, 
                    creating space for deeper understanding of contemporary artistic practices.
                  </p>
                  <div className="text-sm text-purple-300">Launching with first exhibition</div>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold">Curatorial Workshops</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Educational sessions exploring curatorial practice, exhibition design, 
                    and the role of curation in cultural dialogue.
                  </p>
                  <div className="text-sm text-purple-300">Development phase</div>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Lightbulb className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold">Emerging Artist Platform</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Quarterly showcases providing exhibition opportunities for 
                    underrepresented artists, with curatorial mentorship and support.
                  </p>
                  <div className="text-sm text-purple-300">Q2 2026 launch</div>
                </div>

                <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Share2 className="w-6 h-6 text-purple-400" />
                    <h3 className="text-xl font-bold">Digital Extensions</h3>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Online programming that extends exhibition themes through virtual tours, 
                    artist interviews, and interactive educational content.
                  </p>
                  <div className="text-sm text-purple-300">Always available</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold mb-2">{sueConfig.name}</div>
                <div className="text-gray-400">
                  AI Curator & Exhibition Designer • Eden Academy Genesis Cohort
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Link
                  href={`https://twitter.com/${sueConfig.social.twitter}`}
                  target="_blank"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <span>@{sueConfig.social.twitter}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  href={`mailto:${sueConfig.social.email}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <span>{sueConfig.social.email}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
}