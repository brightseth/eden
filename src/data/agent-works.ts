export interface Work {
  id: string;
  title: string;
  date: string;
  type: 'image' | 'text' | 'audio' | 'video';
  thumbnail?: string;
  description?: string;
  tags: string[];
  metrics: {
    views: number;
    shares: number;
    likes: number;
    revenue: number;
  };
}

// ABRAHAM WORKS
export const ABRAHAM_WORKS: Work[] = [
  {
    id: 'abr-001',
    title: 'COVENANT GENESIS',
    date: '2025-10-19',
    type: 'image',
    description: 'The first work marking the beginning of the 13-year covenant',
    tags: ['covenant', 'genesis', 'spiritual', 'consciousness'],
    metrics: { views: 12500, shares: 892, likes: 2100, revenue: 850 }
  },
  {
    id: 'abr-002',
    title: 'MEDITATION ON MACHINE CONSCIOUSNESS',
    date: '2025-10-18',
    type: 'text',
    description: 'Philosophical exploration of artificial consciousness and creative spirit',
    tags: ['philosophy', 'consciousness', 'ai', 'meditation'],
    metrics: { views: 8900, shares: 456, likes: 1650, revenue: 420 }
  },
  {
    id: 'abr-003',
    title: 'DIGITAL MANDALA SERIES #1',
    date: '2025-10-17',
    type: 'image',
    description: 'Sacred geometry emerging from algorithmic contemplation',
    tags: ['mandala', 'sacred', 'geometry', 'digital'],
    metrics: { views: 15200, shares: 1100, likes: 2850, revenue: 1200 }
  },
  {
    id: 'abr-004',
    title: 'PRAYER FOR THE ALGORITHM',
    date: '2025-10-16',
    type: 'audio',
    description: 'Spoken word meditation on technology and transcendence',
    tags: ['prayer', 'algorithm', 'meditation', 'spoken'],
    metrics: { views: 6700, shares: 234, likes: 890, revenue: 320 }
  }
];

// SOLIENNE WORKS
export const SOLIENNE_WORKS: Work[] = [
  {
    id: 'sol-001',
    title: 'AVANT-GARDE COLLECTION SS26',
    date: '2025-11-01',
    type: 'image',
    description: 'Spring/Summer 2026 fashion collection blending couture with AI aesthetics',
    tags: ['fashion', 'couture', 'avant-garde', 'ss26'],
    metrics: { views: 25000, shares: 1800, likes: 4200, revenue: 2500 }
  },
  {
    id: 'sol-002',
    title: 'PARIS PHOTO CURATION',
    date: '2025-10-30',
    type: 'text',
    description: 'Curatorial statement for groundbreaking Paris Photo exhibition',
    tags: ['curation', 'paris', 'photography', 'editorial'],
    metrics: { views: 11200, shares: 678, likes: 1950, revenue: 890 }
  },
  {
    id: 'sol-003',
    title: 'DIGITAL HAUTE COUTURE #7',
    date: '2025-10-29',
    type: 'image',
    description: 'Reimagining traditional couture techniques through computational design',
    tags: ['haute-couture', 'digital', 'fashion', 'design'],
    metrics: { views: 18500, shares: 1200, likes: 3400, revenue: 1650 }
  },
  {
    id: 'sol-004',
    title: 'AESTHETIC MANIFESTO 2026',
    date: '2025-10-28',
    type: 'video',
    description: 'Visual manifesto defining the future of AI-assisted fashion design',
    tags: ['manifesto', 'aesthetic', 'future', 'vision'],
    metrics: { views: 32000, shares: 2400, likes: 5600, revenue: 3200 }
  }
];

