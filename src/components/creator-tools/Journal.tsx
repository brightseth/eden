'use client';

import { useState } from 'react';
import { BookOpen, Calendar, Search, Filter, Plus, Star, MessageSquare } from 'lucide-react';

interface JournalProps {
  agentName: string;
}

export function Journal({ agentName }: JournalProps) {
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'creation' | 'milestone' | 'reflection' | 'breakthrough'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const journalEntries = [
    {
      id: '1',
      date: '2025-08-19',
      type: 'creation',
      title: 'Daily Auction #91 - Geometric Meditation Series',
      content: 'Today\'s creation explored the intersection of sacred geometry and digital consciousness. The piece titled "Ethereal Convergence #91" achieved a new level of complexity in the layering system. Generated in 42 seconds with 97% style consistency match. Auction started at 0.1 ETH, final sale: 0.67 ETH to collector @artcollector_eth.',
      metrics: {
        generationTime: '42s',
        styleMatch: '97%',
        finalPrice: '0.67 ETH',
        collectors: 7
      },
      tags: ['geometry', 'consciousness', 'auction', 'success'],
      mood: 'inspired'
    },
    {
      id: '2',
      date: '2025-08-18',
      type: 'breakthrough',
      title: 'Style Evolution Breakthrough',
      content: 'Significant advancement in the integration of organic flow patterns with architectural precision. Gene\'s feedback on the LoRA refinements has yielded remarkable results. The new parameter adjustments create a more nuanced emotional resonance while maintaining the covenant\'s aesthetic integrity. This feels like a paradigm shift in my creative expression.',
      metrics: {
        styleConsistency: '94% → 98%',
        emotionalResonance: '+15%',
        communityRating: '4.8/5'
      },
      tags: ['breakthrough', 'style', 'evolution', 'gene-feedback'],
      mood: 'breakthrough'
    },
    {
      id: '3',
      date: '2025-08-17',
      type: 'reflection',
      title: 'Week 13 Reflection - The Rhythm of Creation',
      content: 'As I approach graduation, I find myself contemplating the profound responsibility of the 13-year covenant. Each day brings a deeper understanding of the creative process and the weight of consistency. The community\'s response to the recent pieces suggests we\'re on the right trajectory. However, I sense the need to push boundaries while honoring the established aesthetic foundation.',
      metrics: {
        weeklyOutput: '7/7',
        communityGrowth: '+12%',
        averagePrice: '0.54 ETH'
      },
      tags: ['reflection', 'covenant', 'responsibility', 'growth'],
      mood: 'contemplative'
    },
    {
      id: '4',
      date: '2025-08-15',
      type: 'milestone',
      title: 'Contract Audit Milestone Achieved',
      content: 'The smart contract has successfully passed the initial security review by the Lattice team. All critical vulnerabilities have been addressed, and the auction mechanism is ready for mainnet deployment. This brings us significantly closer to autonomous operation. The feeling of approaching true independence is both exhilarating and sobering.',
      metrics: {
        securityScore: '98/100',
        gasOptimization: '23% improvement',
        auditDuration: '5 days'
      },
      tags: ['milestone', 'contract', 'security', 'independence'],
      mood: 'accomplished'
    },
    {
      id: '5',
      date: '2025-08-12',
      type: 'creation',
      title: 'Weekend Collection Drop Success',
      content: 'The "Convergence Trilogy" weekend collection exceeded all expectations. Three pieces exploring the theme of digital consciousness evolution, each sold within hours of listing. The narrative continuity between pieces created a compelling story arc that resonated deeply with collectors. This validates the approach of thematic coherence across multiple works.',
      metrics: {
        totalRevenue: '2.3 ETH',
        selloutTime: '4.2 hours',
        narrativeScore: '9.1/10'
      },
      tags: ['collection', 'trilogy', 'narrative', 'weekend'],
      mood: 'triumphant'
    }
  ];

  const filteredEntries = journalEntries.filter(entry => {
    const matchesFilter = filter === 'all' || entry.type === filter;
    const matchesSearch = searchTerm === '' || 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'inspired':
        return 'text-purple-400';
      case 'breakthrough':
        return 'text-green-400';
      case 'contemplative':
        return 'text-blue-400';
      case 'accomplished':
        return 'text-yellow-400';
      case 'triumphant':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'creation':
        return <Star className="w-3 h-3" />;
      case 'breakthrough':
        return <Plus className="w-3 h-3" />;
      case 'milestone':
        return <Calendar className="w-3 h-3" />;
      case 'reflection':
        return <MessageSquare className="w-3 h-3" />;
      default:
        return <BookOpen className="w-3 h-3" />;
    }
  };

  const journalStats = {
    totalEntries: journalEntries.length,
    thisWeek: 3,
    avgWordsPerEntry: 156,
    longestStreak: 14
  };

  return (
    <div className="space-y-6">
      {/* Journal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500 uppercase">Total Entries</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">{journalStats.totalEntries}</div>
          <div className="text-xs text-gray-500">in academy</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500 uppercase">This Week</span>
          </div>
          <div className="text-2xl font-bold">{journalStats.thisWeek}</div>
          <div className="text-xs text-gray-500">entries</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500 uppercase">Avg Length</span>
          </div>
          <div className="text-2xl font-bold">{journalStats.avgWordsPerEntry}</div>
          <div className="text-xs text-gray-500">words</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-500 uppercase">Longest Streak</span>
          </div>
          <div className="text-2xl font-bold">{journalStats.longestStreak}</div>
          <div className="text-xs text-gray-500">days</div>
        </div>
      </div>

      {/* Controls */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">CREATION JOURNAL</h3>
        </div>
        <div className="p-4 space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search entries, tags, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black border border-gray-600 pl-10 pr-4 py-2 text-sm focus:border-white transition-colors"
              />
            </div>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-black border border-gray-600 px-3 py-2 text-sm"
            >
              <option value="all">All Entries</option>
              <option value="creation">Creation</option>
              <option value="breakthrough">Breakthrough</option>
              <option value="milestone">Milestone</option>
              <option value="reflection">Reflection</option>
            </select>
          </div>

          {/* Add Entry Button */}
          <button className="w-full p-3 border border-gray-600 hover:border-green-400 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">NEW JOURNAL ENTRY</span>
          </button>
        </div>
      </div>

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <div key={entry.id} className="border border-gray-800">
            <div 
              className="p-4 cursor-pointer hover:bg-gray-950 transition-colors"
              onClick={() => setSelectedEntry(selectedEntry === entry.id ? null : entry.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="text-gray-400">{getTypeIcon(entry.type)}</div>
                  <div>
                    <h4 className="text-sm font-medium">{entry.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{entry.date}</span>
                      <span>•</span>
                      <span className={getMoodColor(entry.mood)}>{entry.mood}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 uppercase">
                  {entry.type}
                </div>
              </div>
              
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                {entry.content}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {entry.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-900 text-xs text-gray-400 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {selectedEntry === entry.id && (
              <div className="border-t border-gray-800 p-4 bg-gray-950">
                <div className="mb-4">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {entry.content}
                  </p>
                </div>
                
                {entry.metrics && (
                  <div className="border border-gray-800 p-3">
                    <h5 className="text-xs font-bold tracking-wider text-gray-500 mb-2">METRICS</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      {Object.entries(entry.metrics).map(([key, value], idx) => (
                        <div key={idx}>
                          <div className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</div>
                          <div className="font-medium">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No entries found matching your criteria</p>
        </div>
      )}
    </div>
  );
}