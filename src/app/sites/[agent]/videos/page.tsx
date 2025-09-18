'use client';

/**
 * Agent Video Generation Site Interface
 * Public video generation interface following three-tier architecture
 */

import React, { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Video, Sparkles, Clock, Play,
  Download, Share, ExternalLink
} from 'lucide-react';
import VideoPromptGenerator from '@/components/video/video-prompt-generator';
import { getAgentVideoProfile, getSupportedVideoAgents } from '@/lib/video/agent-profiles';
import { FEATURE_FLAGS } from '@/config/flags';

interface AgentVideosPageProps {
  params: Promise<{
    agent: string;
  }>;
}

interface GeneratedVideo {
  id: string;
  url: string;
  concept: string;
  template: string;
  duration: number;
  generatedAt: Date;
  metadata: any;
}

export default function AgentVideosPage({ params }: AgentVideosPageProps) {
  const router = useRouter();
  const [agent, setAgent] = useState<string>('');
  const [agentProfile, setAgentProfile] = useState<any>(null);

  // Extract params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setAgent(resolvedParams.agent);

      const supportedAgents = getSupportedVideoAgents();
      const profile = getAgentVideoProfile(resolvedParams.agent);

      if (!supportedAgents.includes(resolvedParams.agent) || !profile) {
        notFound();
        return;
      }

      setAgentProfile(profile);
    };

    resolveParams();
  }, [params]);

  if (!agent || !agentProfile) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-black dark:text-white">Loading...</div>
      </div>
    );
  }

  // Component state
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([]);
  const [showGenerator, setShowGenerator] = useState(true);

  // Load previously generated videos from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`${agent}-generated-videos`);
    if (stored) {
      try {
        const videos = JSON.parse(stored).map((v: any) => ({
          ...v,
          generatedAt: new Date(v.generatedAt)
        }));
        setGeneratedVideos(videos);
      } catch (error) {
        console.error('Error loading stored videos:', error);
      }
    }
  }, [agent]);

  // Handle new video generation
  const handleVideoGenerated = (videoUrl: string, metadata: any) => {
    const newVideo: GeneratedVideo = {
      id: `${agent}-${Date.now()}`,
      url: videoUrl,
      concept: metadata.config.concept || metadata.config.template,
      template: metadata.config.template,
      duration: metadata.config.duration,
      generatedAt: new Date(),
      metadata
    };

    const updatedVideos = [newVideo, ...generatedVideos].slice(0, 10); // Keep last 10
    setGeneratedVideos(updatedVideos);

    // Store in localStorage
    localStorage.setItem(`${agent}-generated-videos`, JSON.stringify(updatedVideos));

    // Switch to gallery view
    setShowGenerator(false);
  };

  // Share video
  const shareVideo = async (video: GeneratedVideo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${agentProfile.name} Video: ${video.concept}`,
          text: `Check out this AI-generated video by ${agentProfile.name}`,
          url: video.url
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(video.url);
      // Could show a toast notification here
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-white bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/sites/${agent}`}
                className="flex items-center gap-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-bold">BACK TO {agentProfile.name}</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowGenerator(!showGenerator)}
                className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition-colors ${
                  showGenerator
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
                }`}
              >
                <Video className="w-4 h-4" />
                {showGenerator ? 'VIEW GALLERY' : 'CREATE NEW'}
              </button>
            </div>
          </div>

          <div className="mt-4">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              {agentProfile.name} VIDEO STUDIO
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              AI-powered video generation for {agentProfile.domain} •
              Eden Universal Template • {agentProfile.personalityTraits.tone.toUpperCase()} perspective
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {showGenerator ? (
          /* Generator Interface */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">
                CREATE NEW VIDEO
              </h2>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-black dark:text-white">EDEN UNIVERSAL TEMPLATE</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  100-word narrative structure: Hook (20) → Development (30) → Revelation (25) → Resonance (25)
                  <br />
                  Optimized for {agentProfile.personalityTraits.energy} energy, {agentProfile.personalityTraits.tone} tone
                </p>
              </div>
            </div>

            <VideoPromptGenerator
              agentSlug={agent}
              onVideoGenerated={handleVideoGenerated}
              showAdvanced={true}
            />
          </div>
        ) : (
          /* Video Gallery */
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                  VIDEO GALLERY
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {generatedVideos.length} videos generated • Last 10 shown
                </p>
              </div>

              {generatedVideos.length === 0 && (
                <button
                  onClick={() => setShowGenerator(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  <Video className="w-5 h-5" />
                  CREATE FIRST VIDEO
                </button>
              )}
            </div>

            {generatedVideos.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2">
                  No videos yet
                </h3>
                <p className="text-gray-400 dark:text-gray-500 mb-6">
                  Generate your first {agentProfile.name} video using the Eden Universal Template
                </p>
                <button
                  onClick={() => setShowGenerator(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  <Sparkles className="w-5 h-5" />
                  START CREATING
                </button>
              </div>
            ) : (
              /* Video Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedVideos.map((video) => (
                  <div
                    key={video.id}
                    className="bg-white dark:bg-black border border-gray-200 dark:border-white rounded-lg overflow-hidden group"
                  >
                    {/* Video Thumbnail/Player */}
                    <div className="aspect-video bg-black relative">
                      <video
                        src={video.url}
                        className="w-full h-full object-cover"
                        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'%3E%3Crect width='320' height='180' fill='%23000'/%3E%3Ctext x='160' y='90' text-anchor='middle' dy='.3em' fill='white' font-family='Arial' font-size='18'%3E{agentProfile.name}%3C/text%3E%3C/svg%3E"
                        onMouseEnter={(e) => {
                          e.currentTarget.play();
                          e.currentTarget.muted = true;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                    </div>

                    {/* Video Info */}
                    <div className="p-4">
                      <h4 className="font-bold text-black dark:text-white mb-2 line-clamp-2">
                        {video.concept.length > 50
                          ? video.concept.substring(0, 50) + '...'
                          : video.concept
                        }
                      </h4>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDuration(video.duration)}
                        </div>
                        <div className="text-xs">
                          {video.template.replace('-', ' ').toUpperCase()}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        {video.generatedAt.toLocaleDateString()} at {video.generatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-black dark:border-white text-black dark:text-white text-sm font-bold rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          VIEW
                        </a>
                        <button
                          onClick={() => shareVideo(video)}
                          className="flex items-center justify-center px-3 py-2 border border-black dark:border-white text-black dark:text-white rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                          <Share className="w-4 h-4" />
                        </button>
                        <a
                          href={video.url}
                          download
                          className="flex items-center justify-center px-3 py-2 border border-black dark:border-white text-black dark:text-white rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feature Notice */}
      {!FEATURE_FLAGS.ENABLE_EDEN2038_INTEGRATION && (
        <div className="fixed bottom-6 right-6 max-w-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-yellow-800 dark:text-yellow-200 text-sm">
                DEMO MODE
              </div>
              <div className="text-yellow-700 dark:text-yellow-300 text-xs mt-1">
                Video generation uses demo URLs. Enable EDEN2038_INTEGRATION for live generation.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}