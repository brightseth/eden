'use client';

import { Clock, TrendingUp, ExternalLink } from 'lucide-react';

interface QuickBuyBarProps {
  agentName: string;
  currentDay: number;
}

export function QuickBuyBar({ agentName, currentDay }: QuickBuyBarProps) {
  const isAbraham = agentName === 'ABRAHAM';
  const dayOfWeek = new Date().getDay();
  const isSunday = dayOfWeek === 0;
  const isAbrahamSabbath = isAbraham && isSunday;

  // Current auction/product data
  const currentPrice = isAbraham ? '0.67 ETH' : '$250';
  const timeRemaining = isAbrahamSabbath ? 'Resting' : '14h 23m';
  const status = isAbrahamSabbath ? 'sabbath' : 'live';

  if (isAbrahamSabbath) {
    return (
      <div className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 border-y border-purple-400/20">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs text-gray-500">SABBATH DAY</p>
                <p className="text-sm font-bold">Abraham Rests</p>
              </div>
              <div className="h-8 w-px bg-gray-800" />
              <div>
                <p className="text-xs text-gray-500">NEXT AUCTION</p>
                <p className="text-sm font-bold">Monday 12:00 AM UTC</p>
              </div>
            </div>
            <div className="text-xs text-purple-400">
              Day of rest • No new creations
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-900/10 to-blue-900/10 border-y border-green-400/20">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Price and status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-green-400">LIVE NOW</span>
            </div>
            
            <div className="h-8 w-px bg-gray-800" />
            
            <div>
              <p className="text-xs text-gray-500">CURRENT {isAbraham ? 'BID' : 'PRICE'}</p>
              <p className="text-lg font-bold text-green-400">{currentPrice}</p>
            </div>
            
            <div className="h-8 w-px bg-gray-800" />
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">TIME LEFT</p>
                <p className="text-sm font-bold">{timeRemaining}</p>
              </div>
            </div>

            {isAbraham && (
              <>
                <div className="h-8 w-px bg-gray-800" />
                <div>
                  <p className="text-xs text-gray-500">BIDDERS</p>
                  <p className="text-sm font-bold">7</p>
                </div>
              </>
            )}

            {!isAbraham && (
              <>
                <div className="h-8 w-px bg-gray-800" />
                <div>
                  <p className="text-xs text-gray-500">REMAINING</p>
                  <p className="text-sm font-bold">67/100</p>
                </div>
              </>
            )}
          </div>

          {/* Right side - Quick buy button */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Creation #{currentDay}</p>
              <p className="text-xs text-gray-400">Day {currentDay} of 100</p>
            </div>
            
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              {isAbraham ? 'BID NOW' : 'BUY NOW'}
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}