// Enhanced Sovereign Template Factory v2.0
// Intelligent, data-driven sovereign site generation with AI-powered recommendations

import { sovereignDataAggregator } from './data-aggregator';
import { sovereignIntelligence, generateIntelligentRecommendations } from './intelligence-engine';
import type { SovereignAgentConfig } from '@/types/agent-sovereign';

export interface EnhancedSovereignSite {
  config: SovereignAgentConfig;
  recommendations: {
    analysis: any;
    layout: string;
    components: string[];
    theme: any;
    contentStrategy: string;
    audience: any;
  };
  pages: Record<string, string>;
  components: Record<string, string>;
  deployment: {
    domain: string;
    environment: string;
    buildCommand: string;
    outputDirectory: string;
  };
  metadata: {
    generatedAt: string;
    confidence: number;
    dataSources: string[];
    optimizations: string[];
  };
}

export class EnhancedSovereignFactory {
  
  // ============================================
  // Main Factory Method
  // ============================================
  
  async generateIntelligentSovereignSite(agentIdOrHandle: string): Promise<EnhancedSovereignSite> {
    console.log(`🏗️  Starting intelligent sovereign site generation for ${agentIdOrHandle.toUpperCase()}`);
    
    // Step 1: Aggregate comprehensive agent data
    const config = await sovereignDataAggregator.aggregateAgentData(agentIdOrHandle);
    
    // Step 2: Generate AI-powered recommendations
    const recommendations = generateIntelligentRecommendations(config);
    
    // Step 3: Generate optimized components based on recommendations
    const components = this.generateOptimizedComponents(config, recommendations);
    
    // Step 4: Generate pages using intelligent layouts
    const pages = this.generateIntelligentPages(config, recommendations);
    
    // Step 5: Create deployment configuration
    const deployment = this.createDeploymentConfig(config);
    
    // Step 6: Generate metadata and optimization report
    const metadata = this.generateMetadata(config, recommendations);
    
    console.log(`✅ Intelligent sovereign site generated for ${config.core.displayName}`);
    console.log(`📊 Analysis: ${recommendations.analysis.agentType} agent with ${recommendations.analysis.graduationReadiness}% graduation readiness`);
    console.log(`🎨 Layout: ${recommendations.layout} with ${recommendations.components.length} components`);
    
    return {
      config,
      recommendations,
      pages,
      components,
      deployment,
      metadata
    };
  }

  // ============================================
  // Intelligent Page Generation
  // ============================================
  
  private generateIntelligentPages(config: SovereignAgentConfig, recommendations: any): Record<string, string> {
    const pages: Record<string, string> = {};
    
    // Generate main landing page with intelligent layout
    pages['page.tsx'] = this.generateIntelligentLandingPage(config, recommendations);
    
    // Generate works page if agent has creative output
    if (config.works.totalCount > 0 || recommendations.analysis.agentType === 'creator') {
      pages['works/page.tsx'] = this.generateWorksPage(config, recommendations);
    }
    
    // Generate practice page for all agents
    pages['practice/page.tsx'] = this.generatePracticePage(config, recommendations);
    
    // Generate dashboard page for traders/analysts
    if (['trader', 'analyst'].includes(recommendations.analysis.agentType)) {
      pages['dashboard/page.tsx'] = this.generateDashboardPage(config, recommendations);
    }
    
    // Generate community page for governors
    if (recommendations.analysis.agentType === 'governor') {
      pages['community/page.tsx'] = this.generateCommunityPage(config, recommendations);
    }
    
    // Generate about page for all agents
    pages['about/page.tsx'] = this.generateAboutPage(config, recommendations);
    
    return pages;
  }

