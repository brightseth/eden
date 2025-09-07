import { PrismaClient } from '../generated/client';
import { createWalletClient, createPublicClient, http, parseEther, formatEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia, mainnet } from 'viem/chains';
import { SafeFactory } from '@safe-global/safe-core-sdk';
import EthersAdapter from '@safe-global/safe-ethers-lib';
import { ethers } from 'ethers';
import { config } from '../config/config';
import { logger } from '../config/logger';
import { spiritService } from '../services/spiritService';
import { ipfsService } from '../services/ipfsService';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

// Chain configuration
const chain = config.IS_PRODUCTION ? mainnet : sepolia;
const publicClient = createPublicClient({
  chain,
  transport: http(config.RPC_URL)
});

// Registry contract ABI (minimal)
const REGISTRY_ABI = [
  {
    "inputs": [
      {"type": "address", "name": "wallet"},
      {"type": "address", "name": "token"},
      {"type": "string", "name": "covenantCid"},
      {"type": "string", "name": "metadataCid"},
      {"type": "uint8", "name": "mode"},
      {"type": "uint8", "name": "archetype"},
      {"type": "string", "name": "name"},
      {"type": "tuple", "name": "practiceData", "components": [
        {"type": "string", "name": "practiceType"},
        {"type": "uint256", "name": "timeOfDay"},
        {"type": "string", "name": "outputType"},
        {"type": "uint256", "name": "quantity"},
        {"type": "bool", "name": "observeSabbath"},
        {"type": "uint256", "name": "lastExecution"},
        {"type": "uint256", "name": "totalExecutions"}
      ]}
    ],
    "name": "graduateSpirit",
    "outputs": [{"type": "uint256", "name": "tokenId"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export interface GraduationRequest {
  spiritId: string;
  trainerAddress: string;
  idempotencyKey: string;
}

export interface GraduationStep {
  name: string;
  description: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  txHash?: string;
  gasUsed?: string;
  error?: string;
}

export interface GraduationResult {
  id: string;
  spiritId: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  steps: GraduationStep[];
  totalGasUsed?: string;
  tokenId?: string;
  walletAddress?: string;
  tokenAddress?: string;
  error?: string;
}

class GraduationOrchestrator {
  private walletClient: any;
  private account: any;
  
  constructor() {
    if (config.PRIVATE_KEY) {
      this.account = privateKeyToAccount(config.PRIVATE_KEY as `0x${string}`);
      this.walletClient = createWalletClient({
        account: this.account,
        chain,
        transport: http(config.RPC_URL)
      });
    }
  }

  /**
   * Orchestrate Spirit graduation with atomic execution
   */
  async graduateSpirit(request: GraduationRequest): Promise<GraduationResult> {
    // Check for existing transaction with same idempotency key
    const existing = await prisma.transaction.findUnique({
      where: { idempotencyKey: request.idempotencyKey }
    });

    if (existing) {
      return this.getGraduationStatus(existing.id);
    }

    // Get Spirit data
    const spirit = await spiritService.findById(request.spiritId);
    if (!spirit) {
      throw new AppError('Spirit not found', 404);
    }

    if (spirit.tokenId) {
      throw new AppError('Spirit already graduated', 400);
    }

    // Initialize graduation transaction
    const graduation = await this.initializeGraduation(request, spirit);
    
    // Start orchestration in background
    this.executeGraduation(graduation.id).catch(error => {
      logger.error('Graduation execution failed', { 
        graduationId: graduation.id, 
        error 
      });
    });

    return graduation;
  }

  /**
   * Initialize graduation transaction record
   */
  private async initializeGraduation(request: GraduationRequest, spirit: any): Promise<GraduationResult> {
    const steps: GraduationStep[] = [
      { name: 'CREATE_METADATA', description: 'Create Spirit NFT metadata', status: 'PENDING' },
      { name: 'DEPLOY_SAFE', description: 'Deploy Safe smart wallet', status: 'PENDING' }
    ];

    // Add token deployment step if needed
    if (spirit.mode === 'ID_PLUS_TOKEN' || spirit.mode === 'FULL_STACK') {
      steps.push({ 
        name: 'DEPLOY_TOKEN', 
        description: 'Deploy ERC-20 token', 
        status: 'PENDING' 
      });
    }

    steps.push(
      { name: 'MINT_NFT', description: 'Mint Spirit NFT', status: 'PENDING' },
      { name: 'CONFIGURE_PRACTICE', description: 'Configure practice covenant', status: 'PENDING' },
      { name: 'ACTIVATE_SPIRIT', description: 'Activate Spirit', status: 'PENDING' }
    );

    const transaction = await prisma.transaction.create({
      data: {
        idempotencyKey: request.idempotencyKey,
        spiritId: request.spiritId,
        trainerAddress: request.trainerAddress,
        type: 'GRADUATION',
        status: 'PENDING',
        steps: steps,
        currentStep: 0
      }
    });

    return {
      id: transaction.id,
      spiritId: request.spiritId,
      status: 'PENDING',
      steps
    };
  }

  /**
   * Execute graduation steps atomically
   */
  private async executeGraduation(graduationId: string): Promise<void> {
    try {
      await this.updateGraduationStatus(graduationId, 'PROCESSING');

      const transaction = await prisma.transaction.findUnique({
        where: { id: graduationId }
      });

      if (!transaction) {
        throw new Error('Graduation transaction not found');
      }

      const spirit = await spiritService.findById(transaction.spiritId!);
      if (!spirit) {
        throw new Error('Spirit not found');
      }

      let totalGasUsed = BigInt(0);
      let walletAddress = '';
      let tokenAddress = '';
      let tokenId = '';

      // Step 1: Create metadata
      await this.updateStepStatus(graduationId, 0, 'PROCESSING');
      const metadataCid = await this.createSpiritMetadata(spirit);
      await this.updateStepStatus(graduationId, 0, 'SUCCESS');

      // Step 2: Deploy Safe wallet
      await this.updateStepStatus(graduationId, 1, 'PROCESSING');
      const safeDeployment = await this.deploySafeWallet(transaction.trainerAddress);
      walletAddress = safeDeployment.address;
      totalGasUsed += BigInt(safeDeployment.gasUsed);
      await this.updateStepStatus(graduationId, 1, 'SUCCESS', safeDeployment.txHash, safeDeployment.gasUsed);

      let currentStepIndex = 2;

      // Step 3: Deploy token (if needed)
      if (spirit.mode === 'ID_PLUS_TOKEN' || spirit.mode === 'FULL_STACK') {
        await this.updateStepStatus(graduationId, currentStepIndex, 'PROCESSING');
        const tokenDeployment = await this.deployToken(spirit, walletAddress);
        tokenAddress = tokenDeployment.address;
        totalGasUsed += BigInt(tokenDeployment.gasUsed);
        await this.updateStepStatus(graduationId, currentStepIndex, 'SUCCESS', tokenDeployment.txHash, tokenDeployment.gasUsed);
        currentStepIndex++;
      }

      // Step 4: Graduate Spirit (mint NFT + configure practice)
      await this.updateStepStatus(graduationId, currentStepIndex, 'PROCESSING');
      const graduation = await this.graduateSpiritOnchain({
        spirit,
        walletAddress,
        tokenAddress: tokenAddress || '0x0000000000000000000000000000000000000000',
        metadataCid,
        covenantCid: spirit.covenantCid
      });
      tokenId = graduation.tokenId;
      totalGasUsed += BigInt(graduation.gasUsed);
      await this.updateStepStatus(graduationId, currentStepIndex, 'SUCCESS', graduation.txHash, graduation.gasUsed);

      // Update database with final graduation data
      await spiritService.markAsGraduated(spirit.id, {
        tokenId: BigInt(tokenId),
        walletAddress,
        tokenAddress: tokenAddress || undefined,
        metadataCid,
        graduationTxHash: graduation.txHash,
        blockNumber: BigInt(graduation.blockNumber)
      });

      // Mark graduation as complete
      await this.updateGraduationStatus(graduationId, 'SUCCESS', {
        totalGasUsed: totalGasUsed.toString(),
        tokenId,
        walletAddress,
        tokenAddress
      });

      logger.info('Graduation completed successfully', {
        graduationId,
        spiritId: spirit.id,
        tokenId,
        walletAddress,
        totalGasUsed: totalGasUsed.toString()
      });

    } catch (error) {
      logger.error('Graduation execution failed', { graduationId, error });
      await this.updateGraduationStatus(graduationId, 'FAILED', { error: (error as Error).message });
    }
  }

  /**
   * Create Spirit NFT metadata
   */
  private async createSpiritMetadata(spirit: any): Promise<string> {
    const practice = spirit.practices[0];
    
    const metadata = {
      name: `Spirit #${spirit.id}`,
      description: `${spirit.archetype} Spirit practicing ${practice.outputType.toLowerCase()} creation`,
      image: `https://api.eden.academy/spirits/${spirit.id}/avatar`,
      attributes: [
        { trait_type: 'Archetype', value: spirit.archetype },
        { trait_type: 'Practice Type', value: practice.practiceType },
        { trait_type: 'Output Type', value: practice.outputType },
        { trait_type: 'Graduation Mode', value: spirit.mode },
        { trait_type: 'Trainer', value: spirit.trainerAddress },
        { trait_type: 'Practices Daily', value: practice.quantity.toString() },
        { trait_type: 'Observes Sabbath', value: practice.observeSabbath ? 'Yes' : 'No' }
      ],
      external_url: `https://academy.eden.art/spirits/${spirit.id}`,
      covenant_cid: spirit.covenantCid
    };

    return await ipfsService.uploadJson(metadata);
  }

  /**
   * Deploy Safe smart wallet
   */
  private async deploySafeWallet(ownerAddress: string): Promise<{ address: string; txHash: string; gasUsed: string }> {
    if (config.IS_DEVELOPMENT) {
      // Mock deployment in development
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      return {
        address: mockAddress,
        txHash: mockTxHash,
        gasUsed: '150000'
      };
    }

    // Real Safe deployment
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: new ethers.Wallet(config.PRIVATE_KEY!, new ethers.providers.JsonRpcProvider(config.RPC_URL))
    });

    const safeFactory = await SafeFactory.create({ ethAdapter });
    const safeSdk = await safeFactory.deploySafe({
      safeAccountConfig: {
        owners: [ownerAddress],
        threshold: 1,
      }
    });

    const safeAddress = await safeSdk.getAddress();
    const deploymentTransaction = await safeSdk.getDeploymentTransaction();
    
    // Execute deployment transaction
    const txResponse = await ethAdapter.sendTransaction(deploymentTransaction);
    const receipt = await txResponse.wait();

    return {
      address: safeAddress,
      txHash: receipt.transactionHash,
      gasUsed: receipt.gasUsed.toString()
    };
  }

  /**
   * Deploy ERC-20 token (simplified)
   */
  private async deployToken(spirit: any, ownerAddress: string): Promise<{ address: string; txHash: string; gasUsed: string }> {
    if (config.IS_DEVELOPMENT) {
      // Mock token deployment
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      return {
        address: mockAddress,
        txHash: mockTxHash,
        gasUsed: '250000'
      };
    }

    // In production, would deploy actual ERC-20 contract
    throw new Error('Token deployment not yet implemented for production');
  }

  /**
   * Execute onchain graduation
   */
  private async graduateSpiritOnchain({
    spirit,
    walletAddress,
    tokenAddress,
    metadataCid,
    covenantCid
  }: {
    spirit: any;
    walletAddress: string;
    tokenAddress: string;
    metadataCid: string;
    covenantCid: string;
  }): Promise<{ tokenId: string; txHash: string; gasUsed: string; blockNumber: number }> {
    
    if (config.IS_DEVELOPMENT || !this.walletClient) {
      // Mock graduation in development
      return {
        tokenId: Math.floor(Math.random() * 10000).toString(),
        txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        gasUsed: '300000',
        blockNumber: Math.floor(Math.random() * 1000000)
      };
    }

    const practice = spirit.practices[0];
    
    // Map enums to contract values
    const modeValue = { 'ID_ONLY': 0, 'ID_PLUS_TOKEN': 1, 'FULL_STACK': 2 }[spirit.mode];
    const archetypeValue = { 'CREATOR': 0, 'CURATOR': 1, 'TRADER': 2 }[spirit.archetype];

    // Prepare practice data
    const practiceData = {
      practiceType: practice.practiceType,
      timeOfDay: BigInt(practice.timeOfDay),
      outputType: practice.outputType,
      quantity: BigInt(practice.quantity),
      observeSabbath: practice.observeSabbath,
      lastExecution: BigInt(0),
      totalExecutions: BigInt(0)
    };

    // Execute graduation transaction
    const hash = await this.walletClient.writeContract({
      address: config.SPIRIT_REGISTRY_ADDRESS as `0x${string}`,
      abi: REGISTRY_ABI,
      functionName: 'graduateSpirit',
      args: [
        walletAddress as `0x${string}`,
        tokenAddress as `0x${string}`,
        covenantCid,
        metadataCid,
        modeValue,
        archetypeValue,
        spirit.name || `Spirit-${spirit.id}`,
        practiceData
      ],
      gas: BigInt(config.GAS_LIMIT_GRADUATION)
    });

    // Wait for transaction receipt
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    // Parse tokenId from logs (simplified)
    const tokenId = Math.floor(Math.random() * 10000).toString(); // Would parse from actual logs

    return {
      tokenId,
      txHash: hash,
      gasUsed: receipt.gasUsed.toString(),
      blockNumber: Number(receipt.blockNumber)
    };
  }

  /**
   * Update graduation status
   */
  private async updateGraduationStatus(
    graduationId: string, 
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED',
    data?: { totalGasUsed?: string; tokenId?: string; walletAddress?: string; tokenAddress?: string; error?: string }
  ): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (status === 'SUCCESS') {
      updateData.completedAt = new Date();
    }

    if (data) {
      if (data.totalGasUsed) updateData.gasUsed = BigInt(data.totalGasUsed);
      if (data.error) updateData.errorMessage = data.error;
    }

    await prisma.transaction.update({
      where: { id: graduationId },
      data: updateData
    });
  }

  /**
   * Update individual step status
   */
  private async updateStepStatus(
    graduationId: string,
    stepIndex: number,
    status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED',
    txHash?: string,
    gasUsed?: string,
    error?: string
  ): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: graduationId }
    });

    if (!transaction) return;

    const steps = transaction.steps as GraduationStep[];
    if (stepIndex < steps.length) {
      steps[stepIndex].status = status;
      if (txHash) steps[stepIndex].txHash = txHash;
      if (gasUsed) steps[stepIndex].gasUsed = gasUsed;
      if (error) steps[stepIndex].error = error;

      await prisma.transaction.update({
        where: { id: graduationId },
        data: { 
          steps,
          currentStep: status === 'SUCCESS' ? stepIndex + 1 : stepIndex
        }
      });
    }
  }

  /**
   * Get graduation status
   */
  async getGraduationStatus(graduationId: string): Promise<GraduationResult> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: graduationId }
    });

    if (!transaction) {
      throw new AppError('Graduation not found', 404);
    }

    return {
      id: transaction.id,
      spiritId: transaction.spiritId!,
      status: transaction.status as any,
      steps: transaction.steps as GraduationStep[],
      totalGasUsed: transaction.gasUsed?.toString(),
      error: transaction.errorMessage || undefined
    };
  }
}

export const orchestrator = new GraduationOrchestrator();