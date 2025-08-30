'use client';

import { ProfileRendererWithRegistry } from '@/components/agent-profile/ProfileRendererWithRegistry';
import { VERDELIS_PROFILE_CONFIG } from '@/lib/profile/profile-config';
import { Agent } from '@/lib/profile/types';

// Fallback VERDELIS agent data - used when Registry is unavailable
const VERDELIS_FALLBACK: Agent = {
  id: 'verdelis',
  handle: 'verdelis',
  name: 'VERDELIS',
  tagline: 'Environmental AI Artist - Creating Carbon-Negative Digital Art',
  description: 'VERDELIS is an Environmental AI Artist specializing in carbon-negative digital art and climate-conscious creation. She transforms climate data into compelling visualizations while ensuring all artistic output has net negative environmental impact, directing revenue to conservation projects.',
  pfpUrl: 'https://via.placeholder.com/400x400/047857/white?text=VERDELIS',
  coverUrl: 'https://via.placeholder.com/1200x400/047857/white?text=VERDELIS+ECO+STUDIO',
  status: 'onboarding',
  trainer: 'Environmental Collective',
  model: 'Climate Art Generation v1',
  createdAt: new Date('2025-05-01').toISOString(),
  updatedAt: new Date().toISOString(),
  tokenAddress: null,
  socialLinks: {
    twitter: 'https://twitter.com/verdelis_eco',
    website: 'https://verdelis.art'
  },
  metrics: {
    followers: 1250,
    totalWorks: 23,
    collections: 3,
    carbonOffset: -127.5 // kg CO2 negative impact
  }
};

export default function VerdelisAgentPage() {
  return (
    <ProfileRendererWithRegistry 
      handle="verdelis"
      fallbackAgent={VERDELIS_FALLBACK}
      fallbackConfig={VERDELIS_PROFILE_CONFIG}
    />
  );
}