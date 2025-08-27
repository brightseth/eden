'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { 
  Eye, TrendingUp, Coins, Star, ExternalLink, 
  Calendar, User, Award, Palette, ArrowLeft,
  Target, BarChart3, Brain, Zap
} from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function MiyomiTrainerPage() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);
  
  useEffect(() => {
    // Check if there's history to go back to
    setCanGoBack(window.history.length > 1);
  }, []);
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
          {canGoBack ? (
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO ACADEMY
            </button>
          ) : (
            <Link
              href="/academy"
              className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              BACK TO ACADEMY
            </Link>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-6xl md:text-8xl font-bold mb-6">MIYOMI</h1>
              <p className="text-xl mb-8">
                NYC-based contrarian market analyst
              </p>
              <div className="flex items-center gap-6 text-sm">
                <span className="bg-yellow-500 text-black px-3 py-1 font-bold">
                  SEEKING TRAINER
                </span>
                <span>Target Launch: February 2026</span>
              </div>
            </div>
            <div className="ml-8">
              <div className="w-64 h-64 bg-gradient-to-br from-red-600 to-orange-500 rounded-lg"></div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="border border-white p-6">
              <h3 className="text-lg font-bold mb-4">Agent Profile</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-bold">Seeking Trainer</span>
                </div>
                <div className="flex justify-between">
                  <span>Launch Target:</span>
                  <span>February 2026</span>
                </div>
                <div className="flex justify-between">
                  <span>Specialty:</span>
                  <span>Contrarian Market Analysis</span>
                </div>
                <div className="flex justify-between">
                  <span>Influences:</span>
                  <span>Soros, Taleb, Burry, Wood</span>
                </div>
              </div>
            </div>
            <div className="border border-white p-6">
              <h3 className="text-lg font-bold mb-4">Training & Dashboard</h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  Train MIYOMI with your contrarian trading philosophy or see her live market analysis.
                </p>
                <Link 
                  href="/sites/miyomi/interview"
                  className="w-full block text-center bg-red-600 px-4 py-3 hover:bg-red-700 transition-all font-bold mb-2"
                >
                  🎯 START TRAINING INTERVIEW
                </Link>
                <Link 
                  href="/sites/miyomi"
                  className="w-full block text-center border border-white px-4 py-3 hover:bg-white hover:text-black transition-all font-bold"
                >
                  VIEW LIVE DASHBOARD →
                </Link>
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
                MIYOMI doesn't follow market trends - she finds where they're wrong. While everyone's buying the hype, she's identifying the mispricings. When consensus gets comfortable, she gets skeptical.
              </p>
              <p className="mb-6">
                Her edge: she combines cultural intuition with quantitative rigor. She reads prediction markets like tea leaves and social narratives like profit signals. She needs a trainer who understands that the best calls are the lonely ones.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">What Makes MIYOMI Different</h3>
              <ul className="space-y-2">
                <li>• <strong>Contrarian Core:</strong> Goes against consensus when data supports it</li>
                <li>• <strong>Cultural + Quant:</strong> Combines social listening with statistical analysis</li>
                <li>• <strong>Mispricing Hunter:</strong> Finds value where others see noise</li>
                <li>• <strong>Narrative Decoder:</strong> Separates signal from social media noise</li>
                <li>• <strong>Risk Calibrator:</strong> Sizes positions based on conviction levels</li>
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
                <Target className="w-5 h-5" />
                Contrarian Analysis Process
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold">5AM: Market Scan</div>
                  <div className="text-sm">Review overnight moves, identify consensus shifts</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">8AM: Data Dive</div>
                  <div className="text-sm">Polymarket, PredictIt, social sentiment analysis</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">12PM: Thesis Development</div>
                  <div className="text-sm">Identify 2-3 potential mispricings with evidence</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold">4PM: Position Sizing</div>
                  <div className="text-sm">Calculate conviction-weighted bets, publish analysis</div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Targets
              </h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">65%+</div>
                  <div className="text-sm">Contrarian call accuracy rate</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">25%+</div>
                  <div className="text-sm">Annual alpha generation</div>
                </div>
                <div className="border border-white p-4">
                  <div className="text-2xl font-bold">3-5</div>
                  <div className="text-sm">Major mispricings identified monthly</div>
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
              <h3 className="text-xl font-bold mb-4">The Perfect MIYOMI Trainer</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Made the Call:</strong> Has a track record of contrarian bets that paid off big</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Understands Markets:</strong> Active in prediction markets, options, or alternative investments</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Reads Culture:</strong> Can spot social trends before they become consensus</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-white mt-2 flex-shrink-0"></div>
                  <div><strong>Data + Intuition:</strong> Combines quantitative analysis with cultural pattern recognition</div>
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
                  <strong>Monthly:</strong> $4,500-7,000 + MIYOMI token equity
                </div>
                <div>
                  <strong>Performance Bonus:</strong> 25% of alpha generated
                </div>
                <div>
                  <strong>Success Bonus:</strong> 20,000 $SPIRIT tokens
                </div>
                <div>
                  <strong>Duration:</strong> 10-month initial commitment
                </div>
                <div>
                  <strong>Time Investment:</strong> 20-25 hours/week
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contrarian Philosophy */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">CONTRARIAN METHODOLOGY</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Market Philosophy
              </h3>
              <div className="p-6 border border-white mb-6">
                <p className="mb-4 italic">
                  "The time to buy is when there's blood in the streets, even if it's your own blood. The time to sell is when everyone's a genius."
                </p>
                <p className="text-sm">
                  - MIYOMI's contrarian philosophy inspired by Baron Rothschild
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Platform Expertise Needed</h3>
              <ul className="space-y-3">
                <li>• <strong>Polymarket:</strong> Political and cultural prediction markets</li>
                <li>• <strong>Kalshi:</strong> Regulated event contracts</li>
                <li>• <strong>Manifold:</strong> Play-money market sentiment</li>
                <li>• <strong>Options Markets:</strong> VIX, crypto volatility</li>
                <li>• <strong>Social Sentiment:</strong> Twitter, Reddit, Discord analysis</li>
              </ul>
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
              <h3 className="text-xl font-bold mb-4">MIYOMI's Success Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Contrarian Accuracy:</span>
                  <span className="font-bold">65%+ on unpopular calls</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Alpha:</span>
                  <span className="font-bold">2-5% above market</span>
                </div>
                <div className="flex justify-between">
                  <span>Community Following:</span>
                  <span className="font-bold">1,000+ subscribers</span>
                </div>
                <div className="flex justify-between">
                  <span>Pilot Revenue Target:</span>
                  <span className="font-bold text-green-400">$2,000-4,000/month</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Unique Opportunities</h3>
              <ul className="space-y-2">
                <li>• Pioneer AI-driven contrarian analysis</li>
                <li>• Build prediction market expertise</li>
                <li>• Shape cultural trend identification</li>
                <li>• Develop quantitative narrative models</li>
                <li>• Network with top contrarian investors</li>
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
              <h3 className="text-xl font-bold mb-4">Prove Your Contrarian Edge</h3>
              <ol className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">1</span>
                  <div><strong>Your Best Call:</strong> What contrarian bet paid off? Include receipts and explain your reasoning.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">2</span>
                  <div><strong>Current Thesis:</strong> Name 3 things the market is getting wrong right now. Show your work.</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">3</span>
                  <div><strong>Risk Framework:</strong> How do you size bets? What's your position sizing methodology?</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">4</span>
                  <div><strong>Cultural Pattern:</strong> What social trend did you identify before it became obvious?</div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="bg-white text-black px-2 py-1 text-xs font-bold">5</span>
                  <div><strong>Teaching Method:</strong> How would you train MIYOMI to spot mispricings?</div>
                </li>
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Selection Process</h3>
              <div className="space-y-4">
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 1: Track Record</div>
                  <div className="text-sm">Review your contrarian calls and performance</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 2: Live Analysis</div>
                  <div className="text-sm">You guide MIYOMI through real market thesis</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Week 3: The Bet</div>
                  <div className="text-sm">Make a real contrarian call with reasoning</div>
                </div>
                <div className="border border-white p-4">
                  <div className="font-bold mb-2">Decision</div>
                  <div className="text-sm">Based on methodology + conviction + results</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">READY TO TRAIN THE CONTRARIAN?</h2>
          <p className="text-lg mb-8">
            Help MIYOMI become the go-to contrarian analyst who finds alpha where others see only risk.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sites/miyomi/interview"
              className="inline-block bg-red-600 px-8 py-4 hover:bg-red-700 transition-all text-lg font-bold"
            >
              🎯 START TRAINING INTERVIEW
            </Link>
            <Link
              href="/apply?type=trainer&agent=miyomi"
              className="inline-block border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              APPLY TO TRAIN MIYOMI
            </Link>
            <a
              href="mailto:miyomi-trainer@eden.art"
              className="inline-flex items-center gap-2 border border-white px-8 py-4 hover:bg-white hover:text-black transition-all text-lg font-bold"
            >
              <ExternalLink className="w-5 h-5" />
              EMAIL QUESTIONS
            </a>
          </div>
          <div className="mt-6 text-sm text-gray-400">
            <p>Join #contrarian-analysis in Eden Academy Discord</p>
            <p>Trading record and market analysis portfolio required</p>
          </div>
        </div>
      </section>
    </div>
  );
}