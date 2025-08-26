// Agent Readiness Dashboard Data Service
// Provides insights into agent development and launch readiness

import { readinessFramework, type AgentReadiness, type ReadinessCategory } from './readiness-framework';

export interface ReadinessDashboard {
  overview: {
    totalAgents: number;
    readyToLaunch: number;
    inDevelopment: number;
    needingAttention: number;
    averageReadinessScore: number;
  };
  agentSummaries: AgentSummary[];
  categoryInsights: CategoryInsight[];
  recommendations: DashboardRecommendation[];
  trends: ReadinessTrend[];
}

export interface AgentSummary {
  agentId: string;
  name: string;
  overallScore: number;
  status: 'ready' | 'near_ready' | 'developing' | 'needs_attention';
  topBlocker?: string;
  nextMilestone: string;
  estimatedLaunchTimeframe?: string;
  categoryScores: Record<ReadinessCategory, number>;
}

export interface CategoryInsight {
  category: ReadinessCategory;
  averageScore: number;
  agentsStruggling: number;
  commonIssues: string[];
  priority: 'high' | 'medium' | 'low';
  improvementSuggestions: string[];
}

export interface DashboardRecommendation {
  type: 'urgent' | 'optimization' | 'strategic';
  title: string;
  description: string;
  affectedAgents: string[];
  estimatedImpact: 'high' | 'medium' | 'low';
  actionItems: string[];
}

export interface ReadinessTrend {
  period: string;
  metric: string;
  value: number;
  change: number;
  direction: 'up' | 'down' | 'stable';
}

export class ReadinessDashboardService {
  async generateDashboard(agentIds?: string[]): Promise<ReadinessDashboard> {
    // Default to all known Genesis Cohort agents
    const defaultAgentIds = [
      'abraham', 'solienne',           // Launching
      'geppetto', 'koru',              // Developing (committed)  
      'miyomi', 'amanda', 'citizen', 'nina'  // Developing (seeking)
    ];
    
    const targetAgents = agentIds || defaultAgentIds;
    
    console.log(`[Dashboard] Generating readiness dashboard for ${targetAgents.length} agents`);
    
    // Assess all agents
    const assessments = await Promise.all(
      targetAgents.map(async agentId => {
        const assessment = await readinessFramework.assessAgent(agentId);
        return { agentId, assessment };
      })
    );
    
    // Generate dashboard components
    const overview = this.generateOverview(assessments);
    const agentSummaries = this.generateAgentSummaries(assessments);
    const categoryInsights = this.generateCategoryInsights(assessments);
    const recommendations = this.generateRecommendations(assessments);
    const trends = this.generateTrends(assessments);
    
    return {
      overview,
      agentSummaries,
      categoryInsights,
      recommendations,
      trends
    };
  }
  
  private generateOverview(assessments: Array<{ agentId: string; assessment: AgentReadiness }>): ReadinessDashboard['overview'] {
    const totalAgents = assessments.length;
    const readyToLaunch = assessments.filter(a => a.assessment.readyForLaunch).length;
    const nearReady = assessments.filter(a => 
      !a.assessment.readyForLaunch && a.assessment.overallScore >= 70
    ).length;
    const developing = assessments.filter(a => 
      a.assessment.overallScore >= 40 && a.assessment.overallScore < 70
    ).length;
    const needingAttention = assessments.filter(a => 
      a.assessment.overallScore < 40
    ).length;
    
    const averageScore = assessments.reduce((sum, a) => sum + a.assessment.overallScore, 0) / totalAgents;
    
    return {
      totalAgents,
      readyToLaunch,
      inDevelopment: developing + nearReady,
      needingAttention,
      averageReadinessScore: Math.round(averageScore)
    };
  }
  
