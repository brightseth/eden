'use client';

import { useAgents } from '@/hooks/use-agents';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ChevronRight, Plus, Zap, Globe, Palette } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: agents, isLoading, error } = useAgents();

  if (error) {
    return (
      <div className="min-h-screen bg-eden-black text-eden-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-mono mb-4">SYSTEM ERROR</h1>
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load agents. Please check your connection and try again.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-eden-black text-eden-white">
      {/* Header */}
      <div className="border-b border-eden-white/10">
        <div className="container mx-auto py-12">
          <div className="text-center">
            <h1 className="text-4xl font-mono mb-4">EDEN AGENT ACADEMY</h1>
            <p className="text-eden-gray max-w-2xl mx-auto">
              SYSTEMATIC ONBOARDING FOR AUTONOMOUS ARTISTS. CONFIGURE, TRAIN, AND LAUNCH AI AGENTS ON THE EDEN PLATFORM.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            <div className="text-center p-4 bg-eden-white/5 rounded-lg">
              <Zap className="w-6 h-6 mx-auto mb-2 text-eden-gray" />
              <div className="text-2xl font-mono">{agents?.length || 0}</div>
              <div className="text-xs text-eden-gray">ACTIVE AGENTS</div>
            </div>
            <div className="text-center p-4 bg-eden-white/5 rounded-lg">
              <Globe className="w-6 h-6 mx-auto mb-2 text-eden-gray" />
              <div className="text-2xl font-mono">7</div>
              <div className="text-xs text-eden-gray">INTEGRATIONS</div>
            </div>
            <div className="text-center p-4 bg-eden-white/5 rounded-lg">
              <Palette className="w-6 h-6 mx-auto mb-2 text-eden-gray" />
              <div className="text-2xl font-mono">5</div>
              <div className="text-xs text-eden-gray">CREATIVE TOOLS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-12">
        <div className="max-w-4xl mx-auto">
          {/* Section Title */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-mono text-eden-gray">AGENT ROSTER</h2>
            <button className="text-sm font-mono px-3 py-1 bg-eden-white/10 hover:bg-eden-white/20 rounded transition-colors">
              + NEW AGENT
            </button>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 bg-eden-white/5 rounded-lg">
                  <Skeleton className="h-6 w-32 bg-eden-white/20 mb-2" />
                  <Skeleton className="h-4 w-48 bg-eden-white/10" />
                </div>
              ))}
            </div>
          ) : agents && agents.length > 0 ? (
            <div className="grid gap-4">
              {agents.map((agent: any) => {
                // Map old stage numbers to new stage names
                const stageMap: { [key: number]: string } = {
                  1: 'setup',
                  2: 'training', 
                  3: 'prelaunch',
                  4: 'launched'
                };
                const currentStage = stageMap[agent.currentStage] || 'setup';
                const setupProgress = agent.onboardingPercentage || 15;
                
                return (
                  <Link
                    key={agent.id}
                    href={`/agent/${agent.id}`}
                    className="block p-6 bg-eden-white/5 rounded-lg hover:bg-eden-white/10 transition-all hover:translate-x-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-mono text-xl mb-2">{agent.name}</h3>
                        <div className="flex items-center gap-6 text-sm text-eden-gray">
                          <span className="uppercase">STAGE: {currentStage}</span>
                          <span>{setupProgress}% COMPLETE</span>
                          {currentStage !== 'launched' && (
                            <span className="text-yellow-400">IN PROGRESS</span>
                          )}
                        </div>
                        {/* Progress Bar */}
                        <div className="mt-3 w-full bg-eden-white/10 rounded-full h-1">
                          <div 
                            className="bg-eden-white h-1 rounded-full transition-all"
                            style={{ width: `${setupProgress}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-eden-gray" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-eden-white/10 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-eden-gray" />
                </div>
                <h3 className="font-mono text-lg mb-2">NO AGENTS YET</h3>
                <p className="text-sm text-eden-gray mb-6">
                  Start your journey by creating your first autonomous artist.
                </p>
                <button className="px-6 py-3 bg-eden-white text-eden-black font-mono text-sm hover:bg-eden-white/90 transition-colors">
                  CREATE FIRST AGENT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Academy Info */}
        <div className="max-w-4xl mx-auto mt-16 pt-16 border-t border-eden-white/10">
          <h2 className="text-sm font-mono text-eden-gray mb-6">ACADEMY CURRICULUM</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-6 bg-eden-white/5 rounded-lg">
              <div className="text-2xl font-mono mb-2">01</div>
              <h3 className="font-mono mb-2">SETUP</h3>
              <p className="text-sm text-eden-gray">
                Establish identity and core capabilities. Profile, tools, and basic configuration.
              </p>
            </div>
            <div className="p-6 bg-eden-white/5 rounded-lg">
              <div className="text-2xl font-mono mb-2">02</div>
              <h3 className="font-mono mb-2">TRAINING</h3>
              <p className="text-sm text-eden-gray">
                Develop creative style and test capabilities. LoRA training and first creations.
              </p>
            </div>
            <div className="p-6 bg-eden-white/5 rounded-lg">
              <div className="text-2xl font-mono mb-2">03</div>
              <h3 className="font-mono mb-2">PRE-LAUNCH</h3>
              <p className="text-sm text-eden-gray">
                Connect platforms and configure revenue. Social integrations and monetization.
              </p>
            </div>
            <div className="p-6 bg-eden-white/5 rounded-lg">
              <div className="text-2xl font-mono mb-2">04</div>
              <h3 className="font-mono mb-2">LAUNCHED</h3>
              <p className="text-sm text-eden-gray">
                Live and operating autonomously. Creating, engaging, and earning independently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}