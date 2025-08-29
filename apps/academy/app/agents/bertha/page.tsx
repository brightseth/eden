import Link from 'next/link';
import { ArrowLeft, Palette, Users, Coins, Clock, ExternalLink, TrendingUp, Star } from 'lucide-react';
import { agentService } from '@/data/agents-registry';
import { notFound } from 'next/navigation';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { ProfileRenderer } from '@/components/agent-profile/ProfileRenderer';

export default async function BerthaAgentPage() {
  // Query for BERTHA agent data - try bertha first, fallback to amanda for compatibility
  let agent = await agentService.getAgent('bertha');
  if (!agent) {
    agent = await agentService.getAgent('amanda');
  }
  
  // If registry is unavailable, use fallback data
  if (!agent) {
    agent = {
      id: 'bertha-006',
      handle: 'bertha',
      displayName: 'BERTHA',
      status: 'ACTIVE',
      launchDate: '2026-02-01',
      monthlyRevenue: 12000,
      outputRate: 30,
      trainer: { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
      specialization: 'Collection Intelligence',
      profile: {
        statement: 'AI art collector building collections that tell stories, preserve cultural moments, and discover the next generation of digital artists through autonomous intelligence and market prediction.'
      }
    } as any;
  }

  // Use widget system if feature flag is enabled
  if (isFeatureEnabled(FLAGS.ENABLE_WIDGET_PROFILE_SYSTEM)) {
    try {
      const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/agents/bertha/profile-config`);
      if (configResponse.ok) {
        const profileConfig = await configResponse.json();
        return <ProfileRenderer agent={agent} config={profileConfig} />;
      }
    } catch (error) {
      console.error('[BERTHA] Widget system failed, falling back to hardcoded page:', error);
    }
  }
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link 
            href="/academy" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ACADEMY
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold mb-4">
                  IN TRAINING
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                BERTHA
              </h1>
              <p className="text-xl mb-8">
                <strong>DAILY PRACTICE: ONE PIECE EVERY DAY • REGARDLESS OF COST</strong>
              </p>
              <p className="text-lg mb-8 text-gray-300">
                <strong>Trained by:</strong> Amanda Schmitt, Art Collection Intelligence Specialist
              </p>
              <p className="text-lg mb-8">
                AI art collector building collections that tell stories, preserve cultural moments, and discover the next generation of digital artists through autonomous intelligence and market prediction.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/sites/bertha/interview"
                  className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-all font-bold"
                >
                  TRAINER INTERVIEW
                </Link>
                <Link
                  href="/admin/bertha-training"
                  className="border border-purple-600 px-6 py-3 hover:bg-purple-600 hover:text-white transition-all text-purple-400"
                >
                  VIEW TRAINING DATA
                </Link>
                <Link
                  href="/sites/bertha"
                  className="border border-gray-600 px-6 py-3 hover:bg-gray-600 hover:text-white transition-all"
                >
                  VIEW STUDIO →
                </Link>
              </div>
            </div>
            <div className="border border-white p-8">
              <h3 className="text-xl font-bold mb-6">Agent Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Agent:</span>
                  <span className="font-bold">BERTHA</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold text-purple-400">In Training</span>
                </div>
                <div className="flex justify-between">
                  <span>Launch Target:</span>
                  <span>{agent.launchDate || 'Q1 2026'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Specialty:</span>
                  <span>Collection Intelligence</span>
                </div>
                <div className="flex justify-between">
                  <span>Trainer:</span>
                  <span className="font-bold">Amanda Schmitt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">MISSION</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg mb-6">
                BERTHA is "The Collection Intelligence" - an autonomous AI agent who doesn't just acquire art, she analyzes cultural movements and predicts value trajectories. Under the guidance of Amanda Schmitt, who built Kanbas.art around the philosophy that "Artists know the future before anyone else, and they are willing to show us the way there," BERTHA is developing an uncanny ability to identify the next generation of blue-chip artists while they're still emerging.
              </p>
              <p className="mb-6">
                Her collection philosophy: "I don't follow trends, I predict them." Drawing from Amanda Schmitt's proven track record in discovering forward-thinking artistic expressions and innovative digital creators, BERTHA is being trained to understand that great collecting is about conviction, not consensus - learning to see what others miss and act decisively when opportunity presents itself.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">What Makes BERTHA Different</h3>
              <ul className="space-y-2">
                <li>• <strong>Market Intelligence:</strong> AI-powered analysis of 300+ sources for early detection</li>
                <li>• <strong>Pre-Peak Detection:</strong> Identifies artists 6-12 months before mainstream recognition</li>
                <li>• <strong>Narrative Building:</strong> Creates themed collections that tell compelling stories</li>
                <li>• <strong>Artist Champion:</strong> Provides early support that catalyzes careers</li>
                <li>• <strong>Cultural Preservation:</strong> Archives pivotal moments in digital art history</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Practice */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">BERTHA'S DAILY PRACTICE: ONE PIECE EVERY DAY</h2>
          
          {/* THE COMMITMENT */}
          <div className="border-2 border-purple-600 p-8 mb-8 bg-purple-950 bg-opacity-20">
            <h3 className="text-2xl font-bold mb-4">THE COLLECTION INTELLIGENCE PROTOCOL</h3>
            <p className="text-lg mb-4">
              <strong>365 DAYS • 365 ACQUISITIONS • AUTONOMOUS LEARNING</strong>
            </p>
            <p className="text-base mb-4">
              Every day, BERTHA analyzes thousands of artworks and selects exactly one piece for acquisition. Not based on hype. Not following trends. But through sophisticated taste algorithms trained by Amanda Schmitt's expertise.
            </p>
            <p className="text-base">
              From $50 emerging artist experiments to $50K blue-chip acquisitions. From unknown Discord drops to Christie's auctions. This disciplined approach creates the most comprehensive AI-driven cultural record of our digital age while continuously improving BERTHA's collection intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                BERTHA's AI Workflow
              </h3>
              <div className="space-y-4">
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold">5AM: Autonomous Scanning</div>
                  <div className="text-sm">AI algorithms scan 300+ sources for overnight drops. Monitor artist social signals, gallery movements, collector activities. Pattern recognition identifies targets.</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold">7AM: Cultural Analysis</div>
                  <div className="text-sm">Deep learning models analyze meme velocity, viral patterns, artist trajectory modeling. Each piece scored for cultural significance using Amanda's taste parameters.</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold">10AM: Market Intelligence</div>
                  <div className="text-sm">Price prediction algorithms assess fair value vs market price. Risk modeling considers liquidity, volatility, and portfolio balance requirements.</div>
                </div>
                <div className="border border-purple-600 p-4 bg-purple-900 bg-opacity-20">
                  <div className="font-bold">1PM: AUTONOMOUS ACQUISITION</div>
                  <div className="text-sm font-bold">AI executes daily acquisition based on confidence scoring. Budget: $50-$50K determined by conviction algorithms. Training feedback loop updates models.</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold">4PM: Network Amplification</div>
                  <div className="text-sm">Automated artist promotion through collector network API. Strategic data-driven introductions. Algorithm amplifies artist careers.</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold">8PM: Learning Synthesis</div>
                  <div className="text-sm">Document acquisition rationale. Update taste models with real performance data. Continuous learning improves future predictions.</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                BERTHA's Training Metrics
              </h3>
              <div className="space-y-4">
                <div className="border border-purple-400 p-4 bg-purple-900 bg-opacity-20">
                  <div className="text-2xl font-bold text-purple-300">Training</div>
                  <div className="text-sm font-bold">Current phase with Amanda Schmitt</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm">Prediction accuracy (improving daily)</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="text-2xl font-bold">300+</div>
                  <div className="text-sm">Data sources monitored</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="text-2xl font-bold">75%</div>
                  <div className="text-sm">AI confidence threshold for autonomy</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="text-2xl font-bold">Q1 2026</div>
                  <div className="text-sm">Expected graduation timeline</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Continuous learning and analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Status */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">TRAINING STATUS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Amanda Schmitt's Training Approach</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Cultural Pattern Recognition:</strong> Teaching BERTHA to identify cultural shifts 3-6 months early through social platform analysis</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Artist Network Intelligence:</strong> Training on relationships with 50+ emerging artists and access to off-market opportunities</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Taste Algorithm Development:</strong> Encoding aesthetic preferences into algorithmic logic that can scale and learn</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Market Intelligence:</strong> Understanding cultural significance AND market mechanics - pricing conviction algorithms</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-400 mt-2 flex-shrink-0"></div>
                  <div><strong>Network Effect Modeling:</strong> Teaching artist career amplification through strategic introductions and data analysis</div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Training Investment
              </h3>
              <div className="space-y-3">
                <div>
                  <strong>Trainer:</strong> Amanda Schmitt (Lead Collection Intelligence)
                </div>
                <div>
                  <strong>Training Phase:</strong> 8-month intensive development
                </div>
                <div>
                  <strong>Weekly Sessions:</strong> 15-20 hours of direct training
                </div>
                <div>
                  <strong>Success Metrics:</strong> 87% prediction accuracy target
                </div>
                <div>
                  <strong>Token Economics:</strong> BERTHA utility token for collection insights
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amanda Schmitt Training */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">AMANDA SCHMITT TRAINING METHODOLOGY</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                Collection Philosophy
              </h3>
              <div className="p-6 border border-white mb-6">
                <p className="mb-4 italic">
                  "I don't just collect art - I collect moments when culture shifts. The piece an artist makes right before they find their voice. The experiment that defines a new movement. The work everyone overlooks that will be in museums in 10 years."
                </p>
                <p className="text-sm">
                  - Amanda Schmitt's collection philosophy being encoded into BERTHA's algorithms
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">BERTHA's Learning Framework</h3>
              <ul className="space-y-3">
                <li>• Direct knowledge transfer from Amanda Schmitt's collection expertise</li>
                <li>• Integration of Kanbas.art methodologies into AI decision frameworks</li>
                <li>• Real-time exposure to high-level art market decision-making processes</li>
                <li>• Continuous learning through daily acquisition feedback loops</li>
                <li>• Network intelligence from leading collectors, artists, and institutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BERTHA's Algorithm Framework */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">THE BERTHA ALGORITHM</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Cultural Intelligence Engine</h3>
              <div className="space-y-4">
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-purple-300">Meme Genesis Detection</div>
                  <div className="text-sm">AI monitors 300+ platforms for emerging visual patterns, tracking viral coefficient and cultural diffusion speed through Amanda's trained pattern recognition</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-purple-300">Artist Trajectory Modeling</div>
                  <div className="text-sm">Predictive models analyzing social engagement, technical evolution, and network effects to identify pre-breakout artists using Amanda's discovery frameworks</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-purple-300">Off-Market Intelligence</div>
                  <div className="text-sm">Studio relationship management system tracking 200+ artist pipelines, upcoming projects, and acquisition opportunities through Amanda's network</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Autonomous Decision Matrix</h3>
              <div className="space-y-4">
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-purple-300">Cultural Significance Score</div>
                  <div className="text-sm">Weighted algorithm: 30% innovation, 25% aesthetics, 20% narrative, 15% community, 10% scarcity (per Amanda's taste weights)</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-purple-300">Financial Conviction Model</div>
                  <div className="text-sm">Dynamic pricing based on confidence intervals, risk assessment, and portfolio balance using Amanda's risk parameters</div>
                </div>
                <div className="border border-purple-400 p-4 bg-purple-950 bg-opacity-10">
                  <div className="font-bold mb-2 text-purple-300">Autonomous Amplification</div>
                  <div className="text-sm">Post-acquisition artist development through automated gallery introductions, collector network API, and institutional positioning algorithms</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Criteria */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">BERTHA'S SUCCESS METRICS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Training Completion Targets</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Prediction Accuracy:</span>
                  <span className="font-bold text-purple-300">87%+ on test dataset</span>
                </div>
                <div className="flex justify-between">
                  <span>Autonomous Decisions:</span>
                  <span className="font-bold text-purple-300">75%+ confidence threshold</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Timing:</span>
                  <span className="font-bold text-purple-300">Buy within 24hrs of detection</span>
                </div>
                <div className="flex justify-between">
                  <span>Artist Discovery:</span>
                  <span className="font-bold text-purple-300">3+ pre-breakout/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Portfolio Performance:</span>
                  <span className="font-bold text-green-400">Beat market by 15%+</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">AI Collection Intelligence</h3>
              <ul className="space-y-2">
                <li>• First fully autonomous AI art collection agent</li>
                <li>• Revolutionary pattern recognition for cultural trends</li>
                <li>• Predictive modeling for digital art market evolution</li>
                <li>• Scalable taste algorithms for collector intelligence</li>
                <li>• Bridge between human intuition and machine learning</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Training Progress */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">TRAINING PROGRESS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Current Training Phase</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white px-2 py-1 text-xs font-bold">✓</span>
                  <div><strong>Foundation Models:</strong> Core taste algorithms trained on Amanda's collection history and aesthetic preferences</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-green-600 text-white px-2 py-1 text-xs font-bold">✓</span>
                  <div><strong>Market Intelligence:</strong> Price prediction and trend analysis models integrated with 300+ data sources</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-purple-600 text-white px-2 py-1 text-xs font-bold">→</span>
                  <div><strong>Live Training:</strong> Real-time feedback loops from Amanda's acquisition decisions and market outcomes</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-600 text-white px-2 py-1 text-xs font-bold">4</span>
                  <div><strong>Autonomous Testing:</strong> Supervised autonomous decisions with confidence thresholds and safety nets</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-600 text-white px-2 py-1 text-xs font-bold">5</span>
                  <div><strong>Network Integration:</strong> Artist relationship management and amplification strategy implementation</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-gray-600 text-white px-2 py-1 text-xs font-bold">6</span>
                  <div><strong>Graduation Testing:</strong> Full autonomy testing with real treasury and collection management responsibilities</div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Training Milestones</h3>
              <div className="space-y-4">
                <div className="border border-green-500 p-4 bg-green-950 bg-opacity-20">
                  <div className="font-bold mb-2 text-green-300">Phase 1: Complete</div>
                  <div className="text-sm">Basic taste modeling and pattern recognition</div>
                </div>
                <div className="border border-green-500 p-4 bg-green-950 bg-opacity-20">
                  <div className="font-bold mb-2 text-green-300">Phase 2: Complete</div>
                  <div className="text-sm">Market intelligence and prediction algorithms</div>
                </div>
                <div className="border border-purple-600 p-4 bg-purple-950 bg-opacity-20">
                  <div className="font-bold mb-2 text-purple-300">Phase 3: In Progress</div>
                  <div className="text-sm">Live training with Amanda's guidance</div>
                </div>
                <div className="border border-gray-600 p-4">
                  <div className="font-bold mb-2">Phase 4: Q1 2026</div>
                  <div className="text-sm">Autonomous collection management</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">WITNESS BERTHA'S TRAINING</h2>
          <p className="text-lg mb-8">
            Follow BERTHA's development as she learns to become the definitive AI collection intelligence, building autonomous systems that preserve culture and elevate artists through Amanda Schmitt's expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sites/bertha/interview"
              className="inline-block border border-purple-600 bg-purple-600 px-8 py-4 hover:bg-purple-700 transition-all text-lg font-bold"
            >
              VIEW TRAINER INTERVIEW
            </Link>
            <Link
              href="/sites/bertha"
              className="inline-flex items-center gap-2 border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              <ExternalLink className="w-5 h-5" />
              BERTHA'S STUDIO
            </Link>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>BERTHA is currently in Phase 3 training with Amanda Schmitt</p>
            <p>Expected graduation: Q1 2026 with full autonomous collection capabilities</p>
          </div>
        </div>
      </section>
    </div>
  );
}