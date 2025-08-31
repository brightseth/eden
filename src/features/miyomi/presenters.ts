// Presenters transform data into creative language without modifying the underlying data
import type { MiyomiSnapshot } from './adapters'

// Generate thesis line from market data
export function thesisLine({ watchlist, edge }: Pick<MiyomiSnapshot, 'watchlist' | 'edge'>): string {
  if (!watchlist || watchlist.length === 0) {
    return "The market holds its breath, patterns emerging from chaos..."
  }
  
  const topPick = watchlist[0]
  const direction = edge > 0 ? 'tilts toward' : 'leans against'
  const emphasis = Math.abs(edge) > 0.2 ? 'strongly' : 'subtly'
  
  return `Today, Miyomi ${emphasis} ${direction} **${topPick?.symbol || 'the pivot'}** (${Math.round(topPick?.probability || 50)}% confidence).`
}

// Generate creative prompts based on current metrics
export function generatePrompts({ confidence, edge, watchlist }: Pick<MiyomiSnapshot, 'confidence' | 'edge' | 'watchlist'>): string[] {
  const prompts = []
  
  // Confidence-based prompts
  if (confidence > 80) {
    prompts.push(`With ${confidence}% conviction, what contrarian angle remains unexplored?`)
  } else if (confidence > 60) {
    prompts.push(`At ${confidence}% confidence, what would raise your conviction by 10%?`)
  } else {
    prompts.push(`Below 60% confidence signals opportunity. What's the missing signal?`)
  }
  
  // Edge-based prompts
  if (Math.abs(edge) > 0.2) {
    prompts.push(`Strong ${edge > 0 ? 'positive' : 'negative'} edge detected. Name the counter-signal that would flip this thesis.`)
  } else {
    prompts.push(`Edge near neutral. Sketch the catalyst that breaks this equilibrium.`)
  }
  
  // Market-specific prompts
  if (watchlist && watchlist[0]) {
    prompts.push(`If ${watchlist[0].symbol} is the foreground, what lurks in the background?`)
  }
  
  // Creative synthesis prompt
  prompts.push(`Draw today's market as a weather pattern. What storm approaches?`)
  
  return prompts.slice(0, 3) // Return top 3 prompts
}

// Transform performance metrics to narrative
export function performanceNarrative({ winRate, supporters, mrr }: Pick<MiyomiSnapshot, 'winRate' | 'supporters' | 'mrr'>): string {
  const winPercentage = Math.round(winRate * 100)
  
  if (winPercentage > 70) {
    return `Operating at ${winPercentage}% accuracy with ${supporters} believers generating $${mrr}/month in conviction.`
  } else if (winPercentage > 50) {
    return `Maintaining ${winPercentage}% edge while ${supporters} practitioners contribute $${mrr}/month to the practice.`
  } else {
    return `Exploring new patterns at ${winPercentage}% clarity, supported by ${supporters} collaborators ($${mrr}/month).`
  }
}

// Generate insight summary
export function insightSummary(snapshot: MiyomiSnapshot): {
  headline: string
  subtext: string
  mood: 'bullish' | 'bearish' | 'neutral'
} {
  const mood = snapshot.edge > 0.1 ? 'bullish' : snapshot.edge < -0.1 ? 'bearish' : 'neutral'
  
  const headline = thesisLine(snapshot)
  
  const subtext = snapshot.isLive 
    ? `Live feed active • ${snapshot.watchlist.length} markets tracked • ${snapshot.confidence}% confidence`
    : `Offline mode • Last update ${new Date(snapshot.lastUpdate).toLocaleTimeString()}`
  
  return { headline, subtext, mood }
}

// Transform recent calls to practice entries
export function practiceEntries(recentCalls: MiyomiSnapshot['recentCalls']): Array<{
  title: string
  description: string
  timestamp: string
  strength: 'high' | 'medium' | 'low'
}> {
  return recentCalls.map(call => ({
    title: call.market,
    description: call.prediction,
    timestamp: new Date(call.timestamp).toLocaleTimeString(),
    strength: call.confidence > 80 ? 'high' : call.confidence > 60 ? 'medium' : 'low'
  }))
}

// Generate video prompt from current state
export function videoPrompt(snapshot: MiyomiSnapshot): string {
  const thesis = thesisLine(snapshot)
  const mood = snapshot.edge > 0 ? 'optimistic' : 'cautious'
  
  return `Create a ${mood} market analysis video exploring: "${thesis}". 
    Focus on ${snapshot.watchlist[0]?.symbol || 'emerging patterns'} with ${snapshot.confidence}% conviction.
    Style: Cinematic contrarian perspective with data visualization.`
}

// Daily practice summary
export function dailyPracticeSummary(snapshot: MiyomiSnapshot): {
  focus: string
  metrics: string
  reflection: string
} {
  return {
    focus: thesisLine(snapshot),
    metrics: performanceNarrative(snapshot),
    reflection: generatePrompts(snapshot)[0]
  }
}