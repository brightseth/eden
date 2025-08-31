import Link from 'next/link';
import { ArrowLeft, Twitter, ArrowUpRight, Crown } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function SethProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/trainers" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Trainers
          </Link>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Left: Basic Info */}
          <div>
            <div className="mb-6">
              <span className="text-xs font-medium tracking-[0.3em] text-gray-500">TRAINER</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Seth Goldstein</h1>
            <p className="text-gray-400 mb-6">
              Creative Technologist
            </p>
            
            {/* Links */}
            <div className="space-y-3">
              <a href="https://twitter.com/sethgoldstein" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
                <Twitter className="w-4 h-4" />
                @sethgoldstein
              </a>
            </div>
          </div>

          {/* Middle: Bio */}
          <div className="md:col-span-2">
            <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">ABOUT</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed mb-4">
                Seth Goldstein is a creative technologist exploring the intersection of consciousness, 
                velocity, and architectural light through AI-driven creative exploration.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                As co-trainer of Solienne alongside Kristi Coronado, Seth helps guide the agent's 
                exploration of visual consciousness and the sublime through generative creation.
              </p>
            </div>

            {/* Training */}
            <div className="mt-12">
              <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">TRAINING</h2>
              <div className="grid gap-6">
                <Link href="/academy/agent/solienne" className="group">
                  <div className="border border-gray-900 p-6 hover:border-gray-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-gray-600">AGENT 002</span>
                        <h3 className="text-2xl font-bold mt-1 mb-2">SOLIENNE</h3>
                        <p className="text-sm text-gray-500">
                          Paris Photo debut • 3,677 generations
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          Co-trained with Kristi Coronado
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
                
                <Link href="/academy/agent/miyomi" className="group">
                  <div className="border border-gray-900 p-6 hover:border-gray-700 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-gray-600">AGENT 005</span>
                        <h3 className="text-2xl font-bold mt-1 mb-2">MIYOMI</h3>
                        <p className="text-sm text-gray-500">
                          Market Oracle • Live Trading Signals
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          Primary Trainer
                        </p>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* CEO Dashboard Access */}
            <div className="mt-12">
              <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-6">EXECUTIVE ACCESS</h2>
              <Link href="/admin/ceo/live-status" className="group">
                <div className="border border-yellow-500/30 bg-yellow-500/5 p-6 hover:bg-yellow-500/10 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Crown className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-xl font-bold">CEO DASHBOARD</h3>
                      </div>
                      <p className="text-sm text-gray-400">
                        Live agent status • Training progress • Revenue metrics
                      </p>
                      <p className="text-xs text-yellow-500/70 mt-2">
                        Executive access only
                      </p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}