  private generateAgentSummaries(assessments: Array<{ agentId: string; assessment: AgentReadiness }>): AgentSummary[] {
    // Agent display names (this would come from Registry in real implementation)
    const agentNames: Record<string, string> = {
      'abraham': 'ABRAHAM',
      'solienne': 'SOLIENNE',
      'geppetto': 'GEPPETTO', 
      'koru': 'KORU',
      'miyomi': 'MIYOMI',
      'amanda': 'AMANDA',
      'citizen': 'CITIZEN',
      'nina': 'NINA'
    };
    
    return assessments.map(({ agentId, assessment }) => {
      let status: AgentSummary['status'] = 'developing';
      let estimatedTimeframe: string | undefined;
      
      if (assessment.readyForLaunch) {
        status = 'ready';
        estimatedTimeframe = 'Ready now';
      } else if (assessment.overallScore >= 70) {
        status = 'near_ready';
        estimatedTimeframe = '1-2 months';
      } else if (assessment.overallScore >= 40) {
        status = 'developing';
        estimatedTimeframe = '3-6 months';
      } else {
        status = 'needs_attention';
        estimatedTimeframe = '6+ months';
      }
      
      // Find top blocker
      const allBlockers = Object.values(assessment.categories)
        .flatMap(cat => cat.blockers);
      const topBlocker = allBlockers.length > 0 ? allBlockers[0] : undefined;
      
      // Extract category scores
      const categoryScores = Object.entries(assessment.categories).reduce((acc, [category, data]) => {
        acc[category as ReadinessCategory] = data.score;
        return acc;
      }, {} as Record<ReadinessCategory, number>);
      
      return {
        agentId,
        name: agentNames[agentId] || agentId.toUpperCase(),
        overallScore: assessment.overallScore,
        status,
        topBlocker,
        nextMilestone: assessment.nextMilestone || 'Continue development',
        estimatedLaunchTimeframe: estimatedTimeframe,
        categoryScores
      };
    });
  }
  
