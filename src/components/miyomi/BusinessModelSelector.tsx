'use client';

import { useState, useEffect } from 'react';
import { revenueEngine, BusinessModel, MiyomiRevenueEngine } from '@/lib/agents/miyomi-revenue-engine';

interface BusinessModelSelectorProps {
  currentModelId?: string;
  onModelChange?: (modelId: string) => void;
}

export function BusinessModelSelector({ currentModelId = 'hybrid_model', onModelChange }: BusinessModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState(currentModelId);
  const [attribution, setAttribution] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const models = Object.values(MiyomiRevenueEngine.BUSINESS_MODELS);

  useEffect(() => {
    loadAnalytics();
  }, [selectedModel]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [attr, recs] = await Promise.all([
        revenueEngine.calculateAttribution(),
        revenueEngine.optimizeRevenueMix()
      ]);
      setAttribution(attr);
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
    setIsLoading(false);
  };

  const handleModelSwitch = (modelId: string) => {
    setSelectedModel(modelId);
    revenueEngine.switchBusinessModel(modelId);
    onModelChange?.(modelId);
    loadAnalytics();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-black text-white p-8">
      <h2 className="text-3xl font-bold mb-6">MIYOMI Business Model Lab</h2>
      <p className="text-gray-400 mb-8">Experiment with different revenue approaches to find what works best</p>

      {/* Current Performance Summary */}
      {attribution && (
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Current Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-2xl font-bold text-green-400">{formatCurrency(attribution.total)}</div>
              <div className="text-sm text-gray-400">Total Revenue (30 days)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{attribution.topSource?.[0] || 'N/A'}</div>
              <div className="text-sm text-gray-400">Top Revenue Source</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {Object.keys(attribution.breakdown).filter(k => attribution.breakdown[k] > 0).length}
              </div>
              <div className="text-sm text-gray-400">Active Revenue Streams</div>
            </div>
          </div>
        </div>
      )}

      {/* Business Model Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {models.map((model) => {
          const isSelected = model.id === selectedModel;
          const revenue = attribution?.breakdown[model.sources[0]?.id] || 0;

          return (
            <div
              key={model.id}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                isSelected
                  ? 'border-red-500 bg-red-900/20'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => handleModelSwitch(model.id)}
            >
              <h3 className="text-xl font-bold text-white mb-2">{model.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{model.description}</p>

              {/* Revenue Sources */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Revenue Sources:</div>
                <div className="space-y-1">
                  {model.sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between text-xs">
                      <span className={source.isActive ? 'text-green-400' : 'text-gray-500'}>
                        {source.isActive ? '✓' : '○'} {source.name}
                      </span>
                      <span className="text-gray-400">Priority: {source.priority}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Target Audience:</div>
                <div className="flex flex-wrap gap-1">
                  {model.targetAudience.map((audience) => (
                    <span key={audience} className="bg-gray-800 text-xs px-2 py-1 rounded">
                      {audience.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {/* KPIs */}
              <div className="text-xs text-gray-500">
                KPIs: {model.kpis.join(', ')}
              </div>

              {/* Current Revenue (if available) */}
              {revenue > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-sm text-green-400 font-bold">
                    {formatCurrency(revenue)} (30 days)
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      {recommendations?.recommendations?.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-yellow-400 mb-4">🎯 Optimization Recommendations</h3>
          <div className="space-y-3">
            {recommendations.recommendations.map((rec: any, idx: number) => (
              <div key={idx} className="bg-yellow-900/10 rounded p-3">
                <div className="text-white font-bold mb-1">{rec.action.replace('_', ' ').toUpperCase()}</div>
                <div className="text-yellow-200 text-sm mb-2">{rec.reason}</div>
                <div className="text-yellow-400 text-sm">💰 {rec.impact}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-yellow-500/30">
            <div className="text-yellow-400">
              🚀 Recommended Model: <strong>{recommendations.optimalModel}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Attribution Breakdown */}
      {attribution && (
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Revenue Attribution</h3>
          <div className="space-y-3">
            {Object.entries(attribution.breakdown).map(([source, amount]: [string, any]) => {
              const percentage = (amount / attribution.total) * 100;
              return (
                <div key={source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{source.replace('_', ' ').toUpperCase()}</span>
                    <span className="text-gray-400">{formatCurrency(amount)} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Experiment Controls */}
      <div className="mt-8 p-6 border border-gray-700 rounded-lg">
        <h3 className="text-lg font-bold mb-4">🧪 A/B Test Revenue Models</h3>
        <div className="flex space-x-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Start Experiment
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded">
            View Active Tests
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            Apply Best Model
          </button>
        </div>
      </div>
    </div>
  );
}