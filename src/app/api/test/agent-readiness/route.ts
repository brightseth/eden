// Test endpoint for agent readiness framework
// Helps understand what makes agents ready for launch

import { NextRequest, NextResponse } from 'next/server';
import { readinessFramework } from '@/lib/agent-readiness/readiness-framework';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent');
    
    if (agentId) {
      // Assess specific agent
      console.log(`[ReadinessTest] Assessing agent: ${agentId}`);
      const assessment = await readinessFramework.assessAgent(agentId);
      
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        agentId,
        assessment,
        success: true
      });
    } else {
      // Get framework overview and assess all known agents
      console.log('[ReadinessTest] Assessing all agents...');
      
      const frameworkOverview = readinessFramework.getFrameworkOverview();
      
      // Known agents to assess
      const knownAgents = [
        'abraham', 'solienne',           // LAUNCHING
        'geppetto', 'koru',              // DEVELOPING (committed trainers)
        'miyomi', 'amanda', 'citizen', 'nina'  // DEVELOPING (seeking trainers)
      ];
      
      const assessments = await Promise.all(
        knownAgents.map(async agentId => {
          const assessment = await readinessFramework.assessAgent(agentId);
          return { agentId, assessment };
        })
      );
      
      // Categorize by readiness level
      const readyAgents = assessments.filter(a => a.assessment.readyForLaunch);
      const nearReadyAgents = assessments.filter(a => 
        !a.assessment.readyForLaunch && a.assessment.overallScore >= 60
      );
      const developingAgents = assessments.filter(a => 
        !a.assessment.readyForLaunch && a.assessment.overallScore < 60
      );
      
      // Identify common blockers
      const allBlockers = assessments.flatMap(a => 
        Object.values(a.assessment.categories).flatMap(cat => cat.blockers)
      );
      const blockerCounts = allBlockers.reduce((acc, blocker) => {
        const key = blocker.split(':')[0]; // Get metric name
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Get insights
      const insights = {
        totalAgents: assessments.length,
        readyCount: readyAgents.length,
        nearReadyCount: nearReadyAgents.length,
        developingCount: developingAgents.length,
        averageScore: Math.round(
          assessments.reduce((sum, a) => sum + a.assessment.overallScore, 0) / assessments.length
        ),
        commonBlockers: Object.entries(blockerCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([blocker, count]) => ({ blocker, count })),
        categoryAnalysis: this.analyzeCategoryPerformance(assessments)
      };
      
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        frameworkOverview,
        insights,
        assessments: assessments.map(a => ({
          agentId: a.agentId,
          overallScore: a.assessment.overallScore,
          readyForLaunch: a.assessment.readyForLaunch,
          nextMilestone: a.assessment.nextMilestone,
          categoryScores: Object.entries(a.assessment.categories).map(([category, data]) => ({
            category,
            score: data.score,
            blockerCount: data.blockers.length
          }))
        })),
        success: true
      });
    }
    
  } catch (error) {
    console.error('[ReadinessTest] Assessment failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}

function analyzeCategoryPerformance(assessments: Array<{ agentId: string; assessment: any }>) {
  const categories = ['technical', 'creative', 'economic', 'cultural', 'operational'];
  
  return categories.map(category => {
    const scores = assessments.map(a => a.assessment.categories[category].score);
    const avgScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    const lowPerformers = assessments.filter(a => 
      a.assessment.categories[category].score < 50
    ).length;
    
    return {
      category,
      averageScore: avgScore,
      lowPerformerCount: lowPerformers,
      needsAttention: avgScore < 60 || lowPerformers > assessments.length / 2
    };
  });
}