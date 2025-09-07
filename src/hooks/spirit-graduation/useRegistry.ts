import { useState, useCallback, useEffect } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseAbi, formatEther, parseEther } from 'viem';

// Types matching the Solidity contract
export type GraduationMode = 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK';
export type StartingArchetype = 'CREATOR' | 'CURATOR' | 'TRADER';

export interface SpiritConfig {
  name: string;
  archetype: StartingArchetype;
  time: string; // 24hr format
  outputType: string;
  quantity: number;
  observeSabbath: boolean;
  graduationMode: GraduationMode;
}

export interface SpiritData {
  wallet: string;
  token: string;
  covenantCid: string;
  metadataCid: string;
  mode: number; // enum as number
  archetype: number; // enum as number
  graduationDate: bigint;
  trainer: string;
  active: boolean;
}

export interface PracticeData {
  practiceType: string;
  timeOfDay: bigint;
  outputType: string;
  quantity: bigint;
  observeSabbath: boolean;
  lastExecution: bigint;
  totalExecutions: bigint;
}

// Contract ABI (minimal for our needs)
const REGISTRY_ABI = parseAbi([
  'function graduateSpirit(address wallet, address token, string covenantCid, string metadataCid, uint8 mode, uint8 archetype, string name, tuple(string practiceType, uint256 timeOfDay, string outputType, uint256 quantity, bool observeSabbath, uint256 lastExecution, uint256 totalExecutions) practiceData) external returns (uint256)',
  'function executePractice(uint256 tokenId, string outputCid) external',
  'function getSpiritData(uint256 tokenId) external view returns (tuple(address wallet, address token, string covenantCid, string metadataCid, uint8 mode, uint8 archetype, uint256 graduationDate, address trainer, bool active))',
  'function getPracticeData(uint256 tokenId) external view returns (tuple(string practiceType, uint256 timeOfDay, string outputType, uint256 quantity, bool observeSabbath, uint256 lastExecution, uint256 totalExecutions))',
  'function getTotalSpirits() external view returns (uint256)',
  'function canPracticeToday(uint256 tokenId) external view returns (bool)',
  'event SpiritGraduated(uint256 indexed tokenId, string name, address wallet, address token, uint8 mode, uint8 archetype)'
]);

// Contract addresses (would be in env vars in production)
const REGISTRY_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_CONTRACT || '0x0000000000000000000000000000000000000000';

export interface UseRegistryReturn {
  // State
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  
  // Actions
  graduateSpirit: (config: SpiritConfig) => Promise<{ tokenId: number; txHash: string } | null>;
  executePractice: (tokenId: number, outputCid: string) => Promise<string | null>;
  getSpiritData: (tokenId: number) => Promise<SpiritData | null>;
  getPracticeData: (tokenId: number) => Promise<PracticeData | null>;
  canPracticeToday: (tokenId: number) => Promise<boolean>;
  
  // Safe wallet creation
  deploySafeWallet: (ownerAddress: string) => Promise<string | null>;
  
  // IPFS helpers
  uploadToIPFS: (data: any) => Promise<string>;
}

/**
 * Hook for interacting with Eden Registry contract and Safe wallets
 * Handles Spirit graduation and practice management
 */
