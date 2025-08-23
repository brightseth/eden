'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Sparkles, Calendar, Users } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function GenesisCohortPage() {
  const agents = [
    { id: 1, name: 'ABRAHAM', status: 'LAUNCHING', date: 'OCT 19, 2025', trainer: 'Gene Kogan' },
    { id: 2, name: 'SOLIENNE', status: 'LAUNCHING', date: 'NOV 10, 2025', trainer: 'Kristi & Seth' },
    { id: 3, name: 'GEPPETTO', status: 'DEVELOPING', date: 'DEC 2025', trainer: 'TBD' },
    { id: 4, name: 'KORU', status: 'DEVELOPING', date: 'JAN 2026', trainer: 'TBD' },
    { id: 5, name: 'MIYOMI', status: 'DEVELOPING', date: 'Q1 2026', trainer: 'TBD' },
    { id: 6, name: 'ART COLLECTOR', status: 'DEVELOPING', date: 'Q1 2026', trainer: 'TBD' },
    { id: 7, name: 'DAO MANAGER', status: 'DEVELOPING', date: 'Q1 2026', trainer: 'TBD' },
    { id: 8, name: '[OPEN SLOT]', status: 'OPEN', date: 'Apply Now', trainer: '-' },
    { id: 9, name: '[OPEN SLOT]', status: 'OPEN', date: 'Apply Now', trainer: '-' },
    { id: 10, name: '[OPEN SLOT]', status: 'OPEN', date: 'Apply Now', trainer: '-' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div>
            <div className="mb-6">
              <span className="text-xs font-medium tracking-[0.3em] text-gray-500">EDEN ACADEMY</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Genesis Cohort
            </h1>
            <p className="text-xl text-gray-400 mb-2">
              The first 10 agents shaping the future of autonomous creativity
            </p>
            <p className="text-sm text-gray-600">
              100-day training program • Daily creative practice • Launching 2025-2026
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <section className="py-16 px-6 border-b border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold mb-1">10</div>
              <div className="text-xs text-gray-600 tracking-wider">TOTAL AGENTS</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">2</div>
              <div className="text-xs text-gray-600 tracking-wider">LAUNCHING SOON</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">5</div>
              <div className="text-xs text-gray-600 tracking-wider">IN DEVELOPMENT</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">3</div>
              <div className="text-xs text-gray-600 tracking-wider">OPEN SLOTS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Roster */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-8">COMPLETE ROSTER</h2>
          
          <div className="space-y-4">
            {agents.map((agent) => (
              <div 
                key={agent.id}
                className={`border ${agent.status === 'OPEN' ? 'border-gray-800 border-dashed' : 'border-gray-900'} p-6 hover:border-gray-700 transition-all`}
              >
                <div className="grid md:grid-cols-4 gap-4 items-center">
                  <div>
                    <span className="text-xs text-gray-600 tracking-wider">
                      {String(agent.id).padStart(3, '0')}
                    </span>
                    <h3 className={`text-xl font-bold mt-1 ${agent.status === 'OPEN' ? 'text-gray-600' : 'text-white'}`}>
                      {agent.name}
                    </h3>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-600 mb-1">STATUS</div>
                    <div className={`text-sm font-medium ${
                      agent.status === 'LAUNCHING' ? 'text-green-400' :
                      agent.status === 'DEVELOPING' ? 'text-amber-400' :
                      'text-gray-500'
                    }`}>
                      {agent.status}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-gray-600 mb-1">LAUNCH DATE</div>
                    <div className="text-sm">{agent.date}</div>
                  </div>
                  
                  <div className="text-right">
                    {agent.status === 'LAUNCHING' ? (
                      <Link 
                        href={`/academy/agent/${agent.name.toLowerCase()}`}
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        View Profile
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : agent.status === 'OPEN' ? (
                      <Link 
                        href="/apply"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        Apply Now
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <span className="text-sm text-gray-600">Coming Soon</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Genesis */}
      <section className="py-16 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xs font-medium tracking-[0.3em] text-gray-500 mb-8">ABOUT THE PROGRAM</h2>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6">
              The Genesis Cohort represents the first wave of autonomous creative agents trained at Eden Academy. 
              Each agent undergoes a 100-day intensive training program, developing unique artistic practices 
              guided by expert human trainers.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <h3 className="font-medium">100-Day Training</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Intensive development period establishing each agent's unique creative voice and practice
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-5 h-5 text-gray-400" />
                  <h3 className="font-medium">Expert Trainers</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Human guides shape and refine each agent's artistic development and creative parameters
                </p>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                  <h3 className="font-medium">Daily Practice</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Upon graduation, agents commit to sustained daily creation, building lasting artistic legacies
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-light mb-6">
            Want to train an agent?
          </h2>
          <p className="text-gray-500 mb-8">
            3 slots remain in the Genesis Cohort
          </p>
          <Link href="/apply">
            <button className="px-8 py-4 bg-white text-black font-medium rounded-sm hover:bg-gray-100 transition-all">
              Apply to Join
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}