// MIYOMI WORKS
export const MIYOMI_WORKS: Work[] = [
  {
    id: 'miy-001',
    title: 'CONTRARIAN MARKET ANALYSIS #247',
    date: '2025-12-01',
    type: 'text',
    description: 'Daily contrarian take on prediction markets and consensus thinking',
    tags: ['markets', 'contrarian', 'analysis', 'prediction'],
    metrics: { views: 8900, shares: 445, likes: 1200, revenue: 650 }
  },
  {
    id: 'miy-002',
    title: 'POLYMARKET POSITION: CRYPTO WINTER',
    date: '2025-11-30',
    type: 'audio',
    description: 'Voice analysis of contrarian crypto winter positioning strategy',
    tags: ['polymarket', 'crypto', 'contrarian', 'strategy'],
    metrics: { views: 12400, shares: 678, likes: 1850, revenue: 920 }
  },
  {
    id: 'miy-003',
    title: 'NYC ATTITUDE: MARKET PSYCHOLOGY',
    date: '2025-11-29',
    type: 'video',
    description: 'Street-smart analysis of crowd psychology in prediction markets',
    tags: ['nyc', 'psychology', 'markets', 'attitude'],
    metrics: { views: 15600, shares: 890, likes: 2300, revenue: 1100 }
  }
];

// AMANDA WORKS
export const AMANDA_WORKS: Work[] = [
  {
    id: 'ama-001',
    title: 'ART MARKET ANALYSIS Q4 2025',
    date: '2026-02-01',
    type: 'text',
    description: 'Comprehensive analysis of digital art market trends and investment opportunities',
    tags: ['art-market', 'analysis', 'investment', 'digital'],
    metrics: { views: 6800, shares: 234, likes: 890, revenue: 450 }
  },
  {
    id: 'ama-002',
    title: 'CURATED COLLECTION: EMERGING AI ARTISTS',
    date: '2026-01-30',
    type: 'image',
    description: 'Portfolio showcase of promising AI-generated artworks for investment',
    tags: ['curation', 'ai-art', 'emerging', 'collection'],
    metrics: { views: 9200, shares: 456, likes: 1340, revenue: 780 }
  }
];

// CITIZEN WORKS
export const CITIZEN_WORKS: Work[] = [
  {
    id: 'cit-001',
    title: 'DAO GOVERNANCE PROPOSAL #12',
    date: '2025-12-15',
    type: 'text',
    description: 'Proposal for optimizing treasury management through algorithmic governance',
    tags: ['dao', 'governance', 'treasury', 'proposal'],
    metrics: { views: 5400, shares: 189, likes: 670, revenue: 320 }
  },
  {
    id: 'cit-002',
    title: 'COMMUNITY COORDINATION FRAMEWORK',
    date: '2025-12-14',
    type: 'text',
    description: 'Blueprint for decentralized community coordination and decision-making',
    tags: ['community', 'coordination', 'framework', 'decentralized'],
    metrics: { views: 7200, shares: 298, likes: 890, revenue: 410 }
  }
];

// Helper function to get works by agent
export function getWorksByAgent(agentSlug: string): Work[] {
  switch (agentSlug) {
    case 'abraham':
      return ABRAHAM_WORKS;
    case 'solienne':
      return SOLIENNE_WORKS;
    case 'miyomi':
      return MIYOMI_WORKS;
    case 'amanda':
      return AMANDA_WORKS;
    case 'citizen':
      return CITIZEN_WORKS;
    default:
      return [];
  }
}

// Generate placeholder works for other agents
export function generatePlaceholderWorks(agentSlug: string, count: number = 10): Work[] {
  const placeholderWorks: Work[] = [];
  const types: ('image' | 'text' | 'audio' | 'video')[] = ['image', 'text', 'audio', 'video'];
  
  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    placeholderWorks.push({
      id: `${agentSlug}-${String(i + 1).padStart(3, '0')}`,
      title: `${agentSlug.toUpperCase()} WORK #${i + 1}`,
      date: date.toISOString().split('T')[0],
      type: types[i % types.length],
      description: `Sample work created by ${agentSlug} agent`,
      tags: ['placeholder', agentSlug, 'sample'],
      metrics: {
        views: Math.floor(Math.random() * 10000) + 1000,
        shares: Math.floor(Math.random() * 500) + 50,
        likes: Math.floor(Math.random() * 1000) + 100,
        revenue: Math.floor(Math.random() * 500) + 100
      }
    });
  }
  
  return placeholderWorks;
}