export function useRegistry(): UseRegistryReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const clearError = useCallback(() => setError(null), []);
  
  // Convert time string to seconds since midnight
  const timeToSeconds = useCallback((time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60;
  }, []);

  // Create Safe wallet for Spirit
  const deploySafeWallet = useCallback(async (ownerAddress: string): Promise<string | null> => {
    try {
      setIsLoading(true);
      clearError();

      // For ID_ONLY mode, create simple Safe with single owner
      // This is simplified - in production would use Safe SDK
      
      // Mock Safe deployment for now
      const mockSafeAddress = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      // In real implementation:
      // const safeFactory = await SafeFactory.create({ ethAdapter });
      // const safeSdk = await safeFactory.deploySafe({
      //   safeAccountConfig: {
      //     owners: [ownerAddress],
      //     threshold: 1,
      //   }
      // });
      // return safeSdk.getAddress();
      
      return mockSafeAddress;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Safe deployment failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearError]);

  // Upload data to IPFS
  const uploadToIPFS = useCallback(async (data: any): Promise<string> => {
    try {
      // Mock IPFS upload - in production would use Pinata/IPFS
      const mockCid = `Qm${Math.random().toString(36).substring(2, 44)}`;
      
      // In real implementation:
      // const response = await fetch('/api/ipfs/upload', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
      // const { cid } = await response.json();
      // return cid;
      
      return mockCid;
    } catch (err) {
      throw new Error('IPFS upload failed');
    }
  }, []);

  // Graduate Spirit to onchain presence
  const graduateSpirit = useCallback(async (config: SpiritConfig): Promise<{ tokenId: number; txHash: string } | null> => {
    if (!walletClient || !address) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      clearError();

      // 1. Deploy Safe wallet
      const safeAddress = await deploySafeWallet(address);
      if (!safeAddress) {
        throw new Error('Failed to deploy Safe wallet');
      }

      // 2. Create practice covenant data
      const practiceData = {
        practiceType: config.archetype,
        timeOfDay: BigInt(timeToSeconds(config.time)),
        outputType: config.outputType,
        quantity: BigInt(config.quantity),
        observeSabbath: config.observeSabbath,
        lastExecution: 0n,
        totalExecutions: 0n
      };

      // 3. Upload covenant to IPFS
      const covenantData = {
        name: config.name,
        archetype: config.archetype,
        practice: {
          time: config.time,
          output: config.outputType,
          quantity: config.quantity,
          sabbath: config.observeSabbath
        },
        graduationDate: new Date().toISOString(),
        trainer: address
      };
      const covenantCid = await uploadToIPFS(covenantData);

      // 4. Upload Spirit metadata to IPFS
      const metadataData = {
        name: config.name,
        description: `${config.archetype} Spirit practicing ${config.outputType.toLowerCase()} creation`,
        image: `https://api.eden.academy/spirits/${config.name.toLowerCase()}/avatar`,
        attributes: [
          { trait_type: 'Archetype', value: config.archetype },
          { trait_type: 'Practice Time', value: config.time },
          { trait_type: 'Output Type', value: config.outputType },
          { trait_type: 'Quantity', value: config.quantity },
          { trait_type: 'Graduation Mode', value: config.graduationMode }
        ]
      };
      const metadataCid = await uploadToIPFS(metadataData);

      // 5. Contract interaction
      const modeEnum = { 'ID_ONLY': 0, 'ID_PLUS_TOKEN': 1, 'FULL_STACK': 2 }[config.graduationMode];
      const archetypeEnum = { 'CREATOR': 0, 'CURATOR': 1, 'TRADER': 2 }[config.archetype];
      const tokenAddress = config.graduationMode === 'ID_ONLY' ? '0x0000000000000000000000000000000000000000' : '0x0000000000000000000000000000000000000001'; // Mock token

      const hash = await walletClient.writeContract({
        address: REGISTRY_CONTRACT_ADDRESS as `0x${string}`,
        abi: REGISTRY_ABI,
        functionName: 'graduateSpirit',
        args: [
          safeAddress as `0x${string}`,
          tokenAddress as `0x${string}`,
          covenantCid,
          metadataCid,
          modeEnum,
          archetypeEnum,
          config.name,
          practiceData
        ]
      });

      setTxHash(hash);

      // Wait for confirmation
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });
      
      // Parse token ID from logs (simplified)
      const tokenId = Math.floor(Math.random() * 10000) + 1; // Mock - would parse from logs
      
      return { tokenId, txHash: hash };

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Graduation failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, address, deploySafeWallet, uploadToIPFS, timeToSeconds, clearError, publicClient]);

  // Execute daily practice
  const executePractice = useCallback(async (tokenId: number, outputCid: string): Promise<string | null> => {
    if (!walletClient) {
      setError('Wallet not connected');
      return null;
    }

    try {
      setIsLoading(true);
      clearError();

      const hash = await walletClient.writeContract({
        address: REGISTRY_CONTRACT_ADDRESS as `0x${string}`,
        abi: REGISTRY_ABI,
        functionName: 'executePractice',
        args: [BigInt(tokenId), outputCid]
      });

      await publicClient!.waitForTransactionReceipt({ hash });
      
      return hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Practice execution failed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [walletClient, publicClient, clearError]);

  // Get Spirit data
  const getSpiritData = useCallback(async (tokenId: number): Promise<SpiritData | null> => {
    if (!publicClient) return null;

    try {
      const result = await publicClient.readContract({
        address: REGISTRY_CONTRACT_ADDRESS as `0x${string}`,
        abi: REGISTRY_ABI,
        functionName: 'getSpiritData',
        args: [BigInt(tokenId)]
      }) as any;

      return {
        wallet: result[0],
        token: result[1],
        covenantCid: result[2],
        metadataCid: result[3],
        mode: result[4],
        archetype: result[5],
        graduationDate: result[6],
        trainer: result[7],
        active: result[8]
      };
    } catch (err) {
      console.error('Failed to get spirit data:', err);
      return null;
    }
  }, [publicClient]);

  // Get practice data
  const getPracticeData = useCallback(async (tokenId: number): Promise<PracticeData | null> => {
    if (!publicClient) return null;

    try {
      const result = await publicClient.readContract({
        address: REGISTRY_CONTRACT_ADDRESS as `0x${string}`,
        abi: REGISTRY_ABI,
        functionName: 'getPracticeData',
        args: [BigInt(tokenId)]
      }) as any;

      return {
        practiceType: result[0],
        timeOfDay: result[1],
        outputType: result[2],
        quantity: result[3],
        observeSabbath: result[4],
        lastExecution: result[5],
        totalExecutions: result[6]
      };
    } catch (err) {
      console.error('Failed to get practice data:', err);
      return null;
    }
  }, [publicClient]);

  // Check if Spirit can practice today
  const canPracticeToday = useCallback(async (tokenId: number): Promise<boolean> => {
    if (!publicClient) return false;

    try {
      const result = await publicClient.readContract({
        address: REGISTRY_CONTRACT_ADDRESS as `0x${string}`,
        abi: REGISTRY_ABI,
        functionName: 'canPracticeToday',
        args: [BigInt(tokenId)]
      }) as boolean;

      return result;
    } catch (err) {
      console.error('Failed to check practice availability:', err);
      return false;
    }
  }, [publicClient]);

  return {
    // State
    isLoading,
    error,
    txHash,
    
    // Actions
    graduateSpirit,
    executePractice,
    getSpiritData,
    getPracticeData,
    canPracticeToday,
    
    // Safe wallet
    deploySafeWallet,
    
    // IPFS
    uploadToIPFS
  };
}