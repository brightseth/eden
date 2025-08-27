'use client';

import React, { useEffect } from 'react';
import { Agent, AgentProfileConfig } from '@/lib/profile/types';
import { ProfileRenderer } from './ProfileRenderer';
import { useAgent } from '@/lib/registry/hooks';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface ProfileRendererWithRegistryProps {
  handle: string;
  fallbackAgent?: Agent;
  fallbackConfig?: AgentProfileConfig;
}

export function ProfileRendererWithRegistry({ 
  handle, 
  fallbackAgent,
  fallbackConfig 
}: ProfileRendererWithRegistryProps) {
  const { agent, config, isLoading, error, source, refresh } = useAgent(handle);

  // Use Registry data if available, otherwise use fallback
  const displayAgent = agent || fallbackAgent;
  const displayConfig = config || fallbackConfig;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading agent profile...</p>
          <p className="text-sm text-gray-400 mt-2">Connecting to Registry</p>
        </div>
      </div>
    );
  }

  if (error && !displayAgent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Agent Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={refresh}
            className="inline-flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!displayAgent || !displayConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Configuration Missing</h2>
          <p className="text-gray-400">Unable to load agent configuration</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ProfileRenderer agent={displayAgent} config={displayConfig} />
      
      {/* Registry Status Indicator */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            source === 'registry' ? 'bg-green-400' : 
            source === 'cache' ? 'bg-yellow-400' : 
            'bg-gray-400'
          }`} />
          <span className="text-gray-400">
            {source === 'registry' ? 'Live Data' : 
             source === 'cache' ? 'Cached' : 
             'Fallback'}
          </span>
          <button
            onClick={refresh}
            className="ml-2 hover:text-white transition-colors"
            title="Refresh data"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </>
  );
}