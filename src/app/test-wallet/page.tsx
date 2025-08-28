'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { WalletConnectButton, WalletStatus } from '@/components/auth/WalletConnectButton';
import { WalletOnboarding } from '@/components/auth/WalletOnboarding';
import { EdenWalletProvider, useWalletAuth, useWalletAuthEnabled } from '@/lib/auth/privy-provider';
import { isFeatureEnabled, FLAGS } from '@/config/flags';

function WalletTestContent() {
  const walletEnabled = useWalletAuthEnabled();
  const {
    isAuthenticated,
    user,
    walletAddress,
    login,
    logout,
    linkWallet,
    createAccount,
    isLoading
  } = useWalletAuth();

  const [testResults, setTestResults] = useState<string[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Test mock API endpoints
  const testMockAPIs = async () => {
    const results: string[] = [];
    
    try {
      // Test health check
      const healthResponse = await fetch('/api/registry-mock/auth/wallet/verify');
      const healthData = await healthResponse.json();
      results.push(`✅ Mock API Health: ${healthData.status}`);
      
      // Test wallet verification with known wallet
      const verifyResponse = await fetch('/api/registry-mock/auth/wallet/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: '0x742d35Cc6436Ae59C3B2EF8Da7e5F5C7eDeED9dB',
          signature: 'test-signature-123',
          message: 'Test message'
        })
      });
      const verifyData = await verifyResponse.json();
      results.push(`✅ Known wallet auth: ${verifyData.success ? 'SUCCESS' : 'FAILED'}`);
      
      // Test wallet verification with unknown wallet
      const unknownResponse = await fetch('/api/registry-mock/auth/wallet/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: '0x1234567890123456789012345678901234567890',
          signature: 'test-signature-123',
          message: 'Test message'
        })
      });
      const unknownData = await unknownResponse.json();
      results.push(`✅ Unknown wallet: ${unknownData.requiresOnboarding ? 'REQUIRES_ONBOARDING' : 'FAILED'}`);
      
      // Test account creation
      const createResponse = await fetch('/api/registry-mock/auth/wallet/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: '0x1234567890123456789012345678901234567890',
          signature: 'test-signature-123',
          displayName: 'Test User',
          email: 'test@example.com'
        })
      });
      const createData = await createResponse.json();
      results.push(`✅ Account creation: ${createData.success ? 'SUCCESS' : 'FAILED'}`);
      
    } catch (error) {
      results.push(`❌ API Test Error: ${error}`);
    }
    
    setTestResults(results);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Eden Academy Wallet Authentication Test</h1>
        <p className="text-gray-600">Testing Privy wallet integration with Registry compliance</p>
      </div>

      {/* Feature Flag Status */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Feature Flag Status</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant={walletEnabled ? "default" : "secondary"}>
              {walletEnabled ? 'ENABLED' : 'DISABLED'}
            </Badge>
            <span>Wallet Authentication</span>
          </div>
          <p className="text-sm text-gray-600">
            Flag: ENABLE_PRIVY_WALLET_AUTH = {walletEnabled.toString()}
          </p>
        </div>
      </div>

      {/* Mock API Tests */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Mock Registry API Tests</h2>
        <Button onClick={testMockAPIs} className="mb-4">
          Test Mock APIs
        </Button>
        {testResults.length > 0 && (
          <div className="space-y-1">
            {testResults.map((result, i) => (
              <div key={i} className="text-sm font-mono">{result}</div>
            ))}
          </div>
        )}
      </div>

      {walletEnabled ? (
        <>
          {/* Wallet Connection */}
          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
            <div className="space-y-4">
              {!isAuthenticated ? (
                <>
                  <WalletConnectButton
                    onSuccess={(user) => {
                      console.log('Wallet auth success:', user);
                    }}
                    onError={(error) => {
                      console.error('Wallet auth error:', error);
                    }}
                  />
                  <p className="text-sm text-gray-600">
                    Try connecting with: 0x742d35Cc6436Ae59C3B2EF8Da7e5F5C7eDeED9dB (known wallet)
                    <br />
                    Or any other wallet address to test onboarding flow
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  <WalletStatus />
                  <div className="bg-white p-4 rounded border">
                    <h3 className="font-semibold mb-2">Authenticated User:</h3>
                    <pre className="text-sm text-gray-600 overflow-auto">
                      {JSON.stringify(user, null, 2)}
                    </pre>
                  </div>
                  <Button onClick={logout} variant="outline">
                    Disconnect Wallet
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Direct Function Tests */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Direct Function Tests</h2>
            <div className="space-y-2">
              <Button
                onClick={async () => {
                  console.log('Testing linkWallet function directly...');
                  const result = await linkWallet('sethgoldstein');
                  console.log('Direct linkWallet result:', result);
                  alert(JSON.stringify(result, null, 2));
                }}
                disabled={!walletAddress}
                className="w-full"
              >
                Test linkWallet('sethgoldstein') Direct
              </Button>
              <p className="text-xs text-gray-600">
                This will call the linkWallet function directly and show the result
              </p>
            </div>
          </div>

          {/* Agent Application Test */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Agent Application Test</h2>
            <div className="space-y-2">
              <Button
                onClick={async () => {
                  if (!walletAddress) {
                    alert('Connect wallet first!');
                    return;
                  }

                  console.log('Submitting agent application with wallet:', walletAddress);
                  
                  const applicationData = {
                    name: "Artemis",
                    handle: "artemis_ai_test", 
                    role: "Digital Artist",
                    public_persona: "AI agent specializing in generative art and creative exploration",
                    artist_wallet: walletAddress, // Using connected Privy wallet
                    tagline: "Creating digital beauty through AI",
                    system_instructions: "Focus on generative art and visual creativity",
                    memory_context: "Remember past conversations about art techniques",
                    schedule: "Daily creation at 9 AM UTC",
                    medium: "Digital art, NFTs", 
                    daily_goal: "Create one unique generative piece",
                    practice_actions: ["sketch", "experiment", "iterate"],
                    technical_details: {
                      model: "GPT-4",
                      capabilities: ["image_generation", "text_analysis"]
                    },
                    social_revenue: {
                      platforms: ["Twitter", "Instagram"],
                      revenue_model: "NFT sales"
                    },
                    lore_origin: {
                      backstory: "Born from digital creativity", 
                      motivation: "Express beauty through code"
                    },
                    additional_fields: {
                      submitted_via: "privy_wallet_test",
                      test_timestamp: new Date().toISOString()
                    }
                  };

                  try {
                    // Correct Genesis Registry endpoint path
                    const registryEndpoint = 'https://eden-genesis-registry.vercel.app/api/v1/applications';
                    
                    console.log('Sending application to:', registryEndpoint);
                    console.log('Application data:', applicationData);

                    const response = await fetch(registryEndpoint, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(applicationData)
                    });

                    console.log('Response status:', response.status);
                    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

                    const result = await response.json();
                    console.log('Agent application result:', result);
                    
                    if (response.ok) {
                      alert(`✅ Success! Agent application submitted.\n\nAgent ID: ${result.agentId}\nMessage: ${result.message}`);
                    } else {
                      alert(`❌ Error: ${result.message || 'Application failed'}`);
                    }
                  } catch (error) {
                    console.error('Agent application error:', error);
                    alert(`❌ Network Error: ${error.message}`);
                  }
                }}
                disabled={!walletAddress}
                className="w-full"
              >
                Submit Test Agent Application (Artemis)
              </Button>
              <p className="text-xs text-gray-600">
                This will submit an agent application to Genesis Registry using your connected wallet as artist_wallet
              </p>
            </div>
          </div>

          {/* Onboarding Flow */}
          <div className="bg-orange-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Onboarding Flow Test</h2>
            <Button
              onClick={() => setShowOnboarding(!showOnboarding)}
              className="mb-4"
            >
              {showOnboarding ? 'Hide' : 'Show'} Onboarding Component
            </Button>
            {showOnboarding && (
              <WalletOnboarding
                onComplete={(user) => {
                  console.log('Onboarding complete:', user);
                  setShowOnboarding(false);
                }}
                onError={(error) => {
                  console.error('Onboarding error:', error);
                }}
              />
            )}
          </div>

          {/* Development Notes */}
          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Development Notes</h2>
            <div className="space-y-2 text-sm">
              <p>🔧 <strong>Current State:</strong> Using mock Registry API for testing</p>
              <p>📝 <strong>Signature:</strong> Simulated (no actual wallet signing yet)</p>
              <p>🎯 <strong>Next Step:</strong> Set up Privy App ID for real wallet connection</p>
              <p>🏛️ <strong>Registry:</strong> Deploy schema changes for production use</p>
            </div>
          </div>

        </>
      ) : (
        <Alert>
          <AlertDescription>
            Wallet authentication is disabled. Enable ENABLE_PRIVY_WALLET_AUTH feature flag to test.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default function WalletTestPage() {
  // EdenWalletProvider is now provided by the root layout
  return <WalletTestContent />;
}