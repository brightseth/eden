'use client';

import { Clock, ExternalLink, TrendingUp, Users, ArrowRight, Package } from 'lucide-react';
import { RevenueFlow } from './RevenueFlow';

interface CollectTabProps {
  agentName: string;
  academyStatus?: {
    currentDay: number;
    totalDays: number;
    daysRemaining: number;
    hasGraduated: boolean;
    progressPercentage: number;
    graduationDate: string;
    startDate: string;
  };
}

export function CollectTab({ agentName, academyStatus }: CollectTabProps) {
  const isAbraham = agentName === 'ABRAHAM';
  const currentDay = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const isSunday = currentDay === 0;

  // Abraham's auction data (6 days/week - rests on Sunday)
  const currentAuction = {
    title: isAbraham ? "Ethereal Convergence #39" : "Digital Fashion Drop #17",
    currentBid: isAbraham ? "0.67 ETH" : "0.42 ETH",
    reserve: "0.1 ETH", 
    timeRemaining: isAbraham ? "3h 24m" : "5h 12m",
    endTime: "12:00 UTC",
    timezone: "(8:00 AM EST / 5:00 AM PST)",
    bidders: isAbraham ? 7 : 4,
    image: "/placeholder-art.jpg",
    auctionType: "24-hour auction",
    platform: "OpenSea"
  };

  // Solienne's product data (7 days/week - physical products via Printify)
  const currentProduct = {
    title: isAbraham ? "Limited Edition Print #39" : "Avant-Garde Collection #17",
    subtitle: isAbraham ? "Sacred Geometry Series" : "Fashion Forward Series",
    price: isAbraham ? "$350" : "$250",
    remaining: isAbraham ? 23 : 67,
    totalSupply: isAbraham ? 50 : 100,
    sizes: ["18x24", "24x36", "36x48"],
    material: "Museum-Quality Archival Print",
    fulfillment: "Ships via Printify in 2-3 weeks",
    image: "/placeholder-fashion.jpg"
  };

  const upcomingDrops = isAbraham ? [
    { day: "Tomorrow", title: "Daily Creation #40", time: "12:00 UTC", timezone: "8:00 AM EST" },
    { day: "Oct 17", title: "Daily Creation #98", time: "12:00 UTC", timezone: "8:00 AM EST" },
    { day: "Oct 18", title: "Daily Creation #99", time: "12:00 UTC", timezone: "8:00 AM EST" },
    { day: "Oct 19", title: "GRADUATION DAY - Final Academy Piece", time: "12:00 UTC", timezone: "8:00 AM EST" },
    { day: "Oct 20", title: "SPIRIT LAUNCH - First Autonomous Creation", time: "12:00 UTC", timezone: "8:00 AM EST" }
  ] : [
    { day: "Tomorrow", title: "Daily Creation #18", time: "12:00 UTC", timezone: "8:00 AM EST" },
    { day: "Nov 8", title: "Daily Creation #98", time: "12:00 UTC", timezone: "8:00 AM EST" },
    { day: "Nov 9", title: "Daily Creation #99", time: "12:00 UTC", timezone: "8:00 AM EST" },
    { day: "Nov 10", title: "GRADUATION DAY - Final Academy Piece", time: "12:00 UTC", timezone: "8:00 AM EST" },
    { day: "Nov 11", title: "SPIRIT LAUNCH - First Autonomous Creation", time: "12:00 UTC", timezone: "8:00 AM EST" }
  ];


  return (
    <div className="space-y-8">
      {/* Main Collection Section */}
      <div className="border border-gray-800">

        {/* Abraham's Sabbath Message */}
        {isAbraham && isSunday ? (
          <div className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">🕊️</div>
              <h3 className="text-2xl font-bold mb-4">Day of Rest</h3>
              <p className="text-gray-400 mb-6">
                Abraham observes the sabbath and rests on Sundays. 
                No new creations are minted on this day.
              </p>
              <div className="p-4 bg-gray-950 border border-gray-800">
                <p className="text-sm text-gray-500 mb-2">NEXT AUCTION BEGINS</p>
                <p className="text-xl font-bold">Monday, 12:00 AM EST</p>
                <p className="text-sm text-gray-400 mt-1">5:00 AM UTC / 9:00 PM PST</p>
                <p className="text-sm text-gray-400 mt-2">In approximately 14 hours</p>
              </div>
            </div>
          </div>
        ) : isAbraham ? (
          /* Abraham's Auction Interface - Simplified */
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Creation #{academyStatus?.currentDay || 39}</h3>
                <p className="text-sm text-gray-400">Day {academyStatus?.currentDay || 39} of 100</p>
              </div>
              
              <div className="space-y-4">
                {/* Simplified bid info */}
                <div className="p-6 bg-gray-950 border border-gray-800">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">CURRENT BID</p>
                      <p className="text-xl font-bold text-white">{currentAuction.currentBid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">TIME LEFT</p>
                      <p className="text-xl font-bold">{currentAuction.timeRemaining}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">BIDDERS</p>
                      <p className="text-xl font-bold">{currentAuction.bidders}</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <a 
                  href="#" 
                  className="w-full block py-3 px-4 bg-white text-black font-bold text-center hover:bg-gray-200 transition-colors"
                >
                  BID NOW →
                </a>
                
                <p className="text-xs text-gray-500 text-center">
                  Daily auction • Ends {currentAuction.endTime} ({currentAuction.timezone})
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Solienne's Product Interface - Simplified */
          <div className="p-6">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Drop #{academyStatus?.currentDay || 17}</h3>
                <p className="text-sm text-gray-400">Day {academyStatus?.currentDay || 17} of 100</p>
              </div>
              
              <div className="space-y-4">
                {/* Simplified product info */}
                <div className="p-6 bg-gray-950 border border-gray-800">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">PRICE</p>
                      <p className="text-xl font-bold text-white">{currentProduct.price}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">REMAINING</p>
                      <p className="text-xl font-bold">{currentProduct.remaining}/{currentProduct.totalSupply}</p>
                    </div>
                  </div>
                </div>

                {/* Size selection */}
                <div>
                  <p className="text-xs text-gray-500 mb-2">SELECT SIZE</p>
                  <div className="grid grid-cols-3 gap-2">
                    {currentProduct.sizes.map((size) => (
                      <button 
                        key={size}
                        className="py-2 border border-gray-600 hover:border-white hover:bg-gray-950 transition-colors text-sm"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button className="w-full py-3 px-4 bg-white text-black font-bold text-center hover:bg-gray-200 transition-colors">
                  BUY NOW →
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  {currentProduct.material} • {currentProduct.fulfillment}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Revenue Distribution Display */}
      <RevenueFlow 
        salePrice={isAbraham ? "1.0 ETH" : "$250"} 
        isEth={isAbraham}
        agentName={agentName}
      />

      {/* Upcoming Drops */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">UPCOMING DROPS</h3>
          <p className="text-xs text-gray-500 mt-1">All times in Eastern Standard Time</p>
        </div>
        <div className="divide-y divide-gray-800">
          {upcomingDrops.map((drop, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-950 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{drop.title}</p>
                  <p className="text-xs text-gray-500">{drop.day} • {drop.time} ({drop.timezone})</p>
                </div>
                {drop.title.includes("GRADUATION") && (
                  <span className="px-2 py-1 text-xs font-bold border border-green-400 text-green-400">
                    SPECIAL
                  </span>
                )}
                {drop.title.includes("SPIRIT") && (
                  <span className="px-2 py-1 text-xs font-bold border border-purple-400 text-purple-400">
                    TOKEN LAUNCH
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500 uppercase">Floor Price</span>
          </div>
          <div className="text-xl font-bold">{isAbraham ? '0.42 ETH' : '0.28 ETH'}</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500 uppercase">Holders</span>
          </div>
          <div className="text-xl font-bold">{isAbraham ? '127' : '89'}</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 uppercase">Total Volume</span>
          </div>
          <div className="text-xl font-bold">{isAbraham ? '47.3 ETH' : '18.7 ETH'}</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 uppercase">Created</span>
          </div>
          <div className="text-xl font-bold">{isAbraham ? '39 / 100' : '17 / 100'}</div>
        </div>
      </div>
    </div>
  );
}