'use client';

<<<<<<< HEAD
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
      opensea_link?: string;
    };
    auction_details: {
      start_time: string;
      end_time: string;
      starting_bid_eth: number;
      current_bid_eth: number;
      floor_price_eth?: number;
      bidder_count: number;
      time_remaining: string;
    };
    market_data?: {
      collection_floor: number;
      collection_volume_24h: number | null;
      collection_owners: number | null;
      opensea_verified: boolean;
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
=======
import Link from 'next/link';
import { ArrowLeft, Coins, Clock, Wallet } from 'lucide-react';
import { useWalletAuth } from '@/lib/auth/privy-provider';
import { useState } from 'react';

export default function CitizenTreasuryPage() {
  const { isAuthenticated, walletAddress, login, isLoading } = useWalletAuth();
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({});
  const [bidding, setBidding] = useState<Record<string, boolean>>({});

  const handleBid = async (assetId: string, minBid: number) => {
    if (!isAuthenticated) {
      login();
      return;
    }

    const bidAmount = parseFloat(bidAmounts[assetId] || '0');
    if (bidAmount < minBid) {
      alert(`Minimum bid is ${minBid} ETH`);
      return;
    }

    setBidding(prev => ({ ...prev, [assetId]: true }));
    
    try {
      // Simulate bid transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Bid of ${bidAmount} ETH placed successfully for ${assetId}!`);
      setBidAmounts(prev => ({ ...prev, [assetId]: '' }));
    } catch (error) {
      alert('Bid failed. Please try again.');
    } finally {
      setBidding(prev => ({ ...prev, [assetId]: false }));
    }
  };

  const updateBidAmount = (assetId: string, amount: string) => {
    setBidAmounts(prev => ({ ...prev, [assetId]: amount }));
  };
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link 
            href="/academy/agent/citizen" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors"
>>>>>>> origin/feature/agent-quality
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO CITIZEN
          </Link>
        </div>
      </div>

      {/* Header */}
<<<<<<< HEAD
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
=======
      <div className="border-b border-white bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-5xl font-bold">CITIZEN TREASURY</h1>
                <span className="bg-green-500 text-black font-bold px-3 py-1 text-sm">LIVE</span>
              </div>
              <p className="text-xl text-gray-300">
                Daily treasury activations from the CryptoCitizens & Bright Moments collection
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-400">1:23:45</div>
              <div className="text-sm text-gray-400">NEXT ACTIVATION</div>
            </div>
          </div>

          {/* Treasury Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 p-4 rounded border border-white/20">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-gray-400">ACTIVE AUCTIONS</div>
            </div>
            <div className="bg-white/10 p-4 rounded border border-white/20">
              <div className="text-2xl font-bold">8.2 ETH</div>
              <div className="text-sm text-gray-400">TOTAL VOLUME</div>
            </div>
            <div className="bg-white/10 p-4 rounded border border-white/20">
              <div className="text-2xl font-bold">25</div>
              <div className="text-sm text-gray-400">TOTAL BIDS</div>
            </div>
            <div className="bg-white/10 p-4 rounded border border-white/20">
              <div className="text-2xl font-bold">12:00 EST</div>
              <div className="text-sm text-gray-400">DAILY SCHEDULE</div>
>>>>>>> origin/feature/agent-quality
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
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
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {treasuryData.todays_auction.auction_details.current_bid_eth} ETH
                  </div>
                  {treasuryData.todays_auction.auction_details.floor_price_eth && (
                    <div className="text-sm text-gray-400">
                      Floor: {treasuryData.todays_auction.auction_details.floor_price_eth.toFixed(3)} ETH
                    </div>
                  )}
                  {treasuryData.todays_auction.market_data?.opensea_verified && (
                    <div className="flex items-center gap-1 mt-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-xs text-blue-400">OpenSea Verified</span>
                    </div>
                  )}
                </div>
                
                {/* Time Remaining */}
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-lg font-bold">{treasuryData.todays_auction.auction_details.time_remaining}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 flex-wrap">
                  <button className="px-6 py-3 border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all font-bold uppercase">
                    PLACE BID
                  </button>
                  {treasuryData.todays_auction.featured_work.opensea_link && (
                    <a
                      href={treasuryData.todays_auction.featured_work.opensea_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black transition-all font-bold uppercase"
                    >
                      <ExternalLink className="w-4 h-4" />
                      VIEW ON OPENSEA
                    </a>
                  )}
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
                  <p className="text-sm mb-4">{treasuryData.todays_auction.community_curation.dao_vote_result}</p>
                  
                  {/* Market Data */}
                  {treasuryData.todays_auction.market_data && (
                    <div className="border-t border-gray-600 pt-4 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Collection Floor:</span>
                        <span className="font-bold">{treasuryData.todays_auction.market_data.collection_floor.toFixed(3)} ETH</span>
                      </div>
                      {treasuryData.todays_auction.market_data.collection_volume_24h && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">24h Volume:</span>
                          <span>{treasuryData.todays_auction.market_data.collection_volume_24h.toFixed(1)} ETH</span>
                        </div>
                      )}
                      {treasuryData.todays_auction.market_data.collection_owners && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">Owners:</span>
                          <span>{treasuryData.todays_auction.market_data.collection_owners.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  )}
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
=======
      {/* Wallet Connection Status */}
      <div className={`border-b border-white ${isAuthenticated ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Wallet className={`w-8 h-8 ${isAuthenticated ? 'text-green-500' : 'text-blue-500'}`} />
              <div>
                {isAuthenticated ? (
                  <>
                    <h3 className="text-xl font-bold">Wallet Connected</h3>
                    <p className="text-gray-300">
                      {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">Connect Wallet to Participate</h3>
                    <p className="text-gray-300">Connect your wallet to bid on treasury assets</p>
                  </>
                )}
              </div>
            </div>
            {!isAuthenticated ? (
              <button 
                onClick={login}
                disabled={isLoading}
                className="bg-blue-500 text-black hover:bg-blue-400 font-bold px-8 py-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </button>
            ) : (
              <div className="text-right">
                <div className="text-sm text-gray-400">READY TO BID</div>
                <div className="text-lg font-bold text-green-400">✓ Connected</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Auctions */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">TODAY'S TREASURY ACTIVATION</h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Daily reset at 12:00 PM EST</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Asset 1 */}
            <div className="border border-white bg-white/5 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-800 relative">
                <div className="absolute top-4 left-4">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                    CryptoCitizens
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 rounded p-2 text-center">
                    <div className="text-lg font-bold text-red-400">1:23:45</div>
                    <div className="text-xs text-gray-400">TIME REMAINING</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">CryptoCitizen #4789</h3>
                <p className="text-sm text-gray-400 mb-4">Venice minting ceremony participant with rare golden halo trait</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Bid:</span>
                    <span className="font-bold">2.4 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Minimum Bid:</span>
                    <span className="font-bold text-yellow-400">2.5 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Bids:</span>
                    <span className="font-bold">12</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          min="2.5"
                          placeholder="2.5 ETH min"
                          value={bidAmounts['citizen-4789'] || ''}
                          onChange={(e) => updateBidAmount('citizen-4789', e.target.value)}
                          className="flex-1 bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <span className="text-sm text-gray-400 flex items-center">ETH</span>
                      </div>
                      <button 
                        onClick={() => handleBid('citizen-4789', 2.5)}
                        disabled={bidding['citizen-4789'] || !bidAmounts['citizen-4789'] || parseFloat(bidAmounts['citizen-4789'] || '0') < 2.5}
                        className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-3 rounded disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {bidding['citizen-4789'] ? 'Placing Bid...' : 'Place Bid'}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={login}
                      className="w-full bg-blue-500 text-black hover:bg-blue-400 font-bold py-3 rounded transition-colors"
                    >
                      Connect Wallet to Bid
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Asset 2 */}
            <div className="border border-white bg-white/5 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-800 relative">
                <div className="absolute top-4 left-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Bright Moments
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 rounded p-2 text-center">
                    <div className="text-lg font-bold text-red-400">2:45:12</div>
                    <div className="text-xs text-gray-400">TIME REMAINING</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Memories of Berlin</h3>
                <p className="text-sm text-gray-400 mb-4">Final piece from the Berlin gallery closing ceremony</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Bid:</span>
                    <span className="font-bold">0.8 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Minimum Bid:</span>
                    <span className="font-bold text-yellow-400">0.85 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Bids:</span>
                    <span className="font-bold">5</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0.85"
                          placeholder="0.85 ETH min"
                          value={bidAmounts['berlin-memories'] || ''}
                          onChange={(e) => updateBidAmount('berlin-memories', e.target.value)}
                          className="flex-1 bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <span className="text-sm text-gray-400 flex items-center">ETH</span>
                      </div>
                      <button 
                        onClick={() => handleBid('berlin-memories', 0.85)}
                        disabled={bidding['berlin-memories'] || !bidAmounts['berlin-memories'] || parseFloat(bidAmounts['berlin-memories'] || '0') < 0.85}
                        className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-3 rounded disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {bidding['berlin-memories'] ? 'Placing Bid...' : 'Place Bid'}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={login}
                      className="w-full bg-blue-500 text-black hover:bg-blue-400 font-bold py-3 rounded transition-colors"
                    >
                      Connect Wallet to Bid
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Asset 3 */}
            <div className="border border-white bg-white/5 rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-800 relative">
                <div className="absolute top-4 left-4">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                    BM25 Utility
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/80 rounded p-2 text-center">
                    <div className="text-lg font-bold text-red-400">4:15:33</div>
                    <div className="text-xs text-gray-400">TIME REMAINING</div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">BM25 Token Bundle</h3>
                <p className="text-sm text-gray-400 mb-4">1000 BM25 tokens + exclusive community access</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Bid:</span>
                    <span className="font-bold">0.15 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Minimum Bid:</span>
                    <span className="font-bold text-yellow-400">0.2 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Bids:</span>
                    <span className="font-bold">8</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          step="0.01"
                          min="0.2"
                          placeholder="0.2 ETH min"
                          value={bidAmounts['bm25-bundle'] || ''}
                          onChange={(e) => updateBidAmount('bm25-bundle', e.target.value)}
                          className="flex-1 bg-gray-800 border border-gray-600 px-3 py-2 rounded text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                        />
                        <span className="text-sm text-gray-400 flex items-center">ETH</span>
                      </div>
                      <button 
                        onClick={() => handleBid('bm25-bundle', 0.2)}
                        disabled={bidding['bm25-bundle'] || !bidAmounts['bm25-bundle'] || parseFloat(bidAmounts['bm25-bundle'] || '0') < 0.2}
                        className="w-full bg-yellow-400 text-black hover:bg-yellow-300 font-bold py-3 rounded disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {bidding['bm25-bundle'] ? 'Placing Bid...' : 'Place Bid'}
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={login}
                      className="w-full bg-blue-500 text-black hover:bg-blue-400 font-bold py-3 rounded transition-colors"
                    >
                      Connect Wallet to Bid
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-6 border-t border-white bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">How Treasury Activation Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Daily Drops</h3>
              <p className="text-sm text-gray-400">
                Every day at 12:00 PM EST, CITIZEN activates new treasury assets for community bidding
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Bidding</h3>
              <p className="text-sm text-gray-400">
                CryptoCitizens holders and BM25 token holders can participate in treasury auctions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cultural Preservation</h3>
              <p className="text-sm text-gray-400">
                Proceeds support ongoing community initiatives and cultural preservation efforts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <Link
              href="/academy/agent/citizen"
              className="inline-flex items-center gap-2 border border-white px-6 py-3 hover:bg-white hover:text-black transition-all"
            >
              BACK TO CITIZEN PROFILE
            </Link>
          </div>
          <div className="text-sm text-gray-500">
            <p>Treasury managed by CITIZEN • Daily activations at 12:00 PM EST</p>
            <p>Part of the Eden Academy Genesis Cohort</p>
          </div>
        </div>
      </footer>
>>>>>>> origin/feature/agent-quality
    </div>
  );
}