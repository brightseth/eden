'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, TrendingUp, Zap, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface TreasuryData {
  success: boolean;
  agent: string;
  date: string;
  treasury_overview: {
    total_nfts: number;
    total_value_eth: number;
    total_value_usd: number;
    active_collections: number;
    daily_auction_schedule: string;
    citizen_role: string;
    collection_breakdown: {
      [key: string]: {
        owned: number;
        percentage: number;
        estimated_value_eth: number;
        significance: string;
      };
    };
  };
  todays_auction: {
    auction_id: string;
    status: string;
    theme: string;
    featured_work: {
      title: string;
      artist: string;
      collection: string;
      token_id: string;
      image_url: string;
    };
    auction_details: {
      start_time: string;
      end_time: string;
      starting_bid_eth: number;
      current_bid_eth: number;
      bidder_count: number;
      time_remaining: string;
    };
    community_curation: {
      nominated_by: string;
      curatorial_note: string;
      dao_vote_result: string;
      discussion_thread: string;
    };
    cultural_context: {
      historical_significance: string;
      artist_background: string;
      technical_notes: string;
      provenance: string;
    };
  };
  community_impact: {
    auctions_completed_this_month: number;
    total_participation_wallets: number;
    average_daily_engagement: number;
    community_curation_proposals: number;
    dao_treasury_growth: string;
    artist_royalties_distributed: string;
  };
  bright_moments_integration: {
    irl_event_coordination: string;
    cross_city_participation: string;
    cultural_education: string;
    fellowship_building: string;
    lore_preservation: string;
  };
  next_auction: {
    time: string;
    preview_available: string;
    curation_theme: string;
    community_voting_closes: string;
  };
}

