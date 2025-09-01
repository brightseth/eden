'use client';

import { useState, useEffect } from 'react';
import { 
  Play, Upload, Download, RefreshCw, 
  Video, Zap, Sparkles, BarChart3,
  CheckCircle, XCircle, Clock, AlertCircle,
  Palette
} from 'lucide-react';

interface GeneratedVideo {
  id: string;
  url: string;
  taskId: string;
  status: 'processing' | 'completed' | 'failed';
  prompt: string;
  style: string;
  format: string;
  createdAt: string;
  thumbnail?: string;
  poster?: string;
  statement?: string;
  metadata?: any;
}

interface VideoGeneratorProps {
  pickId?: string;
  onVideoGenerated?: (video: GeneratedVideo) => void;
}

export default function VideoGenerator({ pickId, onVideoGenerated }: VideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<'fast' | 'creative' | 'analytical'>('fast');
  const [format, setFormat] = useState<'short' | 'long'>('short');
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [pollingTasks, setPollingTasks] = useState<Set<string>>(new Set());

  // Load existing videos on mount
  useEffect(() => {
    loadRecentVideos();
  }, []);

  // Poll for processing videos
  useEffect(() => {
    if (pollingTasks.size === 0) return;

    const interval = setInterval(async () => {
      const taskIds = Array.from(pollingTasks);
      
      for (const taskId of taskIds) {
        try {
          const response = await fetch(`/api/miyomi/generate-video?taskId=${taskId}`);
          const data = await response.json();
          
          if (data.status?.status === 'completed') {
            // Update video status and URL
            setVideos(prev => prev.map(video => 
              video.taskId === taskId 
                ? { 
                    ...video, 
                    status: 'completed', 
                    url: data.status.output?.output_video || video.url 
                  }
                : video
            ));
            
            setPollingTasks(prev => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });
          } else if (data.status?.status === 'failed') {
            setVideos(prev => prev.map(video =>
              video.taskId === taskId
                ? { ...video, status: 'failed' }
                : video
            ));
            
            setPollingTasks(prev => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });
          }
        } catch (error) {
          console.error('Error polling task:', taskId, error);
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [pollingTasks]);

  async function loadRecentVideos() {
    try {
      const response = await fetch('/api/miyomi/generate-video');
      const data = await response.json();
      
      if (data.videos) {
        setVideos(data.videos);
        
        // Start polling for any processing videos
        const processingTasks = data.videos
          .filter((v: GeneratedVideo) => v.status === 'processing')
          .map((v: GeneratedVideo) => v.taskId);
          
        if (processingTasks.length > 0) {
          setPollingTasks(new Set(processingTasks));
        }
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    }
  }

  async function generateVideo() {
    if (!prompt.trim() && !pickId) {
      alert('Please enter a prompt or select a pick');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/miyomi/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickId,
          prompt: prompt.trim(),
          style,
          format,
          useArtisticFramework: (style as string) === 'artistic'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const newVideo = data.video;
        setVideos(prev => [newVideo, ...prev]);
        
        // Start polling if video is still processing
        if (newVideo.status === 'processing') {
          setPollingTasks(prev => new Set([...prev, newVideo.taskId]));
        }
        
        if (onVideoGenerated) {
          onVideoGenerated(newVideo);
        }
        
        // Clear prompt for next generation
        if (!pickId) {
          setPrompt('');
        }
      } else {
        throw new Error(data.error || 'Video generation failed');
      }
    } catch (error) {
      console.error('Error generating video:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  }

  function getStyleIcon(style: string) {
    switch (style) {
      case 'fast':
        return <Zap className="w-4 h-4" />;
      case 'creative':
        return <Sparkles className="w-4 h-4" />;
      case 'analytical':
        return <BarChart3 className="w-4 h-4" />;
      case 'artistic':
        return <Palette className="w-4 h-4" />;
      default:
        return <Video className="w-4 h-4" />;
    }
  }

  return (
    <div className="space-y-6">
      {/* Generation Controls */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Video className="w-6 h-6 text-red-500" />
          Generate Video Content
        </h3>

        {!pickId && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Video Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the market analysis video you want to create..."
              className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
              rows={3}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Generation Style</label>
            <div className="space-y-2">
              {[
                { value: 'fast', label: 'Fast Generation', desc: 'Quick turnaround, good quality' },
                { value: 'creative', label: 'Creative Mode', desc: 'Higher quality, longer processing' },
                { value: 'analytical', label: 'Data-Driven', desc: 'Chart-focused, professional' },
                { value: 'artistic', label: 'Artistic Framework', desc: 'Dynamic narrative, cinematic quality, multi-phase creation' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value={option.value}
                    checked={style === option.value}
                    onChange={(e) => setStyle(e.target.value as any)}
                    className="text-red-500 focus:ring-red-500"
                  />
                  <div className="flex items-center gap-2">
                    {getStyleIcon(option.value)}
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-400">{option.desc}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Video Format</label>
            <div className="space-y-2">
              {[
                { value: 'short', label: 'Short Form (9:16)', desc: 'TikTok, YouTube Shorts, Instagram' },
                { value: 'long', label: 'Landscape (16:9)', desc: 'YouTube, Twitter, general sharing' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value={option.value}
                    checked={format === option.value}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="text-red-500 focus:ring-red-500"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-400">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generateVideo}
          disabled={isGenerating || (!prompt.trim() && !pickId)}
          className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              Generate Video
            </>
          )}
        </button>
      </div>

      {/* Generated Videos */}
      {videos.length > 0 && (
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Generated Videos</h3>
            <button
              onClick={loadRecentVideos}
              className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {videos.slice(0, 10).map((video) => (
              <div key={video.id} className="border border-white/20 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(video.status)}
                    <div>
                      <div className="font-medium">
                        {video.style.charAt(0).toUpperCase() + video.style.slice(1)} • {video.format}
                      </div>
                      <div className="text-sm text-gray-400">
                        {new Date(video.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {video.status === 'completed' && video.url && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(video.url, '_blank')}
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-1 text-sm"
                      >
                        <Play className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => {
                          const a = document.createElement('a');
                          a.href = video.url;
                          a.download = `miyomi-video-${video.id}.mp4`;
                          a.click();
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1 text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  )}
                </div>
                
                {video.prompt && (
                  <div className="text-sm text-gray-300 bg-black/30 rounded p-2 mt-2">
                    {video.prompt}
                  </div>
                )}

                {video.poster && (
                  <div className="mt-3">
                    <img 
                      src={video.poster} 
                      alt="Video poster"
                      className="w-full max-w-sm rounded-lg border border-white/20"
                    />
                  </div>
                )}

                {video.statement && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-yellow-400 mb-2">Artist Statement</div>
                    <div className="text-sm text-gray-300 bg-black/30 rounded p-3 whitespace-pre-line">
                      {video.statement}
                    </div>
                  </div>
                )}

                {video.metadata && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-blue-400 mb-2">Project Metadata</div>
                    <div className="text-xs text-gray-400 bg-black/20 rounded p-2">
                      <div><strong>Title:</strong> {video.metadata.title}</div>
                      <div><strong>Concept:</strong> {video.metadata.coreConcept}</div>
                      <div><strong>Emotional Frequency:</strong> {video.metadata.emotionalFrequency?.primary} / {video.metadata.emotionalFrequency?.secondary}</div>
                    </div>
                  </div>
                )}
                
                {video.status === 'processing' && (
                  <div className="text-sm text-yellow-400 mt-2">
                    Video is being processed... This may take a few minutes.
                  </div>
                )}
                
                {video.status === 'failed' && (
                  <div className="text-sm text-red-400 mt-2">
                    Video generation failed. Please try again.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}