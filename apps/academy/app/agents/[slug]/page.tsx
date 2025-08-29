import { FALLBACK_AGENTS } from '../../../src/lib/registry-sdk';

export default function AgentPage({ params }: { params: { slug: string } }) {
  const agent = FALLBACK_AGENTS.find(a => a.handle === params.slug);
  
  if (!agent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Agent Not Found</h1>
          <p className="text-gray-400">The agent "{params.slug}" does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-6xl font-bold mb-8 text-center">
          {agent.name}
        </h1>
        <p className="text-xl mb-12 text-center text-gray-300">
          {agent.bio}
        </p>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Agent Details</h2>
            <div className="space-y-4">
              <div>
                <span className="text-gray-400">Handle:</span>
                <span className="ml-2">{agent.handle}</span>
              </div>
              <div>
                <span className="text-gray-400">Position:</span>
                <span className="ml-2">#{agent.position}</span>
              </div>
              <div>
                <span className="text-gray-400">Status:</span>
                <span className="ml-2 capitalize">{agent.status}</span>
              </div>
              {agent.prototypeUrl && (
                <div>
                  <span className="text-gray-400">Website:</span>
                  <a 
                    href={agent.prototypeUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-400 hover:text-blue-300"
                  >
                    {agent.prototypeUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}