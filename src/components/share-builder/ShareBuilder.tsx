'use client';

import { useState } from 'react';
import { Share2, Download, Copy, Check, Twitter, Instagram } from 'lucide-react';

interface ShareBuilderProps {
  creation: {
    id: string;
    title: string;
    image_url: string;
    agent_name: string;
    tags?: any;
  };
  onClose: () => void;
}

export function ShareBuilder({ creation, onClose }: ShareBuilderProps) {
  const [format, setFormat] = useState<'square' | 'story' | 'og'>('square');
  const [platform, setPlatform] = useState<'twitter' | 'instagram' | 'farcaster'>('twitter');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate caption based on platform
  const generateCaption = () => {
    const baseCaption = `"${creation.title}" by ${creation.agent_name}`;
    const tags = creation.tags?.taxonomy?.mood?.join(' ') || '';
    
    switch (platform) {
      case 'twitter':
        return `${baseCaption}\n\n${tags ? `#${tags.replace(/\s+/g, ' #')}` : ''} #EdenInstitute #AIArt`;
      case 'instagram':
        return `${baseCaption}\n.\n.\n.\n${tags ? `#${tags.replace(/\s+/g, ' #')}` : ''} #edeninstitute #aiart #digitalart #generativeart`;
      case 'farcaster':
        return `${baseCaption}\n\n/art /eden`;
      default:
        return baseCaption;
    }
  };

  // Copy caption to clipboard
  const copyCaption = async () => {
    const caption = generateCaption();
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate formatted image
  const generateImage = async () => {
    setIsGenerating(true);
    
    // In production, this would call an API to generate the formatted image
    // For now, we'll simulate with a timeout
    setTimeout(() => {
      setIsGenerating(false);
      // Download the image
      const link = document.createElement('a');
      link.href = creation.image_url;
      link.download = `${creation.agent_name}-${creation.id}-${format}.jpg`;
      link.click();
    }, 1500);
  };

  const formats = [
    { id: 'square' as const, label: 'Square (1:1)', dimensions: '1080×1080' },
    { id: 'story' as const, label: 'Story (9:16)', dimensions: '1080×1920' },
    { id: 'og' as const, label: 'OG Image (1.91:1)', dimensions: '1200×630' }
  ];

  const platforms = [
    { id: 'twitter' as const, label: 'Twitter', icon: Twitter },
    { id: 'instagram' as const, label: 'Instagram', icon: Instagram },
    { id: 'farcaster' as const, label: 'Farcaster', icon: Share2 }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-gray-950 border border-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            Share Builder
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preview */}
          <div>
            <h3 className="text-sm font-bold mb-3">Preview</h3>
            <div className={`bg-gray-900 rounded-lg overflow-hidden ${
              format === 'square' ? 'aspect-square' :
              format === 'story' ? 'aspect-[9/16]' :
              'aspect-[1.91/1]'
            }`}>
              <img 
                src={creation.image_url}
                alt={creation.title}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {formats.find(f => f.id === format)?.dimensions}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <h3 className="text-sm font-bold mb-3">Format</h3>
              <div className="space-y-2">
                {formats.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`w-full text-left px-4 py-2 rounded border transition-all ${
                      format === f.id 
                        ? 'bg-purple-900/20 border-purple-500 text-purple-400'
                        : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="font-bold">{f.label}</div>
                    <div className="text-xs text-gray-400">{f.dimensions}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <h3 className="text-sm font-bold mb-3">Platform</h3>
              <div className="flex gap-2">
                {platforms.map(p => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPlatform(p.id)}
                      className={`flex-1 px-4 py-2 rounded border transition-all flex items-center justify-center gap-2 ${
                        platform === p.id
                          ? 'bg-purple-900/20 border-purple-500 text-purple-400'
                          : 'bg-gray-900 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Caption */}
            <div>
              <h3 className="text-sm font-bold mb-3">Caption</h3>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                <pre className="text-sm whitespace-pre-wrap font-sans">
                  {generateCaption()}
                </pre>
              </div>
              <button
                onClick={copyCaption}
                className="mt-2 px-4 py-2 bg-gray-800 rounded text-sm hover:bg-gray-700 flex items-center gap-2 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Caption
                  </>
                )}
              </button>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={generateImage}
                disabled={isGenerating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}