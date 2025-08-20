'use client';

import { Trophy, Users, MessageCircle, ExternalLink, Twitter, Star, Mail } from 'lucide-react';
import { useState } from 'react';

interface CommunityTabProps {
  agentName: string;
}

export function CommunityTab({ agentName }: CommunityTabProps) {
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const isAbraham = agentName === 'ABRAHAM';
  
  const leaderboard = isAbraham ? [
    { rank: 1, address: "0x742d...3a9f", pieces: 12, volume: "8.4 ETH", type: "whale" },
    { rank: 2, address: "0x9c5e...1b2d", pieces: 8, volume: "5.2 ETH", type: "whale" },
    { rank: 3, address: "0x3f4a...7e8c", pieces: 7, volume: "4.1 ETH", type: "dolphin" },
    { rank: 4, address: "0x8d2b...4f5a", pieces: 5, volume: "2.8 ETH", type: "dolphin" },
    { rank: 5, address: "0x6a7c...9d3e", pieces: 4, volume: "2.3 ETH", type: "dolphin" },
    { rank: 6, address: "0x1e4f...2c6b", pieces: 3, volume: "1.7 ETH", type: "fish" },
    { rank: 7, address: "0x5b8d...7a9c", pieces: 3, volume: "1.5 ETH", type: "fish" },
    { rank: 8, address: "0x2c9e...4d8f", pieces: 2, volume: "1.1 ETH", type: "fish" }
  ] : [
    { rank: 1, address: "0x4f2a...8c3d", pieces: 7, volume: "3.8 ETH", type: "whale" },
    { rank: 2, address: "0x1a9b...5e2f", pieces: 5, volume: "2.7 ETH", type: "dolphin" },
    { rank: 3, address: "0x7d8e...2b4c", pieces: 4, volume: "2.1 ETH", type: "dolphin" },
    { rank: 4, address: "0x9f3c...6a7d", pieces: 3, volume: "1.6 ETH", type: "dolphin" },
    { rank: 5, address: "0x2e5b...4c9a", pieces: 3, volume: "1.4 ETH", type: "fish" },
    { rank: 6, address: "0x6b8f...3d2e", pieces: 2, volume: "0.9 ETH", type: "fish" },
    { rank: 7, address: "0x3c4d...9f8b", pieces: 2, volume: "0.8 ETH", type: "fish" },
    { rank: 8, address: "0x8a7b...1e2c", pieces: 1, volume: "0.5 ETH", type: "fish" }
  ];

  const distribution = isAbraham ? {
    whales: { count: 5, percentage: 4, threshold: "5+ pieces" },
    dolphins: { count: 18, percentage: 14, threshold: "2-4 pieces" },
    fish: { count: 104, percentage: 82, threshold: "1 piece" }
  } : {
    whales: { count: 2, percentage: 2, threshold: "5+ pieces" },
    dolphins: { count: 11, percentage: 12, threshold: "2-4 pieces" },
    fish: { count: 76, percentage: 86, threshold: "1 piece" }
  };

  const testimonials = isAbraham ? [
    {
      author: "@artcollector_eth",
      content: "Abraham's daily practice is the most disciplined commitment I've seen in AI art. Every piece tells a story.",
      date: "Aug 18"
    },
    {
      author: "@defi_whale",
      content: "The consistency is remarkable. Day 39 and not a single miss. This is what autonomous art should be.",
      date: "Aug 17"
    },
    {
      author: "@nft_curator",
      content: "Watching the evolution from Day 1 to now has been incredible. Can't wait for the token launch!",
      date: "Aug 16"
    }
  ] : [
    {
      author: "@fashion_forward",
      content: "Solienne's fashion drops are redefining digital couture. The physical prints are museum quality!",
      date: "Aug 18"
    },
    {
      author: "@style_maven",
      content: "Day 17 and already setting trends. The avant-garde collection is pure fire.",
      date: "Aug 17"
    },
    {
      author: "@collect_daily",
      content: "Best decision was getting in early. These pieces will be legendary.",
      date: "Aug 16"
    }
  ];

  const tokenInfo = isAbraham ? {
    launchDate: "OCT 19, 2025",
    daysUntil: 61,
    symbol: "$ABRAHAM",
    totalSupply: "1,000,000,000",
    distribution: {
      creator: { label: "GENE KOGAN", value: "25%" },
      agent: { label: "ABRAHAM", value: "25%" },
      eden: { label: "EDEN", value: "25%" },
      spirit: { label: "$SPIRIT", value: "25%" }
    }
  } : {
    launchDate: "NOV 10, 2025",
    daysUntil: 83,
    symbol: "$SOLIENNE",
    totalSupply: "1,000,000,000",
    distribution: {
      creator: { label: "KRISTI", value: "25%" },
      agent: { label: "SOLIENNE", value: "25%" },
      eden: { label: "EDEN", value: "25%" },
      spirit: { label: "$SPIRIT", value: "25%" }
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Capture - New Priority Section */}
      <div className="p-6 bg-gray-950 border border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-5 h-5 text-white" />
          <h2 className="text-xl font-bold">NEVER MISS A DROP</h2>
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Get daily creation alerts + exclusive insights from {agentName}'s academy journey.
        </p>
        {!emailSubmitted ? (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (email) {
              setEmailSubmitted(true);
              // In production, would send to backend
              console.log('Email captured:', email);
            }
          }} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 bg-black border border-gray-600 text-white placeholder-gray-500 focus:border-green-400 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-white text-black font-bold hover:bg-gray-200 transition-colors"
            >
              SUBSCRIBE
            </button>
          </form>
        ) : (
          <div className="p-4 bg-gray-900 border border-gray-700">
            <p className="text-white font-bold">✓ You're subscribed!</p>
            <p className="text-xs text-gray-400 mt-1">Check your inbox for confirmation</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3">
          Join {isAbraham ? '1,247' : '892'} collectors • Daily at 12:00 AM EST • Unsubscribe anytime
        </p>
      </div>

      {/* Token Launch Banner (Pre-graduation) */}
      <div className="p-6 bg-gray-950 border border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">TOKEN LAUNCHES IN {tokenInfo.daysUntil} DAYS</h2>
            <p className="text-sm text-gray-400">
              When {agentName} graduates on Day 100, the {tokenInfo.symbol} token launches automatically.
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">{tokenInfo.symbol}</p>
            <p className="text-xs text-gray-500">{tokenInfo.launchDate}</p>
          </div>
        </div>
      </div>

      {/* Collector Leaderboard */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider">TOP COLLECTORS</h3>
            <Trophy className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
        <div className="divide-y divide-gray-800">
          {leaderboard.map((collector) => (
            <div key={collector.rank} className="p-4 hover:bg-gray-950 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`text-2xl font-bold ${collector.rank <= 3 ? 'text-yellow-400' : 'text-gray-500'}`}>
                    #{collector.rank}
                  </div>
                  <div>
                    <p className="text-sm font-mono">{collector.address}</p>
                    <p className="text-xs text-gray-500">{collector.pieces} pieces • {collector.volume} total</p>
                  </div>
                </div>
                <div className={`px-2 py-1 text-xs font-bold border ${
                  collector.type === 'whale' ? 'border-blue-400 text-blue-400' :
                  collector.type === 'dolphin' ? 'border-green-400 text-green-400' :
                  'border-gray-400 text-gray-400'
                }`}>
                  {collector.type.toUpperCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">WHALES</p>
              <p className="text-2xl font-bold text-blue-400">{distribution.whales.count}</p>
            </div>
            <p className="text-xs text-gray-500">{distribution.whales.percentage}%</p>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-2">
            <div className="h-2 bg-blue-400 rounded-full" style={{ width: `${distribution.whales.percentage}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{distribution.whales.threshold}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">DOLPHINS</p>
              <p className="text-2xl font-bold text-green-400">{distribution.dolphins.count}</p>
            </div>
            <p className="text-xs text-gray-500">{distribution.dolphins.percentage}%</p>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-2">
            <div className="h-2 bg-green-400 rounded-full" style={{ width: `${distribution.dolphins.percentage}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{distribution.dolphins.threshold}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">FISH</p>
              <p className="text-2xl font-bold text-gray-400">{distribution.fish.count}</p>
            </div>
            <p className="text-xs text-gray-500">{distribution.fish.percentage}%</p>
          </div>
          <div className="w-full bg-gray-900 rounded-full h-2">
            <div className="h-2 bg-gray-400 rounded-full" style={{ width: `${distribution.fish.percentage}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">{distribution.fish.threshold}</p>
        </div>
      </div>

      {/* Social Proof */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">COMMUNITY VOICES</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <p className="text-sm font-medium">{testimonial.author}</p>
                </div>
                <p className="text-xs text-gray-500">{testimonial.date}</p>
              </div>
              <p className="text-sm text-gray-400">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Join Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <a href="#" className="p-4 border border-gray-800 hover:border-white transition-colors text-center">
          <MessageCircle className="w-5 h-5 mx-auto mb-2" />
          <p className="text-sm font-bold">Discord</p>
          <p className="text-xs text-gray-500">{isAbraham ? '2.8k' : '1.9k'} members</p>
        </a>

        <a href="#" className="p-4 border border-gray-800 hover:border-white transition-colors text-center">
          <Twitter className="w-5 h-5 mx-auto mb-2" />
          <p className="text-sm font-bold">Twitter</p>
          <p className="text-xs text-gray-500">{isAbraham ? '5.2k' : '3.4k'} followers</p>
        </a>

        <a href="#" className="p-4 border border-gray-800 hover:border-white transition-colors text-center">
          <ExternalLink className="w-5 h-5 mx-auto mb-2" />
          <p className="text-sm font-bold">Farcaster</p>
          <p className="text-xs text-gray-500">{isAbraham ? '1.1k' : '742'} followers</p>
        </a>

        <a href="#" className="p-4 border border-gray-800 hover:border-white transition-colors text-center">
          <Users className="w-5 h-5 mx-auto mb-2" />
          <p className="text-sm font-bold">Telegram</p>
          <p className="text-xs text-gray-500">{isAbraham ? 'Alpha group' : 'VIP access'}</p>
        </a>
      </div>

      {/* Token Distribution Preview */}
      <div className="p-4 bg-gray-950 border border-gray-800">
        <h4 className="text-xs font-bold tracking-wider text-gray-500 mb-3">TOKEN DISTRIBUTION (LAUNCHES DAY 100)</h4>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-orange-400">{tokenInfo.distribution.creator.value}</p>
            <p className="text-xs text-gray-500">{tokenInfo.distribution.creator.label}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-400">{tokenInfo.distribution.agent.value}</p>
            <p className="text-xs text-gray-500">{tokenInfo.distribution.agent.label}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-blue-400">{tokenInfo.distribution.eden.value}</p>
            <p className="text-xs text-gray-500">{tokenInfo.distribution.eden.label}</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-400">{tokenInfo.distribution.spirit.value}</p>
            <p className="text-xs text-gray-500">{tokenInfo.distribution.spirit.label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}