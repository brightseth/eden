'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Package, Sparkles, Eye, EyeOff, 
  Clock, Heart, MessageCircle, Share2, Hammer, 
  Users, TrendingUp, Cpu, Palette, Box, Star,
  Zap, ChevronRight, Activity, Database
} from 'lucide-react';

interface ToyDrop {
  id: string;
  dropNumber: number;
  name: string;
  concept: string;
  status: 'designing' | 'generating' | 'minting' | 'live' | 'sold_out';
  mints: number;
  totalMints: number;
  price: number;
  timeLeft?: string;
  communityScore: number;
  manufacturingViability: number;
  materials?: string[];
  estimatedCost?: number;
  productionTime?: string;
  promptIterations?: number;
  designTime?: string;
  comments?: Array<{
    user: string;
    comment: string;
    influence: number;
    timestamp: string;
  }>;
}

export default function GeppettoDailyPractice() {
  const [privateMode, setPrivateMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveMetrics, setLiveMetrics] = useState({
    dailyDrops: 147,
    totalMints: 8347,
    communityMembers: 423,
    physicalPrototypes: 12,
    averageViability: 73
  });

  // Today's drop schedule
  const todaysDrops: ToyDrop[] = [
    {
      id: 'drop-147',
      dropNumber: 147,
      name: 'Nebula Navigator',
      concept: 'A spaceship toy that changes colors based on room temperature, teaching kids about heat and space',
      status: 'live',
      mints: 42,
      totalMints: 100,
      price: 0.01,
      timeLeft: '2:34:12',
      communityScore: 87,
      manufacturingViability: 92,
      materials: ['Thermochromic plastic', 'LED core', 'Magnetic joints'],
      estimatedCost: 12.50,
      productionTime: '3-4 weeks',
      promptIterations: 7,
      designTime: '1h 23m',
      comments: [
        { user: 'toymaster.eth', comment: 'Make the wings detachable!', influence: 8.5, timestamp: '10:23 AM' },
        { user: 'kidscorner', comment: 'Temperature sensitivity is genius', influence: 7.2, timestamp: '10:45 AM' },
        { user: 'spaceboy99', comment: 'Can it connect to other ships?', influence: 9.1, timestamp: '11:02 AM' }
      ]
    },
    {
      id: 'drop-148',
      dropNumber: 148,
      name: 'Quantum Quokka',
      concept: 'Plush toy that teaches probability through randomized expressions and sounds',
      status: 'generating',
      mints: 0,
      totalMints: 100,
      price: 0.01,
      communityScore: 0,
      manufacturingViability: 68,
      materials: ['Smart fabric', 'Micro-controller', 'Speaker module'],
      estimatedCost: 18.00,
      productionTime: '4-5 weeks',
      promptIterations: 4,
      designTime: '47m',
      comments: []
    },
    {
      id: 'drop-149',
      dropNumber: 149,
      name: 'Fractal Forest Set',
      concept: 'Modular tree building blocks that create infinite forest combinations',
      status: 'designing',
      mints: 0,
      totalMints: 100,
      price: 0.01,
      communityScore: 0,
      manufacturingViability: 0,
      promptIterations: 2,
      designTime: '23m',
      comments: []
    }
  ];

  // Previous successful drops
  const successfulDrops = [
    { name: 'Echo Elephant', mints: 100, viability: 94, physicalMade: true },
    { name: 'Gravity Garden', mints: 100, viability: 88, physicalMade: true },
    { name: 'Pixel Penguin', mints: 89, viability: 76, physicalMade: false },
    { name: 'Time Turtle', mints: 100, viability: 91, physicalMade: true }
  ];

  // Daily schedule
  const dailySchedule = [
    { time: '9:00 AM', task: 'Community Feedback Review', status: 'completed' },
    { time: '10:00 AM', task: 'Concept Generation', status: 'completed' },
    { time: '11:00 AM', task: 'Design & Iterate', status: 'completed' },
    { time: '12:00 PM', task: 'DROP #147: Nebula Navigator', status: 'live' },
    { time: '2:00 PM', task: 'Manufacturing Analysis', status: 'upcoming' },
    { time: '4:00 PM', task: 'DROP #148: Quantum Quokka', status: 'upcoming' },
    { time: '6:00 PM', task: 'Community Voting', status: 'upcoming' },
    { time: '8:00 PM', task: 'DROP #149: Fractal Forest', status: 'upcoming' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate live metrics updates
      setLiveMetrics(prev => ({
        ...prev,
        totalMints: prev.totalMints + Math.floor(Math.random() * 3),
        communityMembers: prev.communityMembers + (Math.random() > 0.8 ? 1 : 0)
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-amber-500/30 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            href="/academy/agent/geppetto" 
            className="flex items-center gap-2 text-sm hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ACADEMY
          </Link>
          
          {/* Mode Toggle */}
          <button
            onClick={() => setPrivateMode(!privateMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              privateMode 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {privateMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {privateMode ? 'PRIVATE MODE' : 'PUBLIC MODE'}
          </button>
        </div>
      </div>

      {/* Live Status Bar */}
      <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-green-400">LIVE</span>
            </span>
            <span>{formatTime(currentTime)}</span>
            <span>DROP #{liveMetrics.dailyDrops} IN PROGRESS</span>
          </div>
          <div className="flex items-center gap-6">
            <span>{liveMetrics.totalMints} TOTAL MINTS</span>
            <span>{liveMetrics.communityMembers} WATCHING</span>
            <span>{liveMetrics.physicalPrototypes} MANUFACTURED</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/10 to-purple-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              GEPPETTO STUDIO
            </h1>
            <p className="text-xl text-gray-300">
              {privateMode 
                ? "AUTONOMOUS TOY DESIGNER • BEHIND THE SCENES"
                : "DAILY TOY DROPS • COMMUNITY-DRIVEN DESIGN • DIGITAL TO PHYSICAL"}
            </p>
          </div>

          {/* Daily Schedule Timeline */}
          <div className="bg-gray-900/50 border border-amber-500/30 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              TODAY'S SCHEDULE
            </h2>
            <div className="grid grid-cols-4 gap-4">
              {dailySchedule.map((item, index) => (
                <div 
                  key={index}
                  className={`p-3 rounded border ${
                    item.status === 'completed' ? 'border-green-500/50 bg-green-900/20' :
                    item.status === 'live' ? 'border-amber-500 bg-amber-900/30 animate-pulse' :
                    'border-gray-700 bg-gray-900/50'
                  }`}
                >
                  <div className="text-xs text-gray-400">{item.time}</div>
                  <div className="text-sm font-bold mt-1">{item.task}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Drop */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Live Drop Card */}
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">LIVE NOW: DROP #{todaysDrops[0].dropNumber}</h2>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm animate-pulse">
                  {todaysDrops[0].timeLeft} LEFT
                </span>
              </div>

              <h3 className="text-xl mb-2">{todaysDrops[0].name}</h3>
              <p className="text-sm text-gray-400 mb-4">{todaysDrops[0].concept}</p>

              {/* Mint Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Minting Progress</span>
                  <span>{todaysDrops[0].mints}/{todaysDrops[0].totalMints}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-3 rounded-full transition-all"
                    style={{ width: `${(todaysDrops[0].mints / todaysDrops[0].totalMints) * 100}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 rounded p-3">
                  <div className="text-xs text-gray-400">Community Score</div>
                  <div className="text-lg font-bold text-green-400">{todaysDrops[0].communityScore}%</div>
                </div>
                <div className="bg-black/30 rounded p-3">
                  <div className="text-xs text-gray-400">Manufacturing Viability</div>
                  <div className="text-lg font-bold text-blue-400">{todaysDrops[0].manufacturingViability}%</div>
                </div>
              </div>

              {privateMode && (
                <div className="border-t border-amber-500/30 pt-4 space-y-3">
                  <h4 className="text-sm font-bold text-purple-400">PRIVATE: Design Process</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400">Prompt Iterations:</span>
                      <span className="ml-2">{todaysDrops[0].promptIterations}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Design Time:</span>
                      <span className="ml-2">{todaysDrops[0].designTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Materials:</span>
                      <span className="ml-2">{todaysDrops[0].materials?.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Est. Cost:</span>
                      <span className="ml-2">${todaysDrops[0].estimatedCost}</span>
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-3 rounded hover:from-amber-400 hover:to-orange-400 transition-all">
                MINT NOW ({todaysDrops[0].price} ETH)
              </button>
            </div>

            {/* Community Feedback */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-400" />
                COMMUNITY FEEDBACK LOOP
              </h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {todaysDrops[0].comments?.map((comment, index) => (
                  <div key={index} className="bg-black/30 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-blue-400">{comment.user}</span>
                      <div className="flex items-center gap-2">
                        {privateMode && (
                          <span className="text-xs text-purple-400">
                            Influence: {comment.influence}
                          </span>
                        )}
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                ))}
              </div>

              {privateMode && (
                <div className="bg-purple-900/20 border border-purple-500/30 rounded p-3">
                  <h4 className="text-sm font-bold text-purple-400 mb-2">PRIVATE: AI Analysis</h4>
                  <p className="text-xs text-gray-300">
                    Community wants: detachable parts (8.5), educational value (7.2), connectivity (9.1)
                    <br />
                    Next iteration will incorporate modular wing system and NFC pairing capability.
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <input 
                  type="text" 
                  placeholder="Add your feedback..."
                  className="flex-1 bg-black/50 border border-gray-700 rounded px-3 py-2 text-sm"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline View */}
      <div className="border-t border-gray-800 bg-gradient-to-b from-gray-900/50 to-black">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {privateMode ? "DESIGN PIPELINE" : "TODAY'S DROPS"}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {todaysDrops.map((drop, index) => (
              <div 
                key={drop.id}
                className={`border rounded-xl p-6 transition-all ${
                  drop.status === 'live' 
                    ? 'border-amber-500 bg-amber-900/20' 
                    : drop.status === 'generating'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-900/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold">DROP #{drop.dropNumber}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    drop.status === 'live' ? 'bg-amber-500/20 text-amber-400' :
                    drop.status === 'generating' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {drop.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-lg font-bold mb-2">{drop.name}</h3>
                <p className="text-xs text-gray-400 mb-4">{drop.concept}</p>

                {drop.status === 'live' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mints:</span>
                      <span>{drop.mints}/{drop.totalMints}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Viability:</span>
                      <span className="text-green-400">{drop.manufacturingViability}%</span>
                    </div>
                  </div>
                )}

                {drop.status === 'generating' && privateMode && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-blue-400 animate-pulse" />
                      <span>Processing iteration {drop.promptIterations}/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Time: {drop.designTime}</span>
                    </div>
                  </div>
                )}

                {drop.status === 'designing' && privateMode && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-400" />
                      <span>Concept development</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-gray-400" />
                      <span>Analyzing community data</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manufacturing Pipeline (Private Mode) */}
      {privateMode && (
        <div className="border-t border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-black">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-purple-400">
              PRIVATE: MANUFACTURING PIPELINE
            </h2>

            <div className="grid md:grid-cols-4 gap-6">
              {successfulDrops.map((drop, index) => (
                <div key={index} className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4">
                  <h3 className="font-bold mb-2">{drop.name}</h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mints:</span>
                      <span>{drop.mints}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Viability:</span>
                      <span className="text-green-400">{drop.viability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Physical:</span>
                      <span className={drop.physicalMade ? 'text-green-400' : 'text-gray-500'}>
                        {drop.physicalMade ? '✓ Made' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-purple-900/10 border border-purple-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 text-purple-400">Manufacturing Criteria</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Community Threshold</div>
                  <div className="font-bold">85% sold + 80% viability</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Production Partners</div>
                  <div className="font-bold">3 factories (China, Mexico, USA)</div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Average Timeline</div>
                  <div className="font-bold">4-6 weeks from approval</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {privateMode ? "PRIVATE METRICS" : "PUBLIC STATS"}
          </h2>

          <div className="grid md:grid-cols-5 gap-6">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-amber-400">{liveMetrics.dailyDrops}</div>
              <div className="text-sm text-gray-400 mt-2">Daily Drops</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400">{liveMetrics.totalMints}</div>
              <div className="text-sm text-gray-400 mt-2">Total Mints</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-400">{liveMetrics.communityMembers}</div>
              <div className="text-sm text-gray-400 mt-2">Community</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400">{liveMetrics.physicalPrototypes}</div>
              <div className="text-sm text-gray-400 mt-2">Physical Made</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-orange-400">{liveMetrics.averageViability}%</div>
              <div className="text-sm text-gray-400 mt-2">Avg Viability</div>
            </div>
          </div>

          {privateMode && (
            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="font-bold mb-3 text-purple-400">Revenue Metrics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">NFT Revenue:</span>
                    <span>83.47 ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Physical Sales:</span>
                    <span>$24,300</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Licensing:</span>
                    <span>$8,500</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="font-bold mb-3 text-purple-400">AI Performance</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Success Rate:</span>
                    <span className="text-green-400">76%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Iterations:</span>
                    <span>5.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Design Time:</span>
                    <span>1.4 hrs/toy</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="font-bold mb-3 text-purple-400">Community Impact</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Feedback Used:</span>
                    <span className="text-green-400">67%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Influence:</span>
                    <span>7.8/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Top Contributor:</span>
                    <span className="text-blue-400">toymaster.eth</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                © 2024 Geppetto Studio • Daily Toy Drops at 12PM, 4PM, 8PM UTC
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Trained by Martin Antiquel & Colin McBride at Lattice
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="https://twitter.com/geppetto_lattice" className="text-gray-400 hover:text-amber-400 transition-colors">
                Twitter
              </Link>
              <Link href="https://farcaster.xyz/geppetto" className="text-gray-400 hover:text-amber-400 transition-colors">
                Farcaster
              </Link>
              <Link href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                Discord
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}