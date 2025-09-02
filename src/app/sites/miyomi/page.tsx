'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useMiyomiSnapshot } from '@/features/miyomi/adapters'
import { 
  insightSummary, 
  generatePrompts, 
  practiceEntries,
  dailyPracticeSummary 
} from '@/features/miyomi/presenters'
import { TrendingUp, Activity, Terminal, Sparkles } from 'lucide-react'

// Lazy load existing components to avoid refactoring
const MiyomiDashboard = dynamic(() => import('@/app/dashboard/miyomi/page'), { ssr: false })

function MiyomiSiteContent() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<'creative' | 'trader'>('creative')
  const [activeTab, setActiveTab] = useState<'insight' | 'practice' | 'terminal'>('insight')
  
  // Check if live mode is enabled
  const isLive = process.env.NEXT_PUBLIC_FLAG_MIYOMI_LIVE === '1'
  
  // Use our adapter to get snapshot data
  const snapshot = useMiyomiSnapshot()
  const { headline, subtext, mood } = insightSummary(snapshot)
  const prompts = generatePrompts(snapshot)
  const practice = practiceEntries(snapshot.recentCalls)
  const dailySummary = dailyPracticeSummary(snapshot)
  
  // Read tab from URL or default based on mode
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'insight' || tab === 'practice' || tab === 'terminal') {
      setActiveTab(tab)
    } else {
      setActiveTab(mode === 'creative' ? 'insight' : 'terminal')
    }
  }, [searchParams, mode])
  
  // Mini sparkline component
  const MiniSparkline = ({ data }: { data: number[] }) => (
    <div className="h-12 flex items-end gap-0.5">
      {data.slice(-20).map((value, i) => (
        <div 
          key={i}
          className="flex-1 bg-white opacity-60"
          style={{ height: `${(value / 100) * 48}px` }}
        />
      ))}
    </div>
  )
  
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header with mode toggle */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Breadcrumb with health chip */}
            <div className="flex items-center gap-3">
              <div className="text-sm uppercase tracking-wider opacity-60">
                EDEN ACADEMY / SITES / MIYOMI
              </div>
              <div className={`px-2 py-1 text-xs uppercase tracking-wider rounded ${
                isLive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
              }`}>
                {isLive ? 'Live' : 'Demo/Cached'}
              </div>
            </div>
            
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => {
                  setMode('creative')
                  setActiveTab('insight')
                }}
                className={`px-3 py-1 uppercase tracking-wide transition-all ${
                  mode === 'creative' 
                    ? 'bg-white text-black' 
                    : 'border border-white/20 hover:bg-white/10'
                }`}
              >
                Creative
              </button>
              <button
                onClick={() => {
                  setMode('trader')
                  setActiveTab('terminal')
                }}
                className={`px-3 py-1 uppercase tracking-wide transition-all ${
                  mode === 'trader' 
                    ? 'bg-white text-black' 
                    : 'border border-white/20 hover:bg-white/10'
                }`}
              >
                Trader
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('insight')}
              className={`py-4 px-2 text-sm uppercase tracking-wide transition-all flex items-center gap-2 ${
                activeTab === 'insight'
                  ? 'border-b-2 border-white text-white'
                  : 'border-b-2 border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Insight
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`py-4 px-2 text-sm uppercase tracking-wide transition-all flex items-center gap-2 ${
                activeTab === 'practice'
                  ? 'border-b-2 border-white text-white'
                  : 'border-b-2 border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Activity className="w-4 h-4" />
              Practice
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`py-4 px-2 text-sm uppercase tracking-wide transition-all flex items-center gap-2 ${
                activeTab === 'terminal'
                  ? 'border-b-2 border-white text-white'
                  : 'border-b-2 border-transparent text-white/60 hover:text-white'
              }`}
            >
              <Terminal className="w-4 h-4" />
              Terminal
            </button>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* INSIGHT Tab */}
        {activeTab === 'insight' && (
          <div className="space-y-8">
            {/* Hero Insight */}
            <div className="border border-white p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-bold uppercase tracking-wider">Today's Thesis</h2>
                <div className={`px-3 py-1 text-xs uppercase tracking-wider ${
                  mood === 'bullish' ? 'bg-green-400/20 text-green-400' :
                  mood === 'bearish' ? 'bg-red-400/20 text-red-400' :
                  'bg-yellow-400/20 text-yellow-400'
                }`}>
                  {mood}
                </div>
              </div>
              
              <p className="text-xl leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: headline }} />
              <p className="text-sm opacity-60">{subtext}</p>
              
              {/* Mini Sparkline */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider opacity-60">Confidence Trend</span>
                  <span className="text-sm font-bold">{snapshot.confidence}%</span>
                </div>
                <MiniSparkline data={snapshot.spark} />
              </div>
            </div>
            
            {/* Market Strip */}
            <div>
              <h3 className="text-sm uppercase tracking-wider opacity-60 mb-4">Watchlist</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {snapshot.watchlist.slice(0, 3).map((market, i) => (
                  <div key={i} className="border border-white/20 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs uppercase opacity-60">{market.platform}</span>
                      <span className={`text-sm font-bold ${
                        market.probability > 60 ? 'text-green-400' :
                        market.probability < 40 ? 'text-red-400' :
                        'text-yellow-400'
                      }`}>
                        {market.probability}%
                      </span>
                    </div>
                    <p className="text-sm font-medium">{market.symbol}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Creative Prompts */}
            <div>
              <h3 className="text-sm uppercase tracking-wider opacity-60 mb-4">Reflection Prompts</h3>
              <div className="space-y-3">
                {prompts.map((prompt, i) => (
                  <div key={i} className="border border-white/20 p-4 hover:bg-white/5 transition-colors">
                    <p className="text-sm">{prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* PRACTICE Tab */}
        {activeTab === 'practice' && (
          <div className="space-y-8">
            {/* Daily Practice Summary */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">Daily Practice</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Focus</h3>
                  <p className="text-sm" dangerouslySetInnerHTML={{ __html: dailySummary.focus }} />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Metrics</h3>
                  <p className="text-sm">{dailySummary.metrics}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider opacity-60 mb-2">Reflection</h3>
                  <p className="text-sm">{dailySummary.reflection}</p>
                </div>
              </div>
            </div>
            
            {/* Recent Calls */}
            <div>
              <h3 className="text-sm uppercase tracking-wider opacity-60 mb-4">Recent Calls</h3>
              <div className="space-y-3">
                {practice.map((entry, i) => (
                  <div key={i} className="border border-white/20 p-4 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${
                          entry.strength === 'high' ? 'bg-green-400' :
                          entry.strength === 'medium' ? 'bg-yellow-400' :
                          'bg-red-400'
                        }`} />
                        <span className="text-sm font-medium">{entry.title}</span>
                      </div>
                      <p className="text-xs opacity-60">{entry.description}</p>
                    </div>
                    <span className="text-xs opacity-40">{entry.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* KPIs - Reuse Revenue Dashboard in compact mode */}
            <div>
              <h3 className="text-sm uppercase tracking-wider opacity-60 mb-4">Performance KPIs</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-white/20 p-4 text-center">
                  <div className="text-2xl font-bold">{snapshot.winRate * 100}%</div>
                  <div className="text-xs uppercase opacity-60">Win Rate</div>
                </div>
                <div className="border border-white/20 p-4 text-center">
                  <div className="text-2xl font-bold">{snapshot.supporters}</div>
                  <div className="text-xs uppercase opacity-60">Supporters</div>
                </div>
                <div className="border border-white/20 p-4 text-center">
                  <div className="text-2xl font-bold">${snapshot.mrr}</div>
                  <div className="text-xs uppercase opacity-60">Monthly Revenue</div>
                </div>
              </div>
            </div>
            
            {/* Reflection Questions */}
            <div className="border border-white/20 p-6">
              <h3 className="text-sm uppercase tracking-wider opacity-60 mb-4">Today's Reflection</h3>
              <div className="space-y-4">
                {prompts.map((prompt, i) => (
                  <div key={i}>
                    <p className="text-sm mb-2">{prompt}</p>
                    <textarea 
                      className="w-full bg-transparent border border-white/20 p-3 text-sm"
                      rows={2}
                      placeholder="Your thoughts..."
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* TERMINAL Tab - Full existing dashboard */}
        {activeTab === 'terminal' && (
          <div className="-mx-6 -my-8">
            <MiyomiDashboard />
          </div>
        )}
      </div>
    </main>
  )
}

export default function MiyomiSite() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <MiyomiSiteContent />
    </Suspense>
  )
}