  private generateCategoryInsights(assessments: Array<{ agentId: string; assessment: AgentReadiness }>): CategoryInsight[] {
    const categories: ReadinessCategory[] = ['technical', 'creative', 'economic', 'cultural', 'operational'];
    
    return categories.map(category => {
      // Calculate average score for this category
      const categoryScores = assessments.map(a => a.assessment.categories[category].score);
      const averageScore = Math.round(
        categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length
      );
      
      // Count agents struggling in this category
      const agentsStruggling = assessments.filter(a => 
        a.assessment.categories[category].score < 50
      ).length;
      
      // Collect common issues
      const allIssues = assessments.flatMap(a => 
        a.assessment.categories[category].blockers.concat(a.assessment.categories[category].recommendations)
      );
      const issueFreq = allIssues.reduce((acc, issue) => {
        const key = issue.split(':')[0].trim(); // Extract issue type
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const commonIssues = Object.entries(issueFreq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([issue]) => issue);
      
      // Determine priority
      let priority: CategoryInsight['priority'] = 'low';
      if (averageScore < 50 || agentsStruggling > assessments.length / 2) {
        priority = 'high';
      } else if (averageScore < 70 || agentsStruggling > assessments.length / 3) {
        priority = 'medium';
      }
      
      // Generate improvement suggestions
      const improvementSuggestions = this.getCategoryImprovements(category, commonIssues);
      
      return {
        category,
        averageScore,
        agentsStruggling,
        commonIssues,
        priority,
        improvementSuggestions
      };
    });
  }
  
  private getCategoryImprovements(category: ReadinessCategory, commonIssues: string[]): string[] {
    const suggestions: Record<ReadinessCategory, string[]> = {
      technical: [
        'Standardize agent API integration patterns',
        'Implement automated health checks',
        'Create deployment templates for onchain infrastructure'
      ],
      creative: [
        'Establish minimum portfolio thresholds',
        'Implement automated style consistency checking',
        'Create curatorial feedback loops'
      ],
      economic: [
        'Develop token economics modeling tools',
        'Create market demand assessment framework',
        'Establish revenue projection methodologies'
      ],
      cultural: [
        'Define clear mission alignment criteria',
        'Create community feedback mechanisms',
        'Establish uniqueness evaluation process'
      ],
      operational: [
        'Standardize trainer onboarding process',
        'Create documentation templates',
        'Implement support system checklists'
      ]
    };
    
    return suggestions[category] || ['Review category requirements'];
  }
  
  private generateRecommendations(assessments: Array<{ agentId: string; assessment: AgentReadiness }>): DashboardRecommendation[] {
    const recommendations: DashboardRecommendation[] = [];
    
    // Find urgent issues (critical blockers affecting multiple agents)
    const allBlockers = assessments.flatMap(a => 
      Object.values(a.assessment.categories).flatMap(cat => 
        cat.blockers.map(blocker => ({ blocker, agentId: a.agentId }))
      )
    );
    
    const blockerFreq = allBlockers.reduce((acc, { blocker, agentId }) => {
      const key = blocker.split(':')[0].trim();
      if (!acc[key]) acc[key] = { count: 0, agents: [] };
      acc[key].count++;
      acc[key].agents.push(agentId);
      return acc;
    }, {} as Record<string, { count: number; agents: string[] }>);
    
    // Generate urgent recommendations for common blockers
    Object.entries(blockerFreq)
      .filter(([, data]) => data.count >= 3) // Affecting 3+ agents
      .forEach(([blocker, data]) => {
        recommendations.push({
          type: 'urgent',
          title: `Address ${blocker} Issues`,
          description: `${blocker} is blocking ${data.count} agents from launching`,
          affectedAgents: data.agents,
          estimatedImpact: 'high',
          actionItems: [
            `Review ${blocker} requirements across all agents`,
            'Create standardized solution or process',
            'Implement systematic resolution plan'
          ]
        });
      });
    
    // Strategic recommendations
    const averageScore = assessments.reduce((sum, a) => sum + a.assessment.overallScore, 0) / assessments.length;
    if (averageScore < 60) {
      recommendations.push({
        type: 'strategic',
        title: 'Improve Overall Readiness Framework',
        description: 'Average readiness score is below target, consider framework improvements',
        affectedAgents: assessments.map(a => a.agentId),
        estimatedImpact: 'high',
        actionItems: [
          'Review and refine readiness metrics',
          'Provide more development resources',
          'Consider extending development timelines'
        ]
      });
    }
    
    return recommendations;
  }
  
  private generateTrends(assessments: Array<{ agentId: string; assessment: AgentReadiness }>): ReadinessTrend[] {
    // For now, return placeholder trends since we don't have historical data
    // In production, this would track changes over time
    return [
      {
        period: 'Current',
        metric: 'Average Readiness Score',
        value: Math.round(assessments.reduce((sum, a) => sum + a.assessment.overallScore, 0) / assessments.length),
        change: 0,
        direction: 'stable'
      },
      {
        period: 'Current',
        metric: 'Agents Ready to Launch',
        value: assessments.filter(a => a.assessment.readyForLaunch).length,
        change: 0,
        direction: 'stable'
      }
    ];
  }
  
  // Get readiness insights for a specific agent
  async getAgentInsights(agentId: string): Promise<{
    assessment: AgentReadiness;
    benchmarks: {
      category: ReadinessCategory;
      score: number;
      cohortAverage: number;
      ranking: number;
    }[];
    priorityActions: string[];
  }> {
    const assessment = await readinessFramework.assessAgent(agentId);
    
    // Get cohort averages for benchmarking
    const cohortAssessments = await Promise.all([
      'abraham', 'solienne', 'geppetto', 'koru', 'miyomi', 'amanda', 'citizen', 'nina'
    ].map(async id => await readinessFramework.assessAgent(id)));
    
    const benchmarks = Object.entries(assessment.categories).map(([category, data]) => {
      const categoryScores = cohortAssessments.map(a => a.categories[category as ReadinessCategory].score);
      const cohortAverage = Math.round(
        categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length
      );
      const ranking = categoryScores.filter(score => score < data.score).length + 1;
      
      return {
        category: category as ReadinessCategory,
        score: data.score,
        cohortAverage,
        ranking
      };
    });
    
    // Extract priority actions from recommendations
    const priorityActions = Object.values(assessment.categories)
      .flatMap(cat => cat.recommendations)
      .slice(0, 5); // Top 5 actions
    
    return {
      assessment,
      benchmarks,
      priorityActions
    };
  }
}

// Export singleton
export const readinessDashboard = new ReadinessDashboardService();