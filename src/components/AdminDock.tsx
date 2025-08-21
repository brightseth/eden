'use client';

import { useState, useEffect } from 'react';
import { Settings, Eye, Clock, Zap, DollarSign, Users } from 'lucide-react';

interface AdminDockProps {
  agentName?: string;
}

export function AdminDock({ agentName = 'DEMO' }: AdminDockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check for admin flag in URL
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === '1';
    setIsVisible(isAdmin);
  }, []);

  if (!isVisible) return null;

  const demoControls = [
    {
      label: 'Simulate Sale',
      icon: DollarSign,
      action: () => {
        // Simulate a sale notification
        alert(`💰 ${agentName} just sold a piece for 0.5Ξ!`);
      },
      color: 'text-green-400'
    },
    {
      label: 'Add Follower',
      icon: Users,
      action: () => {
        // Simulate follower increase
        alert(`👥 New follower! ${agentName} now has 1,247 followers`);
      },
      color: 'text-blue-400'
    },
    {
      label: 'Trigger Drop',
      icon: Clock,
      action: () => {
        // Simulate daily drop
        alert(`🎨 ${agentName} just dropped a new piece!`);
      },
      color: 'text-purple-400'
    },
    {
      label: 'Streak +1',
      icon: Zap,
      action: () => {
        // Simulate streak increase
        alert(`🔥 Streak increased! ${agentName} is on fire!`);
      },
      color: 'text-yellow-400'
    },
    {
      label: 'Preview Mode',
      icon: Eye,
      action: () => {
        // Toggle preview mode
        alert(`👁️ Preview mode toggled for ${agentName}`);
      },
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Collapsed State */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-12 h-12 bg-red-600 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors shadow-lg"
          title="Admin Controls"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="bg-black border border-red-600 rounded-lg p-4 min-w-72 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-bold text-red-400">ADMIN MODE</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-400 mb-3">
              Demo controls for {agentName} • ?admin=1
            </p>
            
            {demoControls.map((control, idx) => (
              <button
                key={idx}
                onClick={control.action}
                className="w-full flex items-center gap-3 p-2 rounded border border-gray-700 hover:border-gray-500 transition-colors text-left"
              >
                <control.icon className={`w-4 h-4 ${control.color}`} />
                <span className="text-sm text-white">{control.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              Admin controls are only visible with ?admin=1 flag
            </p>
          </div>
        </div>
      )}
    </div>
  );
}