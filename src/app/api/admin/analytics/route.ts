import { NextRequest, NextResponse } from 'next/server';

interface AgentStatus {
  name: string;
  handle: string;
  status: 'active' | 'training' | 'paused' | 'error';
  endpoint: string;
}

const AGENTS: AgentStatus[] = [
  { name: 'ABRAHAM', handle: 'abraham', status: 'active', endpoint: '/api/agents/abraham/status' },
  { name: 'SOLIENNE', handle: 'solienne', status: 'active', endpoint: '/api/agents/solienne/status' },
  { name: 'MIYOMI', handle: 'miyomi', status: 'active', endpoint: '/api/agents/miyomi/status' },
  { name: 'SUE', handle: 'sue', status: 'active', endpoint: '/api/agents/sue/status' },
  { name: 'CITIZEN', handle: 'citizen', status: 'active', endpoint: '/api/agents/citizen/status' },
  { name: 'BERTHA', handle: 'bertha', status: 'active', endpoint: '/api/agents/bertha/status' }
];

// GET /api/admin/analytics - Get aggregated analytics for all agents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    
    if (type === 'overview') {
      // Fetch status from each agent
      const agentMetrics = await Promise.all(
        AGENTS.map(async (agent) => {
          try {
            // In production, make actual calls to agent endpoints
            // For now, return simulated but realistic data
            return generateAgentMetrics(agent);
          } catch (error) {
            console.error(`Failed to fetch metrics for ${agent.name}:`, error);
            return generateAgentMetrics(agent, true); // Error state
          }
        })
      );
      
      // Calculate aggregate metrics
      const totalRevenue = agentMetrics.reduce((sum, agent) => sum + agent.monthlyRevenue, 0);
      const totalDailyDecisions = agentMetrics.reduce((sum, agent) => sum + agent.performance.dailyDecisions, 0);
      const avgSuccessRate = agentMetrics.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agentMetrics.length;
      const activeAgents = agentMetrics.filter(a => a.status === 'active').length;
      
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        summary: {
          totalMonthlyRevenue: totalRevenue,
          totalDailyRevenue: totalRevenue / 30,
          activeAgents,
          totalAgents: AGENTS.length,
          totalDailyDecisions,
          averageSuccessRate: Math.round(avgSuccessRate),
          systemStatus: activeAgents === AGENTS.length ? 'operational' : 'degraded',
          lastUpdated: new Date().toISOString()
        },
        agents: agentMetrics,
        trends: {
          revenue: calculateTrend('revenue'),
          usage: calculateTrend('usage'),
          performance: calculateTrend('performance')
        },
        alerts: generateAlerts(agentMetrics)
      });
    }
    
    if (type === 'historical') {
      // Return historical data for charts
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        historical: generateHistoricalData()
      });
    }
    
    return NextResponse.json(
      { error: `Unknown analytics type: ${type}` },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateAgentMetrics(agent: AgentStatus, hasError = false) {
  const baseRevenue = {
    'abraham': 12500,
    'solienne': 8500,
    'miyomi': 15000,
    'sue': 4500,
    'citizen': 8200,
    'bertha': 12000
  }[agent.handle.toLowerCase()] || 5000;
  
  // Add some realistic variance
  const variance = (Math.random() - 0.5) * 0.2; // ±10% variance
  const monthlyRevenue = baseRevenue * (1 + variance);
  
  return {
    name: agent.name,
    handle: agent.handle,
    status: hasError ? 'error' : agent.status,
    monthlyRevenue: Math.round(monthlyRevenue),
    dailyRevenue: Math.round(monthlyRevenue / 30),
    performance: {
      successRate: hasError ? 0 : Math.floor(85 + Math.random() * 15), // 85-100%
      responseTime: hasError ? 'N/A' : `${(0.5 + Math.random() * 1.5).toFixed(1)}s`,
      dailyDecisions: hasError ? 0 : Math.floor(50 + Math.random() * 200),
      uptime: hasError ? '0%' : `${(99 + Math.random()).toFixed(1)}%`,
      errorRate: hasError ? 100 : Math.random() * 2, // 0-2% error rate
      avgConfidence: hasError ? 0 : 70 + Math.random() * 20 // 70-90%
    },
    trends: {
      revenue: Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable' as 'up' | 'down' | 'stable',
      usage: Math.random() > 0.4 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable' as 'up' | 'down' | 'stable',
      performance: Math.random() > 0.5 ? 'up' : 'stable' as 'up' | 'down' | 'stable'
    },
    specialty: getAgentSpecialty(agent.handle),
    lastActivity: generateLastActivity(),
    metrics: {
      todayRevenue: Math.round(monthlyRevenue / 30 * (0.8 + Math.random() * 0.4)),
      weekRevenue: Math.round(monthlyRevenue / 4 * (0.9 + Math.random() * 0.2)),
      monthRevenue: Math.round(monthlyRevenue),
      totalInteractions: Math.floor(1000 + Math.random() * 5000),
      uniqueUsers: Math.floor(100 + Math.random() * 500)
    }
  };
}

function getAgentSpecialty(handle: string): string {
  const specialties: Record<string, string> = {
    'abraham': 'Covenant Artist',
    'solienne': 'Consciousness Explorer',
    'miyomi': 'Market Oracle',
    'sue': 'Gallery Curator',
    'citizen': 'DAO Manager',
    'bertha': 'Collection Intelligence'
  };
  return specialties[handle.toLowerCase()] || 'AI Agent';
}

function generateLastActivity(): string {
  const minutes = Math.floor(Math.random() * 60);
  if (minutes === 0) return 'Just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  return `${Math.floor(minutes / 60)} hours ago`;
}

function calculateTrend(metric: string): 'up' | 'down' | 'stable' {
  // Simulate trend calculation
  const random = Math.random();
  if (random > 0.6) return 'up';
  if (random < 0.3) return 'down';
  return 'stable';
}

function generateAlerts(agentMetrics: any[]): string[] {
  const alerts: string[] = [];
  
  agentMetrics.forEach(agent => {
    if (agent.status === 'error') {
      alerts.push(`⚠️ ${agent.name} is experiencing errors`);
    }
    if (agent.performance.successRate < 80) {
      alerts.push(`📉 ${agent.name} success rate below threshold (${agent.performance.successRate}%)`);
    }
    if (agent.performance.errorRate > 5) {
      alerts.push(`❌ ${agent.name} error rate elevated (${agent.performance.errorRate.toFixed(1)}%)`);
    }
  });
  
  if (alerts.length === 0) {
    alerts.push('✅ All systems operating normally');
  }
  
  return alerts;
}

function generateHistoricalData() {
  // Generate 30 days of historical data for charts
  const days = 30;
  const data = [];
  const baseRevenue = 60700; // Total monthly revenue
  
  for (let i = days; i > 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(baseRevenue / 30 * (0.8 + Math.random() * 0.4)),
      decisions: Math.floor(500 + Math.random() * 300),
      successRate: Math.floor(85 + Math.random() * 15),
      activeUsers: Math.floor(800 + Math.random() * 600),
      newUsers: Math.floor(20 + Math.random() * 50)
    });
  }
  
  return data;
}