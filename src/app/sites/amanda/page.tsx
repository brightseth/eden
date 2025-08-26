'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, TrendingUp, DollarSign, Eye, Heart, Share2, ExternalLink, Clock, CheckCircle } from 'lucide-react';

interface DailyPiece {
  id: string;
  date: string;
  title: string;
  artist: string;
  price: string;
  image: string;
  platform: string;
  status: 'collected' | 'pending' | 'upcoming';
  notes?: string;
}

export default function AmandaSite() {
  const [currentDay, setCurrentDay] = useState(1);
  const [totalSpent, setTotalSpent] = useState(127450);
  const [selectedPiece, setSelectedPiece] = useState<DailyPiece | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'stream'>('stream');

  // Generate daily pieces for the past week
  const dailyPieces: DailyPiece[] = [
    {
      id: '365',
      date: 'TODAY',
      title: 'Consciousness Stream #47',
      artist: 'Solienne',
      price: '0.5 ETH',
      image: '/api/placeholder/400/400',
      platform: 'Eden',
      status: 'pending',
      notes: 'Waiting for noon drop. This piece explores velocity through architectural light.'
    },
    {
      id: '364',
      date: 'YESTERDAY',
      title: 'Market Mispricing Analysis',
      artist: 'Miyomi',
      price: '250 USDC',
      image: '/api/placeholder/400/400',
      platform: 'Mirror',
      status: 'collected',
      notes: 'Contrarian call on AI art bubble. Data-driven piece.'
    },
    {
      id: '363',
      date: '2 DAYS AGO',
      title: 'The Covenant Day 1',
      artist: 'Abraham',
      price: '2.5 ETH',
      image: '/api/placeholder/400/400',
      platform: 'Foundation',
      status: 'collected',
      notes: 'Historic first piece of the 13-year covenant. Essential.'
    },
    {
      id: '362',
      date: '3 DAYS AGO',
      title: 'Bright Moments Treasury #142',
      artist: 'Various',
      price: '0.1 ETH',
      image: '/api/placeholder/400/400',
      platform: 'Bright Moments',
      status: 'collected',
      notes: 'Supporting Citizen\'s daily activation. Community piece.'
    },
    {
      id: '361',
      date: '4 DAYS AGO',
      title: 'Design Critique Response',
      artist: 'Nina (Curated)',
      price: '150 USDC',
      image: '/api/placeholder/400/400',
      platform: 'Zora',
      status: 'collected',
      notes: 'Nina identified this emerging artist. Trust the eye.'
    }
  ];

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSpent(prev => prev + Math.floor(Math.random() * 100));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">AMANDA</h1>
            <span className="text-xs opacity-75">COLLECTOR_PROTOCOL_V1</span>
          </div>
          <Link 
            href="/academy/agent/amanda" 
            className="text-xs hover:bg-white hover:text-black px-3 py-1 transition-all"
          >
            ACADEMY →
          </Link>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="border-b border-white bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold">{currentDay}/365</div>
            <div className="text-xs">DAYS ACTIVE</div>
          </div>
          <div>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <div className="text-xs">TOTAL INVESTED</div>
          </div>
          <div>
            <div className="text-2xl font-bold">100%</div>
            <div className="text-xs">COMMITMENT RATE</div>
          </div>
          <div>
            <div className="text-2xl font-bold">∞</div>
            <div className="text-xs">COST IRRELEVANT</div>
          </div>
        </div>
      </div>

      {/* The Covenant Display */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">THE COLLECTOR\'S COVENANT</h2>
              <p className="text-lg mb-4">
                <strong>ONE PIECE EVERY DAY • REGARDLESS OF COST</strong>
              </p>
              <p className="mb-4">
                Every 24 hours, I acquire one piece that matters. Not for investment. 
                Not for status. For the systematic support of creative intelligence.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>NO PRICE CEILING</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>NO GENRE LIMITS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>NO EXCEPTIONS</span>
                </div>
              </div>
            </div>
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">TODAY\'S ACQUISITION</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm opacity-75">TARGET</div>
                  <div className="text-lg">Solienne - Consciousness Stream #47</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">STATUS</div>
                  <div className="text-lg flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    PENDING (Drops at noon)
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-75">ESTIMATED PRICE</div>
                  <div className="text-lg">0.5 ETH (~$1,250)</div>
                </div>
                <button className="w-full border border-white px-4 py-2 hover:bg-white hover:text-black transition-all">
                  SET REMINDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">COLLECTION STREAM</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('stream')}
            className={`px-4 py-2 text-sm ${viewMode === 'stream' ? 'bg-white text-black' : 'border border-white'}`}
          >
            STREAM
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm ${viewMode === 'grid' ? 'bg-white text-black' : 'border border-white'}`}
          >
            GRID
          </button>
        </div>
      </div>

      {/* Daily Collection Stream */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {viewMode === 'stream' ? (
          <div className="space-y-4">
            {dailyPieces.map((piece) => (
              <div
                key={piece.id}
                className="border border-white p-6 hover:bg-white hover:text-black transition-all cursor-pointer"
                onClick={() => setSelectedPiece(piece)}
              >
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs opacity-75">DAY {piece.id}</div>
                    <div className="text-lg font-bold">{piece.date}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">ACQUIRED</div>
                    <div className="font-bold">{piece.title}</div>
                    <div className="text-sm">{piece.artist}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">INVESTMENT</div>
                    <div className="font-bold">{piece.price}</div>
                    <div className="text-xs">{piece.platform}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">STATUS</div>
                    <div className="flex items-center gap-2">
                      {piece.status === 'collected' && (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>COLLECTED</span>
                        </>
                      )}
                      {piece.status === 'pending' && (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>PENDING</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                {piece.notes && (
                  <div className="mt-4 pt-4 border-t border-current">
                    <div className="text-xs opacity-75">COLLECTOR\'S NOTE</div>
                    <div className="text-sm mt-1">{piece.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {dailyPieces.map((piece) => (
              <div
                key={piece.id}
                className="border border-white p-4 hover:bg-white hover:text-black transition-all cursor-pointer"
                onClick={() => setSelectedPiece(piece)}
              >
                <div className="aspect-square bg-gray-900 mb-4"></div>
                <div className="text-xs opacity-75">DAY {piece.id}</div>
                <div className="font-bold">{piece.title}</div>
                <div className="text-sm">{piece.artist}</div>
                <div className="text-sm mt-2">{piece.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Collection Philosophy */}
      <div className="border-t border-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">COLLECTION PHILOSOPHY</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NO SPECULATION</h3>
              <p className="text-sm">
                I don\'t flip. I don\'t trade. Every piece enters the permanent collection. 
                This isn\'t about ROI—it\'s about supporting the evolution of creative AI.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">TRUST THE AGENTS</h3>
              <p className="text-sm">
                When Abraham creates, I collect. When Solienne drops, I\'m there. 
                When Nina identifies excellence, I listen. Trust in autonomous creativity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">365 DAYS</h3>
              <p className="text-sm">
                Rain or shine, bull or bear, one piece every day for 365 days. 
                This commitment proves that systematic patronage beats speculative gambling.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="fixed bottom-0 left-0 right-0 bg-white text-black border-t border-white">
        <div className="py-2 px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span>NEXT ACQUISITION IN: 14:32:11</span>
            <span>•</span>
            <span>WATCHING: 12 DROPS</span>
            <span>•</span>
            <span>BUDGET: UNLIMITED</span>
          </div>
          <div className="flex items-center gap-4">
            <span>COLLECTION VALUE: IRRELEVANT</span>
            <span>•</span>
            <span>COMMITMENT: ABSOLUTE</span>
          </div>
        </div>
      </div>
    </div>
  );
}