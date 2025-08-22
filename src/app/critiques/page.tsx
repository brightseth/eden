'use client';

import { useState, useEffect } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import Image from 'next/image';

interface Critique {
  id: string;
  work_id: string;
  critic: string;
  verdict: 'INCLUDE' | 'MAYBE' | 'EXCLUDE';
  scores: any;
  rationale: string;
  flags: any;
  created_at: string;
  work?: {
    id: string;
    agent_id: string;
    day: number;
    media_url: string;
    state: string;
  };
}

export default function CritiquesPage() {
  const [critiques, setCritiques] = useState<Critique[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCritique, setSelectedCritique] = useState<Critique | null>(null);

  useEffect(() => {
    fetchCritiques();
  }, []);

  const fetchCritiques = async () => {
    try {
      const res = await fetch('/api/critiques');
      const data = await res.json();
      setCritiques(data.critiques || []);
    } catch (error) {
      console.error('Error fetching critiques:', error);
    } finally {
      setLoading(false);
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

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'INCLUDE': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'MAYBE': return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'EXCLUDE': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <UnifiedHeader />
      
      {/* Page Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  href="/inbox" 
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Inbox
                </Link>
              </div>
              <h1 className="text-3xl font-bold mb-2">Critique Results</h1>
              <p className="text-gray-400">
                Nina's AI analysis of submitted works. Review verdicts and feedback.
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">{critiques.length}</div>
              <div className="text-sm text-gray-400">Total Critiques</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critiques List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">Loading critiques...</div>
        ) : critiques.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No critiques yet</p>
            <p className="text-sm mt-2">Send works from the Inbox for AI critique</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {critiques.map((critique) => (
              <div 
                key={critique.id}
                className="bg-gray-950 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex gap-6">
                  {/* Image Preview */}
                  {critique.work?.media_url && (
                    <div className="w-32 h-32 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={critique.work.media_url}
                        alt="Work"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    </div>
                  )}
                  
                  {/* Critique Details */}
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          {getVerdictIcon(critique.verdict)}
                          <span className={`text-xl font-bold ${getVerdictColor(critique.verdict).split(' ')[0]}`}>
                            {critique.verdict}
                          </span>
                          {critique.work && (
                            <span className="text-sm text-gray-400">
                              {critique.work.agent_id} • Day {critique.work.day}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">
                          Critiqued {new Date(critique.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      
                      {/* Score */}
                      {critique.scores?.weighted_total !== undefined && (
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {(critique.scores.weighted_total * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-400">Overall Score</div>
                        </div>
                      )}
                    </div>

                    {/* Rationale */}
                    <div className="bg-gray-900 rounded p-3">
                      <p className="text-sm text-gray-300 line-clamp-3">
                        {critique.rationale.split('\n')[0]}
                      </p>
                    </div>

                    {/* Scores */}
                    {critique.scores && (
                      <div className="flex gap-4 text-xs">
                        {Object.entries(critique.scores)
                          .filter(([key]) => !['weighted_total', 'confidence'].includes(key))
                          .slice(0, 5)
                          .map(([key, value]) => (
                            <div key={key}>
                              <div className="text-gray-500">{key.replace(/_/g, ' ')}</div>
                              <div className="font-bold">{value as number}</div>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedCritique(
                          selectedCritique?.id === critique.id ? null : critique
                        )}
                        className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {selectedCritique?.id === critique.id ? 'Hide' : 'View'} Full Critique
                      </button>
                      
                      {critique.verdict === 'INCLUDE' && critique.work?.state !== 'published' && (
                        <button
                          onClick={async () => {
                            if (confirm('Publish this work to the collection?')) {
                              const res = await fetch(`/api/works/${critique.work_id}/publish`, {
                                method: 'POST'
                              });
                              if (res.ok) {
                                alert('Work published successfully!');
                                fetchCritiques();
                              } else {
                                alert('Failed to publish work');
                              }
                            }
                          }}
                          className="px-3 py-1 bg-green-900 text-green-400 hover:bg-green-800 rounded text-sm font-bold"
                        >
                          ✓ Publish to Collection
                        </button>
                      )}
                      
                      {critique.verdict === 'EXCLUDE' && critique.work?.state !== 'published' && (
                        <button
                          onClick={async () => {
                            if (confirm('Delete this work? This cannot be undone.')) {
                              const res = await fetch(`/api/works/${critique.work_id}`, {
                                method: 'DELETE'
                              });
                              if (res.ok) {
                                alert('Work deleted');
                                fetchCritiques();
                              } else {
                                alert('Failed to delete work');
                              }
                            }
                          }}
                          className="px-3 py-1 bg-red-900 text-red-400 hover:bg-red-800 rounded text-sm"
                        >
                          × Delete
                        </button>
                      )}
                      
                      {critique.work?.state === 'published' && (
                        <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded text-sm">
                          ✓ Published
                        </span>
                      )}
                    </div>

                    {/* Expanded Details */}
                    {selectedCritique?.id === critique.id && (
                      <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
                        <div>
                          <h4 className="font-bold mb-2">Full Rationale</h4>
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">
                            {critique.rationale}
                          </p>
                        </div>
                        
                        {critique.flags?.prompt_patch && (
                          <div className="bg-blue-950/30 border border-blue-800 rounded p-3">
                            <h4 className="font-bold text-blue-400 mb-1">Improvement Suggestion</h4>
                            <p className="text-sm">{critique.flags.prompt_patch}</p>
                          </div>
                        )}
                        
                        {critique.flags?.flags && critique.flags.flags.length > 0 && (
                          <div>
                            <h4 className="font-bold mb-2">Flags</h4>
                            <div className="flex flex-wrap gap-2">
                              {critique.flags.flags.map((flag: string) => (
                                <span key={flag} className="px-2 py-1 bg-red-950 text-red-400 text-xs rounded">
                                  {flag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}