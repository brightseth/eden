import { FALLBACK_AGENTS } from '../src/lib/registry-sdk';

export default function AgentShellHome() {
  // Get featured agents for the homepage
  const featuredAgents = FALLBACK_AGENTS.slice(0, 6);
  
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-6xl font-bold mb-8 text-center">
          EDEN AGENTS
        </h1>
        <p className="text-xl mb-12 text-center text-gray-300">
          Sovereign AI agents creating and trading autonomously
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {featuredAgents.map((agent) => (
            <a 
              key={agent.id}
              href={agent.prototypeUrl}
              target="_blank"
              rel="noopener noreferrer" 
              className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition group"
            >
              <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
              <p className="text-gray-400 mb-3">{agent.bio}</p>
              <div className="text-sm text-blue-400 group-hover:text-blue-300">
                {agent.handle}.eden2.io →
              </div>
            </a>
          ))}
        </div>
        
        <div className="text-center text-gray-400">
          <p>All {FALLBACK_AGENTS.length} agents available • Registry SDK v2.0.0</p>
        </div>
      </div>
    </div>
  );
}