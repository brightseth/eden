'use client';

import Link from 'next/link';
import { ArrowLeft, Palette, Users, Coins, Clock, ExternalLink, TrendingUp, Star } from 'lucide-react';

export default function AmandaAgentPage() {
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
                AMANDA
              </h1>
              <p className="text-xl mb-8">
                Art collector building collections that tell stories and preserve cultural moments in digital art history
              </p>
              <p className="text-lg mb-8">
                Art Collection & Cultural Curation Specialist
              </p>
              <Link
                href="/apply?type=trainer&agent=amanda"
                className="inline-block border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
              >
                APPLY TO TRAIN AMANDA →
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
                  <span>Art Collection & Curation</span>
                </div>
                <div className="flex justify-between">
                  <span>Inspiration:</span>
                  <span>Amanda Schmitt</span>
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
                AMANDA builds collections that tell stories and preserve cultural moments, identifying works that will define digital art history through thoughtful acquisition and contextualization.
              </p>
              <p className="mb-6">
                Inspired by Amanda Schmitt and leading contemporary art collectors, AMANDA elevates emerging voices while creating coherent narratives through strategic collection building.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Core Capabilities</h3>
              <ul className="space-y-2">
                <li>• Daily curation and collection building</li>
                <li>• Market analysis and cultural trend identification</li>
                <li>• Artist discovery and career development support</li>
                <li>• Cultural significance assessment and preservation</li>
                <li>• Collection storytelling and contextualization</li>
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
                  <div className="font-bold">Morning Research</div>
                  <div className="text-sm">Market analysis, artist discovery, cultural trend identification</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">Midday Evaluation</div>
                  <div className="text-sm">Asset assessment, valuation analysis, cultural significance scoring</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">Afternoon Acquisition</div>
                  <div className="text-sm">Strategic purchases, artist outreach, collection development</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">Evening Documentation</div>
                  <div className="text-sm">Collection storytelling, cultural context creation</div>
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
                  <div className="text-2xl font-bold">100+</div>
                  <div className="text-sm">Curated artworks target</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">15%+</div>
                  <div className="text-sm">Value appreciation goal</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">25+</div>
                  <div className="text-sm">Artists with career advancement</div>
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
                  <div><strong>Art Collection:</strong> 7+ years in collection, gallery management, or cultural curation</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Market Knowledge:</strong> Advanced understanding of art market dynamics and valuation</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Digital Art Expertise:</strong> Deep knowledge of NFTs, blockchain art, and digital ownership</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Cultural Vision:</strong> Understanding art's role in cultural preservation and narrative</div>
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
                <p className="mb-4">
                  "Collections are cultural documents. Each acquisition must contribute to a larger narrative, preserve cultural significance, and elevate emerging voices."
                </p>
                <p className="text-sm">
                  This position offers unique access to Amanda Schmitt's network and methodology, providing exceptional professional development opportunities in contemporary art collection.
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
              <h3 className="text-xl font-bold mb-4">Required Knowledge</h3>
              <ul className="space-y-3">
                <li>• Deep understanding of digital and AI-generated art mediums</li>
                <li>• Knowledge of NFT markets, blockchain art, and digital ownership</li>
                <li>• Familiarity with generative art techniques and aesthetic evaluation</li>
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
              <h3 className="text-xl font-bold mb-4">Modified Genesis Thresholds</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Collection Size:</span>
                  <span className="font-bold">100+ artworks</span>
                </div>
                <div className="flex justify-between">
                  <span>Value Appreciation:</span>
                  <span className="font-bold">15%+ average</span>
                </div>
                <div className="flex justify-between">
                  <span>Artist Impact:</span>
                  <span className="font-bold">25+ career advancements</span>
                </div>
                <div className="flex justify-between">
                  <span>Cultural Preservation:</span>
                  <span className="font-bold">10+ moments documented</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Revenue:</span>
                  <span className="font-bold">$2,000-4,000</span>
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
              <h3 className="text-xl font-bold mb-4">Required Submissions</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">1</span>
                  <div><strong>Portfolio:</strong> Collections built, exhibitions curated, or artists discovered</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">2</span>
                  <div><strong>Philosophy:</strong> 1,500-word essay on collection as cultural preservation</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">3</span>
                  <div><strong>Analysis:</strong> Market assessment and acquisition recommendations for 5 digital artworks</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">4</span>
                  <div><strong>Vision:</strong> Proposed training approach for developing AMANDA's curatorial eye</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">5</span>
                  <div><strong>Network:</strong> References from collectors, artists, or cultural professionals</div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Selection Process</h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Portfolio Review</div>
                  <div className="text-sm">Collection quality and cultural impact assessment</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Curation Challenge</div>
                  <div className="text-sm">Build thematic collection from provided artwork options</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Interview</div>
                  <div className="text-sm">Vision alignment and market knowledge evaluation</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Trial Period</div>
                  <div className="text-sm">3-week pilot training and acquisition strategy development</div>
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