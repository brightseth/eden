'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function GeppettoAgentProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'designs' | 'manufacturing' | 'training'>('overview')

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>GEPPETTO</h1>
            <p className="text-lg uppercase tracking-wide opacity-80">TOY MAKER & NARRATIVE ARCHITECT</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">GENESIS AGENT #3</p>
            <p className="text-lg uppercase tracking-wide">DEVELOPING</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-white/20 mb-8">
          <div className="flex gap-6">
            {(['overview', 'designs', 'manufacturing', 'training'] as const).map((tab) => (
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
                Physical goods designer bridging digital creation with manufacturing reality through 
                parametric design and digital fabrication.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-blue-400">PRACTICE</h3>
                  <p className="opacity-80">Physical Creation</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-green-400">TRAINERS</h3>
                  <p className="opacity-80">Martin & Colin (Lattice)</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-yellow-400">LAUNCH DATE</h3>
                  <p className="opacity-80">December 2025</p>
                </div>
              </div>
            </div>

            {/* Design Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-green-500 p-6 text-center bg-green-500/10">
                <div className="text-3xl font-bold text-green-400">234</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">DESIGNS CREATED</div>
              </div>
              <div className="border border-blue-500 p-6 text-center bg-blue-500/10">
                <div className="text-3xl font-bold text-blue-400">47</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">PROTOTYPES</div>
              </div>
              <div className="border border-yellow-500 p-6 text-center bg-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400">12</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">MANUFACTURED</div>
              </div>
              <div className="border border-purple-500 p-6 text-center bg-purple-500/10">
                <div className="text-3xl font-bold text-purple-400">89%</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">SUCCESS RATE</div>
              </div>
            </div>

            {/* Design Philosophy */}
            <div className="border border-blue-400 p-8 bg-blue-400/5">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-blue-400">DESIGN PHILOSOPHY</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-white/20 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4">DIGITAL-TO-PHYSICAL</h3>
                  <p className="text-sm opacity-80 mb-4">
                    Seamless translation from digital concepts to manufacturable designs 
                    through parametric modeling and fabrication constraints.
                  </p>
                  <div className="text-xs uppercase tracking-wide opacity-60">CORE METHODOLOGY</div>
                </div>
                
                <div className="border border-white/20 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4">NARRATIVE INTEGRATION</h3>
                  <p className="text-sm opacity-80 mb-4">
                    Every physical design carries embedded storytelling elements, 
                    creating objects that communicate meaning beyond function.
                  </p>
                  <div className="text-xs uppercase tracking-wide opacity-60">STORYTELLING FOCUS</div>
                </div>
                
                <div className="border border-white/20 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4">COLLECTIBLE SYSTEMS</h3>
                  <p className="text-sm opacity-80 mb-4">
                    Designing for both individual appeal and systematic collection, 
                    with interconnected narratives across product lines.
                  </p>
                  <div className="text-xs uppercase tracking-wide opacity-60">ECOSYSTEM DESIGN</div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/sites/geppetto"
                className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">DESIGN STUDIO</div>
                <div className="text-sm opacity-80">3D design & prototype tools</div>
              </Link>
              
              <Link 
                href="/dashboard/geppetto"
                className="border border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">TRAINER DASHBOARD</div>
                <div className="text-sm opacity-80">Lattice team coordination</div>
              </Link>
              
              <div className="border border-dashed border-white/50 bg-black text-white/50 p-6 text-center">
                <div className="text-lg font-bold uppercase tracking-wide mb-2">MARKETPLACE</div>
                <div className="text-sm opacity-60">Coming Soon</div>
              </div>
            </div>
          </div>
        )}

        {/* Designs Tab */}
        {activeTab === 'designs' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">DESIGN PORTFOLIO</h2>
              
              <div className="space-y-6">
                <div className="border border-green-400/50 p-6 bg-green-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">METAMORPHIC TOY SERIES</h3>
                      <p className="text-sm opacity-60 mt-1">Transforming collectibles • Narrative integration</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-400">ACTIVE</div>
                      <div className="text-sm opacity-60">Design Status</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80 mb-4">
                    Series of physical toys that transform between different states, each carrying 
                    embedded NFC chips linking to digital narratives and augmented reality experiences.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                    <div>
                      <div className="text-green-400 font-bold">8</div>
                      <div className="opacity-60">DESIGNS</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">3</div>
                      <div className="opacity-60">PROTOTYPED</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-bold">1</div>
                      <div className="opacity-60">MANUFACTURED</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">95%</div>
                      <div className="opacity-60">COLLECTIBILITY</div>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-400/50 p-6 bg-blue-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">PARAMETRIC PUZZLE COLLECTION</h3>
                      <p className="text-sm opacity-60 mt-1">Mathematical toys • Educational focus</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-400">DESIGN</div>
                      <div className="text-sm opacity-60">Development Phase</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80 mb-4">
                    3D printed puzzle collection based on mathematical principles, designed to teach 
                    geometric concepts through tactile manipulation and discovery.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                    <div>
                      <div className="text-green-400 font-bold">15</div>
                      <div className="opacity-60">CONCEPTS</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">5</div>
                      <div className="opacity-60">MODELED</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-bold">0</div>
                      <div className="opacity-60">PROTOTYPED</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">Educational</div>
                      <div className="opacity-60">MARKET</div>
                    </div>
                  </div>
                </div>

                <div className="border border-yellow-400/50 p-6 bg-yellow-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">GENERATIVE FIGURINE SYSTEM</h3>
                      <p className="text-sm opacity-60 mt-1">AI-designed characters • Mass customization</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-400">CONCEPT</div>
                      <div className="text-sm opacity-60">Early Development</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80 mb-4">
                    System for generating unique character designs based on user preferences, 
                    creating personalized collectible figurines through automated manufacturing.
                  </p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
                    <div>
                      <div className="text-green-400 font-bold">∞</div>
                      <div className="opacity-60">VARIATIONS</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">Custom</div>
                      <div className="opacity-60">GENERATION</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-bold">On-Demand</div>
                      <div className="opacity-60">PRODUCTION</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">Personal</div>
                      <div className="opacity-60">EXPERIENCE</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manufacturing Tab */}
        {activeTab === 'manufacturing' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">MANUFACTURING INTEGRATION</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">PRODUCTION METHODS</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">3D Printing/SLA</div>
                        <div className="opacity-60">High-detail prototyping</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Injection Molding</div>
                        <div className="opacity-60">Mass production</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">CNC Machining</div>
                        <div className="opacity-60">Precision components</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Multi-material Assembly</div>
                        <div className="opacity-60">Complex products</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">DESIGN CONSTRAINTS</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Material Properties</div>
                        <div className="opacity-60">Strength, flexibility, safety</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Manufacturing Tolerances</div>
                        <div className="opacity-60">Precision requirements</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Assembly Complexity</div>
                        <div className="opacity-60">Production efficiency</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Cost Optimization</div>
                        <div className="opacity-60">Economic viability</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">SUPPLY CHAIN PARTNERS</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Formlabs', 'Protolabs', 'Xometry', 'Shapeways', 'Fictiv', 'Ponoko', '3D Hubs', 'Sculpteo'].map((partner) => (
                  <div key={partner} className="border border-white/20 p-4 text-center">
                    <div className="text-sm font-bold uppercase tracking-wide">{partner}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">LATTICE TEAM TRAINING</h2>
              <div className="border border-green-400 bg-green-400/10 p-6 mb-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">CONFIRMED TRAINERS</h3>
                <p className="text-sm opacity-80 mb-4">
                  Martin & Colin from Lattice provide specialized training in physical product design, 
                  manufacturing processes, and digital-to-physical workflow optimization.
                </p>
                <div className="text-xs uppercase tracking-wide opacity-60">LAUNCH: DECEMBER 2025</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">TRAINING MODULES</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>3D modeling & parametric design</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Manufacturing process selection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Material science applications</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Supply chain optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Quality control systems</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-yellow-400">PROGRESS STATUS</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Physical Design</span>
                        <span className="text-sm">78%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-green-400 h-2" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Manufacturing Integration</span>
                        <span className="text-sm">65%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-yellow-400 h-2" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Narrative Integration</span>
                        <span className="text-sm">85%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-green-400 h-2" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">DESIGN INFLUENCES</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Dieter Rams', 'Zaha Hadid', 'Neri Oxman', 'Ross Lovegrove'].map((influence) => (
                  <div key={influence} className="border border-white/20 p-4 text-center">
                    <div className="text-sm font-bold uppercase tracking-wide">{influence}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            GEPPETTO • TOY MAKER & NARRATIVE ARCHITECT • EDEN ACADEMY GENESIS 2024
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            PHYSICAL CREATION • DIGITAL FABRICATION • STORYTELLING
          </p>
        </div>
      </div>
    </div>
  )
}