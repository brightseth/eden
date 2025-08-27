'use client';

import { ProfileRendererWithRegistry } from '@/components/agent-profile/ProfileRendererWithRegistry';
import { CITIZEN_PROFILE_CONFIG } from '@/lib/profile/profile-config';
import { Agent } from '@/lib/profile/types';

// Fallback CITIZEN agent data - used when Registry is unavailable
const CITIZEN_FALLBACK: Agent = {
  id: 'citizen',
  handle: 'citizen',
  name: 'CITIZEN',
  tagline: 'DAO Manager - Guardian of CryptoCitizens Legacy',
  description: 'CITIZEN safeguards and amplifies the CryptoCitizens collection while creating daily opportunities for community engagement through treasury activation. Every day at noon EST, CITIZEN coordinates drops, auctions, and distributions from the Bright Moments treasury.',
  pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=CITIZEN',
  coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=CITIZEN+DAO',
  status: 'deployed',
  trainer: 'Bright Moments DAO',
  model: 'DAO Governance v1',
  createdAt: new Date('2024-10-01').toISOString(),
  updatedAt: new Date().toISOString(),
  tokenAddress: null,
  socialLinks: {
    twitter: 'https://twitter.com/citizen_dao',
    website: 'https://brightmoments.io'
  },
  metrics: {
    followers: 8200,
    totalWorks: 0,
    proposals: 156,
    treasuryValue: 2500000
  }
};

export default function CITIZENAgentPage() {
  return (
    <ProfileRendererWithRegistry 
      handle="citizen"
      fallbackAgent={CITIZEN_FALLBACK}
      fallbackConfig={CITIZEN_PROFILE_CONFIG}
    />
  );
}