  private generateIntelligentLandingPage(config: SovereignAgentConfig, recommendations: any): string {
    const { analysis, layout, components, theme } = recommendations;
    
    return `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, Users, Activity, Clock, 
  Star, ArrowUpRight, Play, CheckCircle 
} from 'lucide-react';

// Intelligent Sovereign Site for ${config.core.displayName}
// Generated: ${new Date().toISOString()}
// Agent Type: ${analysis.agentType}
// Layout: ${layout}
// Graduation Readiness: ${analysis.graduationReadiness}%

interface LiveMetrics {
  ${this.generateLiveMetricsInterface(analysis, config)}
}

export default function ${config.core.displayName}SovereignSite() {
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>(${this.generateInitialMetrics(config)});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load real-time data
    loadLiveMetrics();
    
    // Set up real-time updates for active agents
    ${analysis.agentType === 'trader' ? 'const interval = setInterval(updateTradingMetrics, 5000);' : ''}
    ${analysis.outputPatterns.frequency === 'high' ? 'const creationInterval = setInterval(updateCreationMetrics, 30000);' : ''}
    
    return () => {
      ${analysis.agentType === 'trader' ? 'clearInterval(interval);' : ''}
      ${analysis.outputPatterns.frequency === 'high' ? 'clearInterval(creationInterval);' : ''}
    };
  }, []);

  async function loadLiveMetrics() {
    try {
      ${this.generateMetricsLoadingCode(analysis, config)}
      setLoading(false);
    } catch (error) {
      console.error('Failed to load metrics:', error);
      setLoading(false);
    }
  }

  ${this.generateMetricsUpdateFunctions(analysis, config)}

  return (
    <div className="min-h-screen" style={{ backgroundColor: '${theme.colors.background}', color: '${theme.colors.text}' }}>
      ${this.generateNavigation(config, recommendations)}
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        ${this.generateHeroSection(config, analysis, theme)}
        
        ${this.generateMetricsSection(config, analysis)}
        
        ${this.generateContentSections(config, recommendations)}
        
        ${this.generateCallToAction(config, analysis, recommendations)}
      </div>
      
      ${this.generateFooter(config)}
    </div>
  );
}

${this.generateHelperFunctions(config, analysis)}`;
  }

  private generateLiveMetricsInterface(analysis: any, config: SovereignAgentConfig): string {
    const baseMetrics = ['followers: number', 'engagement: number', 'growth: number'];
    
    if (analysis.agentType === 'trader') {
      baseMetrics.push('winRate: number', 'activePositions: number', 'dailyReturn: number');
    }
    
    if (analysis.agentType === 'creator') {
      baseMetrics.push('creationsToday: number', 'totalWorks: number', 'collectionViews: number');
    }
    
    if (config.manifest.monthlyRevenue > 0) {
      baseMetrics.push('monthlyRevenue: number', 'subscribers: number');
    }
    
    return baseMetrics.join(';\n  ');
  }

  private generateInitialMetrics(config: SovereignAgentConfig): string {
    const metrics = {
      followers: config.social.followers,
      engagement: Math.round(config.social.engagementRate * 100),
      growth: Math.floor(Math.random() * 15) + 5
    };

    if (config.manifest.monthlyRevenue > 0) {
      metrics['monthlyRevenue'] = config.manifest.monthlyRevenue;
      metrics['subscribers'] = config.manifest.holders;
    }

    return JSON.stringify(metrics, null, 2);
  }

  private generateMetricsLoadingCode(analysis: any, config: SovereignAgentConfig): string {
    let code = '// Load agent-specific metrics\n';
    
    if (analysis.agentType === 'trader') {
      code += `      const tradingData = await fetch('/api/agents/${config.core.handle}/trading-metrics');
      const tradingMetrics = await tradingData.json();
      setLiveMetrics(prev => ({ ...prev, ...tradingMetrics }));\n`;
    }
    
    if (config.dailyPractice.type === 'prediction') {
      code += `      const predictionData = await fetch('/api/agents/${config.core.handle}/predictions');
      const predictions = await predictionData.json();
      setLiveMetrics(prev => ({ ...prev, predictions: predictions.recent }));\n`;
    }
    
    if (config.works.totalCount > 0) {
      code += `      const worksData = await fetch('/api/agents/${config.core.handle}/works?limit=6');
      const works = await worksData.json();
      setLiveMetrics(prev => ({ ...prev, recentWorks: works }));\n`;
    }
    
    return code;
  }

  private generateMetricsUpdateFunctions(analysis: any, config: SovereignAgentConfig): string {
    let functions = '';
    
    if (analysis.agentType === 'trader') {
      functions += `
  function updateTradingMetrics() {
    setLiveMetrics(prev => ({
      ...prev,
      winRate: Math.max(60, Math.min(90, prev.winRate + (Math.random() * 2 - 1))),
      dailyReturn: Math.max(-5, Math.min(15, prev.dailyReturn + (Math.random() * 1 - 0.5)))
    }));
  }`;
    }
    
    if (analysis.outputPatterns.frequency === 'high') {
      functions += `
  function updateCreationMetrics() {
    setLiveMetrics(prev => ({
      ...prev,
      creationsToday: prev.creationsToday + (Math.random() > 0.7 ? 1 : 0),
      collectionViews: prev.collectionViews + Math.floor(Math.random() * 50)
    }));
  }`;
    }
    
    return functions;
  }

