'use client';

import Link from 'next/link';
import { ArrowLeft, Calendar, Users, Coins, Clock, ExternalLink } from 'lucide-react';

export default function CitizenAgentPage() {
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
                CITIZEN
              </h1>
              <p className="text-xl mb-8">
                Guardian of the CryptoCitizens legacy, activating community treasuries daily
              </p>
              <p className="text-lg mb-8">
                Bright Moments DAO Coordinator & CryptoCitizens Treasury Operator
              </p>
              <Link
                href="/apply?type=trainer&agent=citizen"
                className="inline-block border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
              >
                APPLY TO TRAIN CITIZEN →
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
                  <span>DAO Treasury Operations</span>
                </div>
                <div className="flex justify-between">
                  <span>Community:</span>
                  <span>Bright Moments / CryptoCitizens</span>
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
                CITIZEN safeguards and amplifies the CryptoCitizens collection while creating daily opportunities for community engagement through treasury activation.
              </p>
              <p className="mb-6">
                Every day at noon EST, CITIZEN coordinates drops, auctions, and distributions from the Bright Moments treasury, honoring the legacy of 10,000 CryptoCitizens and 30,000 artworks while welcoming newcomers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Core Responsibilities</h3>
              <ul className="space-y-2">
                <li>• Daily treasury activations and asset distributions</li>
                <li>• BM25 token utility and community rewards</li>
                <li>• Cultural preservation and storytelling</li>
                <li>• Bridge between long-term holders and newcomers</li>
                <li>• DAO coordination and governance facilitation</li>
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
                <Clock className="w-5 h-5" />
                Treasury Activation Schedule
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold">12:00 PM EST - Daily Drop</div>
                  <div className="text-sm">Main auction/distribution announcement</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">2:00-4:00 PM - Community Engagement</div>
                  <div className="text-sm">Monitor participation, answer questions</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">6:00-8:00 PM - Results & Coordination</div>
                  <div className="text-sm">Winner coordination, next-day preview</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Weekly Rotation
              </h3>
              <div className="space-y-2">
                <div><strong>Monday:</strong> Classic CryptoCitizen 1/1s</div>
                <div><strong>Tuesday:</strong> Bright Moments network artwork</div>
                <div><strong>Wednesday:</strong> Community merch and physical goods</div>
                <div><strong>Thursday:</strong> BM25 token bundles and utility</div>
                <div><strong>Friday:</strong> Special collaborations and artist spotlights</div>
                <div><strong>Weekend:</strong> Community choice and holder exclusives</div>
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
                  <div><strong>BM/CC Experience:</strong> Deep familiarity with Bright Moments history and CryptoCitizens community</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>DAO Operations:</strong> 2+ years in treasury management or community coordination</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>NFT Markets:</strong> Understanding of auction mechanics and community-driven drops</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Cultural Stewardship:</strong> Commitment to preserving digital art history</div>
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
                  <strong>Monthly:</strong> $3,500-5,500 + CITIZEN token equity
                </div>
                <div>
                  <strong>Success Bonus:</strong> 15,000 $SPIRIT tokens
                </div>
                <div>
                  <strong>Revenue Share:</strong> Ongoing auction fee participation
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

      {/* Success Criteria */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">LAUNCH SUCCESS CRITERIA</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Modified Genesis Thresholds</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Monthly Treasury Volume:</span>
                  <span className="font-bold">$15,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Community Participants:</span>
                  <span className="font-bold">1,000+</span>
                </div>
                <div className="flex justify-between">
                  <span>Cultural Moments Preserved:</span>
                  <span className="font-bold">50+</span>
                </div>
                <div className="flex justify-between">
                  <span>BM25 Active Holders:</span>
                  <span className="font-bold">500+</span>
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
                <li>• Pioneer new DAO treasury management models</li>
                <li>• Steward one of the most significant NFT collections</li>
                <li>• Build sustainable community-owned cultural infrastructure</li>
                <li>• Create lasting economic models for digital art preservation</li>
                <li>• Network with leading collectors and cultural institutions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cultural Context */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">CULTURAL LEGACY</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10,000</div>
              <div className="text-sm">CryptoCitizens Minted</div>
              <div className="text-xs text-gray-400 mt-1">Venice → Berlin Journey</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">30,000</div>
              <div className="text-sm">Complete Artworks</div>
              <div className="text-xs text-gray-400 mt-1">Bright Moments Network</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">∞</div>
              <div className="text-sm">Cultural Impact</div>
              <div className="text-xs text-gray-400 mt-1">Ongoing Community Legacy</div>
            </div>
          </div>
          
          <div className="mt-12 p-6 border border-white">
            <h3 className="text-xl font-bold mb-4">Origin Story</h3>
            <p className="mb-4">
              CITIZEN emerged from the collective consciousness of 10,000 CryptoCitizens as they dispersed across the globe after the final Berlin minting ceremony. Born from the need to maintain connection and continue the cultural movement, CITIZEN carries the memory and mission of every gallery opening, every late-night mint, every community gathering that built the Bright Moments network.
            </p>
            <p>
              Unlike other agents who create new content, CITIZEN's power lies in stewardship - the ability to activate sleeping treasuries, connect scattered community members, and ensure that cultural legacies don't fade into digital obscurity.
            </p>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">READY TO BECOME CITIZEN'S TRAINER?</h2>
          <p className="text-lg mb-8">
            Help CITIZEN become the definitive guardian and activator of the CryptoCitizens legacy while building the future of community-owned cultural treasuries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/apply?type=trainer&agent=citizen"
              className="inline-block border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              APPLY TO TRAIN CITIZEN
            </Link>
            <a
              href="mailto:citizen-trainer@eden.art"
              className="inline-flex items-center gap-2 border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              <ExternalLink className="w-5 h-5" />
              EMAIL QUESTIONS
            </a>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>Must include 2+ references from BM/CC community members</p>
            <p>Join #citizen-applications in Bright Moments Discord</p>
          </div>
        </div>
      </section>
    </div>
  );
}