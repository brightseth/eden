'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Video, CheckCircle, XCircle, Clock, Copy, ExternalLink } from 'lucide-react';

export function WorkflowExplainer() {
  const [showDetails, setShowDetails] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const sampleEdenPrompt = {
    "agent": "miyomi",
    "action": "generate_video",
    "content": {
      "market": "Will Fed cut rates in March 2025?",
      "position": "NO",
      "confidence": "78%",
      "edge": "+18% EV",
      "script": "The market's at 73% for March rate cuts. That's delusional...",
      "hook": "Everyone thinks the Fed's about to save them with rate cuts. They're dead wrong."
    },
    "style": {
      "format": "vertical-short",
      "duration": "45-60s",
      "mood": "analytical-contrarian",
      "variant": "lower-third-v2"
    }
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(JSON.stringify(sampleEdenPrompt, null, 2));
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/20">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-bold">📋 How MIYOMI's Workflow Actually Works</h3>
        {showDetails ? <ChevronUp /> : <ChevronDown />}
      </button>

      {showDetails && (
        <div className="mt-6 space-y-6">
          {/* Button Explanations */}
          <div className="space-y-4">
            <h4 className="font-bold text-yellow-400">What Each Button Does:</h4>
            
            <div className="border-l-2 border-green-500 pl-4">
              <h5 className="font-bold">🎯 Generate Smart Drop</h5>
              <p className="text-sm opacity-90">
                Triggers full AI workflow: analyzes markets → generates pick → creates video script
              </p>
              <div className="mt-2 text-xs bg-green-900/20 p-2 rounded">
                <span className="font-bold">Status:</span> ✅ Fully automated (shows thinking process)
              </div>
            </div>

            <div className="border-l-2 border-green-500 pl-4">
              <h5 className="font-bold">📊 Review Pending Picks</h5>
              <p className="text-sm opacity-90">
                Fetches picks from database that need human review before going live
              </p>
              <div className="mt-2 text-xs bg-green-900/20 p-2 rounded">
                <span className="font-bold">Status:</span> ✅ Connected to database
              </div>
            </div>

            <div className="border-l-2 border-green-500 pl-4">
              <h5 className="font-bold">🔄 Update Results</h5>
              <p className="text-sm opacity-90">
                Updates pick statuses in database (simulates market resolution for now)
              </p>
              <div className="mt-2 text-xs bg-green-900/20 p-2 rounded">
                <span className="font-bold">Status:</span> ✅ Database connected (mock resolution)
              </div>
            </div>
          </div>

          {/* Video Generation Flow */}
          <div className="border-t border-white/20 pt-6">
            <h4 className="font-bold text-red-400 mb-4">🎬 Video Generation: Current vs Future</h4>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-900/20 p-4 rounded">
                <h5 className="font-bold mb-2">Current (Manual)</h5>
                <ol className="text-sm space-y-1">
                  <li>1. MIYOMI generates script</li>
                  <li>2. <span className="text-yellow-400">Copy prompt below ↓</span></li>
                  <li>3. Paste into Eden API</li>
                  <li>4. Eden returns video URL</li>
                </ol>
              </div>
              
              <div className="bg-green-900/20 p-4 rounded opacity-50">
                <h5 className="font-bold mb-2">Future (Automated)</h5>
                <ol className="text-sm space-y-1">
                  <li>1. MIYOMI generates script</li>
                  <li>2. Auto-sends to Eden API</li>
                  <li>3. Eden generates video</li>
                  <li>4. Auto-publishes at scheduled time</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Eden Prompt Example */}
          <div className="border-t border-white/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold">🎨 Eden Video Generation Prompt</h4>
              <button
                onClick={copyPrompt}
                className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded hover:bg-white/20 transition text-sm"
              >
                {copiedPrompt ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
            <pre className="bg-black/50 p-4 rounded text-xs overflow-x-auto">
{JSON.stringify(sampleEdenPrompt, null, 2)}
            </pre>
            <div className="mt-2 text-xs opacity-75">
              <p>To generate video manually:</p>
              <ol className="ml-4 mt-1">
                <li>1. Copy this prompt</li>
                <li>2. Go to <a href="https://api.eden.art/docs" target="_blank" className="text-blue-400 underline">api.eden.art/docs</a></li>
                <li>3. Use the /agents/video endpoint</li>
                <li>4. Paste prompt and submit</li>
              </ol>
            </div>
          </div>

          {/* Schedule Info */}
          <div className="border-t border-white/20 pt-6">
            <h4 className="font-bold mb-4">⏰ Automated Schedule (When Live)</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/5 p-3 rounded">
                <div className="text-xl font-bold">11:00 ET</div>
                <div className="text-xs opacity-75">Morning Drop</div>
              </div>
              <div className="bg-white/5 p-3 rounded">
                <div className="text-xl font-bold">15:00 ET</div>
                <div className="text-xs opacity-75">Afternoon Drop</div>
              </div>
              <div className="bg-white/5 p-3 rounded">
                <div className="text-xl font-bold">21:00 ET</div>
                <div className="text-xs opacity-75">Evening Drop</div>
              </div>
            </div>
          </div>

          {/* Integration Status */}
          <div className="border-t border-white/20 pt-6">
            <h4 className="font-bold mb-4">🔌 Integration Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Claude SDK (Pick Generation)</span>
                <span className="text-green-500">✅ Working</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Market Data APIs</span>
                <span className="text-yellow-500">⚠️ Mock Data</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Eden Video API</span>
                <span className="text-red-500">❌ Manual Only</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database (Pick Storage)</span>
                <span className="text-green-500">✅ Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Scheduler (Cron Jobs)</span>
                <span className="text-yellow-500">⚠️ Ready, Not Running</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}