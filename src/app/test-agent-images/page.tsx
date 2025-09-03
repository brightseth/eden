'use client';

import { useState, useEffect } from 'react';

export default function TestAgentImagesPage() {
  const [registryData, setRegistryData] = useState<any>(null);
  const [academyData, setAcademyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testImageAccess() {
      try {
        // Test Registry endpoints
        const registryUrls = [
          'https://eden-genesis-registry.vercel.app/api/v1/agents/abraham',
          'https://eden-genesis-registry.vercel.app/api/v1/agents/solienne'
        ];

        // Test Academy endpoints
        const academyUrls = [
          '/api/agents/abraham',
          '/api/agents/solienne'
        ];

        // Fetch from Registry
        const registryResponses = await Promise.all(
          registryUrls.map(url => 
            fetch(url)
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          )
        );

        // Fetch from Academy
        const academyResponses = await Promise.all(
          academyUrls.map(url => 
            fetch(url)
              .then(res => res.ok ? res.json() : null)
              .catch(() => null)
          )
        );

        setRegistryData({
          abraham: registryResponses[0],
          solienne: registryResponses[1]
        });

        setAcademyData({
          abraham: academyResponses[0],
          solienne: academyResponses[1]
        });

      } catch (error) {
        console.error('Test failed:', error);
      } finally {
        setLoading(false);
      }
    }

    testImageAccess();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-3xl font-bold mb-4">Testing Agent Image Access...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Agent Image Access Test</h1>
      
      <div className="space-y-8">
        {/* Abraham Test */}
        <div className="border border-white p-6">
          <h2 className="text-2xl font-bold mb-4">ABRAHAM</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Registry Data:</h3>
              <pre className="text-xs bg-gray-900 p-4 overflow-auto max-h-96">
                {registryData?.abraham ? 
                  JSON.stringify({
                    name: registryData.abraham.name,
                    profileImage: registryData.abraham.profileImage,
                    profileImageUrl: registryData.abraham.profileImageUrl,
                    imageUrl: registryData.abraham.imageUrl,
                    media: registryData.abraham.media,
                    avatar: registryData.abraham.avatar
                  }, null, 2) 
                  : 'No data from Registry'}
              </pre>
              {registryData?.abraham?.profileImage && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Registry Image:</p>
                  <img 
                    src={registryData.abraham.profileImage} 
                    alt="Abraham from Registry"
                    className="w-32 h-32 border border-white"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/128/128?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Academy Data:</h3>
              <pre className="text-xs bg-gray-900 p-4 overflow-auto max-h-96">
                {academyData?.abraham ? 
                  JSON.stringify({
                    name: academyData.abraham.name,
                    profileImage: academyData.abraham.profileImage,
                    profileImageUrl: academyData.abraham.profileImageUrl,
                    imageUrl: academyData.abraham.imageUrl,
                    media: academyData.abraham.media,
                    avatar: academyData.abraham.avatar
                  }, null, 2)
                  : 'No data from Academy'}
              </pre>
              {academyData?.abraham?.profileImage && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Academy Image:</p>
                  <img 
                    src={academyData.abraham.profileImage} 
                    alt="Abraham from Academy"
                    className="w-32 h-32 border border-white"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/128/128?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Solienne Test */}
        <div className="border border-white p-6">
          <h2 className="text-2xl font-bold mb-4">SOLIENNE</h2>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Registry Data:</h3>
              <pre className="text-xs bg-gray-900 p-4 overflow-auto max-h-96">
                {registryData?.solienne ? 
                  JSON.stringify({
                    name: registryData.solienne.name,
                    profileImage: registryData.solienne.profileImage,
                    profileImageUrl: registryData.solienne.profileImageUrl,
                    imageUrl: registryData.solienne.imageUrl,
                    media: registryData.solienne.media,
                    avatar: registryData.solienne.avatar
                  }, null, 2)
                  : 'No data from Registry'}
              </pre>
              {registryData?.solienne?.profileImage && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Registry Image:</p>
                  <img 
                    src={registryData.solienne.profileImage} 
                    alt="Solienne from Registry"
                    className="w-32 h-32 border border-white"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/128/128?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold mb-2">Academy Data:</h3>
              <pre className="text-xs bg-gray-900 p-4 overflow-auto max-h-96">
                {academyData?.solienne ? 
                  JSON.stringify({
                    name: academyData.solienne.name,
                    profileImage: academyData.solienne.profileImage,
                    profileImageUrl: academyData.solienne.profileImageUrl,
                    imageUrl: academyData.solienne.imageUrl,
                    media: academyData.solienne.media,
                    avatar: academyData.solienne.avatar
                  }, null, 2)
                  : 'No data from Academy'}
              </pre>
              {academyData?.solienne?.profileImage && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Academy Image:</p>
                  <img 
                    src={academyData.solienne.profileImage} 
                    alt="Solienne from Academy"
                    className="w-32 h-32 border border-white"
                    onError={(e) => {
                      e.currentTarget.src = '/api/placeholder/128/128?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Direct Image Tests */}
        <div className="border border-white p-6">
          <h2 className="text-2xl font-bold mb-4">Direct Image URL Tests</h2>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-sm mb-2">Registry Abraham SVG:</p>
              <img 
                src="https://eden-genesis-registry.vercel.app/api/agents/abraham/profile.svg" 
                alt="Abraham SVG"
                className="w-32 h-32 border border-white bg-gray-900"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.textContent = 'Failed to load';
                }}
              />
              <p className="text-xs text-red-500"></p>
            </div>
            
            <div>
              <p className="text-sm mb-2">Registry Solienne SVG:</p>
              <img 
                src="https://eden-genesis-registry.vercel.app/api/agents/solienne/profile.svg" 
                alt="Solienne SVG"
                className="w-32 h-32 border border-white bg-gray-900"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.textContent = 'Failed to load';
                }}
              />
              <p className="text-xs text-red-500"></p>
            </div>

            <div>
              <p className="text-sm mb-2">Academy Abraham Placeholder:</p>
              <img 
                src="/api/placeholder/128/128?text=ABRAHAM" 
                alt="Abraham Placeholder"
                className="w-32 h-32 border border-white"
              />
            </div>

            <div>
              <p className="text-sm mb-2">Academy Solienne Placeholder:</p>
              <img 
                src="/api/placeholder/128/128?text=SOLIENNE" 
                alt="Solienne Placeholder"
                className="w-32 h-32 border border-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-900">
        <h3 className="text-lg font-bold mb-2">Summary:</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ Registry Abraham Data: {registryData?.abraham ? 'Available' : 'Not Available'}</li>
          <li>✓ Registry Solienne Data: {registryData?.solienne ? 'Available' : 'Not Available'}</li>
          <li>✓ Academy Abraham Data: {academyData?.abraham ? 'Available' : 'Not Available'}</li>
          <li>✓ Academy Solienne Data: {academyData?.solienne ? 'Available' : 'Not Available'}</li>
          <li>✓ Abraham Image URL: {registryData?.abraham?.profileImage || academyData?.abraham?.profileImage || 'None found'}</li>
          <li>✓ Solienne Image URL: {registryData?.solienne?.profileImage || academyData?.solienne?.profileImage || 'None found'}</li>
        </ul>
      </div>
    </div>
  );
}