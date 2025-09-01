'use client';

import AgentShell from '@/components/AgentShell';
import { useAbrahamSnapshot, getCovenantStatus } from '@/features/abraham/adapters';
import { generateThesis, generateReflectionPrompts } from '@/features/abraham/presenters';
import AbrahamTerminal from '@/features/abraham/Terminal';

/**
 * Abraham Site - INSIGHT/PRACTICE/TERMINAL shell
 * Converted from monolithic to shell pattern following MIYOMI template
 */
export default function AbrahamSite() {
  const snapshot = useAbrahamSnapshot();
  
  // Generate recent works component
  const RecentWorksComponent = () => (
    <div className="grid md:grid-cols-2 gap-6">
      {snapshot.recentWorks.length > 0 ? (
        snapshot.recentWorks.slice(0, 4).map((work: any, i: number) => (
          <div key={work.id || i} className="border border-white/20 p-4">
            <div className="text-sm text-gray-400">WORK #{snapshot.totalWorks - i}</div>
            <div className="font-bold mt-1">{work.title || `Covenant Work ${i + 1}`}</div>
            <div className="text-xs text-gray-500 mt-2">
              {work.createdAt ? new Date(work.createdAt).toLocaleDateString() : 'Today'}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-2 border border-white/20 p-8 text-center text-gray-400">
          <div className="mb-2">Covenant works will appear here</div>
          <div className="text-xs">Daily creation begins October 19, 2024</div>
        </div>
      )}
    </div>
  );

  return (
    <AgentShell
      agentName="abraham"
      insight={{
        thesis: generateThesis(snapshot),
        confidence: snapshot.confidence,
        recentWorks: <RecentWorksComponent />
      }}
      practice={{
        outputsPerWeek: snapshot.outputsPerWeek,
        supporters: snapshot.supporters, 
        mrr: snapshot.mrr,
        prompts: generateReflectionPrompts(snapshot)
      }}
      Terminal={AbrahamTerminal}
    />
  );
}