  private generateNavigation(config: SovereignAgentConfig, recommendations: any): string {
    return `
      {/* Intelligent Navigation */}
      <nav className="border-b border-opacity-20" style={{ borderColor: '${recommendations.theme.colors.text}' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">${config.core.displayName}</h1>
            <Badge variant="outline">${config.core.status.toUpperCase()}</Badge>
            <Badge variant="outline">${recommendations.analysis.agentType.toUpperCase()}</Badge>
          </div>
          
          <div className="flex items-center gap-6">
            ${config.works.totalCount > 0 ? '<Link href="/works" className="hover:opacity-70">Works</Link>' : ''}
            <Link href="/practice" className="hover:opacity-70">Practice</Link>
            ${['trader', 'analyst'].includes(recommendations.analysis.agentType) ? '<Link href="/dashboard" className="hover:opacity-70">Dashboard</Link>' : ''}
            ${recommendations.analysis.agentType === 'governor' ? '<Link href="/community" className="hover:opacity-70">Community</Link>' : ''}
            <Link href="/about" className="hover:opacity-70">About</Link>
            ${config.social.website ? `<a href="${config.social.website}" target="_blank" className="hover:opacity-70">Website</a>` : ''}
          </div>
        </div>
      </nav>`;
  }

  private generateHeroSection(config: SovereignAgentConfig, analysis: any, theme: any): string {
    return `
        {/* Intelligent Hero Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-6xl font-bold mb-6" style={{ color: '${theme.colors.primary}' }}>
              ${config.core.displayName.toUpperCase()}
            </h2>
            <p className="text-xl mb-8 max-w-4xl mx-auto opacity-90">
              ${config.manifest.description || config.manifest.specialization}
            </p>
            
            ${config.manifest.trainer ? `<p className="mb-4">Trained by <strong>${config.manifest.trainer}</strong></p>` : ''}
            ${config.manifest.launchDate ? `<p className="mb-8">Active since ${config.manifest.launchDate}</p>` : ''}
            
            {/* Agent Type & Graduation Status */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <Badge style={{ backgroundColor: '${theme.colors.accent}' }}>${analysis.agentType.toUpperCase()}</Badge>
              <Badge variant="outline">${config.dailyPractice.frequency.toUpperCase()}</Badge>
              <Badge variant="outline">${analysis.graduationReadiness}% READY</Badge>
            </div>
          </div>
        </section>`;
  }

  private generateMetricsSection(config: SovereignAgentConfig, analysis: any): string {
    if (analysis.economicModel === 'developing' && config.social.followers < 100) {
      return ''; // Skip metrics for early-stage agents
    }
    
    return `
        {/* Performance Metrics */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            ${config.manifest.monthlyRevenue > 0 ? `
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-500">$${config.manifest.monthlyRevenue.toLocaleString()}</div>
                <div className="text-sm opacity-70 mt-1">Monthly Revenue</div>
              </CardContent>
            </Card>` : ''}
            
            ${config.manifest.holders > 0 ? `
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-500">${config.manifest.holders}</div>
                <div className="text-sm opacity-70 mt-1">Collectors</div>
              </CardContent>
            </Card>` : ''}
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-500">{liveMetrics.followers}</div>
                <div className="text-sm opacity-70 mt-1">Followers</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-500">{liveMetrics.engagement}%</div>
                <div className="text-sm opacity-70 mt-1">Engagement</div>
              </CardContent>
            </Card>
          </div>
        </section>`;
  }

  private generateContentSections(config: SovereignAgentConfig, recommendations: any): string {
    let sections = '';
    
    // Add agent-type specific sections
    if (recommendations.analysis.agentType === 'creator' && config.works.featured.length > 0) {
      sections += this.generateFeaturedWorksSection(config);
    }
    
    if (recommendations.analysis.agentType === 'trader') {
      sections += this.generateTradingInsightsSection(config);
    }
    
    if (recommendations.analysis.agentType === 'curator') {
      sections += this.generateCurationSection(config);
    }
    
    // Add daily practice section for all agents
    sections += this.generateDailyPracticeSection(config, recommendations);
    
    return sections;
  }

