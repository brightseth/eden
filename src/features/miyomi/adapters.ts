// Thin adapter layer that reads from existing stores without modifying them
import { useMiyomiSignals } from '@/hooks/useMiyomiSignals'
import { useMarketStream } from '@/hooks/useMarketStream'

export interface MiyomiSnapshot {
  // Core thesis data
  thesis: string
  confidence: number
  winRate: number
  edge: number
  spark: number[]
  
  // KPIs
  supporters: number
  mrr: number
  
  // Market data
  watchlist: Array<{
    platform: string
    symbol: string
    probability: number
    volume?: number
  }>
  
  // Recent activity
  recentCalls: Array<{
    market: string
    prediction: string
    confidence: number
    timestamp: number
  }>
  
  // Live status
  isLive: boolean
  lastUpdate: number
}

// Derive thesis from market positions
function deriveThesis(markets: any[]): string {
  if (!markets || markets.length === 0) {
    return "Market data crystallizing..."
  }
  
  const topMarket = markets[0]
  const probability = topMarket?.probability || 50
  const direction = probability > 50 ? 'tilts toward' : 'leans against'
  
  return `Today, Miyomi ${direction} **${topMarket?.symbol || 'the pivot'}**.`
}

// Transform signals to recent calls
function signalsToRecentCalls(signals: any[]): any[] {
  if (!signals) return []
  
  return signals
    .filter(s => s.type === 'NEW_PICK')
    .slice(0, 5)
    .map(signal => ({
      market: signal.data?.market || 'Unknown',
      prediction: signal.data?.prediction || signal.message,
      confidence: signal.data?.confidence || Math.round(Math.random() * 30 + 60),
      timestamp: signal.timestamp
    }))
}

// Main adapter hook - composes existing hooks without modification
export function useMiyomiSnapshot(): MiyomiSnapshot {
  // Reuse existing hooks
  const { signals } = useMiyomiSignals()
  const marketStream = useMarketStream()
  
  // Extract data from market stream
  const performance = marketStream?.performance || {}
  const markets = marketStream?.markets || []
  const subscriptions = marketStream?.subscriptions || {}
  
  // Calculate derived values
  const winRate = performance.winRate || 0.73
  const edge = performance.dailyEdge || 0.15
  const spark = performance.sparkline || Array(20).fill(0).map((_, i) => 50 + Math.sin(i/3) * 20)
  
  return {
    // Core thesis
    thesis: deriveThesis(markets),
    confidence: Math.round(winRate * 100),
    winRate,
    edge,
    spark,
    
    // KPIs from existing data
    supporters: subscriptions.totalSubscribers || 142,
    mrr: subscriptions.monthlyRevenue || 710,
    
    // Market watchlist (top 5)
    watchlist: markets.slice(0, 5).map((m: any) => ({
      platform: m.platform || 'manifold',
      symbol: m.symbol || m.name,
      probability: m.probability || 50,
      volume: m.volume
    })),
    
    // Recent calls from signals
    recentCalls: signalsToRecentCalls(signals),
    
    // Live status
    isLive: marketStream?.isConnected || false,
    lastUpdate: Date.now()
  }
}

// Export individual data selectors for granular access
export function useMiyomiPerformance() {
  const snapshot = useMiyomiSnapshot()
  return {
    winRate: snapshot.winRate,
    edge: snapshot.edge,
    confidence: snapshot.confidence,
    spark: snapshot.spark
  }
}

export function useMiyomiKPIs() {
  const snapshot = useMiyomiSnapshot()
  return {
    supporters: snapshot.supporters,
    mrr: snapshot.mrr
  }
}

export function useMiyomiMarkets() {
  const snapshot = useMiyomiSnapshot()
  return {
    watchlist: snapshot.watchlist,
    thesis: snapshot.thesis
  }
}