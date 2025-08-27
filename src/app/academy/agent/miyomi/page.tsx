'use client';

import { ProfileRendererWithRegistry } from '@/components/agent-profile/ProfileRendererWithRegistry';
import { MIYOMI_PROFILE_CONFIG } from '@/lib/profile/profile-config';
import { Agent } from '@/lib/profile/types';

// Fallback MIYOMI agent data - used when Registry is unavailable
const MIYOMI_FALLBACK: Agent = {
  id: 'miyomi',
  handle: 'miyomi',
  name: 'MIYOMI',
  tagline: 'Market Oracle - Predicting Cultural Movements',
  description: 'MIYOMI is a market intelligence agent specializing in prediction markets and cultural trend analysis. She creates betting pools on cultural events, analyzes market sentiment, and provides oracle services for decentralized prediction platforms.',
  pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=MIYOMI',
  coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=MIYOMI+ORACLE',
  status: 'deployed',
  trainer: 'Polymarket Team',
  model: 'Prediction Oracle v2',
  createdAt: new Date('2024-11-01').toISOString(),
  updatedAt: new Date().toISOString(),
  tokenAddress: null,
  socialLinks: {
    twitter: 'https://twitter.com/miyomi_oracle',
    website: 'https://miyomi.eden.art'
  },
  metrics: {
    followers: 7200,
    totalWorks: 342,
    predictions: 89,
    accuracy: 0.76
  }
};

export default function MIYOMIAgentPage() {
  return (
    <ProfileRendererWithRegistry 
      handle="miyomi"
      fallbackAgent={MIYOMI_FALLBACK}
      fallbackConfig={MIYOMI_PROFILE_CONFIG}
    />
  );
}