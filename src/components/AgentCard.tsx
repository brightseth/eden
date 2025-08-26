'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useFeatureFlag } from '@/config/flags';
import { spiritClient } from '@/lib/registry/spirit-client';

interface GenesisAgentDisplay {
  id: string;
  name: string;
  status: string;
  date?: string;
  hasProfile?: boolean;
  trainer?: string;
  worksCount?: number;
  description?: string;
  image?: string;
  trainerStatus?: string;
}

interface OnchainStatus {
  isDeployed: boolean;
  tokenAddress?: string;
  deploymentDate?: string;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  lastSyncAt: string;
}

interface AgentCardProps {
  agent: GenesisAgentDisplay;
  variant: 'launching' | 'developing' | 'partnership';
  showOnchainBadges?: boolean;
}

export function AgentCard({ agent, variant, showOnchainBadges = true }: AgentCardProps) {
  const spiritEnabled = useFeatureFlag('ENABLE_SPIRIT_REGISTRY');
  const badgesEnabled = useFeatureFlag('ENABLE_ONCHAIN_BADGES');
  const [onchainStatus, setOnchainStatus] = useState<OnchainStatus | null>(null);
  const [loadingOnchain, setLoadingOnchain] = useState(false);

  useEffect(() => {
    async function fetchOnchainStatus() {
      if (!spiritEnabled || !badgesEnabled || !showOnchainBadges) return;
      
      setLoadingOnchain(true);
      try {
        console.log(`[AgentCard] Fetching onchain status for ${agent.id}...`);
        
        const cohortData = await spiritClient.getGenesisCohort();
        const agentOnchain = cohortData.agents.find(a => 
          a.handle?.toLowerCase() === agent.id.toLowerCase()
        );
        
        if (agentOnchain) {
          setOnchainStatus({
            isDeployed: !!agentOnchain.tokenAddress,
            tokenAddress: agentOnchain.tokenAddress,
            deploymentDate: agentOnchain.deploymentDate,
            verificationStatus: agentOnchain.tokenAddress ? 'verified' : 'unverified',
            lastSyncAt: new Date().toISOString()
          });
        }
        
      } catch (error) {
        console.warn(`[AgentCard] Failed to fetch onchain status for ${agent.id}:`, error);
        // Gracefully degrade - no onchain badges shown
      } finally {
        setLoadingOnchain(false);
      }
    }

    fetchOnchainStatus();
  }, [agent.id, spiritEnabled, badgesEnabled, showOnchainBadges]);

  const OnchainBadge = () => {
    if (!spiritEnabled || !badgesEnabled || !showOnchainBadges || loadingOnchain) return null;
    
    if (!onchainStatus) return null;

    return (
      <div className="flex items-center gap-2">
        {onchainStatus.isDeployed ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-mono">ONCHAIN</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-xs font-mono opacity-50">OFFCHAIN</span>
          </div>
        )}
      </div>
    );
  };

  const TokenInfo = () => {
    if (!onchainStatus?.tokenAddress) return null;
    
    return (
      <div className="text-xs font-mono opacity-75">
        TOKEN: {onchainStatus.tokenAddress.slice(0, 8)}...{onchainStatus.tokenAddress.slice(-6)}
      </div>
    );
  };

  // Launching agents - large cards with full details
  if (variant === 'launching') {
    const href = agent.hasProfile ? `/academy/agent/${agent.name.toLowerCase()}` : '#';
    
    return (
      <Link 
        href={href}
        className="border border-white p-8 hover:bg-white hover:text-black transition-all block group"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <h3 className="text-2xl font-bold">{agent.name}</h3>
            <OnchainBadge />
          </div>
          <span className="text-sm">{agent.date}</span>
        </div>
        <p className="text-sm mb-4">{agent.description}</p>
        <div className="text-xs space-y-1">
          <div>{agent.trainer}</div>
          <div>{agent.worksCount} WORKS</div>
          <TokenInfo />
        </div>
      </Link>
    );
  }

  // Developing agents - medium cards
  if (variant === 'developing') {
    return (
      <div className="border border-white p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold">{agent.name}</h3>
              <OnchainBadge />
            </div>
            <p className="text-xs mb-2">{agent.date || 'Q1 2026'}</p>
          </div>
          <span className="text-xs bg-black text-white border border-white px-2 py-1">
            IN DEVELOPMENT
          </span>
        </div>
        <p className="text-xs opacity-75 mb-2">{agent.trainer}</p>
        <TokenInfo />
      </div>
    );
  }

  // Partnership cards - detailed partnership info
  if (variant === 'partnership') {
    const partnershipDetails = getPartnershipDetails(agent.id);
    
    return (
      <div className="border border-white p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-bold">{agent.name}</h4>
            <OnchainBadge />
          </div>
          <span className="text-xs bg-white text-black px-2 py-1">
            SEEKING PARTNER
          </span>
        </div>
        <p className="text-sm mb-3 font-bold">{partnershipDetails.subtitle}</p>
        <p className="text-xs mb-4 opacity-75">{partnershipDetails.description}</p>
        <div className="text-xs mb-4 space-y-1">
          {partnershipDetails.benefits.map((benefit, idx) => (
            <div key={idx}>→ {benefit}</div>
          ))}
        </div>
        <div className="mb-4">
          <TokenInfo />
        </div>
        <Link
          href={`/academy/agent/${agent.id}`}
          className="inline-block border border-white px-4 py-2 text-xs hover:bg-white hover:text-black transition-all w-full text-center"
        >
          EXPLORE PARTNERSHIP →
        </Link>
      </div>
    );
  }

  return null;
}

function getPartnershipDetails(agentId: string) {
  const details: Record<string, { subtitle: string; description: string; benefits: string[] }> = {
    'miyomi': {
      subtitle: 'Market Contrarian & Cultural Analyst',
      description: 'Train an AI to spot cultural mispricings before markets catch on while mastering prediction market strategy.',
      benefits: [
        'Learn contrarian market analysis',
        'Access prediction market networks',
        'Co-develop AI analysis frameworks'
      ]
    },
    'amanda': {
      subtitle: 'Art Collector & Investment Strategist',
      description: 'Build curated art collections with an AI partner while learning investment strategy and market analysis.',
      benefits: [
        'Master art market dynamics',
        'Build collector networks',
        'Develop investment frameworks'
      ]
    },
    'citizen': {
      subtitle: 'DAO Manager & Governance Coordinator',
      description: 'Pioneer decentralized governance with an AI that manages DAO operations and community coordination.',
      benefits: [
        'Learn DAO governance strategies',
        'Build community networks',
        'Shape decentralized systems'
      ]
    },
    'nina': {
      subtitle: 'Design Critic & Aesthetic Curator',
      description: 'Develop critical frameworks with an AI that analyzes and curates design across digital and physical spaces.',
      benefits: [
        'Master design criticism',
        'Build curatorial expertise',
        'Shape aesthetic discourse'
      ]
    }
  };
  
  return details[agentId] || {
    subtitle: 'Creative Partnership Available',
    description: 'Collaborate with an AI agent while advancing creative practices.',
    benefits: ['Learn new creative techniques', 'Build professional networks', 'Develop innovative frameworks']
  };
}