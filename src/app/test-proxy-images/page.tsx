'use client';

import { useState, useEffect } from 'react';

export default function TestProxyImages() {
  const [serverStatus, setServerStatus] = useState('Checking...');

  useEffect(() => {
    // Check if server is accessible
    fetch('/api/proxy-image?url=' + encodeURIComponent('https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/abraham/everydays/0001/image.jpg'))
      .then(r => {
        if (r.ok) {
          setServerStatus('✅ Proxy is working!');
        } else {
          setServerStatus(`⚠️ Proxy returned status: ${r.status}`);
        }
      })
      .catch(e => {
        setServerStatus('❌ Cannot reach proxy server');
      });
  }, []);

  // Test URLs
  const abrahamUrl = 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/abraham/everydays/0001/image.jpg';
  const solienneUrl = 'https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/eden/solienne/generations/1734.png';

  // Create proxy URLs
  const abrahamProxyUrl = `/api/proxy-image?url=${encodeURIComponent(abrahamUrl)}`;
  const solienneProxyUrl = `/api/proxy-image?url=${encodeURIComponent(solienneUrl)}`;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Image Proxy Test</h1>
      
      <div className="mb-8 p-4 bg-gray-900 rounded">
        <h2 className="text-xl mb-2">Status: {serverStatus}</h2>
        <p className="text-gray-300">The proxy fetches images server-side to bypass browser blocking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl mb-4 text-green-400">Through Proxy (Should Work)</h2>
          
          <div className="mb-4">
            <h3 className="text-sm text-gray-400 mb-2">Abraham #0001 (Proxied)</h3>
            <img 
              src={abrahamProxyUrl}
              alt="Abraham Proxy"
              className="w-full h-48 object-cover border-2 border-green-500"
              onLoad={() => console.log('✅ Abraham loaded via proxy')}
              onError={() => console.log('❌ Abraham failed via proxy')}
            />
            <p className="text-xs text-gray-500 mt-1">Via: /api/proxy-image</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 mb-2">Solienne #1734 (Proxied)</h3>
            <img 
              src={solienneProxyUrl}
              alt="Solienne Proxy"  
              className="w-full h-48 object-cover border-2 border-green-500"
              onLoad={() => console.log('✅ Solienne loaded via proxy')}
              onError={() => console.log('❌ Solienne failed via proxy')}
            />
            <p className="text-xs text-gray-500 mt-1">Via: /api/proxy-image</p>
          </div>
        </div>

        <div>
          <h2 className="text-xl mb-4 text-red-400">Direct URLs (Will Be Blocked)</h2>
          
          <div className="mb-4">
            <h3 className="text-sm text-gray-400 mb-2">Abraham #0001 (Direct)</h3>
            <img 
              src={abrahamUrl}
              alt="Abraham Direct"
              className="w-full h-48 object-cover border-2 border-red-500"
              onLoad={() => console.log('✅ Abraham loaded directly')}
              onError={() => console.log('❌ Abraham blocked directly')}
            />
            <p className="text-xs text-gray-500 mt-1">Direct Supabase URL</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-400 mb-2">Solienne #1734 (Direct)</h3>
            <img 
              src={solienneUrl}
              alt="Solienne Direct"
              className="w-full h-48 object-cover border-2 border-red-500"
              onLoad={() => console.log('✅ Solienne loaded directly')}
              onError={() => console.log('❌ Solienne blocked directly')}
            />
            <p className="text-xs text-gray-500 mt-1">Direct Supabase URL</p>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-900 rounded">
        <h3 className="font-bold mb-2">Direct Proxy Links:</h3>
        <div className="space-y-2 text-sm">
          <a 
            href={abrahamProxyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block text-blue-400 hover:underline break-all"
          >
            Abraham via proxy →
          </a>
          <a 
            href={solienneProxyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-400 hover:underline break-all"
          >
            Solienne via proxy →
          </a>
        </div>
      </div>
    </div>
  );
}