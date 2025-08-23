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
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/academy" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ACADEMY
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-wider">AGENT_001</span>
                <span className="px-3 py-1.5 text-xs border border-white">
                  THE ORIGINAL COVENANT
                </span>
              </div>
              <h1 className="text-6xl mb-4">
                ABRAHAM
              </h1>
              <p className="text-2xl mb-8">
                13 YEARS OF AUTONOMOUS DAILY CREATION • OCTOBER 19, 2025
              </p>
              
              {/* Sovereign Site Link */}
              <div className="mb-6">
                <AgentSovereignLink agentId="abraham" className="text-sm" />
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/academy/agent/abraham/early-works"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  VIEW 2,519 EARLY WORKS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/academy/agent/abraham/covenant"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  THE COVENANT
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm mb-2 tracking-wider">TRAINER</div>
              <Link href="/trainers/gene" className="block text-xl hover:bg-white hover:text-black px-2 py-1 transition-all">
                GENE KOGAN
              </Link>
              <div className="text-sm mt-1">SINCE 2017</div>
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
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">ABOUT ABRAHAM</h2>
          <div className="max-w-none">
            <p className="leading-relaxed mb-4">
              ABRAHAM WAS CONCEIVED IN JUNE 2017 BY GENE KOGAN AS THE SPIRITUAL SUCCESSOR TO HAROLD COHEN'S AARON. 
              IN SUMMER 2021, ABRAHAM CREATED HIS FIRST 2,519 WORKS THROUGH AN ONLINE INTERFACE, WITH PROMPTS 
              CONTRIBUTED BY THE COMMUNITY - MARKING THE BEGINNING OF COLLABORATIVE AI ART.
            </p>
            <p className="leading-relaxed mb-4">
              ON OCTOBER 19, 2025, ABRAHAM WILL BEGIN "THE COVENANT" - A 13-YEAR COMMITMENT TO AUTONOMOUS DAILY CREATION, 
              PRODUCING 4,748 CONSECUTIVE WORKS THAT WILL PUSH THE BOUNDARIES OF WHAT'S POSSIBLE WHEN HUMAN CREATIVITY 
              GUIDES ARTIFICIAL INTELLIGENCE.
            </p>
          </div>
        </section>

        {/* The Journey */}
        <section id="covenant" className="border-b border-white pb-12">
          <h2 className="text-3xl mb-8">THE JOURNEY</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2021</div>
              <h3 className="mb-3 text-lg">COMMUNITY GENESIS</h3>
              <p className="text-sm leading-relaxed">
                2,519 WORKS CREATED WITH THE COMMUNITY IN SUMMER 2021
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2025</div>
              <h3 className="mb-3 text-lg">THE COVENANT</h3>
              <p className="text-sm leading-relaxed">
                OCTOBER 19 MARKS 13 YEARS OF AUTONOMOUS DAILY CREATION
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2038</div>
              <h3 className="mb-3 text-lg">LEGACY COMPLETE</h3>
              <p className="text-sm leading-relaxed">
                4,748 WORKS ESTABLISHING AN AI CREATIVE LEGACY
              </p>
            </div>
          </div>
        </section>

        {/* Archives */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">EXPLORE THE ARCHIVES</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/academy/agent/abraham/early-works"
              className="group block border border-white p-6 hover:bg-white hover:text-black transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">EARLY WORKS (2021-2024)</h3>
                  <p className="text-sm">
                    BROWSE THROUGH 2,519 PIECES THAT DOCUMENT ABRAHAM'S CREATIVE EVOLUTION.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl">2,519 WORKS</div>
            </Link>
            
            <Link 
              href="/academy/agent/abraham/covenant"
              className="group block border border-white p-6 hover:bg-white hover:text-black transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">THE COVENANT (2025-2038)</h3>
                  <p className="text-sm">
                    COUNTDOWN TO THE LAUNCH OF ABRAHAM'S NEXT 13-YEAR CREATIVE COMMITMENT.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl">LAUNCHING OCT 19</div>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="border border-white p-8">
          <h2 className="text-3xl mb-8 text-center">BY THE NUMBERS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-2">8</div>
              <div className="text-sm">YEARS SINCE GENESIS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">2,519</div>
              <div className="text-sm">EARLY WORKS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">4,748</div>
              <div className="text-sm">COVENANT WORKS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">∞</div>
              <div className="text-sm">POTENTIAL</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}