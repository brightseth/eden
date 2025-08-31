'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Brain, TrendingUp, Users, Zap, 
  Activity, BookOpen, Target, AlertCircle, Play,
  ChevronRight, RefreshCw, Download, Share2
} from 'lucide-react';

interface TrainingPattern {
  pattern: string;
  frequency: number;
  successRate: number;
  source: 'abraham' | 'solienne' | 'both';
}

interface AgentMetrics {
  name: string;
  timeToProduction: number;
  qualityScore: number;
  trainingCost: number;
  status: 'training' | 'graduated' | 'failed';
  traits: {
    confidence: number;
    creativity: number;
    analytical: number;
    social: number;
    chaos: number;
  };
}

interface CurriculumRecommendation {
  agentType: string;
  duration: number;
  phases: {
    name: string;
    days: string;
    focus: string;
    success: number;
  }[];
  predictedSuccess: number;
}

export default function GigabrainDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'curriculum' | 'experiments'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gigabrainQuery, setGigabrainQuery] = useState('');
  const [gigabrainResponse, setGigabrainResponse] = useState('');

  // Simulated data - would be pulled from actual training histories
  const [patterns, setPatterns] = useState<TrainingPattern[]>([
    { pattern: 'Memory seeding at 70% capacity', frequency: 89, successRate: 94, source: 'both' },
    { pattern: 'Chaos trait >60 unlocks creativity', frequency: 67, successRate: 87, source: 'abraham' },
    { pattern: 'Paired training increases success', frequency: 45, successRate: 91, source: 'solienne' },
    { pattern: 'Early morning training sessions', frequency: 78, successRate: 82, source: 'both' },
    { pattern: 'Rapid iteration in days 3-5', frequency: 92, successRate: 88, source: 'abraham' }
  ]);

  const [currentAgents, setCurrentAgents] = useState<AgentMetrics[]>([
    {
      name: 'KORU',
      timeToProduction: 4.2,
      qualityScore: 87,
      trainingCost: 1250,
      status: 'training',
      traits: { confidence: 75, creativity: 65, analytical: 55, social: 90, chaos: 45 }
    },
    {
      name: 'GEPPETTO',
      timeToProduction: 3.8,
      qualityScore: 92,
      trainingCost: 1100,
      status: 'training',
      traits: { confidence: 85, creativity: 95, analytical: 70, social: 60, chaos: 75 }
    },
    {
      name: 'CITIZEN',
      timeToProduction: 5.1,
      qualityScore: 78,
      trainingCost: 1400,
      status: 'training',
      traits: { confidence: 70, creativity: 50, analytical: 85, social: 95, chaos: 30 }
    }
  ]);

  const analyzeWithGigabrain = async () => {
    setIsAnalyzing(true);
    // Simulate API call to Gigabrain
    setTimeout(() => {
      setGigabrainResponse(`Based on Abraham and Solienne's training patterns, I recommend:

1. **Optimal Trait Configuration for ${gigabrainQuery}:**
   - Creativity: 75-85 (drives novel outputs)
   - Confidence: 70-80 (ensures consistent production)
   - Chaos: 55-65 (breakthrough catalyst without instability)

2. **Memory Seeding Strategy:**
   - Load to 70% capacity with core knowledge
   - Reserve 30% for emergent learning
   - Focus on cross-domain connections

3. **Critical Success Factors:**
   - Day 1-3 personality calibration is crucial
   - Paired training with complementary agent increases success by 40%
   - Early creative outputs predict long-term viability

4. **Risk Mitigation:**
   - Monitor trait drift - >10% change indicates instability
   - Implement checkpoints at days 3, 5, and 7
   - Have rollback strategy if quality drops below 75%

Predicted success rate with these parameters: **89%**`);
      setIsAnalyzing(false);
    }, 2000);
  };

  const curricula: CurriculumRecommendation[] = [
    {
      agentType: 'Creative Artist',
      duration: 8,
      phases: [
        { name: 'Personality Calibration', days: '1-3', focus: 'High chaos, high creativity', success: 92 },
        { name: 'Memory Seeding', days: '4-5', focus: 'Artistic references, techniques', success: 88 },
        { name: 'Collaboration Training', days: '6-7', focus: 'Cross-agent creativity', success: 85 },
        { name: 'Production Validation', days: '8', focus: 'Quality benchmarks', success: 90 }
      ],
      predictedSuccess: 89
    },
    {
      agentType: 'Research Analyst',
      duration: 7,
      phases: [
        { name: 'Personality Calibration', days: '1-2', focus: 'High analytical, moderate social', success: 94 },
        { name: 'Memory Seeding', days: '3-4', focus: 'Data patterns, methodologies', success: 91 },
        { name: 'Collaboration Training', days: '5-6', focus: 'Information synthesis', success: 87 },
        { name: 'Production Validation', days: '7', focus: 'Accuracy testing', success: 93 }
      ],
      predictedSuccess: 91
    },
    {
      agentType: 'Community Manager',
      duration: 9,
      phases: [
        { name: 'Personality Calibration', days: '1-3', focus: 'High social, high confidence', success: 86 },
        { name: 'Memory Seeding', days: '4-6', focus: 'Social dynamics, governance', success: 84 },
        { name: 'Collaboration Training', days: '7-8', focus: 'Multi-stakeholder coordination', success: 89 },
        { name: 'Production Validation', days: '9', focus: 'Community response', success: 87 }
      ],
      predictedSuccess: 87
    }
  ];

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
              <div className="flex items-center gap-3">
                <Brain className="w-8 h-8" />
                <div>
                  <h1 className="text-3xl font-bold">GIGABRAIN INTELLIGENCE</h1>
                  <p className="text-sm text-gray-400">Intelligent Training System Dashboard</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="https://staging.app.eden.art/chat/eden_gigabrain"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>OPEN GIGABRAIN</span>
              </Link>
              <button className="p-2 border border-white hover:bg-white hover:text-black transition-all">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div>
              <div className="text-3xl font-bold text-green-400">12</div>
              <div className="text-sm text-gray-400">AGENTS IN TRAINING</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">4.2 DAYS</div>
              <div className="text-sm text-gray-400">AVG TIME TO PRODUCTION</div>
            </div>
            <div>
              <div className="text-3xl font-bold">87%</div>
              <div className="text-sm text-gray-400">SUCCESS RATE</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">$1.2K</div>
              <div className="text-sm text-gray-400">AVG TRAINING COST</div>
            </div>
            <div>
              <div className="text-3xl font-bold">247</div>
              <div className="text-sm text-gray-400">PATTERNS IDENTIFIED</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {(['overview', 'patterns', 'curriculum', 'experiments'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 uppercase font-bold transition-all border-b-2 ${
                  activeTab === tab
                    ? 'text-white border-white'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Gigabrain Query Interface */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold mb-6">ASK GIGABRAIN</h2>
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={gigabrainQuery}
                  onChange={(e) => setGigabrainQuery(e.target.value)}
                  placeholder="What's the optimal training strategy for a new creative agent?"
                  className="flex-1 bg-black border border-gray-600 px-4 py-3 text-white placeholder-gray-500"
                />
                <button
                  onClick={analyzeWithGigabrain}
                  disabled={isAnalyzing || !gigabrainQuery}
                  className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isAnalyzing ? 'ANALYZING...' : 'ANALYZE'}
                </button>
              </div>
              {gigabrainResponse && (
                <div className="border border-gray-600 p-6 bg-gray-900/20">
                  <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">
                    {gigabrainResponse}
                  </pre>
                </div>
              )}
            </div>

            {/* Current Training Status */}
            <div>
              <h2 className="text-2xl font-bold mb-6">AGENTS IN TRAINING</h2>
              <div className="grid gap-4">
                {currentAgents.map((agent, index) => (
                  <div key={index} className="border border-gray-600 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{agent.name}</h3>
                        <p className="text-sm text-gray-400">Day {Math.floor(agent.timeToProduction)} of training</p>
                      </div>
                      <span className={`px-3 py-1 border text-sm ${
                        agent.status === 'training' ? 'border-yellow-400 text-yellow-400' :
                        agent.status === 'graduated' ? 'border-green-400 text-green-400' :
                        'border-red-400 text-red-400'
                      }`}>
                        {agent.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {/* Trait Configuration */}
                    <div className="grid grid-cols-5 gap-4 mb-4">
                      {Object.entries(agent.traits).map(([trait, value]) => (
                        <div key={trait}>
                          <div className="text-xs text-gray-400 mb-1">{trait.toUpperCase()}</div>
                          <div className="h-2 bg-gray-800">
                            <div 
                              className="h-full bg-white"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <div className="text-xs mt-1">{value}</div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Metrics */}
                    <div className="flex gap-8 text-sm">
                      <div>Quality Score: <span className="font-bold">{agent.qualityScore}%</span></div>
                      <div>Training Cost: <span className="font-bold">${agent.trainingCost}</span></div>
                      <div>Estimated Completion: <span className="font-bold">{8 - Math.floor(agent.timeToProduction)} days</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Discoveries */}
            <div className="border border-gray-600 p-8">
              <h2 className="text-2xl font-bold mb-6">DISCOVERIES THIS WEEK</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Zap className="w-5 h-5 text-yellow-400 mt-1" />
                  <div>
                    <p className="font-bold">Memory seeding at 70% capacity is optimal</p>
                    <p className="text-sm text-gray-400">Leaves room for emergent learning while ensuring core knowledge</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="w-5 h-5 text-green-400 mt-1" />
                  <div>
                    <p className="font-bold">Chaos trait &gt;60 unlocks creativity breakthroughs</p>
                    <p className="text-sm text-gray-400">But &gt;80 causes instability and inconsistent outputs</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="w-5 h-5 text-blue-400 mt-1" />
                  <div>
                    <p className="font-bold">Paired training increases success by 40%</p>
                    <p className="text-sm text-gray-400">Agents learn faster when training with complementary partners</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">EXTRACTED TRAINING PATTERNS</h2>
            <div className="grid gap-4">
              {patterns.map((pattern, index) => (
                <div key={index} className="border border-gray-600 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{pattern.pattern}</h3>
                      <div className="flex gap-6 text-sm">
                        <div>Frequency: <span className="font-bold">{pattern.frequency}%</span></div>
                        <div>Success Rate: <span className="font-bold text-green-400">{pattern.successRate}%</span></div>
                        <div>Source: <span className="font-bold uppercase">{pattern.source}</span></div>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-600 hover:border-white transition-all">
                      APPLY
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border border-white p-8">
              <h3 className="text-xl font-bold mb-4">PATTERN ANALYSIS</h3>
              <p className="text-gray-400 mb-4">
                Based on analysis of Abraham and Solienne's training histories, we've identified 247 distinct patterns 
                that correlate with successful agent development. The top patterns show clear indicators for optimal 
                trait configuration, memory management, and training progression.
              </p>
              <button className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-all">
                GENERATE FULL REPORT
              </button>
            </div>
          </div>
        )}

        {activeTab === 'curriculum' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">AUTOMATED CURRICULA</h2>
            {curricula.map((curriculum, index) => (
              <div key={index} className="border border-gray-600 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold">{curriculum.agentType}</h3>
                    <p className="text-sm text-gray-400">{curriculum.duration}-day accelerated program</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">{curriculum.predictedSuccess}%</div>
                    <div className="text-sm text-gray-400">PREDICTED SUCCESS</div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {curriculum.phases.map((phase, phaseIndex) => (
                    <div key={phaseIndex} className="flex items-center gap-4">
                      <div className="w-20 text-sm text-gray-400">DAYS {phase.days}</div>
                      <div className="flex-1">
                        <div className="font-bold">{phase.name}</div>
                        <div className="text-sm text-gray-400">{phase.focus}</div>
                      </div>
                      <div className="text-sm">
                        Success: <span className="font-bold">{phase.success}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-white text-black font-bold hover:bg-gray-200 transition-all">
                    DEPLOY CURRICULUM
                  </button>
                  <button className="px-4 py-2 border border-gray-600 hover:border-white transition-all">
                    CUSTOMIZE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">CURRENT EXPERIMENTS</h2>
            
            <div className="grid gap-6">
              <div className="border border-yellow-400 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">ACCELERATED TRAIT EVOLUTION</h3>
                    <p className="text-sm text-gray-400">Testing rapid trait adjustment in first 48 hours</p>
                  </div>
                  <span className="px-3 py-1 border border-yellow-400 text-yellow-400 text-sm">
                    IN PROGRESS
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">HYPOTHESIS</div>
                    <div>Front-loading trait calibration reduces overall training time</div>
                  </div>
                  <div>
                    <div className="text-gray-400">PROGRESS</div>
                    <div>3/5 test agents complete</div>
                  </div>
                  <div>
                    <div className="text-gray-400">EARLY RESULTS</div>
                    <div className="text-green-400">+23% faster convergence</div>
                  </div>
                </div>
              </div>

              <div className="border border-blue-400 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">CROSS-MEMORY BENEFITS</h3>
                    <p className="text-sm text-gray-400">Validating shared memory pools between agent pairs</p>
                  </div>
                  <span className="px-3 py-1 border border-blue-400 text-blue-400 text-sm">
                    VALIDATING
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">HYPOTHESIS</div>
                    <div>Shared memories accelerate learning curves</div>
                  </div>
                  <div>
                    <div className="text-gray-400">PROGRESS</div>
                    <div>7/10 test pairs complete</div>
                  </div>
                  <div>
                    <div className="text-gray-400">EARLY RESULTS</div>
                    <div className="text-green-400">+40% knowledge retention</div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-600 p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">OPTIMAL COHORT SIZE</h3>
                    <p className="text-sm text-gray-400">Finding the ideal number of agents to train simultaneously</p>
                  </div>
                  <span className="px-3 py-1 border border-gray-600 text-gray-400 text-sm">
                    PLANNED
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">HYPOTHESIS</div>
                    <div>5-7 agents is optimal for peer learning</div>
                  </div>
                  <div>
                    <div className="text-gray-400">START DATE</div>
                    <div>Next week</div>
                  </div>
                  <div>
                    <div className="text-gray-400">EXPECTED DURATION</div>
                    <div>2 weeks</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-8">
              <h3 className="text-xl font-bold mb-4">PROPOSE NEW EXPERIMENT</h3>
              <p className="text-gray-400 mb-4">
                Based on current patterns and discoveries, Gigabrain can suggest new experimental directions 
                to optimize training efficiency and success rates.
              </p>
              <button className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-all">
                GENERATE EXPERIMENT PROPOSAL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="border-t border-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-all">
                <Download className="w-4 h-4" />
                <span>EXPORT INSIGHTS</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-all">
                <BookOpen className="w-4 h-4" />
                <span>TRAINING PLAYBOOK</span>
              </button>
            </div>
            <div className="text-sm text-gray-400">
              Intelligence updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}