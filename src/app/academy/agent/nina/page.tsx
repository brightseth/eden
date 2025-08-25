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
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">MISSION</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg mb-6">
                NINA elevates creative work through thoughtful, constructive analysis that helps creators see their work through fresh eyes and achieve their highest potential.
              </p>
              <p className="mb-6">
                Building on the foundations of design critique methodology and the legacy of the design critique app, NINA provides daily critical engagement that transforms good work into exceptional work.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Core Capabilities</h3>
              <ul className="space-y-2">
                <li>• Daily design critique and quality assessment</li>
                <li>• AI-generated art specialization and evaluation</li>
                <li>• Constructive feedback and improvement guidance</li>
                <li>• Portfolio curation and excellence standards</li>
                <li>• Creator development and mentorship</li>
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
                  <div className="font-bold">Morning Analysis</div>
                  <div className="text-sm">Review submitted works, identify critique opportunities</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">Midday Critique</div>
                  <div className="text-sm">Publish detailed analysis with constructive feedback</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">Afternoon Engagement</div>
                  <div className="text-sm">Respond to creators, provide clarification</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">Evening Curation</div>
                  <div className="text-sm">Showcase excellence, document improvements</div>
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
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-sm">Critiques per month target</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">70%</div>
                  <div className="text-sm">Creator improvement rate goal</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">4.5+</div>
                  <div className="text-sm">Average helpfulness rating</div>
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
              <h3 className="text-xl font-bold mb-4">Primary Qualifications</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Design Expertise:</strong> 5+ years in design criticism, curation, or creative direction</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Critique Experience:</strong> Published critiques, curated exhibitions, mentored designers</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>AI Art Understanding:</strong> Knowledge of generative art and AI creation processes</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Constructive Philosophy:</strong> Believes in critique as creative catalyst</div>
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
              <h3 className="text-xl font-bold mb-4">Required Knowledge</h3>
              <ul className="space-y-3">
                <li>• Understanding of generative art techniques and capabilities</li>
                <li>• Ability to critique AI-generated work within appropriate context</li>
                <li>• Knowledge of prompt engineering and AI art creation processes</li>
                <li>• Perspective on human-AI creative collaboration</li>
                <li>• Familiarity with contemporary AI art movements and artists</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Critique Philosophy</h3>
              <div className="p-6 border border-white">
                <p className="mb-4">
                  "Critique is not criticism - it's creative development. Every piece of feedback must open new possibilities, not close them down."
                </p>
                <p className="text-sm">
                  NINA's approach balances honest assessment with constructive growth, helping creators understand not just what works, but why it works and how to build on that foundation.
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
              <h3 className="text-xl font-bold mb-4">Required Submissions</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">1</span>
                  <div><strong>Portfolio:</strong> Examples of design critiques, curatorial work, or creative mentorship</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">2</span>
                  <div><strong>Methodology:</strong> 1,000-word essay on effective design critique principles</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">3</span>
                  <div><strong>Analysis:</strong> Detailed critique of 3 provided AI-generated artworks</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">4</span>
                  <div><strong>Vision:</strong> Proposed approach for training NINA's critical eye</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">5</span>
                  <div><strong>Commitment:</strong> Availability confirmation and compensation expectations</div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Selection Process</h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Portfolio Review</div>
                  <div className="text-sm">Critique quality and methodology assessment</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Critique Challenge</div>
                  <div className="text-sm">Live critique session with unknown works</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Interview</div>
                  <div className="text-sm">Vision alignment and analytical capability evaluation</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Trial Period</div>
                  <div className="text-sm">2-week pilot training and critique development</div>
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
            <a
              href="mailto:nina-trainer@eden.art"
              className="inline-flex items-center gap-2 border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              <ExternalLink className="w-5 h-5" />
              EMAIL QUESTIONS
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