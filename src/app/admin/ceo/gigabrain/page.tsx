'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Brain, TrendingUp, Users, Zap, 
  Activity, BookOpen, Target, AlertCircle, Play,
  ChevronRight, RefreshCw, Download, Share2, Image, Plus, ExternalLink
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

interface Diagram {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  metadata?: {
    type: string;
    tags?: string[];
    prompt?: string;
  };
}

export default function GigabrainDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'curriculum' | 'experiments' | 'diagrams'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [gigabrainQuery, setGigabrainQuery] = useState('');
  const [gigabrainResponse, setGigabrainResponse] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'fallback'>('checking');
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loadingDiagrams, setLoadingDiagrams] = useState(false);
  const [diagramPrompt, setDiagramPrompt] = useState('');
  const [generatingDiagram, setGeneratingDiagram] = useState(false);

  // Simulated data - would be pulled from actual training histories
  const [patterns, setPatterns] = useState<TrainingPattern[]>([
    { pattern: 'Memory seeding at 70% capacity', frequency: 89, successRate: 94, source: 'both' },
    { pattern: 'Chaos trait >60 unlocks creativity', frequency: 67, successRate: 87, source: 'abraham' },
    { pattern: 'Paired training increases success', frequency: 45, successRate: 91, source: 'solienne' },
    { pattern: 'Early morning training sessions', frequency: 78, successRate: 82, source: 'both' },
    { pattern: 'Rapid iteration in days 3-5', frequency: 92, successRate: 88, source: 'abraham' }
  ]);

  // Check API connection status on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/gigabrain/query');
        const data = await response.json();
        setConnectionStatus(data.status === 'connected' ? 'connected' : 'fallback');
      } catch {
        setConnectionStatus('fallback');
      }
    };
    checkConnection();
  }, []);

  // Load diagrams when diagrams tab is selected
  useEffect(() => {
    if (activeTab === 'diagrams' && diagrams.length === 0) {
      loadDiagrams();
    }
  }, [activeTab]);

  const loadDiagrams = async () => {
    setLoadingDiagrams(true);
    try {
      const response = await fetch('/api/gigabrain/collection?collectionId=68b47985d10d4706ff134ed2');
      const data = await response.json();
      if (data.items) {
        setDiagrams(data.items);
      }
    } catch (error) {
      console.error('Error loading diagrams:', error);
    } finally {
      setLoadingDiagrams(false);
    }
  };

  const generateDiagram = async () => {
    if (!diagramPrompt.trim()) return;
    
    setGeneratingDiagram(true);
    try {
      const response = await fetch('/api/gigabrain/collection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: diagramPrompt,
          type: 'architecture',
          collectionId: '68b47985d10d4706ff134ed2'
        })
      });
      
      const data = await response.json();
      if (data.diagram) {
        setDiagrams([data.diagram, ...diagrams]);
        setDiagramPrompt('');
      }
    } catch (error) {
      console.error('Error generating diagram:', error);
    } finally {
      setGeneratingDiagram(false);
    }
  };

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
    if (!gigabrainQuery.trim()) return;
    
    setIsAnalyzing(true);
    setGigabrainResponse('');
    
    try {
      // Get context from current training agents
      const context = {
        agentName: currentAgents[0]?.name,
        agentType: 'training_agent',
        trainingData: currentAgents[0] ? {
          day: currentAgents[0].timeToProduction,
          phase: 'Training',
          qualityScore: currentAgents[0].qualityScore,
          successRate: 87
        } : undefined,
        patterns: patterns.slice(0, 3).map(p => ({
          pattern: p.pattern,
          successRate: p.successRate
        }))
      };
      
      // Call the real Gigabrain API
      const response = await fetch('/api/gigabrain/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: gigabrainQuery,
          context,
          sessionId: `ceo_dashboard_${Date.now()}`
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to query Gigabrain');
      }
      
      const data = await response.json();
      
      // Display the response
      setGigabrainResponse(data.response);
      
      // Log metadata for debugging
      if (data.metadata) {
        console.log('Gigabrain confidence:', data.metadata.confidence);
        console.log('Sources:', data.metadata.sources);
        if (data.metadata.recommendations) {
          console.log('Recommendations:', data.metadata.recommendations);
        }
      }
      
    } catch (error) {
      console.error('Error querying Gigabrain:', error);
      // Fallback to a helpful error message
      setGigabrainResponse(`I'm having trouble connecting to the Gigabrain service right now. 

Based on cached Abraham and Solienne patterns, here are general recommendations:

• **Memory Seeding**: Maintain 70% capacity for optimal learning
• **Chaos Trait**: Keep between 60-75 for creative breakthroughs
• **Paired Training**: Increases success rate by 40%
• **Critical Checkpoints**: Monitor at days 3, 5, and 7

Please try again in a moment or check the API connection status.`);
    } finally {
      setIsAnalyzing(false);
    }
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
              <div className={`flex items-center gap-2 px-3 py-1 border rounded text-sm ${
                connectionStatus === 'connected' 
                  ? 'border-green-400 text-green-400' 
                  : connectionStatus === 'fallback'
                  ? 'border-yellow-400 text-yellow-400'
                  : 'border-gray-400 text-gray-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-400' :
                  connectionStatus === 'fallback' ? 'bg-yellow-400' :
                  'bg-gray-400'
                } animate-pulse`} />
                {connectionStatus === 'connected' ? 'LIVE' : 
                 connectionStatus === 'fallback' ? 'FALLBACK MODE' : 
                 'CHECKING...'}
              </div>
              <Link
                href="https://staging.app.eden.art/chat/eden_gigabrain"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>OPEN GIGABRAIN</span>
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="p-2 border border-white hover:bg-white hover:text-black transition-all"
              >
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
            {(['overview', 'patterns', 'curriculum', 'experiments', 'diagrams'] as const).map((tab) => (
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

        {activeTab === 'diagrams' && (
          <div className="space-y-8">
            {/* Diagram Generation */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold mb-6">GENERATE TRAINING DIAGRAM</h2>
              <div className="flex gap-4 mb-4">
                <input
                  type="text"
                  value={diagramPrompt}
                  onChange={(e) => setDiagramPrompt(e.target.value)}
                  placeholder="Describe the diagram you need (e.g., 'Agent training pipeline with 8-day phases')"
                  className="flex-1 bg-black border border-gray-600 px-4 py-3 text-white placeholder-gray-500"
                />
                <button
                  onClick={generateDiagram}
                  disabled={generatingDiagram || !diagramPrompt}
                  className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {generatingDiagram ? 'GENERATING...' : 'GENERATE'}
                </button>
              </div>
              <p className="text-sm text-gray-400">
                Gigabrain will create visual representations of training concepts, architectures, and workflows
              </p>
            </div>

            {/* Collection Link */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">GIGABRAIN DIAGRAM COLLECTION</h2>
              <Link
                href="https://staging.app.eden.art/collections/68b47985d10d4706ff134ed2"
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>VIEW ON EDEN</span>
              </Link>
            </div>

            {/* Diagram Grid */}
            {loadingDiagrams ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading diagrams...</p>
              </div>
            ) : diagrams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diagrams.map((diagram) => (
                  <div key={diagram.id} className="border border-gray-600 overflow-hidden group">
                    {/* Diagram Image */}
                    <div className="aspect-square bg-gray-900 relative">
                      {diagram.imageUrl || diagram.thumbnailUrl ? (
                        <img
                          src={diagram.thumbnailUrl || diagram.imageUrl}
                          alt={diagram.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="w-12 h-12 text-gray-600" />
                        </div>
                      )}
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => window.open(diagram.imageUrl, '_blank')}
                          className="px-4 py-2 bg-white text-black font-bold"
                        >
                          VIEW FULL SIZE
                        </button>
                      </div>
                    </div>
                    
                    {/* Diagram Info */}
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{diagram.title}</h3>
                      {diagram.description && (
                        <p className="text-sm text-gray-400 mb-3">{diagram.description}</p>
                      )}
                      
                      {/* Metadata */}
                      {diagram.metadata && (
                        <div className="space-y-2">
                          {diagram.metadata.type && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">TYPE:</span>
                              <span className="text-xs px-2 py-1 border border-gray-600 uppercase">
                                {diagram.metadata.type}
                              </span>
                            </div>
                          )}
                          {diagram.metadata.tags && diagram.metadata.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {diagram.metadata.tags.map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 bg-gray-800">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-gray-600">
                <Image className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No diagrams loaded yet</p>
                <button
                  onClick={loadDiagrams}
                  className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
                >
                  LOAD DIAGRAMS
                </button>
              </div>
            )}

            {/* Quick Diagram Templates */}
            <div className="border border-gray-600 p-8">
              <h3 className="text-xl font-bold mb-4">QUICK DIAGRAM TEMPLATES</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setDiagramPrompt('Agent training pipeline showing all phases from personality calibration to production validation')}
                  className="p-4 border border-gray-600 hover:border-white transition-all text-left"
                >
                  <div className="font-bold mb-1">Training Pipeline</div>
                  <div className="text-xs text-gray-400">8-day framework</div>
                </button>
                <button
                  onClick={() => setDiagramPrompt('Nested token economics model showing $SPIRIT containing individual agent tokens')}
                  className="p-4 border border-gray-600 hover:border-white transition-all text-left"
                >
                  <div className="font-bold mb-1">Token Economics</div>
                  <div className="text-xs text-gray-400">Nested structure</div>
                </button>
                <button
                  onClick={() => setDiagramPrompt('Memory seeding optimization chart showing 70% capacity sweet spot')}
                  className="p-4 border border-gray-600 hover:border-white transition-all text-left"
                >
                  <div className="font-bold mb-1">Memory Optimization</div>
                  <div className="text-xs text-gray-400">Capacity analysis</div>
                </button>
                <button
                  onClick={() => setDiagramPrompt('Trait configuration matrix for creative vs analytical agents')}
                  className="p-4 border border-gray-600 hover:border-white transition-all text-left"
                >
                  <div className="font-bold mb-1">Trait Matrix</div>
                  <div className="text-xs text-gray-400">Agent types</div>
                </button>
              </div>
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