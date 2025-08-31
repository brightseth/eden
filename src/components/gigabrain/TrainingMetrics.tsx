'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from 'lucide-react';

interface MetricData {
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  status: 'good' | 'warning' | 'critical';
  benchmark?: number;
}

interface TraitProfile {
  confidence: number;
  creativity: number;
  analytical: number;
  social: number;
  chaos: number;
}

interface AgentProgress {
  name: string;
  day: number;
  totalDays: number;
  phase: string;
  traitProfile: TraitProfile;
  qualityScore: number;
  estimatedCompletion: string;
  riskLevel: 'low' | 'medium' | 'high';
  lastCheckpoint: {
    date: string;
    status: 'passed' | 'failed' | 'warning';
    notes: string;
  };
}

export function TrainingMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([
    {
      label: 'Success Rate',
      value: 87,
      unit: '%',
      trend: 'up',
      changePercent: 5,
      status: 'good',
      benchmark: 85
    },
    {
      label: 'Avg Training Time',
      value: 4.2,
      unit: 'days',
      trend: 'down',
      changePercent: -15,
      status: 'good',
      benchmark: 5
    },
    {
      label: 'Cost Per Agent',
      value: 1200,
      unit: '$',
      trend: 'down',
      changePercent: -8,
      status: 'good',
      benchmark: 1500
    },
    {
      label: 'Quality Score',
      value: 92,
      unit: '/100',
      trend: 'up',
      changePercent: 3,
      status: 'good',
      benchmark: 90
    },
    {
      label: 'Failure Rate',
      value: 13,
      unit: '%',
      trend: 'down',
      changePercent: -20,
      status: 'warning',
      benchmark: 10
    },
    {
      label: 'Autonomy Level',
      value: 89,
      unit: '%',
      trend: 'stable',
      changePercent: 0,
      status: 'good',
      benchmark: 85
    }
  ]);

  const [activeAgents, setActiveAgents] = useState<AgentProgress[]>([
    {
      name: 'KORU',
      day: 5,
      totalDays: 8,
      phase: 'Memory Seeding',
      traitProfile: {
        confidence: 75,
        creativity: 65,
        analytical: 55,
        social: 90,
        chaos: 45
      },
      qualityScore: 87,
      estimatedCompletion: '3 days',
      riskLevel: 'low',
      lastCheckpoint: {
        date: '2 hours ago',
        status: 'passed',
        notes: 'Memory retention at 72%, optimal range'
      }
    },
    {
      name: 'GEPPETTO',
      day: 4,
      totalDays: 8,
      phase: 'Personality Calibration',
      traitProfile: {
        confidence: 85,
        creativity: 95,
        analytical: 70,
        social: 60,
        chaos: 75
      },
      qualityScore: 92,
      estimatedCompletion: '4 days',
      riskLevel: 'medium',
      lastCheckpoint: {
        date: '4 hours ago',
        status: 'warning',
        notes: 'Chaos trait approaching upper limit'
      }
    },
    {
      name: 'CITIZEN',
      day: 6,
      totalDays: 9,
      phase: 'Collaboration Training',
      traitProfile: {
        confidence: 70,
        creativity: 50,
        analytical: 85,
        social: 95,
        chaos: 30
      },
      qualityScore: 78,
      estimatedCompletion: '3 days',
      riskLevel: 'low',
      lastCheckpoint: {
        date: '1 hour ago',
        status: 'passed',
        notes: 'Excellent social coordination scores'
      }
    }
  ]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      case 'stable':
        return <Minus className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: 'good' | 'warning' | 'critical') => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
    }
  };

  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch (risk) {
      case 'low':
        return 'border-green-400 text-green-400';
      case 'medium':
        return 'border-yellow-400 text-yellow-400';
      case 'high':
        return 'border-red-400 text-red-400';
    }
  };

  const getCheckpointIcon = (status: 'passed' | 'failed' | 'warning') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Key Metrics Grid */}
      <div>
        <h3 className="text-xl font-bold mb-4">TRAINING PERFORMANCE METRICS</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="border border-gray-600 p-4">
              <div className="text-xs text-gray-400 mb-2">{metric.label}</div>
              <div className={`text-2xl font-bold mb-2 ${getStatusColor(metric.status)}`}>
                {metric.value}{metric.unit}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-xs ${
                    metric.trend === 'up' && metric.status === 'good' ? 'text-green-400' :
                    metric.trend === 'down' && metric.status === 'good' ? 'text-green-400' :
                    metric.trend === 'stable' ? 'text-gray-400' :
                    'text-yellow-400'
                  }`}>
                    {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                  </span>
                </div>
                {metric.benchmark && (
                  <div className="text-xs text-gray-500">
                    BM: {metric.benchmark}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Training Progress */}
      <div>
        <h3 className="text-xl font-bold mb-4">ACTIVE TRAINING SESSIONS</h3>
        <div className="space-y-4">
          {activeAgents.map((agent, index) => (
            <div key={index} className="border border-gray-600 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold">{agent.name}</h4>
                  <p className="text-sm text-gray-400">
                    Day {agent.day} of {agent.totalDays} - {agent.phase}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 border text-xs ${getRiskColor(agent.riskLevel)}`}>
                    {agent.riskLevel.toUpperCase()} RISK
                  </span>
                  <p className="text-sm text-gray-400 mt-1">
                    ETA: {agent.estimatedCompletion}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((agent.day / agent.totalDays) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-800">
                  <div 
                    className="h-full bg-white transition-all"
                    style={{ width: `${(agent.day / agent.totalDays) * 100}%` }}
                  />
                </div>
              </div>

              {/* Trait Profile */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {Object.entries(agent.traitProfile).map(([trait, value]) => (
                  <div key={trait} className="text-center">
                    <div className="text-xs text-gray-400 mb-1">
                      {trait.charAt(0).toUpperCase() + trait.slice(1, 3)}
                    </div>
                    <div className="relative h-16 w-full bg-gray-800">
                      <div 
                        className="absolute bottom-0 w-full bg-gray-600"
                        style={{ height: `${value}%` }}
                      />
                    </div>
                    <div className="text-xs mt-1">{value}</div>
                  </div>
                ))}
              </div>

              {/* Last Checkpoint */}
              <div className="flex items-center justify-between border-t border-gray-700 pt-3">
                <div className="flex items-center gap-2">
                  {getCheckpointIcon(agent.lastCheckpoint.status)}
                  <div>
                    <span className="text-sm">Last Checkpoint: </span>
                    <span className="text-sm text-gray-400">{agent.lastCheckpoint.date}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">{agent.lastCheckpoint.notes}</p>
              </div>

              {/* Quality Score */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-gray-400">Quality Score</span>
                <span className={`text-lg font-bold ${
                  agent.qualityScore >= 90 ? 'text-green-400' :
                  agent.qualityScore >= 75 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {agent.qualityScore}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Confidence */}
      <div className="border border-white p-6">
        <h3 className="text-xl font-bold mb-4">PATTERN CONFIDENCE MATRIX</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-400 mb-1">Memory Patterns</div>
            <div className="text-2xl font-bold">94%</div>
            <div className="text-xs text-green-400">HIGH CONFIDENCE</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Trait Evolution</div>
            <div className="text-2xl font-bold">87%</div>
            <div className="text-xs text-green-400">HIGH CONFIDENCE</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Collaboration</div>
            <div className="text-2xl font-bold">76%</div>
            <div className="text-xs text-yellow-400">MEDIUM CONFIDENCE</div>
          </div>
          <div>
            <div className="text-sm text-gray-400 mb-1">Production</div>
            <div className="text-2xl font-bold">91%</div>
            <div className="text-xs text-green-400">HIGH CONFIDENCE</div>
          </div>
        </div>
      </div>
    </div>
  );
}