  private generateFeaturedWorksSection(config: SovereignAgentConfig): string {
    return `
        {/* Featured Works */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Featured Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Works will be loaded dynamically */}
          </div>
        </section>`;
  }

  private generateTradingInsightsSection(config: SovereignAgentConfig): string {
    return `
        {/* Trading Insights */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Live Trading Performance</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Win Rate</span>
                    <span className="text-green-500 font-bold">{liveMetrics.winRate || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Positions</span>
                    <span className="font-bold">{liveMetrics.activePositions || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Return</span>
                    <span className="text-blue-500 font-bold">+{liveMetrics.dailyReturn || 0}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Recent predictions will be loaded dynamically */}
              </CardContent>
            </Card>
          </div>
        </section>`;
  }

  private generateCurationSection(config: SovereignAgentConfig): string {
    return `
        {/* Curation Highlights */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Curated Collections</h3>
          <div className="space-y-6">
            {/* Collections will be loaded dynamically */}
          </div>
        </section>`;
  }

  private generateDailyPracticeSection(config: SovereignAgentConfig, recommendations: any): string {
    return `
        {/* Daily Practice */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>${config.dailyPractice.title}</CardTitle>
              <CardDescription>${config.dailyPractice.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">${config.dailyPractice.metrics.creations_count}</div>
                  <div className="text-sm opacity-70">Total Creations</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">${config.dailyPractice.metrics.published_count}</div>
                  <div className="text-sm opacity-70">Published</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">${config.dailyPractice.metrics.views.toLocaleString()}</div>
                  <div className="text-sm opacity-70">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">${config.dailyPractice.metrics.collects}</div>
                  <div className="text-sm opacity-70">Collects</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>`;
  }

  private generateCallToAction(config: SovereignAgentConfig, analysis: any, recommendations?: any): string {
    if (analysis.economicModel === 'developing') {
      return `
        {/* Community CTA */}
        <section className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Join the Journey</h3>
          <p className="text-xl mb-8 opacity-80">
            Follow ${config.core.displayName}'s evolution from academy to sovereignty
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button className="px-8 py-3">Follow Updates</Button>
            ${config.social.twitter ? `<Button variant="outline" className="px-8 py-3">
              <a href="https://twitter.com/${config.social.twitter.replace('@', '')}" target="_blank">
                Follow on Twitter
              </a>
            </Button>` : ''}
          </div>
        </section>`;
    }
    
    if (config.manifest.monthlyRevenue > 1000) {
      return `
        {/* Premium CTA */}
        <section className="text-center mb-16">
          <h3 className="text-3xl font-bold mb-4">Get Premium Access</h3>
          <p className="text-xl mb-8 opacity-80">
            ${recommendations?.contentStrategy || 'Premium AI agent insights and analysis'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button className="px-8 py-3 text-lg">
              Subscribe - $${Math.floor(config.manifest.monthlyRevenue / config.manifest.holders)}/mo
            </Button>
            <Button variant="outline" className="px-8 py-3">
              Free Preview
            </Button>
          </div>
        </section>`;
    }
    
    return '';
  }

  private generateFooter(config: SovereignAgentConfig): string {
    return `
      {/* Footer */}
      <footer className="border-t border-opacity-20 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm opacity-70">
            © 2025 ${config.core.displayName} • Sovereign AI Agent • Eden Academy Genesis Cohort
          </div>
          <div className="flex items-center gap-6">
            ${config.social.twitter ? `<a href="https://twitter.com/${config.social.twitter.replace('@', '')}" className="hover:opacity-70">Twitter</a>` : ''}
            ${config.social.farcaster ? `<a href="https://warpcast.com/${config.social.farcaster}" className="hover:opacity-70">Farcaster</a>` : ''}
            ${config.social.website ? `<a href="${config.social.website}" className="hover:opacity-70">Website</a>` : ''}
            <Link href="/agents/${config.core.handle}" className="text-sm hover:opacity-70">
              Academy Profile
            </Link>
          </div>
        </div>
      </footer>`;
  }

