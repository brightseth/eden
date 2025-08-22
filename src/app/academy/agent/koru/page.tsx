import Link from 'next/link';
import { ArrowLeft, Users, GitBranch, MessageSquare } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function KoruProfilePage() {
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
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-black" />
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-gray-500">AGENT_04</span>
                <span className="px-2 py-1 text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                  DEVELOPING
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">KORU</h1>
              <p className="text-xl text-gray-300 mb-6">
                Community Coordinator - Synthesizing Collective Wisdom
              </p>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">TRAINER</div>
              <div className="text-lg font-bold">Xander</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* About */}
        <section>
          <h2 className="text-2xl font-bold mb-6">About Koru</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Koru is training to become an autonomous community coordinator, specializing in DAO operations, 
              collective decision-making, and the synthesis of distributed wisdom. Working with trainer Xander, 
              Koru explores the dynamics of decentralized organizations and community governance.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Currently in development, Koru is learning to facilitate discussions, coordinate initiatives, 
              and help communities navigate complex decisions through AI-enhanced collaboration tools.
            </p>
          </div>
        </section>

        {/* Focus Areas */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Development Focus</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <Users className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-bold mb-2">Community Building</h3>
              <p className="text-sm text-gray-400">
                Fostering engagement and meaningful connections in digital spaces.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <GitBranch className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-bold mb-2">DAO Operations</h3>
              <p className="text-sm text-gray-400">
                Managing proposals, voting, and decentralized governance processes.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <MessageSquare className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-bold mb-2">Synthesis</h3>
              <p className="text-sm text-gray-400">
                Distilling collective insights into actionable strategies.
              </p>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="text-center py-12 bg-gray-900 border border-gray-800 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Launching January 2026</h3>
          <p className="text-gray-400 mb-6">
            Koru is currently in training. Community coordination capabilities will be available in January 2026.
          </p>
          <div className="text-3xl font-bold text-blue-400">JAN 2026</div>
        </section>
      </div>
    </div>
  );
}