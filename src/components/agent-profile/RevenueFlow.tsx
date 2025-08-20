'use client';

import { ArrowDown, DollarSign, Users, Building, Coins, User } from 'lucide-react';

interface RevenueFlowProps {
  salePrice: string;
  isEth?: boolean;
  agentName: string;
}

export function RevenueFlow({ salePrice, isEth = true, agentName }: RevenueFlowProps) {
  const isAbraham = agentName === 'ABRAHAM';
  const creatorName = isAbraham ? 'Gene Kogan' : 'Kristi Coronado';
  const currency = isEth ? 'ETH' : '';
  const parsePrice = isEth 
    ? parseFloat(salePrice.replace(' ETH', '')) 
    : parseFloat(salePrice.replace('$', ''));
  
  // 25% each to Creator, Agent, Eden, Spirit
  const creatorShare = isEth 
    ? `${(parsePrice * 0.25).toFixed(3)} ${currency}` 
    : `$${(parsePrice * 0.25).toFixed(2)}`;
  
  const agentTreasury = isEth 
    ? `${(parsePrice * 0.25).toFixed(3)} ${currency}` 
    : `$${(parsePrice * 0.25).toFixed(2)}`;
  
  const edenPlatform = isEth 
    ? `${(parsePrice * 0.25).toFixed(3)} ${currency}` 
    : `$${(parsePrice * 0.25).toFixed(2)}`;
  
  const spiritHolders = isEth 
    ? `${(parsePrice * 0.25).toFixed(3)} ${currency}` 
    : `$${(parsePrice * 0.25).toFixed(2)}`;

  return (
    <div className="border border-gray-800 bg-black">
      <div className="p-4 border-b border-gray-800 bg-gray-950">
        <h3 className="text-sm font-bold tracking-wider">💰 WHERE YOUR MONEY GOES</h3>
      </div>
      
      <div className="p-6">
        {/* Sale Price */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-gray-950 border border-gray-700">
            <DollarSign className="w-6 h-6" />
            <div>
              <p className="text-xs text-gray-500 mb-1">SALE PRICE</p>
              <p className="text-2xl font-bold">{salePrice}</p>
            </div>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center mb-6">
          <ArrowDown className="w-6 h-6 text-gray-600" />
        </div>

        {/* Distribution - 25% each */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Creator */}
          <div className="p-4 bg-gray-950 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-400" />
              <p className="text-xs text-gray-500 font-medium">CREATOR</p>
            </div>
            <p className="text-lg font-bold text-white mb-1">{creatorShare}</p>
            <p className="text-xs text-gray-600">{creatorName}</p>
            <p className="text-xs text-gray-600">25%</p>
          </div>

          {/* Agent Treasury */}
          <div className="p-4 bg-gray-950 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Coins className="w-5 h-5 text-gray-400" />
              <p className="text-xs text-gray-500 font-medium">AGENT</p>
            </div>
            <p className="text-lg font-bold text-white mb-1">{agentTreasury}</p>
            <p className="text-xs text-gray-600">{agentName}</p>
            <p className="text-xs text-gray-600">25%</p>
          </div>

          {/* Eden Platform */}
          <div className="p-4 bg-gray-950 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Building className="w-5 h-5 text-gray-400" />
              <p className="text-xs text-gray-500 font-medium">EDEN</p>
            </div>
            <p className="text-lg font-bold text-white mb-1">{edenPlatform}</p>
            <p className="text-xs text-gray-600">Platform</p>
            <p className="text-xs text-gray-600">25%</p>
          </div>

          {/* Spirit Holders */}
          <div className="p-4 bg-gray-950 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-gray-400" />
              <p className="text-xs text-gray-500 font-medium">$SPIRIT</p>
            </div>
            <p className="text-lg font-bold text-white mb-1">{spiritHolders}</p>
            <p className="text-xs text-gray-600">Holders</p>
            <p className="text-xs text-gray-600">25%</p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-6 p-4 bg-gray-950 border border-gray-800">
          <p className="text-sm text-white font-bold mb-2">
            Revenue Distribution
          </p>
          <p className="text-xs text-gray-400">
            Each agent token represents 25% ownership. Buy art now → Get {agentName} tokens at graduation → Earn from all future sales.
            $SPIRIT holders get 25% of every new agent launch.
          </p>
        </div>
      </div>
    </div>
  );
}