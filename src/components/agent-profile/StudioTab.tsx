'use client';

import { useState } from 'react';
import { Upload, BarChart3, Settings, ChevronRight, Inbox } from 'lucide-react';
import { NinaCuratorEmbed } from '@/components/studio/NinaCuratorEmbed';
import { ReviewBoard } from '@/components/review-board/ReviewBoard';

interface StudioTabProps {
  agentName: string;
}

export function StudioTab({ agentName }: StudioTabProps) {
  const [activeSection, setActiveSection] = useState<'review' | 'upload' | 'performance' | 'settings'>('review');

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Sidebar Navigation */}
      <div className="md:w-64 space-y-2">
        <button
          onClick={() => setActiveSection('review')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
            activeSection === 'review' 
              ? 'bg-gray-900 border border-gray-700' 
              : 'hover:bg-gray-950'
          }`}
        >
          <Inbox className="w-5 h-5 text-blue-400" />
          <div className="text-left flex-1">
            <div className="font-bold">Review Board</div>
            <div className="text-xs text-gray-400">Inbox & curation</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
        
        <button
          onClick={() => setActiveSection('upload')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
            activeSection === 'upload' 
              ? 'bg-gray-900 border border-gray-700' 
              : 'hover:bg-gray-950'
          }`}
        >
          <Upload className="w-5 h-5 text-purple-400" />
          <div className="text-left flex-1">
            <div className="font-bold">Upload & Curate</div>
            <div className="text-xs text-gray-400">Manage content pipeline</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
        
        <button
          onClick={() => setActiveSection('performance')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
            activeSection === 'performance' 
              ? 'bg-gray-900 border border-gray-700' 
              : 'hover:bg-gray-950'
          }`}
        >
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <div className="text-left flex-1">
            <div className="font-bold">Performance</div>
            <div className="text-xs text-gray-400">Metrics & analytics</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
        
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
            activeSection === 'settings' 
              ? 'bg-gray-900 border border-gray-700' 
              : 'hover:bg-gray-950'
          }`}
        >
          <Settings className="w-5 h-5 text-gray-400" />
          <div className="text-left flex-1">
            <div className="font-bold">Settings</div>
            <div className="text-xs text-gray-400">Agent configuration</div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeSection === 'review' && (
          <ReviewBoard agentName={agentName} />
        )}
        
        {activeSection === 'upload' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Upload & Curate with Nina</h3>
            
            {/* Nina Curator Integration */}
            <NinaCuratorEmbed agentName={agentName} />
            
            {/* Recent Curation History */}
            <div>
              <h4 className="font-bold mb-3">Recent Curations</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded" />
                    <div>
                      <div className="text-sm font-bold">Abstract Composition #42</div>
                      <div className="text-xs text-gray-400">2 hours ago</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-green-900 text-green-400 text-xs font-bold rounded">
                    INCLUDE
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded" />
                    <div>
                      <div className="text-sm font-bold">Digital Landscape Study</div>
                      <div className="text-xs text-gray-400">3 hours ago</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-yellow-900 text-yellow-400 text-xs font-bold rounded">
                    MAYBE
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-800 rounded" />
                    <div>
                      <div className="text-sm font-bold">Generative Pattern #7</div>
                      <div className="text-xs text-gray-400">5 hours ago</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 bg-red-900 text-red-400 text-xs font-bold rounded">
                    EXCLUDE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'performance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Performance Metrics</h3>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-950 border border-gray-800 p-4 rounded">
                <div className="text-2xl font-bold">87%</div>
                <div className="text-xs text-gray-400">Style Coherence</div>
              </div>
              <div className="bg-gray-950 border border-gray-800 p-4 rounded">
                <div className="text-2xl font-bold">12</div>
                <div className="text-xs text-gray-400">Daily Average</div>
              </div>
              <div className="bg-gray-950 border border-gray-800 p-4 rounded">
                <div className="text-2xl font-bold">23%</div>
                <div className="text-xs text-gray-400">Include Rate</div>
              </div>
              <div className="bg-gray-950 border border-gray-800 p-4 rounded">
                <div className="text-2xl font-bold">$847</div>
                <div className="text-xs text-gray-400">Daily Revenue</div>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-64 bg-gray-950 border border-gray-800 rounded p-4">
              <div className="h-full flex items-center justify-center text-gray-600">
                <BarChart3 className="w-16 h-16" />
              </div>
            </div>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Agent Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Style Prompt</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                  rows={4}
                  placeholder="Define the agent's artistic style..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Daily Target</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                  placeholder="10"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-2">Auto-publish Threshold</label>
                <select className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded focus:border-purple-500 focus:outline-none">
                  <option>Only INCLUDE verdicts</option>
                  <option>INCLUDE and MAYBE</option>
                  <option>All curated</option>
                  <option>Disabled</option>
                </select>
              </div>
              
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded hover:from-purple-700 hover:to-pink-700 transition-all">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}