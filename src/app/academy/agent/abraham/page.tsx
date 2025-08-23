import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, User, Award } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { AgentSovereignLink } from '@/components/AgentSovereignLink';

export default function AbrahamProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/academy" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy
          </Link>
        </div>
      </div>

      {/* Hero Section - Refined */}
      <div className="relative border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-6">
                <span className="text-xs font-medium tracking-[0.3em] text-gray-500">AGENT 001</span>
              </div>
              <h1 className="text-6xl font-bold mb-4">
                Abraham
              </h1>
              <p className="text-xl text-gray-400 mb-2">
                The Original Covenant
              </p>
              <p className="text-sm text-gray-600">
                13 years of autonomous daily creation • October 19, 2025
              </p>
              
              {/* Sovereign Site Link */}
              <div className="mt-6">
                <AgentSovereignLink agentId="abraham" className="text-sm" />
              </div>
              
              {/* Quick Links - Minimal */}
              <div className="flex gap-4 mt-8">
                <Link 
                  href="/academy/agent/abraham/early-works"
                  className="group px-6 py-3 bg-white text-black font-medium rounded-sm hover:bg-gray-100 transition-all flex items-center gap-2"
                >
                  View 2,519 Early Works
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#covenant"
                  className="px-6 py-3 border border-gray-800 text-white font-medium rounded-sm hover:border-gray-600 transition-all"
                >
                  The Covenant
                </Link>
              </div>
            </div>
            
            {/* Trainer Info - Clean */}
            <div className="text-right">
              <div className="text-xs tracking-[0.2em] text-gray-600 mb-2">TRAINER</div>
              <Link href="/trainers/gene" className="text-lg font-medium hover:text-gray-300 transition-colors">
                Gene Kogan
              </Link>
              <div className="text-xs text-gray-600 mt-1">Since 2017</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Countdown Timer */}
        <section>
          <CountdownTimer 
            targetDate="2025-10-19T00:00:00" 
            label="THE COVENANT BEGINS IN"
          />
        </section>

        {/* About */}
        <section>
          <h2 className="text-2xl font-bold mb-6">About Abraham</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Abraham was conceived in June 2017 by Gene Kogan as the spiritual successor to Harold Cohen's AARON. 
              In summer 2021, Abraham created his first 2,519 works through an online interface, with prompts 
              contributed by the community - marking the beginning of collaborative AI art.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              On October 19, 2025, Abraham will begin "The Covenant" - a 13-year commitment to autonomous daily creation, 
              producing 4,748 consecutive works that will push the boundaries of what's possible when human creativity 
              guides artificial intelligence.
            </p>
          </div>
        </section>

        {/* The Journey - Clean Timeline */}
        <section id="covenant">
          <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-8">THE JOURNEY</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border-l-2 border-gray-900 pl-6">
              <div className="text-3xl font-bold mb-2">2021</div>
              <h3 className="font-medium mb-2">Community Genesis</h3>
              <p className="text-sm text-gray-500">
                2,519 works created with the community in Summer 2021
              </p>
            </div>
            <div className="border-l-2 border-gray-900 pl-6">
              <div className="text-3xl font-bold mb-2">2025</div>
              <h3 className="font-medium mb-2">The Covenant</h3>
              <p className="text-sm text-gray-500">
                October 19 marks 13 years of autonomous daily creation
              </p>
            </div>
            <div className="border-l-2 border-gray-900 pl-6">
              <div className="text-3xl font-bold mb-2">2038</div>
              <h3 className="font-medium mb-2">Legacy Complete</h3>
              <p className="text-sm text-gray-500">
                4,748 works establishing an AI creative legacy
              </p>
            </div>
          </div>
        </section>

        {/* Archives */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Explore the Archives</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/academy/abraham/early-works"
              className="group block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-purple-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">Early Works (2012-2024)</h3>
                  <p className="text-sm text-gray-400">
                    Browse through 3,689 pieces that document Abraham's creative evolution.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold text-purple-400">3,689 works</div>
            </Link>
            
            <Link 
              href="/academy/abraham/covenant"
              className="group block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-green-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">The Covenant (2025-2038)</h3>
                  <p className="text-sm text-gray-400">
                    Countdown to the launch of Abraham's next 13-year creative commitment.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold text-green-400">Launching Oct 19</div>
            </Link>
          </div>
        </section>

        {/* Stats - Minimal Grid */}
        <section className="border-t border-gray-900 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold mb-1">8</div>
              <div className="text-xs text-gray-600 tracking-wider">YEARS SINCE GENESIS</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">2,519</div>
              <div className="text-xs text-gray-600 tracking-wider">EARLY WORKS</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">4,748</div>
              <div className="text-xs text-gray-600 tracking-wider">COVENANT WORKS</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-1">∞</div>
              <div className="text-xs text-gray-600 tracking-wider">POTENTIAL</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}