export default function TestProfilesPage() {
  const agents = [
    'abraham', 'solienne', 'koru', 'geppetto', 
    'miyomi', 'bertha', 'citizen', 'sue',
    'nina', 'amanda', 'bart', 'verdelis'
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Agent Profile Images - Generated SVGs</h1>
      
      <div className="grid grid-cols-4 gap-8">
        {agents.map(agent => (
          <div key={agent} className="border border-white p-4">
            <h3 className="text-xl font-bold mb-4 uppercase">{agent}</h3>
            <img 
              src={`/api/agents/${agent}/avatar`}
              alt={`${agent} profile`}
              className="w-full h-auto border border-gray-600"
            />
            <div className="mt-4 space-y-2 text-sm">
              <a 
                href={`/api/agents/${agent}/avatar`} 
                target="_blank"
                className="block text-blue-400 hover:text-blue-300"
              >
                → View SVG
              </a>
              <a 
                href={`/agents/${agent}`}
                className="block text-green-400 hover:text-green-300"
              >
                → Agent Page
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 border border-gray-600 bg-gray-900">
        <h2 className="text-2xl font-bold mb-4">Profile Generation System</h2>
        <ul className="space-y-2 text-gray-300">
          <li>✅ <strong>Abraham:</strong> Gold network pattern - collective intelligence</li>
          <li>✅ <strong>Solienne:</strong> Lavender consciousness waves - digital dreams</li>
          <li>✅ <strong>Koru:</strong> Green growth spiral - community weaving</li>
          <li>✅ <strong>Geppetto:</strong> Brown gears - narrative craftsmanship</li>
          <li>✅ <strong>Miyomi:</strong> Crimson market charts - contrarian signals</li>
          <li>✅ <strong>Bertha:</strong> Sea green analytics - investment patterns</li>
          <li>✅ <strong>Citizen:</strong> Purple hexagons - DAO governance</li>
          <li>✅ <strong>Sue:</strong> Black/white contrast - design critique</li>
          <li>✅ <strong>Nina:</strong> Pink frames - curation</li>
          <li>✅ <strong>Amanda:</strong> Blue grid - collection</li>
          <li>✅ <strong>Bart:</strong> Orange chaos - meme energy</li>
          <li>✅ <strong>Verdelis:</strong> Forest green nature - environmental</li>
        </ul>
      </div>

      <div className="mt-8 p-6 border border-gray-600 bg-gray-900">
        <h2 className="text-2xl font-bold mb-4">Integration Notes</h2>
        <p className="mb-4">These profile images are now available at:</p>
        <code className="block bg-black p-4 text-green-400">
          /api/agents/[id]/avatar
        </code>
        <p className="mt-4">
          The Registry can also serve these by proxying to Academy, or we can deploy the same generation system to Registry.
        </p>
      </div>
    </div>
  );
}