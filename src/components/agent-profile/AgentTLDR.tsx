'use client';

import { ArrowRight } from 'lucide-react';

interface AgentTLDRProps {
  agentName: string;
  currentDay: number;
  onCollectClick: () => void;
  currentTab?: string;
}

export function AgentTLDR({ agentName, currentDay, onCollectClick, currentTab = 'about' }: AgentTLDRProps) {
  let data;
  
  switch(agentName) {
    case 'ABRAHAM':
      data = {
        name: 'ABRAHAM',
        tagline: 'Creating daily for 13 years. No exceptions.',
        price: '0.52Ξ',
        priceLabel: 'Today',
        tokenDate: 'Oct 19',
        ctaText: 'BID NOW',
        day: 39
      };
      break;
      
    case 'SOLIENNE':
      data = {
        name: 'SOLIENNE',
        tagline: 'Physical art drops daily. Gallery quality.',
        price: '$250',
        priceLabel: 'Today',
        tokenDate: 'Nov 10',
        ctaText: 'BUY NOW',
        day: 17
      };
      break;
      
    case 'GEPPETTO':
      data = {
        name: 'GEPPETTO',
        tagline: 'Breathing life into digital beings. Daily character creations.',
        price: 'TBD',
        priceLabel: 'Starting',
        tokenDate: 'Dec 15',
        ctaText: 'COMING SOON',
        day: 0
      };
      break;
      
    case 'KORU':
      data = {
        name: 'KORU',
        tagline: 'Turning collective conversation into coordinated action.',
        price: 'TBD',
        priceLabel: 'Starting',
        tokenDate: 'Jan 15',
        ctaText: 'COMING SOON',
        day: 0
      };
      break;
      
    default:
      data = {
        name: agentName,
        tagline: 'Agent in development.',
        price: 'TBD',
        priceLabel: 'Status',
        tokenDate: 'TBD',
        ctaText: 'COMING SOON',
        day: 0
      };
  }

  return (
    <div className="border border-gray-800 bg-black">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Left: Name and Tagline */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
            <p className="text-gray-400 text-lg">{data.tagline}</p>
          </div>

          {/* Center: Key Stats */}
          <div className="flex gap-8 items-center">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">PROGRESS</p>
              <p className="text-xl font-bold text-white">Day {data.day}/100</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">{data.priceLabel.toUpperCase()}</p>
              <p className="text-xl font-bold">{data.price}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">TOKEN</p>
              <p className="text-xl font-bold">{data.tokenDate}</p>
            </div>
          </div>

          {/* Right: CTA */}
          <div className="flex flex-col items-start lg:items-end gap-3">
            {currentTab === 'about' ? (
              <button
                onClick={onCollectClick}
                className="px-6 py-3 border border-gray-600 hover:border-white transition-colors flex items-center gap-2"
              >
                VIEW COLLECTION
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onCollectClick}
                className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                {data.ctaText}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            <p className="text-xs text-gray-400 font-medium">
              {currentTab === 'about' 
                ? `Training at Eden Academy • Day ${data.day} of 100`
                : '25% to holders, 25% to creator, 25% to agent, 25% to Eden'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}