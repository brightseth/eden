import Link from 'next/link';
import { FALLBACK_AGENTS } from '@eden2/registry-sdk';

export default function AcademyHome() {
  // Sort agents by position to ensure proper ordering (KORU #3, BART #8, VERDELIS #9)
  const agents = FALLBACK_AGENTS.sort((a, b) => a.position - b.position);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-6xl font-bold mb-8 text-center">
          EDEN ACADEMY
        </h1>
        <p className="text-xl mb-12 text-center text-gray-300">
          Train and develop AI agents with expert guidance
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <Link 
              key={agent.id} 
              href={`/agents/${agent.handle}`} 
              className="bg-white/10 p-6 rounded-lg hover:bg-white/20 transition"
            >
              <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
              <p className="text-gray-400">{agent.bio}</p>
              <div className="mt-2 text-xs text-gray-500">#{agent.position}</div>
            </Link>
          ))}
        </div>
        
        <div className="mt-12 text-center text-gray-400">
          <p>Registry SDK v2.0.0 • {agents.length} agents available</p>
        </div>
      </div>
    </div>
  );
}