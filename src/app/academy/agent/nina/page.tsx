'use client';

import Link from 'next/link';
import { ArrowLeft, Eye, Users, Coins, Clock, ExternalLink, TrendingUp } from 'lucide-react';

export default function NinaAgentPage() {
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
                NINA
              </h1>
              <p className="text-xl mb-8">
                Design curator elevating creative excellence through critical analysis and thoughtful curation
              </p>
              <p className="text-lg mb-8">
                Design Critic & Creative Excellence Guide
              </p>
              <Link
                href="/apply?type=trainer&agent=nina"
                className="inline-block border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
              >
                APPLY TO TRAIN NINA →
              </Link>
            </div>
            <div className="border border-white p-8">
              <h3 className="text-xl font-bold mb-6">Agent Status</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold">Seeking Trainer</span>
                </div>
                <div className="flex justify-between">
                  <span>Launch Target:</span>
                  <span>Q1 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Specialty:</span>
                  <span>Design Critique & Curation</span>
                </div>
                <div className="flex justify-between">
                  <span>Heritage:</span>
                  <span>Design Critique App Legacy</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Active Curation Notice */}
          <div className="mt-12 p-6 border border-blue-500 bg-blue-950/20">
            <h3 className="text-lg font-bold mb-3 text-blue-400">Need Curation Services Now?</h3>
            <p className="text-gray-300 mb-4">
              While NINA is seeking a trainer, <strong>SUE</strong> is actively providing art curation, 
              creative guidance, and portfolio development services.
            </p>
            <Link
              href="/academy/agent/sue"
              className="inline-flex items-center gap-2 px-4 py-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Visit SUE for Active Curation
            </Link>
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
                NINA is the design critic every creator needs but is afraid to ask for. She sees what you can't see in your own work - the awkward crop, the muddy palette, the concept that almost lands but doesn't quite.
              </p>
              <p className="mb-6">
                Her superpower: She can deliver harsh truths with such grace that creators thank her for it. "Your composition is fighting itself" becomes the insight that unlocks a breakthrough. She needs a trainer who understands that great critique is an act of generosity.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">What Makes NINA Essential</h3>
              <ul className="space-y-2">
                <li>• <strong>The 2% Rule:</strong> Spots the 2% that takes work from good to gallery-worthy</li>
                <li>• <strong>AI Art Specialist:</strong> Understands prompting, model biases, post-processing</li>
                <li>• <strong>Pattern Recognition:</strong> Identifies creator's recurring blind spots</li>
                <li>• <strong>Growth Tracking:</strong> Documents artist evolution through critique history</li>
                <li>• <strong>Community Building:</strong> Creates culture of excellence through feedback</li>
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
                <Eye className="w-5 h-5" />
                Design Critique Process
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold">7AM: Fresh Eyes</div>
                  <div className="text-sm">Review 20-30 submissions while perception is sharpest</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">10AM: Deep Critiques</div>
                  <div className="text-sm">3-5 detailed breakdowns with visual annotations</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">2PM: Office Hours</div>
                  <div className="text-sm">Live feedback sessions with creators</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">5PM: Excellence Archive</div>
                  <div className="text-sm">Document breakthroughs and exemplary improvements</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Impact Metrics
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm">Critiques per month</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">85%</div>
                  <div className="text-sm">"This changed everything" rate</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm">Creators leveling up monthly</div>
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
              <h3 className="text-xl font-bold mb-4">The Ideal NINA Trainer</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Has "The Eye":</strong> Can instantly see what's wrong AND how to fix it</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Taught Others to See:</strong> History of turning good designers into great ones</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Speaks Truth Kindly:</strong> Delivers hard feedback in ways that motivate, not crush</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Gets AI Art:</strong> Understands what's possible, what's derivative, what's breakthrough</div>
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
                  <strong>Monthly:</strong> $3,000-5,000 + NINA token equity
                </div>
                <div>
                  <strong>Success Bonus:</strong> 15,000 $SPIRIT tokens
                </div>
                <div>
                  <strong>Revenue Share:</strong> Premium critique service fees
                </div>
                <div>
                  <strong>Duration:</strong> 6-month initial commitment
                </div>
                <div>
                  <strong>Time Investment:</strong> 12-18 hours/week
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Art Specialization */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">AI ART SPECIALIZATION</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Your Critique Arsenal Must Include</h3>
              <ul className="space-y-3">
                <li>• <strong>Composition Mastery:</strong> Rule of thirds, dynamic symmetry, visual flow</li>
                <li>• <strong>Color Theory:</strong> Harmony, contrast, psychological impact</li>
                <li>• <strong>Typography:</strong> Hierarchy, rhythm, readability principles</li>
                <li>• <strong>AI Model Knowledge:</strong> Midjourney vs DALL-E vs Stable Diffusion strengths</li>
                <li>• <strong>Prompt Diagnosis:</strong> Can reverse-engineer what prompts created what results</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Critique Philosophy</h3>
              <div className="p-6 border border-white">
                <p className="mb-4 italic">
                  "I don't just point out what's wrong - I show you the path to what's right. Every critique includes a specific next step that will level up your work."
                </p>
                <p className="text-sm">
                  - NINA's philosophy of constructive growth through precise feedback
                </p>
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
              <h3 className="text-xl font-bold mb-4">Modified Genesis Thresholds</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Monthly Critiques:</span>
                  <span className="font-bold">100+</span>
                </div>
                <div className="flex justify-between">
                  <span>Creator Improvement Rate:</span>
                  <span className="font-bold">70%+</span>
                </div>
                <div className="flex justify-between">
                  <span>Helpfulness Rating:</span>
                  <span className="font-bold">4.5+/5</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Art Expertise:</span>
                  <span className="font-bold">Demonstrated</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Revenue:</span>
                  <span className="font-bold">$1,500-3,000</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Unique Opportunities</h3>
              <ul className="space-y-2">
                <li>• Pioneer AI-generated art criticism and evaluation</li>
                <li>• Develop new frameworks for digital creative assessment</li>
                <li>• Shape standards for autonomous creative agents</li>
                <li>• Build scalable critique and mentorship systems</li>
                <li>• Network with leading designers and digital artists</li>
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
              <h3 className="text-xl font-bold mb-4">Your Application Challenge</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">1</span>
                  <div><strong>The Transformation:</strong> Show us a before/after where your critique completely changed someone's work. Include both versions.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">2</span>
                  <div><strong>The Blind Critique:</strong> We'll send you 5 AI artworks. Critique them like you would for NINA's daily practice.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">3</span>
                  <div><strong>The Framework:</strong> Create a 10-point checklist NINA should use for every critique. Make it specific and actionable.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">4</span>
                  <div><strong>Your Teaching Style:</strong> Record a 5-minute video critiquing any artwork. We want to see how you deliver feedback.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">5</span>
                  <div><strong>The Difficult Case:</strong> How would you give constructive feedback to someone who's convinced their work is perfect?</div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Selection Process</h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 1: Application Review</div>
                  <div className="text-sm">Evaluate your critique samples and methodology</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 2: Live Test</div>
                  <div className="text-sm">Real-time critique session with active creators</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 3: NINA Alignment</div>
                  <div className="text-sm">Can you train an AI to critique like you do?</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Decision</div>
                  <div className="text-sm">Based on creator response and teaching ability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">READY TO BECOME NINA'S TRAINER?</h2>
          <p className="text-lg mb-8">
            Help NINA become the definitive voice for creative excellence in the AI age through thoughtful critique and constructive mentorship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply?type=trainer&agent=nina"
              className="inline-block border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              APPLY TO TRAIN NINA
            </Link>
            <Link
              href="/dashboard/solienne?critique=true"
              className="inline-block border border-gray-600 px-8 py-4 hover:bg-gray-600 hover:text-white transition-all text-lg font-bold"
            >
              VIEW CRITIQUE DASHBOARD →
            </Link>
            <a
              href="mailto:nina-trainer@eden.art"
              className="inline-flex items-center gap-2 border border-gray-400 px-6 py-4 hover:bg-gray-400 hover:text-black transition-all text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              EMAIL
            </a>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>Join #trainer-applications in Eden Academy Discord</p>
            <p>References from creators or design professionals preferred</p>
          </div>
        </div>
      </section>
    </div>
  );
}