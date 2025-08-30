'use client';

import { useState, useEffect } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { isFeatureEnabled } from '@/config/flags';

interface EvaluationResult {
  evaluation: any;
  decision: {
    action: string;
    confidence: number;
    reasoning: string;
    riskFactors: string[];
    urgency: string;
    priceTarget?: number;
  };
  archetypes: Array<{
    name: string;
    decision: string;
    confidence: number;
    topReason: string;
  }>;
}

interface AdvisoryReport {
  report: {
    id: string;
    title: string;
    collector: {
      name: string;
    };
    analysis: {
      recommendations: Array<{
        priority: string;
        category: string;
        action: string;
        rationale: string;
        timeline: string;
      }>;
      riskAssessment: {
        overallRisk: string;
        diversificationScore: number;
      };
    };
  };
}

export default function BerthaDemo() {
  const [activeTab, setActiveTab] = useState<'evaluate' | 'advisory' | 'dashboard'>('evaluate');
  const [loading, setLoading] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [advisoryReport, setAdvisoryReport] = useState<AdvisoryReport | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Feature flag check
  const isDemoEnabled = isFeatureEnabled('ENABLE_BERTHA_DEMO');
  
  // Redirect if demo is disabled
  useEffect(() => {
    if (!isDemoEnabled) {
      window.location.href = '/agents/bertha';
    }
  }, [isDemoEnabled]);

  // Sample artwork data for evaluation
  const [artwork, setArtwork] = useState({
    title: 'Genesis Block #1',
    artist: 'Digital Pioneer', 
    currentPrice: 2.5,
    currency: 'ETH',
    platform: 'SuperRare'
  });

  const [signals, setSignals] = useState({
    technical: 0.8,
    cultural: 0.6,
    market: 0.7,
    aesthetic: 0.75
  });

  const [collectorName, setCollectorName] = useState('Demo Collector');

  const handleEvaluate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/bertha/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artwork,
          signals,
          metadata: {
            medium: 'Generative Art',
            created: new Date().toISOString(),
            provenance: ['Artist wallet', 'Gallery verification']
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setEvaluationResult(result);
      } else {
        console.error('Evaluation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Evaluation error:', error);
    }
    setLoading(false);
  };

  const handleGenerateAdvisory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/bertha/advisory-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collectorName,
          targetCategories: ['Digital Art', 'AI Art'],
          budget: '50-100 ETH',
          riskTolerance: 'medium'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAdvisoryReport(result);
      } else {
        console.error('Advisory generation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Advisory error:', error);
    }
    setLoading(false);
  };

  const handleGenerateDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/bertha/collection-dashboard?limit=5');
      
      if (response.ok) {
        const result = await response.json();
        setDashboardData(result);
      } else {
        console.error('Dashboard generation failed:', response.statusText);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    }
    setLoading(false);
  };

  // Show loading while checking feature flag
  if (!isDemoEnabled) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Demo Unavailable</h1>
          <p className="text-gray-400">Redirecting to BERTHA agent page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="border-b border-white pb-8 mb-8">
          <h1 className="text-4xl font-bold mb-4">BERTHA</h1>
          <p className="text-xl mb-2">Collection Intelligence Agent</p>
          <p className="text-gray-400">
            AI art collection intelligence trained by legendary collectors. 
            Provides autonomous artwork evaluation, portfolio analysis, and collection decisions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-600">
          {[
            { key: 'evaluate', label: 'Artwork Evaluation' },
            { key: 'advisory', label: 'Advisory Report' },
            { key: 'dashboard', label: 'Collection Dashboard' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 font-bold ${
                activeTab === tab.key 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Artwork Evaluation Tab */}
        {activeTab === 'evaluate' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Artwork Evaluation</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Artwork Details</h3>
                <div className="space-y-3">
                  <input
                    placeholder="Title"
                    value={artwork.title}
                    onChange={(e) => setArtwork({...artwork, title: e.target.value})}
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded text-white"
                  />
                  <input
                    placeholder="Artist"
                    value={artwork.artist}
                    onChange={(e) => setArtwork({...artwork, artist: e.target.value})}
                    className="w-full p-3 bg-gray-900 border border-gray-600 rounded text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Price"
                      value={artwork.currentPrice}
                      onChange={(e) => setArtwork({...artwork, currentPrice: parseFloat(e.target.value)})}
                      className="flex-1 p-3 bg-gray-900 border border-gray-600 rounded text-white"
                    />
                    <select
                      value={artwork.currency}
                      onChange={(e) => setArtwork({...artwork, currency: e.target.value})}
                      className="p-3 bg-gray-900 border border-gray-600 rounded text-white"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold">Quality Signals</h3>
                <div className="space-y-3">
                  {Object.entries(signals).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between">
                        <label className="capitalize">{key}</label>
                        <span>{value}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={value}
                        onChange={(e) => setSignals({...signals, [key]: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? 'EVALUATING...' : 'EVALUATE ARTWORK'}
            </button>

            {evaluationResult && (
              <div className="mt-8 p-6 border border-gray-600 rounded">
                <h3 className="text-xl font-bold mb-4">BERTHA's Decision</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      {evaluationResult.decision.action.toUpperCase()}
                    </div>
                    <div className="text-lg mb-4">
                      Confidence: {Math.round(evaluationResult.decision.confidence * 100)}%
                    </div>
                    <div className="mb-4">
                      <strong>Reasoning:</strong> {evaluationResult.decision.reasoning}
                    </div>
                    <div className="mb-4">
                      <strong>Urgency:</strong> {evaluationResult.decision.urgency}
                    </div>
                    {evaluationResult.decision.priceTarget && (
                      <div className="mb-4">
                        <strong>Price Target:</strong> {evaluationResult.decision.priceTarget} ETH
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-2">Archetype Breakdown</h4>
                    <div className="space-y-2">
                      {evaluationResult.archetypes.map((arch, i) => (
                        <div key={i} className="p-2 bg-gray-900 rounded">
                          <div className="font-bold">{arch.name}</div>
                          <div className="text-sm">
                            {arch.decision.toUpperCase()} ({Math.round(arch.confidence * 100)}%)
                          </div>
                          <div className="text-xs text-gray-400">{arch.topReason}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Advisory Report Tab */}
        {activeTab === 'advisory' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Collection Advisory Report</h2>
            
            <div className="space-y-4">
              <input
                placeholder="Collector Name"
                value={collectorName}
                onChange={(e) => setCollectorName(e.target.value)}
                className="w-full max-w-md p-3 bg-gray-900 border border-gray-600 rounded text-white"
              />
            </div>

            <button
              onClick={handleGenerateAdvisory}
              disabled={loading}
              className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? 'GENERATING REPORT...' : 'GENERATE ADVISORY REPORT'}
            </button>

            {advisoryReport && (
              <div className="mt-8 p-6 border border-gray-600 rounded">
                <h3 className="text-xl font-bold mb-4">{advisoryReport.report.title}</h3>
                
                <div className="mb-6">
                  <h4 className="font-bold mb-2">Risk Assessment</h4>
                  <div className="text-lg">
                    Overall Risk: <span className="font-bold text-yellow-400">
                      {advisoryReport.report.analysis.riskAssessment.overallRisk.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    Diversification Score: {Math.round(advisoryReport.report.analysis.riskAssessment.diversificationScore * 100)}%
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-2">Key Recommendations</h4>
                  <div className="space-y-3">
                    {advisoryReport.report.analysis.recommendations.slice(0, 3).map((rec, i) => (
                      <div key={i} className="p-4 bg-gray-900 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-bold">{rec.category}</div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${
                            rec.priority === 'high' ? 'bg-red-600' :
                            rec.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                          }`}>
                            {rec.priority.toUpperCase()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 mb-2">{rec.rationale}</div>
                        <div className="text-xs text-gray-400">
                          Action: {rec.action.toUpperCase()} | Timeline: {rec.timeline}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <a 
                    href={`/api/agents/bertha/advisory-report/download?reportId=${advisoryReport.report.id}&format=markdown`}
                    className="inline-block px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download Full Report (Markdown)
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collection Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Collection Intelligence Dashboard</h2>
            
            <button
              onClick={handleGenerateDashboard}
              disabled={loading}
              className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 disabled:opacity-50"
            >
              {loading ? 'ANALYZING COLLECTIONS...' : 'GENERATE DASHBOARD'}
            </button>

            {dashboardData && (
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-900 rounded text-center">
                    <div className="text-2xl font-bold">{dashboardData.dashboard.summary.totalCollections}</div>
                    <div className="text-sm text-gray-400">Collections</div>
                  </div>
                  <div className="p-4 bg-gray-900 rounded text-center">
                    <div className="text-2xl font-bold">{dashboardData.dashboard.summary.totalWorks}</div>
                    <div className="text-sm text-gray-400">Total Works</div>
                  </div>
                  <div className="p-4 bg-gray-900 rounded text-center">
                    <div className="text-2xl font-bold">{Math.round(dashboardData.dashboard.summary.averageQuality * 100)}%</div>
                    <div className="text-sm text-gray-400">Avg Quality</div>
                  </div>
                  <div className="p-4 bg-gray-900 rounded text-center">
                    <div className="text-2xl font-bold">{dashboardData.dashboard.summary.recommendedActions}</div>
                    <div className="text-sm text-gray-400">Actions</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Top Collections</h3>
                  <div className="space-y-4">
                    {dashboardData.dashboard.collections.slice(0, 3).map((collection: any, i: number) => (
                      <div key={i} className="p-4 border border-gray-600 rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-bold">{collection.name}</div>
                            <div className="text-sm text-gray-400">{collection.agent?.displayName}</div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-bold ${
                            collection.recommendation.action === 'strong-buy' ? 'bg-green-600' :
                            collection.recommendation.action === 'buy' ? 'bg-blue-600' :
                            collection.recommendation.action === 'watch' ? 'bg-yellow-600' : 'bg-gray-600'
                          }`}>
                            {collection.recommendation.action.toUpperCase()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>Works: {collection.metrics.totalWorks}</div>
                          <div>Quality: {Math.round(collection.metrics.qualityScore * 100)}%</div>
                          <div>Market: {Math.round(collection.metrics.marketPotential * 100)}%</div>
                          <div>Risk: <span className={`font-bold ${
                            collection.metrics.riskLevel === 'high' ? 'text-red-400' :
                            collection.metrics.riskLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
                          }`}>
                            {collection.metrics.riskLevel.toUpperCase()}
                          </span></div>
                        </div>
                        
                        <div className="text-sm text-gray-300">
                          <strong>Confidence:</strong> {Math.round(collection.recommendation.confidence * 100)}%
                        </div>
                        <div className="text-sm text-gray-300">
                          <strong>Reasoning:</strong> {collection.recommendation.reasoning[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {dashboardData.dashboard.actions.highPriority.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">High Priority Actions</h3>
                    <div className="space-y-2">
                      {dashboardData.dashboard.actions.highPriority.map((action: any, i: number) => (
                        <div key={i} className="p-3 bg-red-900/20 border border-red-400/50 rounded">
                          <div className="font-bold">{action.collection}</div>
                          <div className="text-sm">{action.reasoning}</div>
                          <div className="text-xs text-gray-400">{action.timeline}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}