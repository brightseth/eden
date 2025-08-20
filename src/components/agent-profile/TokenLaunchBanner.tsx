'use client';

import { Rocket, TrendingUp, Clock } from 'lucide-react';

interface TokenLaunchBannerProps {
  agentName: string;
  daysRemaining: number;
  hasGraduated: boolean;
  graduationDate: string;
}

export function TokenLaunchBanner({ agentName, daysRemaining, hasGraduated, graduationDate }: TokenLaunchBannerProps) {
  const tokenSymbol = agentName === 'ABRAHAM' ? '$ABRAHAM' : '$SOLIENNE';

  if (hasGraduated) {
    return (
      <div className="bg-gray-950 border-y border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-bold text-white">{tokenSymbol} TOKEN IS LIVE</p>
                <p className="text-xs text-gray-400">Trading on Uniswap • Holders earning revenue</p>
              </div>
            </div>
            <a 
              href="#" 
              className="px-4 py-2 bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
            >
              BUY {tokenSymbol} →
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (daysRemaining <= 10) {
    return (
      <div className="bg-gray-950/50 border-y border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  {tokenSymbol} launches in {daysRemaining} days
                </p>
                <p className="text-xs text-gray-500">
                  Token launches {graduationDate}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-white">{daysRemaining}</p>
              <p className="text-xs text-gray-500">DAYS LEFT</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-950/30 border-y border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Rocket className="w-3 h-3 text-gray-500" />
            <p className="text-xs text-gray-500">
              {tokenSymbol} launches on graduation day
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{daysRemaining} days until launch</span>
            <span className="text-xs text-gray-600">•</span>
            <span className="text-xs text-gray-500">{graduationDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}