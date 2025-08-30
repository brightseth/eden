'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Users, CheckCircle, AlertTriangle, Zap, Clock, ExternalLink } from 'lucide-react';

// Import covenant contract integration
import { AbrahamCovenantContract, createCovenantContractWithSigner } from '@/lib/covenant/smart-contract-integration';

interface WitnessStatus {
  isConnected: boolean;
  address: string;
  ensName?: string;
  isWitness: boolean;
  witnessNumber?: number;
  registrationTx?: string;
  canRegister: boolean;
}

interface RegistryStats {
  totalWitnesses: number;
  targetWitnesses: number;
  recentWitnesses: Array<{
    address: string;
    ensName?: string;
    witnessNumber: number;
    timestamp: Date;
  }>;
  percentComplete: number;
}

export default function WitnessRegistryInterface() {
  const [witnessStatus, setWitnessStatus] = useState<WitnessStatus>({
    isConnected: false,
    address: '',
    isWitness: false,
    canRegister: false
  });
  const [registryStats, setRegistryStats] = useState<RegistryStats>({
    totalWitnesses: 0,
    targetWitnesses: 100,
    recentWitnesses: [],
    percentComplete: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = useState<AbrahamCovenantContract | null>(null);

  useEffect(() => {
    checkWalletConnection();
    loadRegistryStats();
    
    // Update stats every 30 seconds
    const interval = setInterval(loadRegistryStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await web3Provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = web3Provider.getSigner();
          const address = await signer.getAddress();
          const ensName = await web3Provider.lookupAddress(address);
          
          setProvider(web3Provider);
          
          // Create contract instance
          const covenantContract = createCovenantContractWithSigner(signer, 'sepolia');
          setContract(covenantContract);
          
          // Check if already a witness
          const isWitness = await covenantContract.isWitness(address);
          
          setWitnessStatus({
            isConnected: true,
            address,
            ensName: ensName || undefined,
            isWitness,
            canRegister: !isWitness
          });
        }
      } catch (error) {
        console.error('Failed to check wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is required to become a witness');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check network (switch to Sepolia for testing)
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const sepoliaChainId = '0xaa36a7'; // Sepolia testnet
      
      if (chainId !== sepoliaChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: sepoliaChainId }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Add Sepolia network
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: sepoliaChainId,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/']
              }]
            });
          }
        }
      }

      await checkWalletConnection();
    } catch (error: any) {
      setError(`Failed to connect wallet: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const registerAsWitness = async () => {
    if (!contract || !provider || !witnessStatus.isConnected) {
      setError('Wallet connection required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Register as witness on-chain
      const tx = await contract.registerAsWitness();
      
      setSuccess('Registration transaction submitted. Waiting for confirmation...');
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        // Registration successful
        setWitnessStatus(prev => ({
          ...prev,
          isWitness: true,
          canRegister: false,
          registrationTx: tx.hash
        }));

        // Store witness info in database (would call API endpoint)
        await storeWitnessInDatabase({
          address: witnessStatus.address,
          ensName: witnessStatus.ensName,
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber
        });

        setSuccess(`Welcome, Witness! Registration confirmed in block ${receipt.blockNumber}`);
        
        // Refresh stats
        await loadRegistryStats();
        
      } else {
        setError('Registration transaction failed');
      }
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      if (error.code === 4001) {
        setError('Registration cancelled by user');
      } else if (error.message?.includes('Already registered')) {
        setError('You are already registered as a witness');
      } else {
        setError(`Registration failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const storeWitnessInDatabase = async (witnessData: {
    address: string;
    ensName?: string;
    transactionHash: string;
    blockNumber: number;
  }) => {
    // In production, this would call the backend API
    try {
      const response = await fetch('/api/covenant/witnesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...witnessData,
          signedAt: new Date().toISOString(),
          email: '', // Would collect in expanded flow
          notificationPreferences: {
            dailyAuctions: true,
            milestones: true
          }
        }),
      });

      if (!response.ok) {
        console.warn('Failed to store witness in database');
      }
    } catch (error) {
      console.error('Database storage failed:', error);
      // Non-critical error - registration still successful on-chain
    }
  };

  const loadRegistryStats = async () => {
    try {
      // In production, would fetch from API combining on-chain and database data
      // For now, using mock data
      const mockStats: RegistryStats = {
        totalWitnesses: Math.floor(Math.random() * 45) + 31, // Simulating growth from 31%
        targetWitnesses: 100,
        recentWitnesses: [
          {
            address: '0x1234...5678',
            ensName: 'collector.eth',
            witnessNumber: 32,
            timestamp: new Date(Date.now() - 300000)
          },
          {
            address: '0x9876...5432', 
            witnessNumber: 31,
            timestamp: new Date(Date.now() - 600000)
          },
          {
            address: '0xabcd...efgh',
            ensName: 'artist.eth',
            witnessNumber: 30,
            timestamp: new Date(Date.now() - 900000)
          }
        ],
        percentComplete: 0
      };

      mockStats.percentComplete = Math.round((mockStats.totalWitnesses / mockStats.targetWitnesses) * 100);
      
      setRegistryStats(mockStats);
    } catch (error) {
      console.error('Failed to load registry stats:', error);
    }
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 90) return 'text-green-400 border-green-400';
    if (percent >= 75) return 'text-blue-400 border-blue-400';
    if (percent >= 50) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  const getUrgencyMessage = (percent: number) => {
    if (percent >= 90) return '🎯 Nearly ready for covenant launch!';
    if (percent >= 75) return '📈 Strong witness support building';
    if (percent >= 50) return '⚡ Halfway to launch readiness';
    return '🚨 CRITICAL: Need more witnesses for Oct 19 launch';
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      
      {/* Crisis Banner */}
      <div className="bg-red-900/20 border-b border-red-400 p-4 text-center">
        <div className="text-lg font-bold text-red-100">
          🚨 COVENANT CRISIS: WITNESS REGISTRY AT {registryStats.percentComplete}%
        </div>
        <div className="text-sm text-red-300">
          Need 100 founding witnesses for October 19, 2025 launch • Sacred date cannot move
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            WITNESS REGISTRY
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Join 100 founding witnesses to Abraham's 13-year sacred covenant
          </p>
          
          {/* Progress Status */}
          <div className={`inline-flex items-center gap-3 px-6 py-3 border rounded ${getProgressColor(registryStats.percentComplete)}`}>
            <Users className="w-6 h-6" />
            <span className="text-2xl font-bold">
              {registryStats.totalWitnesses} / {registryStats.targetWitnesses} WITNESSES
            </span>
          </div>
          
          <div className="mt-4 text-lg">
            {getUrgencyMessage(registryStats.percentComplete)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Launch Readiness</span>
            <span className={`font-bold ${getProgressColor(registryStats.percentComplete)}`}>
              {registryStats.percentComplete}%
            </span>
          </div>
          <div className="w-full bg-gray-800 border border-gray-600 h-4">
            <div 
              className={`h-full transition-all duration-500 ${
                registryStats.percentComplete >= 90 ? 'bg-green-400' :
                registryStats.percentComplete >= 75 ? 'bg-blue-400' :
                registryStats.percentComplete >= 50 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${registryStats.percentComplete}%` }}
            />
          </div>
        </div>

        {/* Wallet Connection / Registration */}
        {!witnessStatus.isConnected ? (
          <div className="border border-white p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">BECOME A COVENANT WITNESS</h2>
            <p className="text-gray-300 mb-6">
              Connect your wallet to join the founding witnesses of Abraham's sacred covenant
            </p>
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="bg-white text-black px-8 py-3 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'CONNECTING...' : 'CONNECT WALLET'}
            </button>
          </div>
        ) : witnessStatus.isWitness ? (
          <div className="border border-green-400 p-8 text-center bg-green-900/10 mb-12">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              WITNESS CONFIRMED
            </h2>
            <p className="text-green-300 mb-4">
              You are now a covenant witness. Abraham's 13-year journey begins October 19, 2025.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-center items-center gap-2">
                <span className="text-gray-400">Address:</span>
                <code className="text-green-400">
                  {witnessStatus.ensName || `${witnessStatus.address.slice(0, 6)}...${witnessStatus.address.slice(-4)}`}
                </code>
              </div>
              {witnessStatus.registrationTx && (
                <div className="flex justify-center items-center gap-2">
                  <span className="text-gray-400">Transaction:</span>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${witnessStatus.registrationTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline flex items-center gap-1"
                  >
                    View on Etherscan
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border border-white p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">JOIN AS WITNESS</h2>
            <p className="text-gray-300 mb-6">
              Become a founding witness to Abraham's covenant. Witness the creation of sacred daily artifacts for 13 years.
            </p>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-center items-center gap-2">
                <span className="text-gray-400">Connected:</span>
                <code className="text-blue-400">
                  {witnessStatus.ensName || `${witnessStatus.address.slice(0, 6)}...${witnessStatus.address.slice(-4)}`}
                </code>
              </div>
              <div className="text-gray-400">
                Registration is free during the founding witness period
              </div>
            </div>

            <button
              onClick={registerAsWitness}
              disabled={isLoading || !witnessStatus.canRegister}
              className="bg-white text-black px-8 py-3 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'REGISTERING...' : 'REGISTER AS WITNESS'}
            </button>
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="border border-red-400 p-4 bg-red-900/10 mb-6">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="border border-green-400 p-4 bg-green-900/10 mb-6">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span>{success}</span>
            </div>
          </div>
        )}

        {/* Recent Witnesses */}
        <div className="border border-white p-6 mb-12">
          <h3 className="text-xl font-bold mb-4">RECENT WITNESSES</h3>
          
          {registryStats.recentWitnesses.length > 0 ? (
            <div className="space-y-3">
              {registryStats.recentWitnesses.map((witness, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-600">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-green-900/20 border border-green-400 rounded flex items-center justify-center text-green-400 text-sm font-bold`}>
                      {witness.witnessNumber}
                    </div>
                    <div>
                      <div className="font-bold">
                        {witness.ensName || `${witness.address.slice(0, 6)}...${witness.address.slice(-4)}`}
                      </div>
                      <div className="text-sm text-gray-400">
                        Witness #{witness.witnessNumber}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {witness.timestamp.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              No witnesses registered yet. Be the first.
            </div>
          )}
        </div>

        {/* Covenant Details */}
        <div className="border border-white p-6">
          <h3 className="text-xl font-bold mb-4">THE COVENANT</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Start Date:</span>
                <span>October 19, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span>13 Years (4,745 days)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Auctions:</span>
                <span>24h, ending midnight ET</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Witness Role:</span>
                <span>Attest to daily creation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Founding Benefits:</span>
                <span>Special recognition</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Target Launch:</span>
                <span className="text-red-400 font-bold">100 Witnesses</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-800">
          <div className="text-sm text-gray-400">
            ABRAHAM'S COVENANT • Sacred 13-Year Daily Creation • October 19, 2025 Launch
          </div>
          <div className="text-xs text-red-400 mt-2">
            EMERGENCY STATUS: {100 - registryStats.percentComplete}% away from launch readiness
          </div>
        </div>
      </div>
    </div>
  );
}