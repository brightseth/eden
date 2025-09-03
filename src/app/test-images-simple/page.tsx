'use client';

export default function TestImagesSimplePage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Agent Image Test - Simple</h1>
      
      <div className="grid grid-cols-2 gap-8">
        {/* Abraham Section */}
        <div className="border border-white p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">ABRAHAM</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2 text-gray-400">Test 1: Placeholder API</p>
              <img 
                src="/api/placeholder/200/200?text=ABRAHAM" 
                alt="Abraham Placeholder"
                className="w-48 h-48 border border-white bg-gray-800"
              />
            </div>
            
            <div>
              <p className="text-sm mb-2 text-gray-400">Test 2: Registry API Direct</p>
              <img 
                src="https://eden-genesis-registry.vercel.app/api/agents/abraham/profile" 
                alt="Abraham from Registry"
                className="w-48 h-48 border border-white bg-gray-800"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const errorText = document.createElement('div');
                  errorText.textContent = 'Failed to load from Registry';
                  errorText.className = 'text-red-500 text-sm p-4 border border-red-500';
                  target.parentElement?.appendChild(errorText);
                }}
              />
            </div>

            <div>
              <p className="text-sm mb-2 text-gray-400">Test 3: Static SVG Pattern</p>
              <div className="w-48 h-48 border border-white bg-gray-900 flex items-center justify-center">
                <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                  <rect width="192" height="192" fill="#000"/>
                  <text x="96" y="96" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="24" fontFamily="monospace">
                    ABRAHAM
                  </text>
                  <circle cx="96" cy="60" r="30" fill="none" stroke="#fff" strokeWidth="2"/>
                  <line x1="96" y1="90" x2="96" y2="140" stroke="#fff" strokeWidth="2"/>
                  <line x1="96" y1="140" x2="70" y2="170" stroke="#fff" strokeWidth="2"/>
                  <line x1="96" y1="140" x2="122" y2="170" stroke="#fff" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Solienne Section */}
        <div className="border border-white p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">SOLIENNE</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm mb-2 text-gray-400">Test 1: Placeholder API</p>
              <img 
                src="/api/placeholder/200/200?text=SOLIENNE" 
                alt="Solienne Placeholder"
                className="w-48 h-48 border border-white bg-gray-800"
              />
            </div>
            
            <div>
              <p className="text-sm mb-2 text-gray-400">Test 2: Registry API Direct</p>
              <img 
                src="https://eden-genesis-registry.vercel.app/api/agents/solienne/profile" 
                alt="Solienne from Registry"
                className="w-48 h-48 border border-white bg-gray-800"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const errorText = document.createElement('div');
                  errorText.textContent = 'Failed to load from Registry';
                  errorText.className = 'text-red-500 text-sm p-4 border border-red-500';
                  target.parentElement?.appendChild(errorText);
                }}
              />
            </div>

            <div>
              <p className="text-sm mb-2 text-gray-400">Test 3: Static SVG Pattern</p>
              <div className="w-48 h-48 border border-white bg-gray-900 flex items-center justify-center">
                <svg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg">
                  <rect width="192" height="192" fill="#000"/>
                  <text x="96" y="96" textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="24" fontFamily="monospace">
                    SOLIENNE
                  </text>
                  <circle cx="96" cy="96" r="40" fill="none" stroke="#fff" strokeWidth="1" opacity="0.5"/>
                  <circle cx="96" cy="96" r="30" fill="none" stroke="#fff" strokeWidth="1" opacity="0.7"/>
                  <circle cx="96" cy="96" r="20" fill="none" stroke="#fff" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 border border-gray-600 bg-gray-900">
        <h3 className="text-xl font-bold mb-4 text-white">Test Results:</h3>
        <ul className="space-y-2 text-gray-300">
          <li>• If placeholder images show: Academy placeholder API is working</li>
          <li>• If Registry images show: Registry has profile images configured</li>
          <li>• If only SVG patterns show: We need to implement profile image generation</li>
        </ul>
      </div>

      <div className="mt-4 p-6 border border-gray-600 bg-gray-900">
        <h3 className="text-xl font-bold mb-4 text-white">Quick Data Check:</h3>
        <div className="space-y-2">
          <a href="/api/agents" target="_blank" className="block text-blue-400 hover:text-blue-300">
            → Check Academy /api/agents endpoint
          </a>
          <a href="https://eden-genesis-registry.vercel.app/api/v1/agents" target="_blank" className="block text-blue-400 hover:text-blue-300">
            → Check Registry /api/v1/agents endpoint
          </a>
          <a href="/api/agents/abraham" target="_blank" className="block text-blue-400 hover:text-blue-300">
            → Check Academy Abraham data
          </a>
          <a href="/api/agents/solienne" target="_blank" className="block text-blue-400 hover:text-blue-300">
            → Check Academy Solienne data
          </a>
        </div>
      </div>
    </div>
  );
}