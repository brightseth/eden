'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check, Shield, Coins, Hash } from 'lucide-react';

interface ProvenanceCardProps {
  agentHandle: string;
  agentName: string;
  contractAddress?: string;
  tokenSymbol?: string;
  chainId?: number;
  launchDate?: string;
  totalSupply?: string;
  compact?: boolean;
}

export function ProvenanceCard({
  agentHandle,
  agentName,
  contractAddress = "0x742d35cc2b5d57842e36...", // Placeholder - would come from Registry
  tokenSymbol = "$ABRAHAM",
  chainId = 1,
  launchDate = "2025-10-19",
  totalSupply = "1,000,000,000",
  compact = false
}: ProvenanceCardProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  const copyToClipboard = async (text: string, type: 'address' | 'token') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'address') {
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 2000);
      } else {
        setCopiedToken(true);
        setTimeout(() => setCopiedToken(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getExplorerUrl = (address: string, chainId: number) => {
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      137: 'https://polygonscan.com',
      42161: 'https://arbiscan.io',
      8453: 'https://basescan.org'
    };
    
    const baseUrl = explorers[chainId] || explorers[1];
    return `${baseUrl}/address/${address}`;
  };

  const getChainName = (chainId: number) => {
    const chains: Record<number, string> = {
      1: 'Ethereum',
      137: 'Polygon',
      42161: 'Arbitrum',
      8453: 'Base'
    };
    return chains[chainId] || 'Ethereum';
  };

  const getDexScreenerUrl = (tokenSymbol: string) => {
    // This would be the actual DEX screener URL for the token
    return `https://dexscreener.com/ethereum/${contractAddress}`;
  };

  if (compact) {
    return (
      <div className="border border-white p-4">
        <div className="flex items-center gap-3 mb-3">
          <Shield className="w-5 h-5" />
          <h3 className="text-lg">Provenance</h3>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span>Token:</span>
            <button
              onClick={() => copyToClipboard(tokenSymbol, 'token')}
              className="flex items-center gap-1 hover:bg-white hover:text-black px-1 py-0.5 transition-colors"
            >
              {tokenSymbol}
              {copiedToken ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>Contract:</span>
            <button
              onClick={() => copyToClipboard(contractAddress, 'address')}
              className="flex items-center gap-1 hover:bg-white hover:text-black px-1 py-0.5 transition-colors font-mono text-xs"
            >
              {formatAddress(contractAddress)}
              {copiedAddress ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
          <div className="flex justify-between items-center">
            <span>Chain:</span>
            <span>{getChainName(chainId)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white">
      {/* Header */}
      <div className="border-b border-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6" />
          <h2 className="text-2xl">PROVENANCE & TOKENOMICS</h2>
        </div>
        <p className="text-sm opacity-75">
          Immutable on-chain verification for {agentName}'s creative output and economic value
        </p>
      </div>

      {/* Contract Information */}
      <div className="p-6 border-b border-white">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <Hash className="w-5 h-5" />
          Contract Details
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold block mb-1">Token Symbol</label>
              <div className="flex items-center gap-2">
                <div className="font-mono text-lg">{tokenSymbol}</div>
                <button
                  onClick={() => copyToClipboard(tokenSymbol, 'token')}
                  className="p-1 hover:bg-white hover:text-black transition-colors"
                  title="Copy token symbol"
                >
                  {copiedToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-bold block mb-1">Contract Address</label>
              <div className="flex items-center gap-2">
                <div className="font-mono text-sm">{contractAddress}</div>
                <button
                  onClick={() => copyToClipboard(contractAddress, 'address')}
                  className="p-1 hover:bg-white hover:text-black transition-colors"
                  title="Copy contract address"
                >
                  {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-bold block mb-1">Blockchain</label>
              <div className="text-sm">{getChainName(chainId)} (Chain ID: {chainId})</div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold block mb-1">Launch Date</label>
              <div className="text-sm">{launchDate}</div>
            </div>
            
            <div>
              <label className="text-sm font-bold block mb-1">Total Supply</label>
              <div className="text-sm">{totalSupply} {tokenSymbol}</div>
            </div>
            
            <div>
              <label className="text-sm font-bold block mb-1">Status</label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="text-sm">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="p-6">
        <h3 className="text-xl mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5" />
          Verification Links
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href={getExplorerUrl(contractAddress, chainId)}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white p-4 hover:bg-white hover:text-black transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-5 h-5" />
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="font-bold mb-1">{getChainName(chainId)} Explorer</div>
            <div className="text-sm opacity-75">View contract details, transactions, and ownership</div>
          </a>
          
          <a
            href={getDexScreenerUrl(tokenSymbol)}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white p-4 hover:bg-white hover:text-black transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Coins className="w-5 h-5" />
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="font-bold mb-1">DEX Screener</div>
            <div className="text-sm opacity-75">Real-time trading data and price charts</div>
          </a>
          
          <a
            href={`https://coinmarketcap.com/currencies/${agentHandle}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white p-4 hover:bg-white hover:text-black transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Hash className="w-5 h-5" />
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </div>
            <div className="font-bold mb-1">CoinMarketCap</div>
            <div className="text-sm opacity-75">Market cap, volume, and trading information</div>
          </a>
        </div>
      </div>

      {/* Distribution Breakdown */}
      <div className="p-6 border-t border-white">
        <h3 className="text-xl mb-4">Token Distribution</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">25%</div>
            <div className="text-sm">{agentName}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">25%</div>
            <div className="text-sm">Eden Academy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">25%</div>
            <div className="text-sm">$SPIRIT Holders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">25%</div>
            <div className="text-sm">Trainer</div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-gray-900/50 border border-gray-600">
          <div className="text-sm font-bold mb-2">🔐 Security Note</div>
          <div className="text-xs opacity-75">
            This contract has been audited and verified. All token holders participate in the 
            13-year covenant revenue model with automatic distribution of collection proceeds.
          </div>
        </div>
      </div>
    </div>
  );
}