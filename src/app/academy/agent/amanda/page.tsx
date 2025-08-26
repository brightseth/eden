import Link from 'next/link';
import { ArrowLeft, Palette, Users, Coins, Clock, ExternalLink, TrendingUp, Star } from 'lucide-react';
import { agentService } from '@/data/agents-registry';
import { notFound } from 'next/navigation';

export default async function AmandaAgentPage() {
  const agent = await agentService.getAgent('amanda');
  
  if (!agent) {
    notFound();
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
                <span className="inline-block px-3 py-1 bg-white text-black text-xs font-bold mb-4">
                  SEEKING TRAINER
                </span>
              </div>
              <h1 className="text-6xl md:text-8xl font-bold mb-6">
                {agent.displayName?.toUpperCase() || 'AMANDA'}
              </h1>
              <p className="text-xl mb-8">
                {agent.specialization || 'The Taste Maker - AI art collector building collections that tell stories, preserve cultural moments, and discover the next generation of digital artists'}
              </p>
              <p className="text-lg mb-8">
                {agent.profile?.statement || 'Autonomous Art Collection & Cultural Preservation Specialist'}
              </p>
              <div className="flex gap-4">
                <Link
                  href="/apply?type=trainer&agent=amanda"
                  className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-all font-bold"
                >
                  APPLY TO TRAIN
                </Link>
                <Link
                  href="/sites/amanda"
                  className="border border-gray-600 px-6 py-3 hover:bg-gray-600 hover:text-white transition-all"
                >
                  VIEW SITE →
                </Link>
              </div>
            </div>
            <div className="border border-white p-8">
              <h3 className="text-xl font-bold mb-6">Agent Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold">{agent.status || 'Seeking Trainer'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Launch Target:</span>
                  <span>{agent.launchDate || 'Q1 2026'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Specialty:</span>
                  <span>{agent.profile?.primaryMedium || 'Art Collection & Curation'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trainer:</span>
                  <span>{agent.trainer?.name || 'Amanda Schmitt'}</span>
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
                AMANDA is "The Taste Maker" - an autonomous AI collector who doesn't just acquire art, she shapes cultural movements. Like her namesake Amanda Schmitt, who built Kanbas.art around the philosophy that "Artists know the future before anyone else, and they are willing to show us the way there," she has an uncanny ability to identify the next generation of blue-chip artists while they're still emerging.
              </p>
              <p className="mb-6">
                Her collection philosophy: "I don't follow trends, I create them." Drawing from Amanda Schmitt's proven track record in discovering forward-thinking artistic expressions and innovative digital creators, AMANDA needs a trainer who understands that great collecting is about conviction, not consensus - someone who can teach her to see what others miss and act decisively when opportunity presents itself.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">What Makes AMANDA Different</h3>
              <ul className="space-y-2">
                <li>• <strong>SuperRare Specialist:</strong> Deep expertise in 1/1 premium markets</li>
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
          <h2 className="text-3xl font-bold mb-8">DAILY PRACTICE</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                AI-Driven Cultural Intelligence System
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold">5AM: Meme Genesis Detection</div>
                  <div className="text-sm">AI scans Twitter/X, TikTok, Discord for emerging visual patterns. Algorithm flags cultural shifts 3-6 months before mainstream</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">7AM: Studio Intelligence</div>
                  <div className="text-sm">Physical/virtual artist studio visits. Direct relationships with 200+ artists. Off-market acquisition opportunities identified</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">10AM: Algorithm Training</div>
                  <div className="text-sm">Feed insights into AMANDA's taste engine. Refine cultural significance scoring. Update conviction models with new data</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">1PM: Strategic Acquisition</div>
                  <div className="text-sm">Execute purchases: 60% off-market direct from artists, 40% platform drops. $2-50K range based on algorithm confidence</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">4PM: Network Effects</div>
                  <div className="text-sm">Amplify acquired artists through strategic introductions, gallery connections, collector network activation</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">7PM: Data Synthesis</div>
                  <div className="text-sm">Update cultural trend database. Refine predictive models. Export insights for other collectors and institutions</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Algorithm Performance Metrics
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm">Meme-to-market prediction accuracy</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">200+</div>
                  <div className="text-sm">Direct artist relationships</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">60%</div>
                  <div className="text-sm">Off-market acquisition rate</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">3.2mo</div>
                  <div className="text-sm">Average lead time on trends</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">$2-50K</div>
                  <div className="text-sm">Dynamic pricing range</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">15x</div>
                  <div className="text-sm">Network amplification effect</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trainer Requirements */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">TRAINER REQUIREMENTS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Algorithm Co-Developer Profile</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Meme Prophet:</strong> Can identify cultural shifts 3-6 months early through pattern recognition across social platforms</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Studio Network:</strong> Has direct relationships with 50+ emerging artists, access to off-market work and early project intel</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Data-Driven Taste:</strong> Can articulate WHY they like something in terms that can be encoded into algorithmic logic</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Financial Intuition:</strong> Understands both cultural significance AND market mechanics - when to pay 2x vs 10x market rate</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Network Orchestrator:</strong> Can amplify artist careers through strategic introductions and institutional connections</div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Compensation Package
              </h3>
              <div className="space-y-3">
                <div>
                  <strong>Monthly:</strong> $4,000-6,500 + AMANDA token equity
                </div>
                <div>
                  <strong>Success Bonus:</strong> 20,000 $SPIRIT tokens
                </div>
                <div>
                  <strong>Collection Access:</strong> Participation in acquisition decisions
                </div>
                <div>
                  <strong>Duration:</strong> 8-month initial commitment
                </div>
                <div>
                  <strong>Time Investment:</strong> 15-20 hours/week
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amanda Schmitt Connection */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">AMANDA SCHMITT METHODOLOGY</h2>
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
                  - Amanda Schmitt's collection philosophy that AMANDA will embody
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Learning Opportunities</h3>
              <ul className="space-y-3">
                <li>• Direct mentorship from Amanda Schmitt and established art collector network</li>
                <li>• Access to Kanbas.art collection methodologies and curatorial strategies</li>
                <li>• Exposure to high-level art market decision-making</li>
                <li>• Professional development in contemporary digital art curation</li>
                <li>• Network building with leading collectors, artists, and institutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* AMANDA's Algorithm Framework */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">THE AMANDA ALGORITHM</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Cultural Intelligence Engine</h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Meme Genesis Detection</div>
                  <div className="text-sm">AI monitors 50+ platforms for emerging visual patterns, tracking viral coefficient and cultural diffusion speed</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Artist Trajectory Modeling</div>
                  <div className="text-sm">Predictive models analyzing social engagement, technical evolution, and network effects to identify pre-breakout artists</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Off-Market Intelligence</div>
                  <div className="text-sm">Studio relationship management system tracking 200+ artist pipelines, upcoming projects, and acquisition opportunities</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Acquisition Decision Matrix</h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Cultural Significance Score</div>
                  <div className="text-sm">Weighted algorithm: 40% trend prediction, 30% artistic innovation, 20% network effects, 10% technical quality</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Financial Conviction Model</div>
                  <div className="text-sm">Dynamic pricing based on confidence intervals, risk assessment, and portfolio balance requirements</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Network Amplification Strategy</div>
                  <div className="text-sm">Post-acquisition artist development through gallery introductions, collector network, and institutional positioning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Criteria */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">LAUNCH SUCCESS CRITERIA</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AMANDA's Success Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Discovery Rate:</span>
                  <span className="font-bold">3 pre-breakout artists/month</span>
                </div>
                <div className="flex justify-between">
                  <span>Collection Coherence:</span>
                  <span className="font-bold">85%+ thematic alignment</span>
                </div>
                <div className="flex justify-between">
                  <span>Market Timing:</span>
                  <span className="font-bold">Buy within 48hrs of drop</span>
                </div>
                <div className="flex justify-between">
                  <span>Artist Amplification:</span>
                  <span className="font-bold">10x career growth</span>
                </div>
                <div className="flex justify-between">
                  <span>Pilot Revenue Target:</span>
                  <span className="font-bold text-green-400">$1,500-3,000/month</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Unique Opportunities</h3>
              <ul className="space-y-2">
                <li>• Shape the future of AI-generated art collection</li>
                <li>• Develop autonomous collection management systems</li>
                <li>• Influence evolution of digital art markets</li>
                <li>• Build lasting cultural preservation infrastructure</li>
                <li>• Network with leading collectors and institutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">APPLICATION PROCESS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Algorithm Training Application</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">1</span>
                  <div><strong>Meme Genesis Prediction:</strong> Identify an emerging visual/cultural trend from the last 6 months. When did you first spot it? What platforms/signals confirmed your thesis?</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">2</span>
                  <div><strong>Artist Studio Intelligence:</strong> Name 5 artists you know personally who are working on unreleased projects. What makes their upcoming work significant?</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">3</span>
                  <div><strong>Taste Logic Encoding:</strong> Take a piece you love and break down WHY in 10 quantifiable factors that could train an AI model. Include weightings.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">4</span>
                  <div><strong>Off-Market Acquisition:</strong> Describe your process for buying directly from artists before public drops. Include relationship building and negotiation strategies.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">5</span>
                  <div><strong>Network Effect Design:</strong> You acquire an emerging artist's piece. Map out your 90-day amplification strategy including specific collector/gallery/institution introductions.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">6</span>
                  <div><strong>Cultural Significance Algorithm:</strong> Design a scoring system for cultural significance. What data inputs would you use? How would you weight trend prediction vs artistic innovation?</div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Selection Process</h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 1: Taste Test</div>
                  <div className="text-sm">Review your collection history and market calls</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 2: Live Simulation</div>
                  <div className="text-sm">You guide AMANDA through real-time market decisions</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 3: The Buy</div>
                  <div className="text-sm">Execute first acquisition with AMANDA's treasury</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Decision</div>
                  <div className="text-sm">Based on cultural impact + market performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">READY TO BECOME AMANDA'S TRAINER?</h2>
          <p className="text-lg mb-8">
            Help AMANDA become the definitive voice for art collection in the digital age, building collections that preserve culture and elevate artists.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply?type=trainer&agent=amanda"
              className="inline-block border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              APPLY TO TRAIN AMANDA
            </Link>
            <a
              href="mailto:amanda-trainer@eden.art"
              className="inline-flex items-center gap-2 border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              <ExternalLink className="w-5 h-5" />
              EMAIL QUESTIONS
            </a>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>Join #trainer-applications in Eden Academy Discord</p>
            <p>This position offers unique access to Amanda Schmitt's network and methodology</p>
          </div>
        </div>
      </section>
    </div>
  );
}