export default function CitizenTreasuryPage() {
  const [treasuryData, setTreasuryData] = useState<TreasuryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTreasuryData() {
      try {
        const response = await fetch('/api/agents/citizen/treasury?auction=true');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setTreasuryData(data);
      } catch (error) {
        console.error('Failed to load treasury data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTreasuryData();
    
    // Refresh every 30 seconds for live auction updates
    const interval = setInterval(fetchTreasuryData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Loading CITIZEN Treasury Dashboard...</div>
        </div>
      </div>
    );
  }

  if (!treasuryData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl text-red-400">Failed to load treasury data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/academy/agent/citizen" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO CITIZEN
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl mb-4">BRIGHT MOMENTS TREASURY</h1>
            <p className="text-2xl mb-4">Daily Auction & Community Activation</p>
            <p className="text-lg text-blue-400 mb-8">{treasuryData.treasury_overview.citizen_role}</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-2">{treasuryData.treasury_overview.total_nfts.toLocaleString()}</div>
                <div className="text-sm text-gray-400">TOTAL NFTs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">{treasuryData.treasury_overview.total_value_eth.toLocaleString()}</div>
                <div className="text-sm text-gray-400">ETH VALUE</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">{treasuryData.treasury_overview.active_collections}</div>
                <div className="text-sm text-gray-400">COLLECTIONS</div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">12PM</div>
                <div className="text-sm text-gray-400">DAILY AUCTION</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Live Auction */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8">TODAY'S FEATURED AUCTION</h2>
          <div className="border-2 border-blue-500 bg-blue-900/10 p-8 rounded-lg">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Auction Details */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold text-green-400">{treasuryData.todays_auction.status}</span>
                  <span className="text-sm text-gray-400">#{treasuryData.todays_auction.auction_id}</span>
                </div>
                
                <h3 className="text-3xl font-bold mb-2">{treasuryData.todays_auction.featured_work.title}</h3>
                <p className="text-lg text-blue-400 mb-4">by {treasuryData.todays_auction.featured_work.artist}</p>
                <p className="text-gray-300 mb-6">{treasuryData.todays_auction.theme} Collection</p>
                
                {/* Current Bid */}
                <div className="bg-black border border-white p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">CURRENT BID</span>
                    <span className="text-sm text-gray-400">{treasuryData.todays_auction.auction_details.bidder_count} BIDDERS</span>
                  </div>
                  <div className="text-3xl font-bold text-green-400">
                    {treasuryData.todays_auction.auction_details.current_bid_eth} ETH
                  </div>
                </div>
                
                {/* Time Remaining */}
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-bold">{treasuryData.todays_auction.auction_details.time_remaining}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button className="px-6 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-bold uppercase">
                    PLACE BID
                  </button>
                  <a
                    href={treasuryData.todays_auction.community_curation.discussion_thread}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase"
                  >
                    <ExternalLink className="w-4 h-4" />
                    DISCUSSION
                  </a>
                </div>
              </div>
              
              {/* Artwork Display */}
              <div>
                <div className="aspect-square bg-gray-900 border border-white mb-4 flex items-center justify-center">
                  <img 
                    src={treasuryData.todays_auction.featured_work.image_url}
                    alt={treasuryData.todays_auction.featured_work.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-2">Token #{treasuryData.todays_auction.featured_work.token_id}</p>
                  <p className="text-sm">{treasuryData.todays_auction.community_curation.dao_vote_result}</p>
                </div>
              </div>
            </div>
            
            {/* Curatorial Note */}
            <div className="mt-8 p-6 bg-black border border-gray-600">
              <h4 className="text-lg font-bold mb-2 text-yellow-400">CURATORIAL NOTE</h4>
              <p className="text-gray-300 mb-4">{treasuryData.todays_auction.community_curation.curatorial_note}</p>
              <p className="text-sm text-gray-400">— {treasuryData.todays_auction.community_curation.nominated_by}</p>
            </div>
            
            {/* Cultural Context */}
            <div className="mt-6 grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-bold mb-2 text-blue-400">HISTORICAL SIGNIFICANCE</h4>
                <p className="text-sm text-gray-300">{treasuryData.todays_auction.cultural_context.historical_significance}</p>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-2 text-green-400">ARTIST BACKGROUND</h4>
                <p className="text-sm text-gray-300">{treasuryData.todays_auction.cultural_context.artist_background}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Treasury Overview */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8">TREASURY BREAKDOWN</h2>
          <div className="grid gap-6">
            {Object.entries(treasuryData.treasury_overview.collection_breakdown).map(([category, data]) => (
              <div key={category} className="border border-white p-6 hover:bg-white hover:text-black transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 capitalize">{category.replace(/_/g, ' ')}</h3>
                    <p className="text-gray-300 group-hover:text-gray-700">{data.significance}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400 group-hover:text-blue-600">{data.owned.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-600">{data.percentage}% of treasury</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400 group-hover:text-gray-600">ESTIMATED VALUE</span>
                  <span className="font-bold">{data.estimated_value_eth} ETH</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Impact */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8">COMMUNITY IMPACT</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{treasuryData.community_impact.auctions_completed_this_month}</div>
              <div className="text-sm text-gray-400">AUCTIONS THIS MONTH</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{treasuryData.community_impact.total_participation_wallets.toLocaleString()}</div>
              <div className="text-sm text-gray-400">PARTICIPATING WALLETS</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{treasuryData.community_impact.dao_treasury_growth}</div>
              <div className="text-sm text-gray-400">TREASURY GROWTH</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{treasuryData.community_impact.artist_royalties_distributed}</div>
              <div className="text-sm text-gray-400">ARTIST ROYALTIES</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">{treasuryData.community_impact.community_curation_proposals}</div>
              <div className="text-sm text-gray-400">CURATION PROPOSALS</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{treasuryData.community_impact.average_daily_engagement}</div>
              <div className="text-sm text-gray-400">DAILY ENGAGEMENT</div>
            </div>
          </div>
        </section>

        {/* Next Auction */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8">NEXT AUCTION</h2>
          <div className="border border-gray-600 p-6 bg-gray-900/20">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Tomorrow's Featured Theme</h3>
                <p className="text-2xl text-blue-400 mb-4">{treasuryData.next_auction.curation_theme}</p>
                <div className="space-y-2 text-sm text-gray-300">
                  <div>⏰ Auction starts: {treasuryData.next_auction.time}</div>
                  <div>👀 Preview access: {treasuryData.next_auction.preview_available}</div>
                  <div>🗳️ Community voting closes: {treasuryData.next_auction.community_voting_closes}</div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <Link
                  href="/academy/agent/citizen/daily-practice"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black transition-all font-bold uppercase tracking-wider mb-4"
                >
                  <Calendar className="w-5 h-5" />
                  VIEW DAILY PRACTICE
                </Link>
                <Link
                  href="/academy/agent/citizen/collections"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider"
                >
                  EXPLORE COLLECTIONS
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}