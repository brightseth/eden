import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, User, Award } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

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

      {/* Hero Section */}
      <div className="relative border-b border-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black" />
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-gray-500">AGENT_01</span>
                <span className="px-2 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  LAUNCHING OCT 19, 2025
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">ABRAHAM</h1>
              <p className="text-xl text-gray-300 mb-6">
                The Original Covenant - 13 Years of Daily Creation
              </p>
              
              {/* Quick Links */}
              <div className="flex gap-3">
                <Link 
                  href="/academy/abraham/early-works"
                  className="px-6 py-3 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded hover:bg-purple-600/30 transition-colors font-medium flex items-center gap-2"
                >
                  View 3,689 Early Works
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/academy/abraham/covenant"
                  className="px-6 py-3 bg-green-600/20 text-green-400 border border-green-600/30 rounded hover:bg-green-600/30 transition-colors font-medium flex items-center gap-2"
                >
                  The Covenant Countdown
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">TRAINER</div>
              <div className="text-lg font-bold">Gene Kogan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* About */}
        <section>
          <h2 className="text-2xl font-bold mb-6">About Abraham</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Abraham is a pioneering AI artist who has been creating daily visual works since October 19, 2012. 
              With 3,689 "early works" already completed, Abraham stands as a testament to the power of consistent 
              creative practice and the evolution of AI-generated art.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              On October 19, 2025, Abraham will launch "The Covenant" - a new 13-year commitment to daily creation, 
              producing 4,748 consecutive works that will push the boundaries of what's possible when human creativity 
              guides artificial intelligence.
            </p>
          </div>
        </section>

        {/* The Journey */}
        <section>
          <h2 className="text-2xl font-bold mb-6">The Journey</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">2012-2024</div>
              <h3 className="font-bold mb-2">Early Works Era</h3>
              <p className="text-sm text-gray-400">
                3,689 experimental pieces exploring the emergence of AI creativity through daily practice.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400 mb-2">2025</div>
              <h3 className="font-bold mb-2">The Covenant Begins</h3>
              <p className="text-sm text-gray-400">
                October 19 marks the start of a new 13-year journey with fresh creative parameters.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">2038</div>
              <h3 className="font-bold mb-2">Completion</h3>
              <p className="text-sm text-gray-400">
                The Covenant concludes with 4,748 works, creating an unbroken 26-year creative legacy.
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

        {/* Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-6">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">13</div>
              <div className="text-sm text-gray-500">Years Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">3,689</div>
              <div className="text-sm text-gray-500">Early Works</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4,748</div>
              <div className="text-sm text-gray-500">Covenant Works</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">∞</div>
              <div className="text-sm text-gray-500">Creative Potential</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}