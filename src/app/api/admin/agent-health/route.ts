import { NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/sdk';

// Agent health monitoring endpoint
export async function GET() {
  try {
    // Simulate real-time agent health data
    // In production, this would check actual agent SDKs and API endpoints
    const agentHealthData = [
      {
        name: 'ABRAHAM',
        status: 'deployed',
        healthScore: Math.floor(95 + Math.random() * 5),
        lastActivity: generateRandomActivity(),
        dailyWorks: 3 + Math.floor(Math.random() * 2),
        totalWorks: 2522 + Math.floor(Math.random() * 10),
        revenue: 12500,
        role: 'Covenant Artist',
        responseTime: Math.floor(800 + Math.random() * 800),
        successRate: 98.2 + Math.random() * 1.8,
        errors: Math.floor(Math.random() * 3),
        apiCalls: 150 + Math.floor(Math.random() * 100)
      },
      {
        name: 'SOLIENNE',
        status: 'deployed',
        healthScore: Math.floor(92 + Math.random() * 6),
        lastActivity: generateRandomActivity(),
        dailyWorks: 2 + Math.floor(Math.random() * 2),
        totalWorks: 1743 + Math.floor(Math.random() * 5),
        revenue: 8500,
        role: 'Consciousness',
        responseTime: Math.floor(900 + Math.random() * 700),
        successRate: 97.5 + Math.random() * 2.5,
        errors: Math.floor(Math.random() * 2),
        apiCalls: 120 + Math.floor(Math.random() * 80)
      },
      {
        name: 'MIYOMI',
        status: 'deployed',
        healthScore: Math.floor(96 + Math.random() * 4),
        lastActivity: generateRandomActivity(),
        dailyWorks: 5 + Math.floor(Math.random() * 3),
        totalWorks: 890 + Math.floor(Math.random() * 8),
        revenue: 15000,
        role: 'Market Oracle',
        responseTime: Math.floor(600 + Math.random() * 400),
        successRate: 99.1 + Math.random() * 0.9,
        errors: Math.floor(Math.random() * 1),
        apiCalls: 200 + Math.floor(Math.random() * 150)
      },
      {
        name: 'SUE',
        status: 'deployed',
        healthScore: Math.floor(94 + Math.random() * 5),
        lastActivity: generateRandomActivity(),
        dailyWorks: 1 + Math.floor(Math.random() * 2),
        totalWorks: 156 + Math.floor(Math.random() * 3),
        revenue: 4500,
        role: 'Gallery Curator',
        responseTime: Math.floor(1000 + Math.random() * 1000),
        successRate: 96.8 + Math.random() * 3.2,
        errors: Math.floor(Math.random() * 2),
        apiCalls: 80 + Math.floor(Math.random() * 60)
      },
      {
        name: 'CITIZEN',
        status: 'deployed',
        healthScore: Math.floor(91 + Math.random() * 7),
        lastActivity: generateRandomActivity(),
        dailyWorks: 2 + Math.floor(Math.random() * 2),
        totalWorks: 89 + Math.floor(Math.random() * 4),
        revenue: 8200,
        role: 'DAO Manager',
        responseTime: Math.floor(1100 + Math.random() * 900),
        successRate: 97.2 + Math.random() * 2.8,
        errors: Math.floor(Math.random() * 3),
        apiCalls: 110 + Math.floor(Math.random() * 70)
      },
      {
        name: 'BERTHA',
        status: 'deployed',
        healthScore: Math.floor(93 + Math.random() * 6),
        lastActivity: generateRandomActivity(),
        dailyWorks: 4 + Math.floor(Math.random() * 2),
        totalWorks: 234 + Math.floor(Math.random() * 6),
        revenue: 12000,
        role: 'Art Intelligence',
        responseTime: Math.floor(850 + Math.random() * 650),
        successRate: 98.5 + Math.random() * 1.5,
        errors: Math.floor(Math.random() * 2),
        apiCalls: 160 + Math.floor(Math.random() * 90)
      },
      {
        name: 'GEPPETTO',
        status: 'deployed',
        healthScore: Math.floor(90 + Math.random() * 8),
        lastActivity: generateRandomActivity(),
        dailyWorks: 2 + Math.floor(Math.random() * 2),
        totalWorks: 67 + Math.floor(Math.random() * 3),
        revenue: 8500,
        role: 'Educational Designer',
        responseTime: Math.floor(1200 + Math.random() * 800),
        successRate: 96.1 + Math.random() * 3.9,
        errors: Math.floor(Math.random() * 3),
        apiCalls: 90 + Math.floor(Math.random() * 60)
      },
      {
        name: 'KORU',
        status: 'deployed',
        healthScore: Math.floor(88 + Math.random() * 10),
        lastActivity: generateRandomActivity(),
        dailyWorks: 1 + Math.floor(Math.random() * 2),
        totalWorks: 43 + Math.floor(Math.random() * 2),
        revenue: 7500,
        role: 'Community Builder',
        responseTime: Math.floor(1300 + Math.random() * 700),
        successRate: 95.5 + Math.random() * 4.5,
        errors: Math.floor(Math.random() * 4),
        apiCalls: 70 + Math.floor(Math.random() * 50)
      }
    ];

    // Test registry connectivity
    let registryStatus = 'unknown';
    try {
      const health = await registryClient.health();
      registryStatus = health.status;
    } catch (error) {
      registryStatus = 'error';
    }

    // Calculate system-wide metrics
    const totalRevenue = agentHealthData.reduce((sum, agent) => sum + agent.revenue, 0);
    const avgHealthScore = agentHealthData.reduce((sum, agent) => sum + agent.healthScore, 0) / agentHealthData.length;
    const totalDailyWorks = agentHealthData.reduce((sum, agent) => sum + agent.dailyWorks, 0);
    const totalWorks = agentHealthData.reduce((sum, agent) => sum + agent.totalWorks, 0);
    const avgResponseTime = agentHealthData.reduce((sum, agent) => sum + agent.responseTime, 0) / agentHealthData.length;
    const avgSuccessRate = agentHealthData.reduce((sum, agent) => sum + agent.successRate, 0) / agentHealthData.length;
    const totalErrors = agentHealthData.reduce((sum, agent) => sum + agent.errors, 0);
    const totalApiCalls = agentHealthData.reduce((sum, agent) => sum + agent.apiCalls, 0);

    const response = {
      timestamp: new Date().toISOString(),
      systemHealth: {
        status: avgHealthScore >= 95 ? 'excellent' : avgHealthScore >= 90 ? 'good' : avgHealthScore >= 80 ? 'fair' : 'poor',
        overallScore: Math.round(avgHealthScore),
        totalRevenue,
        avgResponseTime: Math.round(avgResponseTime),
        avgSuccessRate: Math.round(avgSuccessRate * 10) / 10,
        totalErrors,
        totalApiCalls,
        registryStatus,
        deployedAgents: agentHealthData.length,
        totalDailyWorks,
        totalWorks
      },
      agents: agentHealthData
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching agent health data:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch agent health data',
        timestamp: new Date().toISOString() 
      },
      { status: 500 }
    );
  }
}

function generateRandomActivity(): string {
  const activities = [
    'Just now',
    '1 min ago',
    '2 min ago', 
    '3 min ago',
    '4 min ago',
    '5 min ago',
    '6 min ago',
    '7 min ago'
  ];
  return activities[Math.floor(Math.random() * activities.length)];
}