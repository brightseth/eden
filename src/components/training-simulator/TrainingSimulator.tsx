'use client';

import { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCw, 
  Zap, 
  Target,
  Brain,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';

interface SimulatorProps {
  agentId: string;
  agentName: string;
  isActive?: boolean;
}

interface SimulationRun {
  id: string;
  prompt: string;
  imageUrl?: string;
  verdict?: {
    verdict: 'INCLUDE' | 'MAYBE' | 'EXCLUDE';
    scores: Record<string, number>;
    critique: string;
    advice: string;
  };
  status: 'generating' | 'curating' | 'complete' | 'failed';
  timestamp: string;
}

export function TrainingSimulator({ agentId, agentName, isActive = true }: SimulatorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentRun, setCurrentRun] = useState<SimulationRun | null>(null);
  const [history, setHistory] = useState<SimulationRun[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  // Predefined training prompts
  const trainingPrompts = [
    "A solitary figure dissolving into architectural space",
    "Consciousness rendered as pure geometric form", 
    "The moment before transformation begins",
    "Light breaking through crystalline structures",
    "Two forms emerging from shared foundation"
  ];

  const startSimulation = async () => {
    if (!isActive) return;
    
    setIsRunning(true);
    
    // Select prompt
    const prompt = useCustom && customPrompt 
      ? customPrompt 
      : trainingPrompts[Math.floor(Math.random() * trainingPrompts.length)];
    
    // Create simulation run
    const run: SimulationRun = {
      id: crypto.randomUUID(),
      prompt,
      status: 'generating',
      timestamp: new Date().toISOString()
    };
    
    setCurrentRun(run);
    
    // Simulate generation (2-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // Mock generated image
    run.imageUrl = `/api/placeholder/512/512?text=${encodeURIComponent(prompt.slice(0, 20))}`;
    run.status = 'curating';
    setCurrentRun({...run});
    
    // Simulate curation (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Mock verdict
    const verdictOptions = ['INCLUDE', 'MAYBE', 'EXCLUDE'] as const;
    const verdict = verdictOptions[Math.floor(Math.random() * 3)];
    
    run.verdict = {
      verdict,
      scores: {
        composition: 60 + Math.floor(Math.random() * 40),
        technique: 60 + Math.floor(Math.random() * 40),
        concept: 60 + Math.floor(Math.random() * 40),
        originality: 60 + Math.floor(Math.random() * 40),
        paris_photo_ready: verdict === 'INCLUDE' ? 75 + Math.floor(Math.random() * 25) : 40 + Math.floor(Math.random() * 35)
      },
      critique: verdict === 'INCLUDE' 
        ? "Strong formal qualities with sophisticated use of space. The work demonstrates museum-ready composition."
        : verdict === 'MAYBE'
        ? "Promising direction but needs refinement in execution. Consider strengthening the conceptual framework."
        : "Technical issues prevent this from reaching curatorial standards. Focus on fundamental composition principles.",
      advice: verdict === 'INCLUDE'
        ? "Continue this direction. Consider exploring variations at larger scale."
        : "Study similar successful works in this genre. Practice fundamental techniques before attempting complex concepts."
    };
    
    run.status = 'complete';
    setCurrentRun({...run});
    setHistory(prev => [run, ...prev].slice(0, 10)); // Keep last 10
    setIsRunning(false);
    
    // Send notification if user follows this agent
    if ((window as any).testNotification && verdict === 'INCLUDE') {
      (window as any).testNotification('CURATION_VERDICT', agentName);
    }
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (currentRun && currentRun.status !== 'complete') {
      setCurrentRun({ ...currentRun, status: 'failed' });
    }
  };

  const resetSimulator = () => {
    setCurrentRun(null);
    setHistory([]);
    setCustomPrompt('');
    setUseCustom(false);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'generating': return <Zap className="w-4 h-4 animate-pulse" />;
      case 'curating': return <Target className="w-4 h-4 animate-pulse" />;
      case 'complete': return <Sparkles className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch(verdict) {
      case 'INCLUDE': return 'text-green-400 border-green-400';
      case 'MAYBE': return 'text-yellow-400 border-yellow-400';
      case 'EXCLUDE': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  if (!isActive) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
        <Brain className="w-12 h-12 mx-auto mb-4 text-gray-600" />
        <h3 className="text-xl font-bold mb-2">Training Simulator</h3>
        <p className="text-gray-400">
          Simulator will be available when {agentName} enters the Academy
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Training Simulator</h3>
            <p className="text-sm text-gray-400">
              Test {agentName}'s creative process with custom or preset prompts
            </p>
          </div>
          <button
            onClick={resetSimulator}
            className="text-gray-400 hover:text-white transition-colors"
            title="Reset Simulator"
          >
            <RotateCw className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Selection */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setUseCustom(false)}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${
                !useCustom 
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' 
                  : 'border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
            >
              Preset Prompts
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`px-4 py-2 text-sm font-medium border transition-colors ${
                useCustom 
                  ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' 
                  : 'border-gray-600 text-gray-400 hover:border-gray-400'
              }`}
            >
              Custom Prompt
            </button>
          </div>

          {useCustom && (
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Enter your creative prompt..."
              className="w-full px-4 py-2 bg-black border border-gray-600 rounded text-white placeholder-gray-500 focus:border-yellow-400 focus:outline-none"
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={startSimulation}
              disabled={useCustom && !customPrompt}
              className="flex-1 px-6 py-3 bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Start Training Run
            </button>
          ) : (
            <button
              onClick={stopSimulation}
              className="flex-1 px-6 py-3 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            >
              <Pause className="w-4 h-4" />
              Stop Simulation
            </button>
          )}
        </div>
      </div>

      {/* Current Run */}
      {currentRun && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            {getStatusIcon(currentRun.status)}
            <span className="text-sm font-medium capitalize">
              {currentRun.status.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">PROMPT</div>
              <p className="text-sm">{currentRun.prompt}</p>
            </div>

            {currentRun.imageUrl && (
              <div>
                <div className="text-xs text-gray-500 mb-2">GENERATED OUTPUT</div>
                <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center h-48">
                  <div className="text-center">
                    <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                    <p className="text-xs text-gray-400">Image generation simulated</p>
                  </div>
                </div>
              </div>
            )}

            {currentRun.verdict && (
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">CURATORIAL VERDICT</div>
                    <span className={`inline-block px-3 py-1 text-sm font-bold border ${getVerdictColor(currentRun.verdict.verdict)}`}>
                      {currentRun.verdict.verdict}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">PARIS PHOTO READY</div>
                    <div className="text-2xl font-bold">
                      {currentRun.verdict.scores.paris_photo_ready}%
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2">CRITIQUE</div>
                  <p className="text-sm text-gray-300">{currentRun.verdict.critique}</p>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(currentRun.verdict.scores)
                    .filter(([key]) => key !== 'paris_photo_ready')
                    .map(([key, value]) => (
                      <div key={key}>
                        <div className="text-xs text-gray-500 mb-1 capitalize">
                          {key.replace('_', ' ')}
                        </div>
                        <div className="text-lg font-bold">{value}%</div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h4 className="font-bold mb-4">Recent Training Runs</h4>
          <div className="space-y-2">
            {history.map(run => (
              <div key={run.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex-1">
                  <p className="text-sm text-gray-300 truncate">
                    {run.prompt}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(run.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                {run.verdict && (
                  <span className={`px-2 py-1 text-xs font-bold border ${getVerdictColor(run.verdict.verdict)}`}>
                    {run.verdict.verdict}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}