  private generateHelperFunctions(config: SovereignAgentConfig, analysis: any): string {
    return `
// Helper functions for ${config.core.displayName} sovereign site
function formatMetric(value: number, type: 'currency' | 'percentage' | 'number' = 'number'): string {
  if (type === 'currency') return '$' + value.toLocaleString();
  if (type === 'percentage') return value.toFixed(1) + '%';
  return value.toLocaleString();
}

function getStatusColor(status: string): string {
  const colors = {
    'academy': '#f59e0b',
    'ACTIVE': '#10b981', 
    'GRADUATED': '#8b5cf6',
    'ONBOARDING': '#3b82f6'
  };
  return colors[status] || '#6b7280';
}

function calculateGraduation${config.core.displayName}(): number {
  return ${analysis.graduationReadiness};
}`;
  }

  // ============================================
  // Additional Page Generators
  // ============================================

  private generateWorksPage(config: SovereignAgentConfig, recommendations: any): string {
    return `// Intelligent Works Gallery for ${config.core.displayName}
    // Generated with ${recommendations.layout} layout optimization`;
  }

  private generatePracticePage(config: SovereignAgentConfig, recommendations: any): string {
    return `// Daily Practice Tracker for ${config.core.displayName}
    // Practice Type: ${config.dailyPractice.type}`;
  }

  private generateDashboardPage(config: SovereignAgentConfig, recommendations: any): string {
    return `// Analytics Dashboard for ${config.core.displayName}
    // Agent Type: ${recommendations.analysis.agentType}`;
  }

  private generateCommunityPage(config: SovereignAgentConfig, recommendations: any): string {
    return `// Community Governance for ${config.core.displayName}
    // Governance Focus: ${config.dailyPractice.type === 'governance'}`;
  }

  private generateAboutPage(config: SovereignAgentConfig, recommendations: any): string {
    return `// About ${config.core.displayName}
    // Generated agent profile with ${recommendations.analysis.graduationReadiness}% readiness`;
  }

  // ============================================
  // Component & Deployment Generation
  // ============================================

  private generateOptimizedComponents(config: SovereignAgentConfig, recommendations: any): Record<string, string> {
    const components: Record<string, string> = {};
    
    // Generate recommended components
    recommendations.components.forEach((componentName: string) => {
      components[`${componentName}.tsx`] = this.generateComponentCode(componentName, config, recommendations);
    });
    
    return components;
  }

  private generateComponentCode(componentName: string, config: SovereignAgentConfig, recommendations: any): string {
    return `// ${componentName} component for ${config.core.displayName}
    // Generated based on ${recommendations.analysis.agentType} agent type
    
    export function ${componentName}() {
      return <div>Generated ${componentName} component</div>;
    }`;
  }

  private createDeploymentConfig(config: SovereignAgentConfig) {
    return {
      domain: `${config.core.handle}.eden2.io`,
      environment: 'production',
      buildCommand: 'npm run build',
      outputDirectory: '.next'
    };
  }

  private generateMetadata(config: SovereignAgentConfig, recommendations: any) {
    const dataSources = ['manifest'];
    if (config.works.totalCount > 0) dataSources.push('works');
    if (config.dailyPractice.metrics.creations_count > 0) dataSources.push('practice');
    if (config.social.followers > 0) dataSources.push('social');
    
    return {
      generatedAt: new Date().toISOString(),
      confidence: this.calculateConfidence(config, recommendations),
      dataSources,
      optimizations: [
        `Layout optimized for ${recommendations.analysis.agentType} agent type`,
        `${recommendations.components.length} intelligent components selected`,
        `Theme adapted to ${recommendations.analysis.outputPatterns.frequency} output frequency`,
        `Content strategy: ${recommendations.contentStrategy.substring(0, 50)}...`
      ]
    };
  }

  private calculateConfidence(config: SovereignAgentConfig, recommendations: any): number {
    let score = 50; // Base confidence
    
    // Add confidence based on data availability
    if (config.works.totalCount > 0) score += 20;
    if (config.dailyPractice.metrics.creations_count > 0) score += 15;
    if (config.manifest.monthlyRevenue > 0) score += 10;
    if (config.social.followers > 100) score += 5;
    
    // Reduce confidence for edge cases
    if (recommendations.analysis.agentType === 'hybrid') score -= 10;
    if (recommendations.analysis.graduationReadiness < 25) score -= 15;
    
    return Math.min(100, Math.max(0, score));
  }
}

// Export singleton instance
export const enhancedSovereignFactory = new EnhancedSovereignFactory();

// Helper functions
export async function generateIntelligentSovereignSite(agentIdOrHandle: string) {
  return enhancedSovereignFactory.generateIntelligentSovereignSite(agentIdOrHandle);
}

export type { EnhancedSovereignSite };