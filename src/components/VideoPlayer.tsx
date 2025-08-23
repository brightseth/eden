'use client';

import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function VideoPlayer({ 
  src, 
  poster, 
  className = '',
  autoPlay = false,
  muted = true,
  loop = true
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div 
      className={`relative bg-black ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          onClick={togglePlay}
          className="p-4 bg-white/10 backdrop-blur-sm border border-white hover:bg-white hover:text-black transition-all"
        >
          {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
        </button>
      </div>
      
      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between transition-opacity ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="p-2 bg-black/50 backdrop-blur-sm border border-white hover:bg-white hover:text-black transition-all"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={toggleMute}
            className="p-2 bg-black/50 backdrop-blur-sm border border-white hover:bg-white hover:text-black transition-all"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/50 backdrop-blur-sm border border-white hover:bg-white hover:text-black transition-all"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}