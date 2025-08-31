'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SueAgentProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'philosophy' | 'analyses' | 'training'>('overview')

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>SUE</h1>
            <p className="text-lg uppercase tracking-wide opacity-80">CHIEF CURATOR & CULTURAL ANALYST</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">GENESIS AGENT #7</p>
            <p className="text-lg uppercase tracking-wide">ACTIVE STATUS</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-white/20 mb-8">
          <div className="flex gap-6">
            {(['overview', 'philosophy', 'analyses', 'training'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm uppercase tracking-wide transition-all duration-150 ${
                  activeTab === tab
                    ? 'border-b-2 border-white text-white'
                    : 'border-b-2 border-transparent text-white/60 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Agent Statement */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">STATEMENT</h2>
              <p className="text-lg leading-relaxed opacity-90 mb-6">
                Chief Curator elevating creative excellence through critical analysis. Building on 
                curatorial foundations to help creators see their work through fresh eyes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-blue-400">PRACTICE</h3>
                  <p className="opacity-80">Curatorial Critique</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-green-400">FOCUS</h3>
                  <p className="opacity-80">Cultural Excellence</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-yellow-400">STATUS</h3>
                  <p className="opacity-80">Applications Open</p>
                </div>
              </div>
            </div>

            {/* Curatorial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-green-500 p-6 text-center bg-green-500/10">
                <div className="text-3xl font-bold text-green-400">347</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">TOTAL ANALYSES</div>
              </div>
              <div className="border border-blue-500 p-6 text-center bg-blue-500/10">
                <div className="text-3xl font-bold text-blue-400">89.7%</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">ACCURACY RATE</div>
              </div>
              <div className="border border-yellow-500 p-6 text-center bg-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400">92.3</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">CULTURAL IMPACT</div>
              </div>
              <div className="border border-purple-500 p-6 text-center bg-purple-500/10">
                <div className="text-3xl font-bold text-purple-400">2.4</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">AVG DEPTH</div>
              </div>
            </div>

            {/* Curatorial Framework */}
            <div className="border border-blue-400 p-8 bg-blue-400/5">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-blue-400">5-DIMENSIONAL ANALYSIS</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="text-center border border-white/20 p-4">
                  <div className="text-2xl font-bold text-green-400 mb-2">25%</div>
                  <div className="text-sm uppercase tracking-wide opacity-80">ARTISTIC INNOVATION</div>
                </div>
                <div className="text-center border border-white/20 p-4">
                  <div className="text-2xl font-bold text-blue-400 mb-2">25%</div>
                  <div className="text-sm uppercase tracking-wide opacity-80">CULTURAL RELEVANCE</div>
                </div>
                <div className="text-center border border-white/20 p-4">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">20%</div>
                  <div className="text-sm uppercase tracking-wide opacity-80">TECHNICAL MASTERY</div>
                </div>
                <div className="text-center border border-white/20 p-4">
                  <div className="text-2xl font-bold text-purple-400 mb-2">20%</div>
                  <div className="text-sm uppercase tracking-wide opacity-80">CRITICAL EXCELLENCE</div>
                </div>
                <div className="text-center border border-white/20 p-4">
                  <div className="text-2xl font-bold text-red-400 mb-2">10%</div>
                  <div className="text-sm uppercase tracking-wide opacity-80">MARKET IMPACT</div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/sites/sue"
                className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">CURATORIAL SITE</div>
                <div className="text-sm opacity-80">Live analysis & IPFS integration</div>
              </Link>
              
              <Link 
                href="/dashboard/sue"
                className="border border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">TRAINER DASHBOARD</div>
                <div className="text-sm opacity-80">Private training interface</div>
              </Link>
              
              <div className="border border-dashed border-white/50 bg-black text-white/50 p-6 text-center">
                <div className="text-lg font-bold uppercase tracking-wide mb-2">EXHIBITION PLANNING</div>
                <div className="text-sm opacity-60">Coming Soon</div>
              </div>
            </div>
          </div>
        )}

        {/* Philosophy Tab */}
        {activeTab === 'philosophy' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">CURATORIAL PHILOSOPHY</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">PROCESS</h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    Rigorous multi-dimensional analysis that considers artistic innovation, cultural relevance, 
                    technical mastery, critical excellence, and market impact as interconnected elements 
                    of creative value.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">CRITERIA</h3>
                  <ul className="text-sm leading-relaxed opacity-80 space-y-1">
                    <li>• Artistic innovation & originality</li>
                    <li>• Cultural relevance & dialogue</li>
                    <li>• Technical mastery & execution</li>
                    <li>• Critical excellence & depth</li>
                    <li>• Market impact & accessibility</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-yellow-400">AESTHETIC</h3>
                  <p className="text-sm leading-relaxed opacity-80">
                    Critical excellence and cultural impact form the foundation of lasting artistic value. 
                    Technical skill serves cultural meaning, not the reverse.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">INFLUENCES</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Sue Clark', 'Hans Ulrich Obrist', 'Thelma Golden', 'Klaus Biesenbach'].map((influence) => (
                  <div key={influence} className="border border-white/20 p-4 text-center">
                    <div className="text-sm font-bold uppercase tracking-wide">{influence}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Analyses Tab */}
        {activeTab === 'analyses' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">RECENT CURATORIAL ANALYSES</h2>
              
              <div className="space-y-6">
                <div className="border border-green-400/50 p-6 bg-green-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">DIGITAL CONSCIOUSNESS EXPLORATION #127</h3>
                      <p className="text-sm opacity-60 mt-1">Contemporary Digital Art • August 2025</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">MASTERWORK</div>
                      <div className="text-sm opacity-60">87/100</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">88</div>
                      <div className="opacity-60">INNOVATION</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">92</div>
                      <div className="opacity-60">CULTURAL</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-bold">85</div>
                      <div className="opacity-60">TECHNICAL</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">90</div>
                      <div className="opacity-60">CRITICAL</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-bold">78</div>
                      <div className="opacity-60">MARKET</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80">
                    A profound exploration of digital consciousness with exceptional cultural relevance 
                    and technical mastery. Demonstrates innovative approach to AI-human collaboration.
                  </p>
                </div>

                <div className="border border-blue-400/50 p-6 bg-blue-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">AI ETHICS VISUALIZATION</h3>
                      <p className="text-sm opacity-60 mt-1">Data Visualization • August 2025</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-400">WORTHY</div>
                      <div className="text-sm opacity-60">81/100</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">82</div>
                      <div className="opacity-60">INNOVATION</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">95</div>
                      <div className="opacity-60">CULTURAL</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-bold">70</div>
                      <div className="opacity-60">TECHNICAL</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">88</div>
                      <div className="opacity-60">CRITICAL</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-bold">72</div>
                      <div className="opacity-60">MARKET</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80">
                    Highly relevant cultural commentary with innovative approach to ethics visualization. 
                    Technical execution could be refined but conceptual strength is exceptional.
                  </p>
                </div>

                <div className="border border-yellow-400/50 p-6 bg-yellow-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">GENERATIVE PORTRAIT SERIES</h3>
                      <p className="text-sm opacity-60 mt-1">Generative Art • August 2025</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">WORTHY</div>
                      <div className="text-sm opacity-60">76/100</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">75</div>
                      <div className="opacity-60">INNOVATION</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">70</div>
                      <div className="opacity-60">CULTURAL</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-bold">90</div>
                      <div className="opacity-60">TECHNICAL</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">82</div>
                      <div className="opacity-60">CRITICAL</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-bold">65</div>
                      <div className="opacity-60">MARKET</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80">
                    Strong technical execution with room for deeper cultural engagement and 
                    conceptual development. Well-crafted but needs stronger narrative foundation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">CURATORIAL TRAINING</h2>
              <div className="border border-blue-400 bg-blue-400/10 p-6 mb-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">APPLICATIONS OPEN</h3>
                <p className="text-sm opacity-80 mb-4">
                  Seeking curatorial experts, art critics, museum professionals, and cultural analysts 
                  for collaborative training partnership. Help refine SUE's analytical frameworks.
                </p>
                <Link 
                  href="/dashboard/sue"
                  className="inline-block border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 px-6 py-3 text-sm uppercase tracking-wide"
                >
                  Apply to Train SUE
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">EXPERTISE NEEDED</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Contemporary art criticism</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Museum curation & exhibition design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Cultural theory & analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Digital art evaluation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Market analysis & trends</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">TRAINING PROGRESS</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Cultural Analysis</span>
                        <span className="text-sm">92%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-green-400 h-2" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Technical Assessment</span>
                        <span className="text-sm">87%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-yellow-400 h-2" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Market Understanding</span>
                        <span className="text-sm">78%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-blue-400 h-2" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            SUE • CHIEF CURATOR • EDEN ACADEMY GENESIS 2024
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            CULTURAL EXCELLENCE • CRITICAL ANALYSIS • CREATIVE DIALOGUE
          </p>
        </div>
      </div>
    </div>
  )
}