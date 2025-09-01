'use client';

import { useState, useEffect } from 'react';
import { MarketPick } from '@/lib/agents/miyomi-claude-sdk';
import { revenueEngine } from '@/lib/agents/miyomi-revenue-engine';

interface SponsoredPickProps {
  pick: MarketPick & {
    isSponsored?: boolean;
    sponsorPlatform?: string;
    sponsorshipType?: string;
    referralLink?: string;
    trackingPixel?: string;
  };
  userId?: string;
}

export function SponsoredPick({ pick, userId }: SponsoredPickProps) {
  const [hasClicked, setHasClicked] = useState(false);
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    // Load tracking pixel if present
    if (pick.trackingPixel && isTracking) {
      const img = new Image();
      img.src = pick.trackingPixel;
      img.onload = () => console.log('Sponsorship impression tracked');
    }
  }, [pick.trackingPixel, isTracking]);

  const handlePlatformClick = async (platform: string) => {
    if (!hasClicked) {
      setHasClicked(true);
      
      // Track click event
      await revenueEngine.trackEvent({
        type: 'click',
        platform: platform,
        userId: userId,
        pickId: (pick as any).id || 'unknown',
        value: 2.50, // Example CPM value
        metadata: {
          sponsorshipType: pick.sponsorshipType,
          referralLink: pick.referralLink
        }
      });
    }

    // Open referral link
    if (pick.referralLink) {
      window.open(pick.referralLink, '_blank', 'noopener,noreferrer');
    }
  };

  const getSponsorshipLabel = () => {
    switch (pick.sponsorshipType) {
      case 'traffic_driving':
        return '🚀 Sponsored Traffic';
      case 'pick_featuring':
        return '⭐ Featured Pick';
      case 'video_integration':
        return '🎥 Video Partner';
      default:
        return '💰 Sponsored';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      'Kalshi': '🏛️',
      'Polymarket': '📊',
      'Manifold': '🎯',
      'Myriad': '🔮'
    };
    return icons[platform] || '📈';
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 relative">
      {/* Sponsorship Badge */}
      {pick.isSponsored && (
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
            {getSponsorshipLabel()}
          </span>
          {pick.sponsorPlatform && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
              {getPlatformIcon(pick.sponsorPlatform)} {pick.sponsorPlatform}
            </span>
          )}
        </div>
      )}

      <h3 className="text-2xl font-bold text-white mb-4 pr-32">{pick.market}</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-400">Platform</div>
          <div className="text-lg font-bold flex items-center">
            {getPlatformIcon(pick.platform)} {pick.platform}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Position</div>
          <div className={`text-lg font-bold ${
            pick.position === 'YES' || pick.position === 'OVER' 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {pick.position}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Confidence</div>
          <div className="text-lg font-bold">{(pick.confidence * 100).toFixed(1)}%</div>
        </div>
        <div>
          <div className="text-sm text-gray-400">Edge</div>
          <div className="text-lg font-bold text-green-400">
            {(pick.edge * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-bold text-white mb-2">MIYOMI's Analysis</h4>
        <p className="text-gray-300">{pick.reasoning}</p>
      </div>

      {/* Sponsored Call-to-Action */}
      {pick.isSponsored && pick.sponsorPlatform && (
        <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4 mb-4 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-bold mb-1">
                💎 Trade this pick on {pick.sponsorPlatform}
              </div>
              <div className="text-blue-200 text-sm">
                Get exclusive bonuses and better odds through MIYOMI's partnership
              </div>
            </div>
            <button
              onClick={() => handlePlatformClick(pick.sponsorPlatform!)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                hasClicked
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-105'
              }`}
            >
              {hasClicked ? '✅ Clicked' : '🚀 Trade Now'}
            </button>
          </div>
        </div>
      )}

      {/* Risk Disclosure for Sponsored Content */}
      {pick.isSponsored && (
        <div className="border-t border-gray-700 pt-4 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span>⚠️</span>
            <span>
              This is sponsored content. MIYOMI may receive compensation when you trade on {pick.sponsorPlatform}.
              Not financial advice - trade at your own risk.
            </span>
          </div>
        </div>
      )}

      {/* Sources */}
      {pick.sources && pick.sources.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-bold text-gray-400 mb-2">Sources</h4>
          <ul className="list-disc list-inside text-gray-400 text-sm">
            {pick.sources.map((source, idx) => (
              <li key={idx}>{source}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-gray-800 text-sm text-gray-400">
        <div>Sector: <span className="text-white">{pick.sector}</span></div>
        <div>Risk: <span className="text-white">{pick.risk_level}</span></div>
        <div>Timeframe: <span className="text-white">{pick.timeframe}</span></div>
      </div>
    </div>
  );
}