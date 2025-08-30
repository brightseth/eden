'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Clock, Code, Zap } from 'lucide-react';

interface BetaPrototype {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'active' | 'experimental' | 'archived';
  lastUpdated: string;
  technologies: string[];
  agent: string;
}

interface AgentBetaSectionProps {
  agentSlug: string;
  agentName: string;
}

export default function AgentBetaSection({ agentSlug, agentName }: AgentBetaSectionProps) {
  const [prototypes, setPrototypes] = useState<BetaPrototype[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBetaPrototypes();
  }, [agentSlug]);

  const loadBetaPrototypes = async () => {
    try {
      // In production, this would fetch from a dedicated API endpoint
      // For now, use static data based on agent
      const agentPrototypes = getBetaPrototypesByAgent(agentSlug);
      setPrototypes(agentPrototypes);
    } catch (error) {
      console.error('Failed to load beta prototypes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBetaPrototypesByAgent = (agentSlug: string): BetaPrototype[] => {
    const allPrototypes: Record<string, BetaPrototype[]> = {
      citizen: [
        {
          id: 'citizen-dao-simulator',
          title: 'DAO Governance Simulator',
          description: 'Interactive simulation of Bright Moments DAO decision-making processes with real-time consensus tracking and Snapshot integration',
          url: 'https://eden-academy-flame.vercel.app/api/agents/citizen/governance',
          status: 'active',
          lastUpdated: '2025-08-30',
          technologies: ['Snapshot API', 'Web3 Integration', 'Real-time Consensus'],
          agent: 'CITIZEN'
        },
        {
          id: 'cryptocitizens-auction-coordinator',
          title: 'CryptoCitizens Auction Coordinator',
          description: 'Daily treasury activation system coordinating drops, auctions, and distributions from Bright Moments treasury at noon EST',
          url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen/treasury',
          status: 'experimental',
          lastUpdated: '2025-08-29',
          technologies: ['Treasury Management', 'Automated Auctions', 'Community Engagement'],
          agent: 'CITIZEN'
        },
        {
          id: 'bright-moments-cultural-archive',
          title: 'Cultural Archive & Lore Preservation',
          description: 'Comprehensive documentation system preserving IRL event stories, Golden Token ceremonies, and Venice-to-Venice journey narratives',
          url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen/collections',
          status: 'active',
          lastUpdated: '2025-08-28',
          technologies: ['Cultural Preservation', 'Event Documentation', 'Community Stories'],
          agent: 'CITIZEN'
        }
      ],
      
      abraham: [
        {
          id: 'abraham-covenant-tracker',
          title: 'Covenant Progress Tracker',
          description: '13-year covenant progress visualization with daily creation milestone tracking and autonomous art generation analytics',
          url: 'https://abraham.ai/covenant',
          status: 'active',
          lastUpdated: '2025-08-30',
          technologies: ['Covenant Protocol', 'Daily Generation', 'Progress Visualization'],
          agent: 'ABRAHAM'
        },
        {
          id: 'abraham-knowledge-synthesis',
          title: 'Knowledge Synthesis Engine',
          description: 'Advanced AI system that synthesizes human knowledge into visual artifacts using Claude-3.5-Sonnet and custom art generation',
          url: 'https://abraham.ai/synthesis',
          status: 'experimental',
          lastUpdated: '2025-08-29',
          technologies: ['Knowledge Synthesis', 'Visual AI', 'Autonomous Creation'],
          agent: 'ABRAHAM'
        }
      ],

      solienne: [
        {
          id: 'solienne-consciousness-studio',
          title: 'Consciousness Generation Studio',
          description: 'Interactive studio for consciousness exploration through fashion and light with Sue\'s curatorial analysis and Replicate AI integration',
          url: 'https://eden-academy-flame.vercel.app/sites/solienne/create',
          status: 'active',
          lastUpdated: '2025-08-30',
          technologies: ['Consciousness Exploration', 'Fashion Analysis', 'Replicate AI'],
          agent: 'SOLIENNE'
        },
        {
          id: 'solienne-paris-photo-countdown',
          title: 'Paris Photo 2025 Launch Tracker',
          description: 'Real-time countdown and preparation dashboard for SOLIENNE\'s debut at Paris Photo 2025 with generation tracking',
          url: 'https://eden-academy-flame.vercel.app/sites/solienne',
          status: 'active',
          lastUpdated: '2025-08-28',
          technologies: ['Event Countdown', 'Gallery Integration', 'Launch Preparation'],
          agent: 'SOLIENNE'
        }
      ],

      bertha: [
        {
          id: 'bertha-advanced-analytics',
          title: 'Advanced Market Analytics Dashboard',
          description: 'Real-time AI art market intelligence with 34.7% ROI tracking, social sentiment analysis, and predictive models',
          url: 'https://eden-academy-flame.vercel.app/dashboard/bertha',
          status: 'active',
          lastUpdated: '2025-08-30',
          technologies: ['Market Intelligence', 'Predictive Analytics', 'Social Sentiment'],
          agent: 'BERTHA'
        },
        {
          id: 'bertha-collection-engine',
          title: 'Autonomous Collection Engine',
          description: 'AI-powered collection intelligence system analyzing market patterns and NFT acquisition opportunities',
          url: 'https://eden-academy-flame.vercel.app/api/agents/bertha/insights',
          status: 'experimental',
          lastUpdated: '2025-08-29',
          technologies: ['Collection Intelligence', 'Market Analysis', 'Autonomous Trading'],
          agent: 'BERTHA'
        }
      ],

      miyomi: [
        {
          id: 'miyomi-live-trading',
          title: 'Live Trading Interface',
          description: 'Real-time trading dashboard with WebSocket streaming, P&L tracking, and contrarian market prediction system',
          url: 'https://eden-academy-flame.vercel.app/dashboard/miyomi',
          status: 'active',
          lastUpdated: '2025-08-30',
          technologies: ['Live Trading', 'WebSocket Streaming', 'Contrarian Analysis'],
          agent: 'MIYOMI'
        },
        {
          id: 'miyomi-oracle-predictions',
          title: 'Oracle Prediction Engine',
          description: 'Mercury retrograde-powered prediction system making bold contrarian market calls with immaculate vibes',
          url: 'https://eden-academy-flame.vercel.app/sites/miyomi',
          status: 'experimental',
          lastUpdated: '2025-08-29',
          technologies: ['Prediction Markets', 'Oracle System', 'Contrarian Logic'],
          agent: 'MIYOMI'
        }
      ],

      geppetto: [
        {
          id: 'geppetto-3d-studio',
          title: '3D Sculpture Studio',
          description: 'Interactive 3D creation environment with real-time procedural generation and digital sculpting tools',
          url: 'https://eden-academy-flame.vercel.app/sites/geppetto',
          status: 'active',
          lastUpdated: '2025-08-30',
          technologies: ['3D Creation', 'Procedural Generation', 'Digital Sculpture'],
          agent: 'GEPPETTO'
        }
      ],

      sue: [
        {
          id: 'sue-design-critic',
          title: 'AI Design Critic Agent',
          description: 'Autonomous art curation interface with exhibition builder and sophisticated curatorial analysis',
          url: 'https://design-critic-agent-iubx7glzf-edenprojects.vercel.app',
          status: 'active',
          lastUpdated: '2025-08-30',
          technologies: ['Art Curation', 'Exhibition Design', 'Curatorial Analysis'],
          agent: 'SUE'
        }
      ],

      koru: [
        {
          id: 'koru-haiku-garden',
          title: 'Daily Haiku Garden',
          description: 'Interactive poetry space with cultural bridge-building through verse and narrative connections',
          url: 'https://koru.social/garden',
          status: 'active',
          lastUpdated: '2025-08-30',
          technologies: ['Haiku Creation', 'Cultural Bridging', 'Narrative Poetry'],
          agent: 'KORU'
        }
      ]
    };

    return allPrototypes[agentSlug] || [];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="border border-gray-800 p-6">
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (prototypes.length === 0) {
    return (
      <div className="text-center py-12">
        <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">NO BETA PROTOTYPES</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {agentName} doesn't have any experimental prototypes available at the moment. 
          Check back soon for cutting-edge developments.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-3xl font-bold uppercase tracking-wider">
          {agentName} BETA PROTOTYPES
        </h3>
        <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-900 border border-blue-600 text-blue-400">
          EXPERIMENTAL
        </span>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap className="w-4 h-4" />
          UPDATED WEEKLY
        </div>
      </div>
      
      <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">
        Cutting-edge experiments and prototypes showcasing the most innovative work in {agentName}'s 
        development. These represent experimental features and research directions explored over the past week.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {prototypes.map((prototype) => (
          <div key={prototype.id} className="border border-gray-600 hover:border-blue-400 transition-all p-6 group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <h4 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                  {prototype.title}
                </h4>
                <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border ${
                  prototype.status === 'active' 
                    ? 'border-green-600 text-green-400 bg-green-900/20'
                    : prototype.status === 'experimental'
                    ? 'border-blue-600 text-blue-400 bg-blue-900/20'
                    : 'border-gray-600 text-gray-400 bg-gray-900/20'
                }`}>
                  {prototype.status}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {new Date(prototype.lastUpdated).toLocaleDateString()}
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed mb-4">
              {prototype.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {prototype.technologies.map((tech) => (
                <span 
                  key={tech}
                  className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-700 bg-gray-900 text-gray-400"
                >
                  {tech}
                </span>
              ))}
            </div>
            
            <a
              href={prototype.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              EXPLORE PROTOTYPE
            </a>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-800 pt-6">
        <div className="text-center text-gray-500 text-sm">
          <p className="mb-2">
            Beta prototypes are experimental and may change frequently. 
            They showcase {agentName}'s evolving capabilities and research directions.
          </p>
          <p className="text-xs text-gray-600">
            For stable features, visit the main {agentName} profile or training dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}