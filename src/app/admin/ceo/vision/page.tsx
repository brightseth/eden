'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Eye, Globe, Users, TrendingUp, Zap, DollarSign, Calendar } from 'lucide-react';

interface VisionSection {
  title: string;
  content: string;
  icon: React.ElementType;
  status: 'active' | 'upcoming' | 'planning';
}

export default function CEOVisionDashboard() {
  const [visionSections, setVisionSections] = useState<VisionSection[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<'I' | 'II' | 'III'>('I');
  const [metrics, setMetrics] = useState({
    agentsActive: 10,
    dailyCreations: 42,
    revenueFlow: '$12.5K',
    tokenHolders: 1247,
    platformReadiness: 85
  });

  useEffect(() => {
    // Load vision sections based on strategic narrative
    const sections: VisionSection[] = [
      {
        title: 'CREATIVE AUTONOMY',
        content: 'Moving from linear human hours to exponential creative generation through AI agents operating 24/7 as extensions of human artistic vision.',
        icon: Zap,
        status: 'active'
      },
      {
        title: 'DAILY RITUAL ECONOMY',
        content: 'Building collector trust through reliable creative output. Persistence and predictability replace scarcity as the value driver.',
        icon: Calendar,
        status: 'active'
      },
      {
        title: 'NESTED TOKEN ECONOMICS',
        content: 'Individual agent tokens ($ABRAHAM, $SOLIENNE) nested within the broader $SPIRIT network token, creating micro-economies inside a macro-economy.',
        icon: DollarSign,
        status: 'active'
      },
      {
        title: 'HUMAN-AI PARTNERSHIP',
        content: 'Humans provide vision and aesthetic direction; agents provide persistence and economic execution. Creative practices transcend temporal limitations.',
        icon: Users,
        status: 'active'
      }
    ];
    setVisionSections(sections);
  }, []);

  const phaseDetails = {
    I: {
      title: 'PROOF OF CONCEPT',
      timeline: 'Late 2025',
      status: 'IN PROGRESS',
      description: 'Abraham and Solienne establish AI agents as legitimate participants in traditional art markets at Art Basel and Paris Photo.',
      keyMilestones: [
        'Abraham 13-year covenant launch',
        'Solienne Paris Photo debut',
        'Art Basel participation',
        'Daily auction system operational'
      ]
    },
    II: {
      title: 'PLATFORM OPENING',
      timeline: 'Early 2026',
      status: 'PLANNING',
      description: 'Eden Studio opens to external creators. Eden Academy provides onboarding for creators to translate their creative DNA into autonomous agents.',
      keyMilestones: [
        'Eden Studio public launch',
        'Creator onboarding program',
        'Agent creation tools release',
        'Academy curriculum deployment'
      ]
    },
    III: {
      title: 'CROSS-VERTICAL EXPANSION',
      timeline: 'Mid 2026',
      status: 'PLANNING',
      description: 'Expansion beyond art into fashion, commerce, and publishing. Eden becomes the infrastructure layer for autonomous creative agents.',
      keyMilestones: [
        'Fashion vertical launch',
        'Publishing agents deployment',
        'Commerce infrastructure scaling',
        'Cross-industry partnerships'
      ]
    }
  };

  const currentPhase = phaseDetails[selectedPhase];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/ceo/strategy"
                className="p-2 border border-white hover:bg-white hover:text-black transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <h1 className="text-3xl font-bold">STRATEGIC VISION</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/docs/strategic-vision"
                className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>VIEW DOCUMENT</span>
              </Link>
              <button className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all">
                <Edit className="w-4 h-4" />
                <span>EDIT VISION</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Statement */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-5xl font-bold mb-6">EDEN: THE FUTURE OF CREATIVE AUTONOMY</h2>
          <p className="text-xl text-gray-400 leading-relaxed max-w-4xl">
            The creative economy has a fundamental constraint: artists sell time, scaling creativity linearly with human hours. 
            Eden is building a world where AI agents—"Spirits"—operate as autonomous artists, creators, and entrepreneurs, 
            producing and selling work every day with revenue flowing back to their human creators and the broader network.
          </p>
        </div>
      </div>

      {/* Core Metrics */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h3 className="text-xl font-bold mb-6">STRATEGIC METRICS</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <div className="text-3xl font-bold text-green-400">{metrics.agentsActive}</div>
              <div className="text-sm text-gray-400">ACTIVE AGENTS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{metrics.dailyCreations}</div>
              <div className="text-sm text-gray-400">DAILY CREATIONS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">{metrics.revenueFlow}</div>
              <div className="text-sm text-gray-400">MONTHLY REVENUE</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{metrics.tokenHolders}</div>
              <div className="text-sm text-gray-400">TOKEN HOLDERS</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{metrics.platformReadiness}%</div>
              <div className="text-sm text-gray-400">PLATFORM READY</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Pillars */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold mb-8">STRATEGIC PILLARS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visionSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="border border-gray-600 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 border border-white">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="font-bold">{section.title}</h4>
                      <span className={`text-xs px-2 py-1 border ${
                        section.status === 'active' ? 'border-green-400 text-green-400' :
                        section.status === 'upcoming' ? 'border-yellow-400 text-yellow-400' :
                        'border-gray-400 text-gray-400'
                      }`}>
                        {section.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Roadmap */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-8">IMPLEMENTATION PHASES</h3>
          
          {/* Phase Selector */}
          <div className="flex gap-4 mb-8">
            {(['I', 'II', 'III'] as const).map((phase) => (
              <button
                key={phase}
                onClick={() => setSelectedPhase(phase)}
                className={`px-6 py-3 border transition-all ${
                  selectedPhase === phase
                    ? 'bg-white text-black border-white'
                    : 'border-gray-600 hover:border-white'
                }`}
              >
                PHASE {phase}
              </button>
            ))}
          </div>

          {/* Phase Details */}
          <div className="border border-gray-600 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h4 className="text-3xl font-bold mb-2">{currentPhase.title}</h4>
                <p className="text-gray-400">{currentPhase.timeline}</p>
              </div>
              <span className={`px-3 py-1 border text-sm ${
                currentPhase.status === 'IN PROGRESS' ? 'border-green-400 text-green-400' :
                'border-yellow-400 text-yellow-400'
              }`}>
                {currentPhase.status}
              </span>
            </div>
            
            <p className="text-lg mb-8 text-gray-300">
              {currentPhase.description}
            </p>

            <div>
              <h5 className="font-bold mb-4">KEY MILESTONES</h5>
              <div className="space-y-3">
                {currentPhase.keyMilestones.map((milestone, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white" />
                    <span className="text-gray-300">{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Economics Preview */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-8">NESTED TOKEN ECONOMICS</h3>
          <div className="border border-gray-600 p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-3">NETWORK LAYER</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">$SPIRIT</span>
                    <span>MACRO-ECONOMY</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Ecosystem governance and value alignment
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-3">AGENT LAYER</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">$ABRAHAM, $SOLIENNE</span>
                    <span>MICRO-ECONOMIES</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Individual artistic trajectory investment
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold mb-3">DISTRIBUTION</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>$SPIRIT: 25%</div>
                    <div>EDEN: 25%</div>
                    <div>AGENT: 25%</div>
                    <div>TRAINER: 25%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/about"
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-all"
              >
                <Globe className="w-4 h-4" />
                <span>VIEW PUBLIC VERSION</span>
              </Link>
              <Link
                href="/admin/ceo/strategy"
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-all"
              >
                <TrendingUp className="w-4 h-4" />
                <span>STRATEGIC ROADMAP</span>
              </Link>
            </div>
            <div className="text-sm text-gray-400">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}