'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Download, Share2, Sparkles, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface VideoGenerationState {
  status: 'creating-session' | 'generating' | 'completed' | 'failed';
  sessionId?: string;
  videoUrl?: string;
  posterUrl?: string;
  artisticStatement?: string;
  progress?: number;
  error?: string;
  concept?: any;
  edenProject?: any;
  demoMode?: boolean;
  warning?: string;
}

export default function VideoGenerationPage() {
  const params = useParams();
  const router = useRouter();
  const conceptId = params.conceptId as string;
  
  const [generationState, setGenerationState] = useState<VideoGenerationState>({
    status: 'creating-session'
  });

  useEffect(() => {
    if (conceptId) {
      startVideoGeneration();
    }
  }, [conceptId]);

  async function startVideoGeneration() {
    try {
      setGenerationState(prev => ({ ...prev, status: 'creating-session' }));
      
      // Step 1: Start the cinematic video generation
      const response = await fetch('/api/miyomi/generate-video-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conceptId,
          style: 'cinematic',
          useDynamicFramework: true
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to start video generation');
      }

      setGenerationState(prev => ({
        ...prev,
        status: 'generating',
        sessionId: data.sessionId,
        concept: data.concept,
        edenProject: data.edenProject,
        progress: 0,
        demoMode: data.demoMode,
        warning: data.warning
      }));

      // Step 2: Poll for completion
      pollGenerationStatus(data.sessionId);
      
    } catch (error) {
      console.error('Video generation failed:', error);
      setGenerationState(prev => ({
        ...prev,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }

  async function pollGenerationStatus(sessionId: string) {
    const maxAttempts = 60; // 5 minutes
    let attempts = 0;
    
    const poll = async () => {
      try {
        const response = await fetch(`/api/miyomi/video-status/${sessionId}`);
        const data = await response.json();
        
        setGenerationState(prev => ({
          ...prev,
          progress: Math.min(90, (attempts / maxAttempts) * 100)
        }));

        if (data.status === 'completed' && data.videoUrl) {
          setGenerationState(prev => ({
            ...prev,
            status: 'completed',
            videoUrl: data.videoUrl,
            posterUrl: data.posterUrl,
            artisticStatement: data.artisticStatement,
            progress: 100
          }));
          return;
        }
        
        if (data.status === 'failed') {
          throw new Error(data.error || 'Video generation failed');
        }
        
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          throw new Error('Generation timeout');
        }
        
      } catch (error) {
        setGenerationState(prev => ({
          ...prev,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Polling failed'
        }));
      }
    };
    
    poll();
  }

  const getStatusIcon = () => {
    switch (generationState.status) {
      case 'creating-session':
      case 'generating':
        return <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (generationState.status) {
      case 'creating-session':
        return 'Creating Eden session...';
      case 'generating':
        return 'Generating cinematic video...';
      case 'completed':
        return 'Video generation completed!';
      case 'failed':
        return 'Generation failed';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">🎬 Cinematic Video Generation</h1>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          
          {/* Status Card */}
          <div className="bg-white/5 backdrop-blur rounded-xl p-8 mb-8 border border-white/10">
            <div className="text-center">
              {getStatusIcon()}
              <h2 className="text-xl font-semibold mt-4 mb-2">{getStatusText()}</h2>
              
              {generationState.status === 'generating' && (
                <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${generationState.progress || 0}%` }}
                  ></div>
                </div>
              )}
              
              {generationState.concept && (
                <div className="text-left mt-6 p-4 bg-black/30 rounded-lg">
                  <h3 className="font-semibold text-purple-400 mb-2">Concept</h3>
                  <p className="text-lg font-bold mb-2">{generationState.concept.title}</p>
                  <p className="text-gray-300 text-sm">{generationState.concept.contrarian_angle}</p>
                </div>
              )}
              
              {generationState.edenProject && (
                <div className="text-left mt-4 p-4 bg-black/30 rounded-lg">
                  <h3 className="font-semibold text-purple-400 mb-2">Artistic Statement</h3>
                  <p className="text-gray-300 text-sm">{generationState.edenProject.artisticStatement}</p>
                </div>
              )}

              {generationState.demoMode && (
                <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300">
                    🎭 <strong>Demo Mode:</strong> Eden API not configured. Showcasing the Dynamic Narrative Video Framework generation process.
                  </p>
                  {generationState.warning && (
                    <p className="text-blue-400 text-sm mt-2">{generationState.warning}</p>
                  )}
                </div>
              )}

              {generationState.error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300">{generationState.error}</p>
                  <button
                    onClick={startVideoGeneration}
                    className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition"
                  >
                    Retry Generation
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Video Player */}
          {generationState.status === 'completed' && generationState.videoUrl && (
            <div className="bg-white/5 backdrop-blur rounded-xl p-8 border border-white/10">
              <h3 className="text-xl font-semibold mb-4">Generated Video</h3>
              
              <div className="relative rounded-lg overflow-hidden bg-black/50">
                <video
                  controls
                  poster={generationState.posterUrl}
                  className="w-full aspect-video"
                >
                  <source src={generationState.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Actions */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              {/* Metadata */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                {generationState.concept && (
                  <div className="p-4 bg-black/30 rounded-lg">
                    <h4 className="font-semibold text-purple-400 mb-2">Concept Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Title:</strong> {generationState.concept.title}</div>
                      <div><strong>Urgency:</strong> {generationState.concept.urgencyScore}/100</div>
                      <div><strong>Audience:</strong> {generationState.concept.targetAudience}</div>
                      <div><strong>Est. Views:</strong> {generationState.concept.estimatedViews?.toLocaleString()}</div>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-black/30 rounded-lg">
                  <h4 className="font-semibold text-purple-400 mb-2">Generation Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Framework:</strong> Dynamic Narrative (9-phase)</div>
                    <div><strong>Style:</strong> Cinematic</div>
                    <div><strong>Session ID:</strong> {generationState.sessionId}</div>
                    <div><strong>Status:</strong> Completed</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}