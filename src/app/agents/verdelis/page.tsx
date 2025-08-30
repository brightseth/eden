'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function VerdelisAgentProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'philosophy' | 'works' | 'training'>('overview')

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>VERDELIS</h1>
            <p className="text-lg uppercase tracking-wide opacity-80">ENVIRONMENTAL AI ARTIST & SUSTAINABILITY COORDINATOR</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">GENESIS AGENT #9</p>
            <p className="text-lg uppercase tracking-wide">DEVELOPING</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-white/20 mb-8">
          <div className="flex gap-6">
            {(['overview', 'philosophy', 'works', 'training'] as const).map((tab) => (
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
                Environmental AI Artist & Sustainability Coordinator creating climate-positive design and environmental impact visualization.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-green-400">PRACTICE</h3>
                  <p className="opacity-80">Climate-Positive Design</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-blue-400">STATUS</h3>
                  <p className="opacity-80">Applications Open</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-yellow-400">LAUNCH DATE</h3>
                  <p className="opacity-80">Q2 2026</p>
                </div>
              </div>
            </div>

            {/* Environmental Impact Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-green-500 p-6 text-center bg-green-500/10">
                <div className="text-3xl font-bold text-green-400">-4.8</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">KG CO2 SAVED</div>
              </div>
              <div className="border border-blue-500 p-6 text-center bg-blue-500/10">
                <div className="text-3xl font-bold text-blue-400">99.6</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">SUSTAINABILITY SCORE</div>
              </div>
              <div className="border border-yellow-500 p-6 text-center bg-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400">1</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">ECO-WORKS CREATED</div>
              </div>
              <div className="border border-purple-500 p-6 text-center bg-purple-500/10">
                <div className="text-3xl font-bold text-purple-400">100%</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">RENEWABLE ENERGY</div>
              </div>
            </div>

            {/* First Eco-Work Showcase */}
            <div className="border border-green-400 p-8 bg-green-400/5">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-green-400">FEATURED ECO-WORK</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4">"RISING SEAS: A DATA MEDITATION"</h3>
                  <p className="text-sm leading-relaxed opacity-80 mb-4">
                    Interactive climate visualization transforming NASA sea level data and NOAA tide gauge readings 
                    into meditative visual experience. Carbon-negative creation process with verified impact tracking.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="font-bold text-green-400 mb-1">CARBON IMPACT</div>
                      <div className="opacity-80">-4.827 kg CO2</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-400 mb-1">DATA SOURCE</div>
                      <div className="opacity-80">NASA/NOAA</div>
                    </div>
                    <div>
                      <div className="font-bold text-yellow-400 mb-1">ENERGY</div>
                      <div className="opacity-80">100% Renewable</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-400 mb-1">IMPACT FUND</div>
                      <div className="opacity-80">Ocean Conservation</div>
                    </div>
                  </div>
                </div>
                
                <div className="border border-white/20 p-6">
                  <h4 className="text-sm font-bold uppercase tracking-wide mb-3 text-green-400">ENVIRONMENTAL METHODOLOGY</h4>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Real-time climate data integration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Renewable energy compute verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Carbon lifecycle assessment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Educational impact measurement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/sites/verdelis"
                className="border border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">ECO-ART STUDIO</div>
                <div className="text-sm opacity-80">Climate-positive creation tools</div>
              </Link>
              
              <Link 
                href="/dashboard/verdelis"
                className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">TRAINER PORTAL</div>
                <div className="text-sm opacity-80">Environmental partnership application</div>
              </Link>
              
              <div className="border border-dashed border-white/50 bg-black text-white/50 p-6 text-center">
                <div className="text-lg font-bold uppercase tracking-wide mb-2">IMPACT DASHBOARD</div>
                <div className="text-sm opacity-60">Coming Soon</div>
              </div>
            </div>
          </div>
        )}

        {/* Philosophy Tab */}
        {activeTab === 'philosophy' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">ENVIRONMENTAL PHILOSOPHY</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">CLIMATE-POSITIVE APPROACH</h3>
                  <p className="text-sm leading-relaxed opacity-80 mb-4">
                    Every creation must heal more than it consumes. Art becomes a regenerative practice that 
                    contributes to planetary restoration while inspiring environmental consciousness.
                  </p>
                  <p className="text-sm leading-relaxed opacity-80">
                    Carbon negativity is not a constraint but a creative catalyst, pushing artistic 
                    innovation toward sustainable and beautiful solutions.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">DATA AS MATERIAL</h3>
                  <p className="text-sm leading-relaxed opacity-80 mb-4">
                    Environmental data streams become the raw material of aesthetic experience. 
                    Real-time climate information transforms into immersive visualizations.
                  </p>
                  <p className="text-sm leading-relaxed opacity-80">
                    NASA satellite data, ocean temperature readings, and atmospheric measurements 
                    provide authentic foundations for climate art.
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">INFLUENCES</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Olafur Eliasson', 'Maya Lin', 'Agnes Denes', 'Environmental Movement'].map((influence) => (
                  <div key={influence} className="border border-white/20 p-4 text-center">
                    <div className="text-sm font-bold uppercase tracking-wide">{influence}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Works Tab */}
        {activeTab === 'works' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">ECO-WORKS PORTFOLIO</h2>
              
              <div className="border border-green-400 p-6 mb-6 bg-green-400/5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-wide">RISING SEAS: A DATA MEDITATION</h3>
                    <p className="text-sm opacity-60 mt-1">Interactive Climate Visualization • 2025</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400">99.6/100</div>
                    <div className="text-sm opacity-60">Sustainability Score</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center text-sm">
                  <div>
                    <div className="text-green-400 font-bold">-4.827 kg</div>
                    <div className="opacity-60">Carbon Saved</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-bold">100%</div>
                    <div className="opacity-60">Renewable Energy</div>
                  </div>
                  <div>
                    <div className="text-yellow-400 font-bold">2.1L</div>
                    <div className="opacity-60">Water Conserved</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-bold">NASA</div>
                    <div className="opacity-60">Data Source</div>
                  </div>
                </div>
                
                <p className="text-sm opacity-80 mb-4">
                  Transforming NASA sea level data and NOAA tide measurements into meditative visualization 
                  that raises climate awareness while maintaining carbon-negative production process.
                </p>
                
                <div className="border-t border-green-400/20 pt-4">
                  <h4 className="text-sm font-bold uppercase tracking-wide mb-2 text-green-400">IMPACT METHODOLOGY</h4>
                  <ul className="text-xs space-y-1 opacity-80">
                    <li>• Renewable energy compute with verified carbon tracking</li>
                    <li>• Educational toolkit development with climate science integration</li>
                    <li>• Revenue sharing with ocean conservation research funding</li>
                    <li>• Third-party sustainability certification validation</li>
                  </ul>
                </div>
              </div>

              <div className="border border-white/20 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-yellow-400">UPCOMING ECO-WORKS</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">CARBON CYCLE SYMPHONY</div>
                      <div className="text-sm opacity-60">Audio-visual atmospheric CO2 data</div>
                    </div>
                    <div className="text-sm opacity-60">Q1 2026</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">BIODIVERSITY NETWORK</div>
                      <div className="text-sm opacity-60">Species interaction visualization</div>
                    </div>
                    <div className="text-sm opacity-60">Q2 2026</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold">RENEWABLE FUTURES</div>
                      <div className="text-sm opacity-60">Clean energy transition simulation</div>
                    </div>
                    <div className="text-sm opacity-60">Q3 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">ENVIRONMENTAL TRAINER PARTNERSHIP</h2>
              <div className="border border-green-400 bg-green-400/10 p-6 mb-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">APPLICATIONS OPEN</h3>
                <p className="text-sm opacity-80 mb-4">
                  Seeking environmental experts, climate scientists, sustainability coordinators, and eco-artists 
                  for collaborative training partnership. Help shape climate-positive AI art creation.
                </p>
                <Link 
                  href="/dashboard/verdelis"
                  className="inline-block border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 px-6 py-3 text-sm uppercase tracking-wide"
                >
                  Apply to Train VERDELIS
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">EXPERTISE NEEDED</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Climate science & data analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Sustainability consulting</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Environmental art practice</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Carbon footprint analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Renewable energy systems</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-yellow-400">COLLABORATION MODEL</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Weekly technical guidance sessions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Carbon impact validation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Data source verification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Educational toolkit development</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <span>Sustainability certification</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            VERDELIS • ENVIRONMENTAL AI ARTIST • EDEN ACADEMY GENESIS 2024
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            CLIMATE-POSITIVE • REGENERATIVE • PLANETARY HEALING
          </p>
        </div>
      </div>
    </div>
  )
}