'use client';

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
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO CITIZEN
          </Link>
        </div>
      </div>

      {/* Header */}
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
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}