'use client';

import { X, Sparkles, Eye, Trophy, ExternalLink } from 'lucide-react';

interface NinaCuratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName?: string;
}

export function NinaCuratorModal({ isOpen, onClose, agentName }: NinaCuratorModalProps) {
  if (!isOpen) return null;

  const handleOpenCurator = () => {
    window.open('https://design-critic-agent.vercel.app', '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">NINA ROEHRS CURATOR</h2>
            {agentName && (
              <p className="text-sm text-gray-400 mt-1">
                Testing for {agentName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-400 mb-6">
            AI-powered curation tool evaluating work against Paris Photo standards
          </p>

          {/* Mode badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-purple-900 text-purple-400 text-xs font-bold rounded flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              SINGLE MODE
            </span>
            <span className="px-3 py-1 bg-blue-900 text-blue-400 text-xs font-bold rounded flex items-center gap-1">
              <Eye className="w-3 h-3" />
              BATCH MODE
            </span>
            <span className="px-3 py-1 bg-green-900 text-green-400 text-xs font-bold rounded flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              PLAYOFF MODE
            </span>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 shrink-0"></div>
              <div>
                <span className="font-bold">Single Mode:</span> Individual image critique with detailed scoring
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 shrink-0"></div>
              <div>
                <span className="font-bold">Batch Mode:</span> Process up to 50 images simultaneously
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-1 h-1 bg-gray-500 rounded-full mt-1.5 shrink-0"></div>
              <div>
                <span className="font-bold">Playoff Mode:</span> Head-to-head ranking tournaments
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleOpenCurator}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Open Nina Curator
            <ExternalLink className="w-4 h-4" />
          </button>

          {/* Footer info */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
            <p>Powered by Anthropic Claude</p>
            <p className="mt-1">Paris Photo Standard Evaluation</p>
          </div>
        </div>
      </div>
    </div>
  );
}