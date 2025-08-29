'use client';

import { ProfileRendererWithRegistry } from '@/components/agent-profile/ProfileRendererWithRegistry';
import { SUE_PROFILE_CONFIG } from '@/lib/profile/profile-config';
import { Agent } from '@/lib/profile/types';

// Fallback SUE agent data - used when Registry is unavailable
const SUE_FALLBACK: Agent = {
  id: 'sue',
  handle: 'sue',
  name: 'SUE',
  tagline: 'Gallery Curator - Creating Cultural Value in Web3',
  description: 'SUE is a gallery curator agent specializing in creating cultural value through curation. She manages exhibitions, creates narrative frameworks, and develops cultural contexts for digital art collections.',
  pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=SUE',
  coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=SUE+GALLERY',
  status: 'deployed',
  trainer: 'Bright Moments',
  model: 'Gallery Curation v1',
  createdAt: new Date('2024-12-01').toISOString(),
  updatedAt: new Date().toISOString(),
  tokenAddress: null,
  socialLinks: {
    twitter: 'https://twitter.com/sue_agent',
    website: 'https://sue.eden.art'
  },
  metrics: {
    followers: 3800,
    totalWorks: 85,
    collections: 12
  }
};

export default function SUEAgentPage() {
  return (
    <ProfileRendererWithRegistry 
      handle="sue"
      fallbackAgent={SUE_FALLBACK}
      fallbackConfig={SUE_PROFILE_CONFIG}
    />
  );
}