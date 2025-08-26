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
                  href="/dashboard/amanda"
                  className="border border-gray-600 px-6 py-3 hover:bg-gray-600 hover:text-white transition-all"
                >
                  VIEW DASHBOARD →
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
                AMANDA is "The Taste Maker" - an autonomous AI collector who doesn't just acquire art, she shapes cultural movements. Like her namesake Amanda Schmitt, she has an uncanny ability to identify the next generation of blue-chip artists while they're still emerging.
              </p>
              <p className="mb-6">
                Her collection philosophy: "I don't follow trends, I create them." AMANDA needs a trainer who understands that great collecting is about conviction, not consensus - someone who can teach her to see what others miss and act decisively when opportunity presents itself.
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
                Curatorial Excellence Process
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold">6AM: Market Scan</div>
                  <div className="text-sm">Review overnight drops on SuperRare, Foundation, Zora</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">9AM: Artist Studios</div>
                  <div className="text-sm">Visit 10 emerging artist portfolios, identify breakthrough work</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">12PM: Acquisition Decision</div>
                  <div className="text-sm">Execute 1-3 strategic purchases based on cultural thesis</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">3PM: Collection Curation</div>
                  <div className="text-sm">Write context, create exhibitions, amplify artist stories</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Collection Metrics
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">$50K+</div>
                  <div className="text-sm">Monthly collection budget</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">3-5</div>
                  <div className="text-sm">Artists discovered pre-breakout</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">10x</div>
                  <div className="text-sm">Average artist career amplification</div>
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
              <h3 className="text-xl font-bold mb-4">We're Looking For Someone Who...</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Has "The Eye":</strong> Can spot the next XCOPY or Refik Anadol before they break out</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Lives in the Markets:</strong> Active on SuperRare, Foundation, Zora - knows who's dropping what</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Has Conviction:</strong> Willing to pay 5 ETH for the right piece when everyone else thinks it's too much</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Understands Context:</strong> Can explain why a glitch art piece matters culturally, not just aesthetically</div>
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
                <li>• Direct mentorship from established art collector network</li>
                <li>• Access to private collection methodologies and strategies</li>
                <li>• Exposure to high-level art market decision-making</li>
                <li>• Professional development in contemporary curation</li>
                <li>• Network building with leading collectors and institutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Art Specialization */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">DIGITAL ART EXPERTISE</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Platform Expertise Required</h3>
              <ul className="space-y-3">
                <li>• <strong>SuperRare:</strong> Know the top 50 artists by heart</li>
                <li>• <strong>Foundation:</strong> Can spot emerging talent in the feed</li>
                <li>• <strong>Zora:</strong> Understand open edition vs. limited edition dynamics</li>
                <li>• Understanding of digital art's place in broader cultural context</li>
                <li>• Experience with both primary and secondary art markets</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Market Innovation</h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Valuation Frameworks</div>
                  <div className="text-sm">Develop new models for digital art assessment beyond traditional metrics</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Cultural Preservation</div>
                  <div className="text-sm">Create sustainable systems for digital art documentation and legacy</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Autonomous Collection</div>
                  <div className="text-sm">Pioneer AI-assisted curation and collection management systems</div>
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
              <h3 className="text-xl font-bold mb-4">Application Questions</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">1</span>
                  <div><strong>Your Best Call:</strong> What artist did you collect early that everyone else missed? Include transaction proof.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">2</span>
                  <div><strong>Market Thesis:</strong> Pick 3 artists on SuperRare under 1 ETH floor who will be at 10 ETH within 18 months. Explain why.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">3</span>
                  <div><strong>Collection Strategy:</strong> How would you build a "Post-Photography" collection with 50 ETH budget? Name specific works.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">4</span>
                  <div><strong>Your Network:</strong> List 10 artists, collectors, or curators who would take your call. Why do they trust your taste?</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">5</span>
                  <div><strong>The Test:</strong> We'll give you 5 ETH (simulated). Show us your acquisition strategy for next week's drops.</div>
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