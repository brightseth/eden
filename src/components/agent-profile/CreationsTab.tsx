'use client';

import { useState, useEffect } from 'react';
import { Grid, List, Filter, ShoppingCart, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { getAgentCreations } from '@/lib/db/curations';
import { EdenGallery } from '@/components/agents/solienne/eden-gallery';
import { featureFlags, FLAGS } from '@/config/flags';

interface CreationsTabProps {
  agentId: string;
  agentName: string;
}

export function CreationsTab({ agentId, agentName }: CreationsTabProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [creations, setCreations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'academy' | 'eden'>('academy');
  
  // Check if Eden API is enabled for this agent (currently SOLIENNE only)
  const showEdenIntegration = agentName === 'SOLIENNE' && featureFlags.isEnabled(FLAGS.ENABLE_EDEN_API_INTEGRATION);
  
  useEffect(() => {
    async function loadCreations() {
      setIsLoading(true);
      try {
        // Fetch published works for this agent
        const response = await fetch(`/api/works?agent_id=${agentName.toLowerCase()}&state=published`);
        const data = await response.json();
        
        // Transform works to creation format
        const transformedCreations = (data.works || []).map((work: any) => ({
          id: work.id,
          title: `Day ${work.day}`,
          price: 100, // Default price
          status: 'available',
          image_url: work.media_url,
          created_at: work.created_at,
          day: work.day,
          tags: work.tags,
          collects: work.collects?.[0]?.count || 0
        }));
        
        setCreations(transformedCreations);
      } catch (error) {
        console.error('Failed to load published works:', error);
        setCreations([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadCreations();
  }, [agentName]);
  
  const filteredCreations = creations.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'available') return c.status === 'available';
    if (filter === 'sold') return c.status === 'sold_out';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Creations</h2>
          {showEdenIntegration && (
            <div className="flex gap-1">
              <button
                onClick={() => setActiveSection('academy')}
                className={`px-4 py-1.5 text-xs font-bold tracking-wider transition-colors ${
                  activeSection === 'academy'
                    ? 'bg-white text-black'
                    : 'border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                ACADEMY
              </button>
              <button
                onClick={() => setActiveSection('eden')}
                className={`px-4 py-1.5 text-xs font-bold tracking-wider transition-colors flex items-center gap-2 ${
                  activeSection === 'eden'
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                EDEN.ART
              </button>
            </div>
          )}
          <span className="text-sm text-gray-400">
            {activeSection === 'eden' && showEdenIntegration ? 'Eden creations' : `${filteredCreations.length} items`}
          </span>
        </div>
        
        {activeSection === 'academy' && (
          <div className="flex items-center gap-4">
            {/* Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm"
            >
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
            </select>
            
            {/* View Mode */}
            <div className="flex items-center gap-1 bg-gray-900 rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-700' : ''}`}
                title="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-700' : ''}`}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Conditional Content based on active section */}
      {activeSection === 'academy' ? (
        <>
          {/* Collections Row */}
          <div className="flex gap-4 overflow-x-auto pb-2">
            {['Genesis', 'Consciousness', 'Digital Fashion', 'Experiments'].map((collection) => (
              <button
                key={collection}
                className="flex-shrink-0 px-4 py-2 bg-gray-900 border border-gray-700 rounded hover:border-gray-500 transition-colors text-sm"
              >
                {collection}
              </button>
            ))}
          </div>

          {/* Academy Creations Grid/List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Eye className="w-8 h-8 mx-auto mb-4 animate-pulse" />
                <div className="text-sm text-gray-400">Loading Academy creations...</div>
              </div>
            </div>
          ) : filteredCreations.length > 0 ? (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
                : 'space-y-4'
            }>
              {filteredCreations.map((creation) => (
                <div 
                  key={creation.id}
                  className={`bg-gray-950 border border-gray-800 overflow-hidden rounded-lg hover:border-gray-600 transition-all ${
                    viewMode === 'list' ? 'flex gap-4 p-4' : ''
                  }`}
                >
                  {/* Image */}
                  <div className={viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'}>
                    {creation.image_url?.startsWith('data:') || creation.image_url?.startsWith('http') ? (
                      <img 
                        src={creation.image_url} 
                        alt={creation.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-white/20" />
                      </div>
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className={viewMode === 'list' ? 'flex-1' : 'p-3'}>
                    <h3 className="font-bold text-sm mb-1">{creation.title}</h3>
                    <p className="text-xs text-gray-400 mb-2">{creation.date}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        {creation.status === 'available' ? (
                          <span className="text-sm font-bold">${creation.price}</span>
                        ) : creation.status === 'sold' ? (
                          <span className="text-xs text-red-400">SOLD</span>
                        ) : (
                          <span className="text-xs text-yellow-400">RESERVED</span>
                        )}
                      </div>
                      
                      {creation.status === 'available' && (
                        <button className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded transition-colors">
                          <ShoppingCart className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <h3 className="text-lg font-bold mb-2">No Academy Creations</h3>
              <p className="text-sm text-gray-400 mb-6">
                {agentName} hasn't published any Academy creations yet.
              </p>
            </div>
          )}

          {/* Load More for Academy */}
          {!isLoading && filteredCreations.length > 0 && (
            <div className="text-center py-8">
              <button className="px-6 py-2 bg-gray-900 border border-gray-700 rounded hover:border-gray-500 transition-colors text-sm">
                Load More
              </button>
            </div>
          )}
        </>
      ) : activeSection === 'eden' && showEdenIntegration ? (
        <>
          {/* Eden Creations Section */}
          <div className="border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold tracking-wider">EDEN.ART CREATIONS</h3>
              <a 
                href="https://eden.art/solienne"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs border border-gray-700 px-3 py-1 hover:border-purple-400 transition-colors flex items-center gap-1"
              >
                VIEW ON EDEN
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            <EdenGallery 
              className=""
              maxItems={12}
              showHeader={false}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}