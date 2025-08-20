'use client';

import { useState } from 'react';
import { Operations } from './Operations';
import { Financials } from './Financials';
import { Progress } from './Progress';
import { Tokens } from './Tokens';
import { Activity, DollarSign, TrendingUp, Coins } from 'lucide-react';

interface CreatorToolsInterfaceProps {
  agentName: string;
  graduationDate: string;
}

export function CreatorToolsInterface({ agentName, graduationDate }: CreatorToolsInterfaceProps) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const tools = [
    {
      id: 'operations',
      name: 'OPERATIONS',
      description: 'Daily practice tracker, system health, automation',
      icon: Activity,
      status: 'active',
      component: Operations
    },
    {
      id: 'financials',
      name: 'FINANCIALS',
      description: 'Revenue, treasury, costs, token distribution',
      icon: DollarSign,
      status: 'active',
      component: Financials
    },
    {
      id: 'progress',
      name: 'PROGRESS',
      description: 'Academy status, graduation checklist, performance',
      icon: TrendingUp,
      status: 'active',
      component: Progress
    },
    {
      id: 'tokens',
      name: 'TOKENS',
      description: 'Holder analytics, distribution, liquidity',
      icon: Coins,
      status: 'pending',
      component: Tokens
    }
  ];

  if (selectedTool) {
    const tool = tools.find(t => t.id === selectedTool);
    if (tool) {
      const ToolComponent = tool.component;
      return (
        <div>
          {/* Header with back button */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-800">
            <button 
              onClick={() => setSelectedTool(null)}
              className="px-4 py-2 border border-gray-600 hover:border-white transition-colors text-sm"
            >
              ← BACK TO TOOLS
            </button>
            <div className="flex items-center gap-3">
              <tool.icon className="w-5 h-5 text-gray-400" />
              <div>
                <h3 className="text-xl font-bold">{tool.name}</h3>
                <p className="text-sm text-gray-500">{tool.description}</p>
              </div>
            </div>
          </div>
          
          {/* Tool Component */}
          <ToolComponent 
            agentName={agentName} 
            graduationDate={graduationDate}
          />
        </div>
      );
    }
  }

  // Tools Grid View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-gray-950 border border-gray-800">
        <h2 className="text-xl font-bold mb-2">CREATOR TOOLS</h2>
        <p className="text-sm text-gray-400">
          Private operator dashboard for managing {agentName}'s academy journey and operations
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool) => (
          <div 
            key={tool.id}
            className="p-6 border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer group"
            onClick={() => setSelectedTool(tool.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <tool.icon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
              <div className={`w-2 h-2 rounded-full ${
                tool.status === 'active' ? 'bg-green-400 animate-pulse' :
                tool.status === 'complete' ? 'bg-blue-400' :
                'bg-gray-600'
              }`} />
            </div>
            <h3 className="text-sm font-bold tracking-wider mb-2">{tool.name}</h3>
            <p className="text-xs text-gray-500 mb-4">{tool.description}</p>
            <div className="text-xs text-gray-600 uppercase tracking-wider">
              {tool.status === 'active' ? 'MONITORING' :
               tool.status === 'complete' ? 'CONFIGURED' :
               'LAUNCHES DAY 100'}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-950 border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">TODAY\'S REVENUE</p>
          <p className="text-lg font-bold text-green-400">
            {agentName === 'ABRAHAM' ? '0.67 ETH' : '$1,250'}
          </p>
        </div>
        <div className="p-4 bg-gray-950 border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">STREAK</p>
          <p className="text-lg font-bold text-orange-400">
            {agentName === 'ABRAHAM' ? '95 days' : '88 days'}
          </p>
        </div>
        <div className="p-4 bg-gray-950 border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">HOLDERS</p>
          <p className="text-lg font-bold">127</p>
        </div>
        <div className="p-4 bg-gray-950 border border-gray-800">
          <p className="text-xs text-gray-500 mb-1">SYSTEM</p>
          <p className="text-lg font-bold text-green-400">HEALTHY</p>
        </div>
      </div>
    </div>
  );
}