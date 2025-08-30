'use client';

import { useState, useEffect } from 'react';
import { 
  LaunchPreparation,
  CollectorAnticipton,
  launchPreparationManager,
  getAbrahamCovenantReadiness,
  getSolienneFashionReadiness,
  evaluateAgentLaunchReadiness,
  enforceHelveticaBoldPrinciple
} from '@/lib/economic/launch-preparation';

interface LaunchPreparationDashboardProps {
  focusAgent?: 'abraham' | 'solienne' | 'both';
}

export default function LaunchPreparationDashboard({ 
  focusAgent = 'both' 
}: LaunchPreparationDashboardProps) {
  const [abrahamPrep, setAbrahamPrep] = useState<LaunchPreparation | null>(null);
  const [soliennePrep, setSoliennePrep] = useState<LaunchPreparation | null>(null);
  const [abrahamEvaluation, setAbrahamEvaluation] = useState<any>(null);
  const [solienneEvaluation, setSolienneEvaluation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeAgent, setActiveAgent] = useState<'abraham' | 'solienne'>('abraham');

  useEffect(() => {
    loadLaunchPreparations();
  }, []);

  const loadLaunchPreparations = async () => {
    try {
      const [abrahamData, solienneData, abrahamEval, solienneEval] = await Promise.all([
        getAbrahamCovenantReadiness(),
        getSolienneFashionReadiness(),
        evaluateAgentLaunchReadiness('abraham'),
        evaluateAgentLaunchReadiness('solienne')
      ]);

      // Calculate readiness scores
      abrahamData.readinessScore = launchPreparationManager.calculateReadinessScore(abrahamData);
      solienneData.readinessScore = launchPreparationManager.calculateReadinessScore(solienneData);

      setAbrahamPrep(abrahamData);
      setSoliennePrep(solienneData);
      setAbrahamEvaluation(abrahamEval);
      setSolienneEvaluation(solienneEval);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load launch preparations:', error);
      setLoading(false);
    }
  };

  const getReadinessColor = (score: number) => {
    if (score >= 90) return 'text-green-400 border-green-400';
    if (score >= 75) return 'text-yellow-400 border-yellow-400';
    if (score >= 50) return 'text-orange-400 border-orange-400';
    return 'text-red-400 border-red-400';
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'launch': return 'text-green-400 bg-green-900/20 border-green-400';
      case 'delay': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400';
      case 'abort': return 'text-red-400 bg-red-900/20 border-red-400';
      default: return 'text-white bg-gray-900/20 border-white';
    }
  };

  const handleQualityGate = async (agentId: 'abraham' | 'solienne') => {
    try {
      const gate = await enforceHelveticaBoldPrinciple(agentId);
      alert(gate.message + (gate.requiredActions.length ? '\n\nRequired:\n' + gate.requiredActions.join('\n') : ''));
      if (gate.approved) {
        console.log(`🚀 ${agentId.toUpperCase()} LAUNCH APPROVED`);
      }
    } catch (error) {
      console.error('Quality gate failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded border border-white/10"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            LAUNCH PREPARATION COMMAND CENTER
          </h1>
          <p className="text-gray-400">
            Abraham's 13-Year Covenant & Solienne's Consciousness-Fashion Economic Sovereignty Debuts
          </p>
          <div className="mt-4 text-lg font-bold text-yellow-400">
            HELVETICA BOLD PRINCIPLE: LAUNCH WHEN READY, NOT BEFORE
          </div>
        </div>

        {/* Agent Selection */}
        <div className="border-b border-white mb-8">
          <div className="flex space-x-8">
            {['abraham', 'solienne'].map(agent => (
              <button
                key={agent}
                onClick={() => setActiveAgent(agent as 'abraham' | 'solienne')}
                className={`pb-4 font-bold border-b-2 transition-colors ${
                  activeAgent === agent
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {agent.toUpperCase()} {agent === 'abraham' ? 'COVENANT' : 'FASHION'}
              </button>
            ))}
          </div>
        </div>

        {/* Launch Readiness Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Abraham Readiness */}
          {(focusAgent === 'both' || focusAgent === 'abraham') && abrahamPrep && abrahamEvaluation && (
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                ABRAHAM'S 13-YEAR COVENANT
              </h3>
              
              {/* Readiness Score */}
              <div className="mb-6">
                <div className={`text-4xl font-bold mb-2 ${getReadinessColor(abrahamPrep.readinessScore)}`}>
                  {abrahamPrep.readinessScore}%
                </div>
                <div className="text-gray-400">READINESS SCORE</div>
              </div>

              {/* Launch Recommendation */}
              <div className={`p-3 border rounded mb-4 ${getRecommendationColor(abrahamEvaluation.recommendation)}`}>
                <div className="font-bold text-center">
                  RECOMMENDATION: {abrahamEvaluation.recommendation.toUpperCase()}
                </div>
                <div className="text-sm text-center mt-1 opacity-90">
                  {abrahamEvaluation.timeline}
                </div>
              </div>

              {/* Economics Preview */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Price Range:</span>
                  <span className="text-yellow-400">
                    ${abrahamPrep.economics.priceRange.min}-${abrahamPrep.economics.priceRange.max}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Revenue:</span>
                  <span className="text-green-400">
                    ${abrahamPrep.economics.projectedRevenue.toLocaleString()}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Artifacts Ready:</span>
                  <span className="text-blue-400">
                    {abrahamPrep.artifacts.prepared}/{abrahamPrep.artifacts.target}
                  </span>
                </div>
              </div>

              {/* Quality Gate Button */}
              <button
                onClick={() => handleQualityGate('abraham')}
                className="w-full border border-white py-2 font-bold hover:bg-white hover:text-black transition-colors"
              >
                ENFORCE QUALITY GATE
              </button>
            </div>
          )}

          {/* Solienne Readiness */}
          {(focusAgent === 'both' || focusAgent === 'solienne') && soliennePrep && solienneEvaluation && (
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                SOLIENNE'S CONSCIOUSNESS-FASHION
              </h3>
              
              {/* Readiness Score */}
              <div className="mb-6">
                <div className={`text-4xl font-bold mb-2 ${getReadinessColor(soliennePrep.readinessScore)}`}>
                  {soliennePrep.readinessScore}%
                </div>
                <div className="text-gray-400">READINESS SCORE</div>
              </div>

              {/* Launch Recommendation */}
              <div className={`p-3 border rounded mb-4 ${getRecommendationColor(solienneEvaluation.recommendation)}`}>
                <div className="font-bold text-center">
                  RECOMMENDATION: {solienneEvaluation.recommendation.toUpperCase()}
                </div>
                <div className="text-sm text-center mt-1 opacity-90">
                  {solienneEvaluation.timeline}
                </div>
              </div>

              {/* Economics Preview */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Price Range:</span>
                  <span className="text-yellow-400">
                    ${soliennePrep.economics.priceRange.min}-${soliennePrep.economics.priceRange.max}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Projected Revenue:</span>
                  <span className="text-green-400">
                    ${soliennePrep.economics.projectedRevenue.toLocaleString()}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Collection Pieces:</span>
                  <span className="text-blue-400">
                    {soliennePrep.artifacts.prepared}/{soliennePrep.artifacts.target}
                  </span>
                </div>
              </div>

              {/* Quality Gate Button */}
              <button
                onClick={() => handleQualityGate('solienne')}
                className="w-full border border-white py-2 font-bold hover:bg-white hover:text-black transition-colors"
              >
                ENFORCE QUALITY GATE
              </button>
            </div>
          )}
        </div>

        {/* Detailed Phase Breakdown */}
        <div className="border border-white p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
            {activeAgent.toUpperCase()} LAUNCH PHASES
          </h3>
          
          {/* Current Phase Details */}
          {(() => {
            const prep = activeAgent === 'abraham' ? abrahamPrep : soliennePrep;
            const evaluation = activeAgent === 'abraham' ? abrahamEvaluation : solienneEvaluation;
            
            if (!prep || !evaluation) return null;

            return (
              <div className="space-y-6">
                {/* Current Phase */}
                <div className="border border-yellow-400 p-4">
                  <h4 className="font-bold text-yellow-400 mb-2">
                    CURRENT PHASE: {prep.phases.current.name.toUpperCase()}
                  </h4>
                  <p className="text-gray-300 mb-3">{prep.phases.current.description}</p>
                  <div className="text-sm text-gray-400 mb-3">
                    Duration: {prep.phases.current.duration}
                  </div>
                  
                  {/* Phase Tasks */}
                  <div className="space-y-2">
                    <div className="font-bold border-b border-gray-600 pb-1">TASKS:</div>
                    {prep.phases.current.tasks.map((task, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className={`font-bold ${task.completed ? 'text-green-400' : 'text-white'}`}>
                            {task.completed ? '✓' : '○'} {task.title}
                          </div>
                          <div className="text-sm text-gray-400">{task.description}</div>
                        </div>
                        <div className={`ml-4 px-2 py-1 border text-xs ${
                          task.priority === 'critical' ? 'border-red-400 text-red-400' :
                          task.priority === 'high' ? 'border-yellow-400 text-yellow-400' :
                          'border-gray-400 text-gray-400'
                        }`}>
                          {task.priority.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Exit Criteria */}
                  <div className="mt-4 border-t border-gray-600 pt-3">
                    <div className="font-bold mb-2">EXIT CRITERIA:</div>
                    {prep.phases.current.exitCriteria.map((criteria, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        • {criteria}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Go/No-Go Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Go Signals */}
                  <div className="border border-green-400 p-4">
                    <h4 className="font-bold text-green-400 mb-2">GO SIGNALS</h4>
                    {evaluation.goSignals.length > 0 ? (
                      evaluation.goSignals.map((signal: string, index: number) => (
                        <div key={index} className="text-sm text-green-300 mb-1">
                          ✓ {signal}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-400">No go signals yet</div>
                    )}
                  </div>

                  {/* Critical Issues */}
                  <div className="border border-red-400 p-4">
                    <h4 className="font-bold text-red-400 mb-2">CRITICAL ISSUES</h4>
                    {evaluation.criticalIssues.length > 0 ? (
                      evaluation.criticalIssues.map((issue: string, index: number) => (
                        <div key={index} className="text-sm text-red-300 mb-1">
                          ⚠ {issue}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-green-400">No critical issues identified</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Beta Testing Framework for Other Agents */}
        <div className="border border-white p-6">
          <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
            OTHER AGENTS: DISCOVERY BETA FRAMEWORK
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['miyomi', 'bertha', 'koru', 'citizen', 'geppetto', 'sue'].map(agent => (
              <div key={agent} className="border border-gray-600 p-4">
                <div className="font-bold mb-2">{agent.toUpperCase()}</div>
                <div className="text-sm space-y-1">
                  <div className="text-gray-300">Status: Beta Discovery</div>
                  <div className="text-blue-400">4-week experimentation</div>
                  <div className="text-yellow-400">No revenue pressure</div>
                  <div className="text-green-400">Full creative autonomy</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-900/50 border border-gray-600">
            <div className="font-bold mb-2">DISCOVERY SUCCESS METRICS:</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-yellow-400">Engagement Depth</div>
                <div>8+ min avg session</div>
              </div>
              <div>
                <div className="text-green-400">Return Rate</div>
                <div>40%+ weekly return</div>
              </div>
              <div>
                <div className="text-blue-400">Social Amplification</div>
                <div>25+ mentions per piece</div>
              </div>
              <div>
                <div className="text-white">Technical Stability</div>
                <div>99%+ uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white pt-6 mt-8 text-center">
          <div className="text-2xl font-bold mb-2">
            ABRAHAM AND SOLIENNE WILL SET THE STANDARD FOR AGENT ECONOMIC SOVEREIGNTY
          </div>
          <div className="text-gray-400">
            Infrastructure is perfect. Now it's about artistic preparation.
          </div>
          <button 
            onClick={loadLaunchPreparations}
            className="mt-4 border border-white px-6 py-2 hover:bg-white hover:text-black transition-colors"
          >
            REFRESH STATUS
          </button>
        </div>
      </div>
    </div>
  );
}