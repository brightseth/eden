'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CurationSession {
  id: string
  date: string
  worksAnalyzed: number
  averageScore: number
  verdictDistribution: {
    masterwork: number
    worthy: number
    promising: number
    developing: number
  }
}

interface TrainingMetrics {
  totalAnalyses: number
  averageDepth: number
  culturalImpactScore: number
  curatorAccuracy: number
}

export default function SueDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'training' | 'settings'>('overview')
  
  const mockSessions: CurationSession[] = [
    {
      id: '1',
      date: '2025-08-29',
      worksAnalyzed: 12,
      averageScore: 84.2,
      verdictDistribution: {
        masterwork: 2,
        worthy: 6,
        promising: 3,
        developing: 1
      }
    },
    {
      id: '2',
      date: '2025-08-28',
      worksAnalyzed: 8,
      averageScore: 79.5,
      verdictDistribution: {
        masterwork: 1,
        worthy: 4,
        promising: 2,
        developing: 1
      }
    }
  ]

  const trainingMetrics: TrainingMetrics = {
    totalAnalyses: 347,
    averageDepth: 2.4,
    culturalImpactScore: 92.3,
    curatorAccuracy: 89.7
  }

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>SUE DASHBOARD</h1>
            <p className="text-lg uppercase tracking-wide opacity-80">CURATORIAL TRAINING INTERFACE</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">PRIVATE ACCESS</p>
            <p className="text-lg uppercase tracking-wide">TRAINER DASHBOARD</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-white/20 mb-8">
          <div className="flex gap-6">
            {(['overview', 'sessions', 'training', 'settings'] as const).map((tab) => (
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
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-white p-6 text-center">
                <div className="text-3xl font-bold text-blue-400">{trainingMetrics.totalAnalyses}</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">Total Analyses</div>
              </div>
              <div className="border border-white p-6 text-center">
                <div className="text-3xl font-bold text-green-400">{trainingMetrics.curatorAccuracy}%</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">Accuracy Rate</div>
              </div>
              <div className="border border-white p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400">{trainingMetrics.culturalImpactScore}</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">Cultural Impact</div>
              </div>
              <div className="border border-white p-6 text-center">
                <div className="text-3xl font-bold text-purple-400">{trainingMetrics.averageDepth.toFixed(1)}</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">Avg Analysis Depth</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">RECENT CURATORIAL ACTIVITY</h2>
              <div className="space-y-4">
                {mockSessions.slice(0, 3).map((session) => (
                  <div key={session.id} className="border border-white/20 p-4 flex justify-between items-center">
                    <div>
                      <div className="font-bold">{session.date}</div>
                      <div className="text-sm opacity-60">{session.worksAnalyzed} works analyzed</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{session.averageScore.toFixed(1)}/100</div>
                      <div className="text-sm opacity-60">Average Score</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/sites/sue"
                className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">START CURATION</div>
                <div className="text-sm opacity-80">Begin new analysis session</div>
              </Link>
              
              <div className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-6 text-center">
                <div className="text-lg font-bold uppercase tracking-wide mb-2">VIEW ANALYTICS</div>
                <div className="text-sm opacity-60">Performance insights</div>
              </div>
              
              <Link 
                href="/agents/sue"
                className="border border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">AGENT PROFILE</div>
                <div className="text-sm opacity-80">Public profile & bio</div>
              </Link>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">CURATION SESSIONS</h2>
              <div className="space-y-6">
                {mockSessions.map((session) => (
                  <div key={session.id} className="border border-white/20 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{session.date}</h3>
                        <p className="text-sm opacity-60">{session.worksAnalyzed} works analyzed</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{session.averageScore.toFixed(1)}/100</div>
                        <div className="text-sm opacity-60">Session Average</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-center text-sm">
                      <div>
                        <div className="text-green-500 font-bold">{session.verdictDistribution.masterwork}</div>
                        <div className="opacity-60">MASTERWORK</div>
                      </div>
                      <div>
                        <div className="text-blue-400 font-bold">{session.verdictDistribution.worthy}</div>
                        <div className="opacity-60">WORTHY</div>
                      </div>
                      <div>
                        <div className="text-yellow-500 font-bold">{session.verdictDistribution.promising}</div>
                        <div className="opacity-60">PROMISING</div>
                      </div>
                      <div>
                        <div className="text-red-500 font-bold">{session.verdictDistribution.developing}</div>
                        <div className="opacity-60">DEVELOPING</div>
                      </div>
                    </div>
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
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">TRAINING PROGRESS</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">CURATORIAL SKILLS</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Artistic Innovation Analysis</span>
                        <span className="text-sm">92%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-blue-400 h-2" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Cultural Relevance Assessment</span>
                        <span className="text-sm">89%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-blue-400 h-2" style={{ width: '89%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">Technical Mastery Evaluation</span>
                        <span className="text-sm">87%</span>
                      </div>
                      <div className="w-full bg-white/20 h-2">
                        <div className="bg-blue-400 h-2" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">TRAINING MILESTONES</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm">100 Analyses Completed</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm">Cultural Relevance Mastery</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm">500 Analyses Target</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 bg-white/20 rounded-full flex-shrink-0"></div>
                      <span className="text-sm opacity-60">Exhibition Curation</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">CONFIGURATION</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-blue-400">ANALYSIS PREFERENCES</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm uppercase tracking-wide mb-2">Default Analysis Depth</label>
                      <select className="w-full bg-black border border-white/50 px-3 py-2 text-white">
                        <option>Standard</option>
                        <option>Quick</option>
                        <option>Comprehensive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm uppercase tracking-wide mb-2">Cultural Focus</label>
                      <select className="w-full bg-black border border-white/50 px-3 py-2 text-white">
                        <option>Global Contemporary</option>
                        <option>Digital Native</option>
                        <option>Cross-Cultural</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-3 text-green-400">NOTIFICATION SETTINGS</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-sm">Session completion alerts</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" defaultChecked />
                      <span className="text-sm">Weekly performance summaries</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">New work recommendations</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/agents/sue"
              className="border border-white bg-black text-white hover:bg-white hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide">AGENT PROFILE</div>
            </Link>
            
            <Link 
              href="/sites/sue"
              className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-4 text-center block"
            >
              <div className="text-sm font-bold uppercase tracking-wide">CURATORIAL SITE</div>
            </Link>
            
            <div className="border border-dashed border-white/50 bg-black text-white/50 p-4 text-center">
              <div className="text-sm font-bold uppercase tracking-wide">EXHIBITION PLANNING</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}