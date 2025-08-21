'use client';

import { Heart, ShoppingCart, Eye, Gavel } from 'lucide-react';

interface StickyCTAProps {
  agentName: string;
  isGraduated?: boolean;
  currentTab?: string;
}

export function StickyCTA({ agentName, isGraduated = false, currentTab = 'collect' }: StickyCTAProps) {
  let ctaData;
  
  switch(agentName) {
    case 'ABRAHAM':
      ctaData = {
        followAction: () => window.open('https://twitter.com/abraham_ai', '_blank'),
        primaryAction: () => window.open('https://opensea.io/abraham', '_blank'),
        primaryLabel: isGraduated ? 'BUY NOW' : 'BID NOW',
        primaryIcon: isGraduated ? ShoppingCart : Gavel,
        price: '0.67 ETH',
        followers: '1,247'
      };
      break;
      
    case 'SOLIENNE':
      ctaData = {
        followAction: () => window.open('https://twitter.com/solienne_ai', '_blank'),
        primaryAction: () => window.open('https://solienne.ai/shop', '_blank'),
        primaryLabel: 'BUY NOW',
        primaryIcon: ShoppingCart,
        price: '$250',
        followers: '892'
      };
      break;
      
    case 'GEPPETTO':
      ctaData = {
        followAction: () => window.open('https://twitter.com/geppetto_ai', '_blank'),
        primaryAction: () => alert('Coming Soon! Geppetto launches Dec 15'),
        primaryLabel: 'COMING SOON',
        primaryIcon: Eye,
        price: 'TBD',
        followers: '423'
      };
      break;
      
    case 'KORU':
      ctaData = {
        followAction: () => window.open('https://twitter.com/koru_ai', '_blank'),
        primaryAction: () => alert('Coming Soon! Koru launches Jan 15'),
        primaryLabel: 'COMING SOON',
        primaryIcon: Eye,
        price: 'TBD',
        followers: '156'
      };
      break;
      
    default:
      ctaData = {
        followAction: () => {},
        primaryAction: () => {},
        primaryLabel: 'COMING SOON',
        primaryIcon: Eye,
        price: 'TBD',
        followers: '0'
      };
  }

  // Only show on collect tab
  if (currentTab !== 'collect') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-gray-800 md:hidden">
      <div className="flex items-center justify-between p-4">
        {/* Left: Follow */}
        <button
          onClick={ctaData.followAction}
          className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-colors"
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">Follow</span>
          <span className="text-xs text-gray-400">({ctaData.followers})</span>
        </button>

        {/* Center: Price */}
        <div className="text-center">
          <p className="text-xs text-gray-500">CURRENT PRICE</p>
          <p className="text-lg font-bold text-white">{ctaData.price}</p>
        </div>

        {/* Right: Primary Action */}
        <button
          onClick={ctaData.primaryAction}
          className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold hover:bg-gray-200 transition-colors"
        >
          <ctaData.primaryIcon className="w-4 h-4" />
          <span className="text-sm">{ctaData.primaryLabel}</span>
        </button>
      </div>
    </div>
  );
}