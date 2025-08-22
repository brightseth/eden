'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, Sparkles, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { saveCuration, publishCuration } from '@/lib/db/curations';

interface CurationResult {
  verdict: 'INCLUDE' | 'MAYBE' | 'EXCLUDE';
  weighted_total: number;
  i_see: string;
  scores_raw: {
    paris_photo_ready: number;
    ai_criticality: number;
    conceptual_strength: number;
    technical_excellence: number;
    cultural_dialogue: number;
  };
  rationales: Record<string, string>;
  prompt_patch?: string;
  flags?: string[];
}

interface NinaCuratorEmbedProps {
  agentName?: string;
}

export function NinaCuratorEmbed({ agentName = 'UNKNOWN' }: NinaCuratorEmbedProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [result, setResult] = useState<CurationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [agentDay, setAgentDay] = useState<number>(1);

  // Fetch agent's current day
  useEffect(() => {
    const fetchAgentDay = async () => {
      try {
        const res = await fetch(`/api/agents/${agentName.toLowerCase()}`);
        if (res.ok) {
          const data = await res.json();
          setAgentDay(data.agent?.day_count || 1);
        }
      } catch (error) {
        console.error('Failed to fetch agent day:', error);
      }
    };
    
    if (agentName !== 'UNKNOWN') {
      fetchAgentDay();
    }
  }, [agentName]);

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setResult(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);

    // Convert to base64 for API
    const base64Reader = new FileReader();
    base64Reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      
      try {
        const response = await fetch('/api/nina-critique', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageData: base64 }),
        });

        const data = await response.json();
        
        if (data.success) {
          setResult(data.evaluation);
          
          // Save curation to database
          try {
            await saveCuration({
              agent_name: agentName,
              image_data: base64,
              verdict: data.evaluation.verdict,
              weighted_total: data.evaluation.weighted_total,
              confidence: data.evaluation.confidence,
              scores: data.evaluation.scores_raw,
              rationales: data.evaluation.rationales,
              i_see: data.evaluation.i_see,
              prompt_patch: data.evaluation.prompt_patch,
              flags: data.evaluation.flags,
              gate_checks: data.evaluation.gate,
            });
          } catch (saveError) {
            console.error('Failed to save curation:', saveError);
          }
        } else {
          setError(data.error || 'Curation failed');
        }
      } catch (err) {
        setError('Failed to connect to Nina curator');
        console.error(err);
      } finally {
        setIsProcessing(false);
      }
    };
    base64Reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'INCLUDE': return 'text-green-400 border-green-400';
      case 'MAYBE': return 'text-yellow-400 border-yellow-400';
      case 'EXCLUDE': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      {!imagePreview && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragging ? 'border-purple-500 bg-purple-950/20' : 'border-gray-700 hover:border-gray-500'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
            <p className="text-gray-400 mb-2">Drop image here or click to browse</p>
            <p className="text-xs text-gray-500">Supports JPG, PNG, WebP</p>
          </label>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-64 object-cover rounded-lg"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm">Nina is evaluating...</p>
                </div>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4">
              {/* Verdict Banner */}
              <div className={`p-4 border rounded-lg ${getVerdictColor(result.verdict)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{result.verdict}</span>
                  <span className="text-sm">Score: {(result.weighted_total * 100).toFixed(1)}%</span>
                </div>
                <p className="text-sm opacity-80">{result.i_see}</p>
              </div>

              {/* Scores Breakdown */}
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Score Breakdown
                </h4>
                <div className="space-y-2">
                  {Object.entries(result.scores_raw).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        {key.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono w-8">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prompt Patch */}
              {result.prompt_patch && (
                <div className="bg-blue-950/30 border border-blue-800 rounded-lg p-4">
                  <h4 className="font-bold mb-2 text-blue-400">Improvement Suggestion</h4>
                  <p className="text-sm">{result.prompt_patch}</p>
                </div>
              )}

              {/* Flags */}
              {result.flags && result.flags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {result.flags.map((flag) => (
                    <span key={flag} className="px-2 py-1 bg-red-950 text-red-400 text-xs rounded">
                      {flag}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setImagePreview(null);
                    setResult(null);
                    setError(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
                >
                  Try Another
                </button>
                {result.verdict === 'INCLUDE' && (
                  <button 
                    onClick={async () => {
                      setIsPublishing(true);
                      try {
                        // Try to find next available day
                        const currentDay = agentDay + 1;
                        let workCreated = false;
                        let work = null;
                        
                        // Try up to 10 days ahead
                        for (let i = 0; i < 10; i++) {
                          const workResponse = await fetch('/api/works', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              agent_id: agentName.toLowerCase(),
                              day: currentDay + i,
                              media_url: imagePreview, // Already includes data:image prefix
                              prompt: result.i_see || 'Studio upload',
                              notes: JSON.stringify(result)
                            })
                          });
                          
                          if (workResponse.ok) {
                            work = await workResponse.json();
                            workCreated = true;
                            setAgentDay(currentDay + i); // Update the day counter
                            break;
                          } else if (workResponse.status === 409) {
                            // Day already exists, try next
                            continue;
                          } else {
                            throw new Error('Failed to create work');
                          }
                        }
                        
                        if (!workCreated || !work) {
                          throw new Error('Could not find available day slot');
                        }
                        
                        // Publish the work
                        const publishResponse = await fetch(`/api/works/${work.id}/publish`, {
                          method: 'POST'
                        });
                        
                        if (!publishResponse.ok) {
                          throw new Error('Failed to publish work');
                        }
                        
                        alert(`Successfully published to collection! (Day ${work.day})`);
                        
                        // Reset the form
                        setImagePreview(null);
                        setResult(null);
                        setError(null);
                        
                      } catch (error) {
                        console.error('Publish error:', error);
                        alert('Failed to publish. Try uploading via the main Upload page instead.');
                      } finally {
                        setIsPublishing(false);
                      }
                    }}
                    disabled={isPublishing}
                    className={`flex-1 px-4 py-2 rounded transition-colors ${
                      isPublishing 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-900 text-green-400 hover:bg-green-800'
                    }`}
                  >
                    {isPublishing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </span>
                    ) : (
                      'Publish to Collection'
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-950 border border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Make sure ANTHROPIC_API_KEY is set in .env.local
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}