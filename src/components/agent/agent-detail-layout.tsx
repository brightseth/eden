'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Agent, AgentOverview } from '@/types';
import { LinearOnboarding } from './linear-onboarding';
import { BrutalRealityDashboard } from './brutal-reality-dashboard';
import { TrainingJournal } from './training-journal';
import { DailyPracticeLog } from './daily-practice-log';
import { FinancialModel } from './financial-model';
import { GraduationGate } from './graduation-gate';

interface AgentDetailLayoutProps {
  agent: Agent;
  overview: AgentOverview;
}

type ViewMode = 'daily' | 'financial' | 'graduation' | 'setup' | 'reality' | 'journal';

export function AgentDetailLayout({ agent, overview }: AgentDetailLayoutProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  
  // Determine agent status based on metrics
  const isExternalCreator = true; // Would check actual metrics
  const isOperatorMode = true; // New operator playbook mode
  
  return (
    <div className="min-h-screen bg-eden-black text-eden-white">
      {/* Header */}
      <header className="border-b border-eden-white/20 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-mono text-2xl">{agent.name || 'UNTITLED-AGENT'}</h1>
            <p className="text-sm text-eden-gray">
              Day {agent.currentDay || 12} • Creator: {agent.walletAddress?.slice(0, 8) || 'kristi.eth'} • 
              {' '}Launch: {new Date('2024-12-20').toLocaleDateString()}
            </p>
          </div>
          <Link href="/" className="text-sm font-mono text-eden-gray hover:text-eden-white transition-colors">
            ← BACK TO ROSTER
          </Link>
        </div>
      </header>

      {/* View Tabs */}
      <nav className="border-b border-eden-white/20 px-6 py-3">
        <div className="container mx-auto flex gap-6">
          {/* Operator Playbook Views */}
          <button
            onClick={() => setViewMode('daily')}
            className={`text-sm font-mono pb-3 border-b-2 transition-colors ${
              viewMode === 'daily' 
                ? 'text-eden-white border-eden-white' 
                : 'text-eden-gray border-transparent hover:text-eden-white'
            }`}
          >
            DAILY PRACTICE
          </button>
          <button
            onClick={() => setViewMode('financial')}
            className={`text-sm font-mono pb-3 border-b-2 transition-colors ${
              viewMode === 'financial' 
                ? 'text-eden-white border-eden-white' 
                : 'text-eden-gray border-transparent hover:text-eden-white'
            }`}
          >
            FINANCIAL MODEL
          </button>
          <button
            onClick={() => setViewMode('graduation')}
            className={`text-sm font-mono pb-3 border-b-2 transition-colors ${
              viewMode === 'graduation' 
                ? 'text-eden-white border-eden-white' 
                : 'text-eden-gray border-transparent hover:text-eden-white'
            }`}
          >
            GRADUATION STATUS
          </button>
          
          <div className="flex-1" />
          
          {/* Original Views */}
          <button
            onClick={() => setViewMode('setup')}
            className={`text-sm font-mono pb-3 border-b-2 transition-colors ${
              viewMode === 'setup' 
                ? 'text-eden-white border-eden-white' 
                : 'text-eden-gray border-transparent hover:text-eden-white'
            }`}
          >
            SETUP
          </button>
          <button
            onClick={() => setViewMode('reality')}
            className={`text-sm font-mono pb-3 border-b-2 transition-colors ${
              viewMode === 'reality' 
                ? 'text-eden-white border-eden-white' 
                : 'text-eden-gray border-transparent hover:text-eden-white'
            }`}
          >
            REALITY CHECK
          </button>
          <button
            onClick={() => setViewMode('journal')}
            className={`text-sm font-mono pb-3 border-b-2 transition-colors ${
              viewMode === 'journal' 
                ? 'text-eden-white border-eden-white' 
                : 'text-eden-gray border-transparent hover:text-eden-white'
            }`}
          >
            JOURNAL
          </button>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto p-6">
        {/* Operator Playbook Views */}
        {viewMode === 'daily' && <DailyPracticeLog agentId={agent.id} />}
        {viewMode === 'financial' && <FinancialModel agentId={agent.id} />}
        {viewMode === 'graduation' && <GraduationGate agentId={agent.id} />}
        
        {/* Original Views */}
        {viewMode === 'setup' && <LinearOnboarding />}
        {viewMode === 'reality' && <BrutalRealityDashboard />}
        {viewMode === 'journal' && <TrainingJournal />}
      </main>

      {/* Quick Actions Footer */}
      <footer className="fixed bottom-0 w-full p-4 bg-eden-black border-t border-eden-white/20">
        <div className="container mx-auto flex gap-4">
          <button className="px-4 py-2 bg-red-500/10 border border-red-500 text-red-500 font-mono text-sm hover:bg-red-500/20 transition-colors">
            REPORT BLOCKER
          </button>
          <button className="px-4 py-2 bg-eden-white/10 border border-eden-white/20 font-mono text-sm hover:bg-eden-white/20 transition-colors">
            LOG TODAY'S PRACTICE
          </button>
          <button className="px-4 py-2 bg-green-500/10 border border-green-500 text-green-500 font-mono text-sm hover:bg-green-500/20 transition-colors">
            MARK PUBLISHED
          </button>
        </div>
      </footer>
    </div>
  );
}