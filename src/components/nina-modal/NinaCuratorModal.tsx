'use client';

import { X, Sparkles, Eye, Trophy } from 'lucide-react';

interface NinaCuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName?: string;
}

export function NinaCuratorModal({ isOpen, onClose, agentName }: NinaCuratorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-6xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">NINA ROEHRS CURATOR</h2>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-purple-900 text-purple-400 text-xs font-bold rounded flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                SINGLE MODE
              </span>
              <span className="px-2 py-1 bg-blue-900 text-blue-400 text-xs font-bold rounded flex items-center gap-1">
                <Eye className="w-3 h-3" />
                BATCH MODE
              </span>
              <span className="px-2 py-1 bg-green-900 text-green-400 text-xs font-bold rounded flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                PLAYOFF MODE
              </span>
            </div>
            {agentName && (
              <span className="text-sm text-gray-400">
                Testing for {agentName}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Iframe Content */}
        <div className="flex-1 relative">
          <iframe
            src="https://design-critic-agent.vercel.app"
            className="absolute inset-0 w-full h-full"
            title="Nina Curator Interface"
            allow="clipboard-write"
          />
          {/* Fallback message */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <div className="text-center p-8 bg-gray-800 rounded-lg pointer-events-auto">
              <p className="text-sm text-gray-400 mb-4">Having trouble with the embedded curator?</p>
              <a
                href="https://design-critic-agent.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Open in New Window
              </a>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gray-900 border-t border-gray-700 p-3 shrink-0">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div>
              <span className="font-bold text-white">SINGLE:</span> Individual critique · 
              <span className="font-bold text-white ml-2">BATCH:</span> Process up to 50 images · 
              <span className="font-bold text-white ml-2">PLAYOFF:</span> Head-to-head ranking
            </div>
            <div>
              Paris Photo Standard Evaluation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}