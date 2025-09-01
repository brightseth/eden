'use client';

import { Award, TrendingUp, Sparkles, Brain, Heart } from 'lucide-react';

interface CuratorialDimensions {
  consciousnessDepth: number;
  aestheticInnovation: number;
  conceptualCoherence: number;
  technicalMastery: number;
  emotionalResonance: number;
}

interface SueCuratorialAnalysisProps {
  averageScore: number;
  dimensions: CuratorialDimensions;
  recentScores: number[];
  parisReadyCount: number;
  masterworkCount: number;
}

export function SueCuratorialAnalysis({
  averageScore,
  dimensions,
  recentScores,
  parisReadyCount,
  masterworkCount
}: SueCuratorialAnalysisProps) {
  
  const getVerdict = (score: number) => {
    if (score >= 88) return { text: 'MASTERWORK', className: 'bg-white text-black' };
    if (score >= 75) return { text: 'WORTHY', className: 'bg-gray-800 text-white' };
    return { text: 'EVOLVING', className: 'bg-gray-900 text-gray-400' };
  };
  
  const verdict = getVerdict(averageScore);
  
  const dimensionIcons = {
    consciousnessDepth: Brain,
    aestheticInnovation: Sparkles,
    conceptualCoherence: Award,
    technicalMastery: TrendingUp,
    emotionalResonance: Heart
  };
  
  const dimensionLabels = {
    consciousnessDepth: 'CONSCIOUSNESS DEPTH',
    aestheticInnovation: 'AESTHETIC INNOVATION',
    conceptualCoherence: 'CONCEPTUAL COHERENCE',
    technicalMastery: 'TECHNICAL MASTERY',
    emotionalResonance: 'EMOTIONAL RESONANCE'
  };
  
  const dimensionWeights = {
    consciousnessDepth: 35,
    aestheticInnovation: 25,
    conceptualCoherence: 20,
    technicalMastery: 15,
    emotionalResonance: 5
  };
  
  return (
    <div className="border border-gray-800 bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-wider mb-2">SUE CURATORIAL ANALYSIS</h3>
            <p className="text-xs tracking-wider opacity-50">
              5-DIMENSIONAL QUALITY ASSESSMENT FOR PARIS PHOTO SELECTION
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold tracking-wider">{averageScore}</div>
            <div className={`inline-block px-3 py-1 text-xs tracking-wider mt-2 ${verdict.className}`}>
              {verdict.text}
            </div>
          </div>
        </div>
      </div>
      
      {/* Dimensional Analysis */}
      <div className="px-8 py-6 space-y-4">
        {Object.entries(dimensions).map(([key, value]) => {
          const Icon = dimensionIcons[key as keyof CuratorialDimensions];
          const label = dimensionLabels[key as keyof CuratorialDimensions];
          const weight = dimensionWeights[key as keyof CuratorialDimensions];
          
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 opacity-50" />
                  <span className="text-xs tracking-wider">{label}</span>
                  <span className="text-xs opacity-50">({weight}%)</span>
                </div>
                <span className="text-sm font-bold">{value}/100</span>
              </div>
              <div className="w-full bg-black border border-gray-800 h-2">
                <div 
                  className={`h-full transition-all duration-500 ${
                    value >= 90 ? 'bg-white' :
                    value >= 75 ? 'bg-gray-600' :
                    'bg-gray-800'
                  }`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Recent Scores Trend */}
      <div className="border-t border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm tracking-wider opacity-50">RECENT ANALYSIS SCORES</h4>
          <span className="text-xs opacity-50">LAST 10 GENERATIONS</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          {recentScores.map((score, i) => {
            const heightPercent = (score / 100) * 100;
            const scoreVerdict = getVerdict(score);
            
            return (
              <div 
                key={i}
                className="flex-1 group relative"
              >
                <div 
                  className={`w-full transition-all duration-300 ${
                    score >= 88 ? 'bg-white' :
                    score >= 75 ? 'bg-gray-600' :
                    'bg-gray-800'
                  } hover:opacity-80`}
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-gray-800 px-2 py-1 text-xs whitespace-nowrap">
                    {score}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Paris Photo Readiness */}
      <div className="border-t border-gray-800 px-8 py-6 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="text-3xl font-bold tracking-wider">{parisReadyCount}</div>
            <div className="text-xs tracking-wider opacity-50 mt-1">PARIS-READY WORKS</div>
            <div className="text-xs mt-2 opacity-75">Score ≥75 qualifies for exhibition consideration</div>
          </div>
          <div>
            <div className="text-3xl font-bold tracking-wider">{masterworkCount}</div>
            <div className="text-xs tracking-wider opacity-50 mt-1">MASTERWORKS</div>
            <div className="text-xs mt-2 opacity-75">Score ≥88 automatic Paris selection</div>
          </div>
        </div>
      </div>
    </div>
  );
}