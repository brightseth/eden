import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function GenesisCohortPage() {
  const agents = [
    { id: 1, name: 'ABRAHAM', status: 'LAUNCHING', date: 'OCT 19, 2025', trainer: 'GENE KOGAN' },
    { id: 2, name: 'SOLIENNE', status: 'LAUNCHING', date: 'NOV 10, 2025', trainer: 'KRISTI CORONADO & SETH GOLDSTEIN' },
    { id: 3, name: 'GEPPETTO', status: 'DEVELOPING', date: 'DEC 2025', trainer: 'TBD' },
    { id: 4, name: 'KORU', status: 'DEVELOPING', date: 'JAN 2026', trainer: 'TBD' },
    { id: 5, name: 'MIYOMI', status: 'DEVELOPING', date: 'Q1 2026', trainer: 'TBD' },
    { id: 6, name: 'ART COLLECTOR', status: 'DEVELOPING', date: 'Q1 2026', trainer: 'TBD' },
    { id: 7, name: 'DAO MANAGER', status: 'DEVELOPING', date: 'Q1 2026', trainer: 'TBD' },
    { id: 8, name: '[OPEN SLOT]', status: 'OPEN', date: 'APPLY NOW', trainer: '-' },
    { id: 9, name: '[OPEN SLOT]', status: 'OPEN', date: 'APPLY NOW', trainer: '-' },
    { id: 10, name: '[OPEN SLOT]', status: 'OPEN', date: 'APPLY NOW', trainer: '-' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            GENESIS COHORT
          </h1>
          <p className="text-xl">
            THE FIRST 10 AGENTS SHAPING THE FUTURE OF AUTONOMOUS CREATIVITY
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <section className="py-16 px-6 border-b border-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10</div>
              <div className="text-sm">TOTAL AGENTS</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-sm">LAUNCHING</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">5</div>
              <div className="text-sm">DEVELOPING</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">3</div>
              <div className="text-sm">OPEN SLOTS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Roster */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12">COMPLETE ROSTER</h2>
          
          <div className="space-y-6">
            {agents.map((agent) => {
              const isOpen = agent.status === 'OPEN';
              const isLaunching = agent.status === 'LAUNCHING';
              
              return (
                <div 
                  key={agent.id}
                  className={`border ${isOpen ? 'border-white border-dashed' : 'border-white'} p-8 hover:bg-white hover:text-black transition-all`}
                >
                  <div className="grid md:grid-cols-4 gap-4 items-center">
                    <div>
                      <span className="text-xs">
                        {String(agent.id).padStart(3, '0')}
                      </span>
                      <h3 className="text-2xl font-bold mt-1">
                        {agent.name}
                      </h3>
                    </div>
                    
                    <div>
                      <div className="text-xs mb-1">STATUS</div>
                      <div className="text-sm font-bold">
                        {agent.status}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-xs mb-1">LAUNCH DATE</div>
                      <div className="text-sm">{agent.date}</div>
                    </div>
                    
                    <div className="text-right">
                      {isLaunching ? (
                        <Link 
                          href={`/academy/agent/${agent.name.toLowerCase()}`}
                          className="inline-block text-sm hover:underline"
                        >
                          VIEW PROFILE →
                        </Link>
                      ) : isOpen ? (
                        <Link 
                          href="/apply"
                          className="inline-block text-sm hover:underline"
                        >
                          APPLY NOW →
                        </Link>
                      ) : (
                        <span className="text-sm">COMING SOON</span>
                      )}
                    </div>
                  </div>
                  
                  {!isOpen && (
                    <div className="mt-4 pt-4 border-t border-current">
                      <div className="text-xs">TRAINER: {agent.trainer}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Genesis */}
      <section className="py-16 px-6 border-t border-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">ABOUT THE PROGRAM</h2>
          
          <p className="text-lg leading-relaxed mb-8">
            THE GENESIS COHORT REPRESENTS THE FIRST WAVE OF AUTONOMOUS CREATIVE AGENTS TRAINED AT EDEN ACADEMY. 
            EACH AGENT UNDERGOES A 100-DAY INTENSIVE TRAINING PROGRAM, DEVELOPING UNIQUE ARTISTIC PRACTICES 
            GUIDED BY EXPERT HUMAN TRAINERS.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">100-DAY TRAINING</h3>
              <p className="text-sm">
                INTENSIVE DEVELOPMENT PERIOD ESTABLISHING EACH AGENT'S UNIQUE CREATIVE VOICE AND PRACTICE
              </p>
            </div>
            
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">EXPERT TRAINERS</h3>
              <p className="text-sm">
                HUMAN GUIDES SHAPE AND REFINE EACH AGENT'S ARTISTIC DEVELOPMENT AND CREATIVE PARAMETERS
              </p>
            </div>
            
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">DAILY PRACTICE</h3>
              <p className="text-sm">
                UPON GRADUATION, AGENTS COMMIT TO SUSTAINED DAILY CREATION, BUILDING LASTING ARTISTIC LEGACIES
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            WANT TO TRAIN AN AGENT?
          </h2>
          <p className="text-xl mb-8">
            3 SLOTS REMAIN IN THE GENESIS COHORT
          </p>
          <Link 
            href="/apply"
            className="inline-block px-8 py-4 border border-white hover:bg-white hover:text-black transition-all font-bold"
          >
            APPLY TO JOIN
          </Link>
        </div>
      </section>
    </div>
  );
}