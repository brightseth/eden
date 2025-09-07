import { PrismaClient } from '../generated/client';
import { logger } from '../config/logger';
import { ipfsService } from './ipfsService';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

export interface CreateDraftParams {
  name: string;
  archetype: 'CREATOR' | 'CURATOR' | 'TRADER';
  practice: {
    timeOfDay: number;
    outputType: string;
    quantity: number;
    observeSabbath: boolean;
  };
  graduationMode: 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK';
  trainerAddress: string;
  idempotencyKey: string;
}

export interface PracticeExecutionParams {
  outputDescription?: string;
  mediaUrl?: string;
  trainerAddress: string;
}

export interface UpdatePracticeParams {
  timeOfDay?: number;
  outputType?: string;
  quantity?: number;
  observeSabbath?: boolean;
}

class SpiritService {
  /**
   * Find draft Spirit by name
   */
  async findDraftByName(name: string) {
    return prisma.spirit.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        },
        tokenId: null // Only drafts
      }
    });
  }

  /**
   * Find Spirit by ID
   */
  async findById(id: string) {
    return prisma.spirit.findUnique({
      where: { id },
      include: {
        practices: true,
        treasury: true
      }
    });
  }

  /**
   * Create draft Spirit
   */
  async createDraft(params: CreateDraftParams) {
    // Create covenant metadata
    const covenantData = {
      name: params.name,
      archetype: params.archetype,
      practice: params.practice,
      graduationMode: params.graduationMode,
      trainerAddress: params.trainerAddress,
      createdAt: new Date().toISOString()
    };

    // Upload to IPFS
    const covenantCid = await ipfsService.uploadJson(covenantData);

    // Create Spirit record
    const spirit = await prisma.spirit.create({
      data: {
        // No tokenId yet - this is a draft
        walletAddress: '', // Will be set during graduation
        tokenAddress: params.graduationMode === 'ID_ONLY' ? null : '', // Will be set during graduation
        covenantCid,
        metadataCid: '', // Will be set during graduation
        mode: params.graduationMode,
        archetype: params.archetype,
        graduationDate: new Date(), // Placeholder - will be updated on actual graduation
        graduationTxHash: '', // Will be set during graduation
        trainerAddress: params.trainerAddress,
        active: false, // Not active until graduated
        blockNumber: BigInt(0), // Will be set during graduation
        practices: {
          create: {
            configurationCid: covenantCid,
            configurationTxHash: '', // Will be set during graduation
            practiceType: params.archetype,
            timeOfDay: params.practice.timeOfDay,
            outputType: params.practice.outputType,
            quantity: params.practice.quantity,
            observeSabbath: params.practice.observeSabbath,
            active: true,
            blockNumber: BigInt(0)
          }
        }
      },
      include: {
        practices: true
      }
    });

    // Add name to metadata for easy access
    (spirit as any).name = params.name;

    return spirit;
  }

  /**
   * Update practice configuration
   */
  async updatePractice(spiritId: string, updates: UpdatePracticeParams) {
    const spirit = await this.findById(spiritId);
    if (!spirit) {
      throw new AppError('Spirit not found', 404);
    }

    // Get current practice
    const currentPractice = spirit.practices[0];
    if (!currentPractice) {
      throw new AppError('No practice configuration found', 404);
    }

    // Create updated covenant
    const updatedCovenantData = {
      spiritId,
      practiceType: currentPractice.practiceType,
      timeOfDay: updates.timeOfDay ?? currentPractice.timeOfDay,
      outputType: updates.outputType ?? currentPractice.outputType,
      quantity: updates.quantity ?? currentPractice.quantity,
      observeSabbath: updates.observeSabbath ?? currentPractice.observeSabbath,
      updatedAt: new Date().toISOString()
    };

    // Upload new covenant to IPFS
    const newCovenantCid = await ipfsService.uploadJson(updatedCovenantData);

    // Update practice record
    const updatedPractice = await prisma.practice.update({
      where: { id: currentPractice.id },
      data: {
        configurationCid: newCovenantCid,
        timeOfDay: updatedCovenantData.timeOfDay,
        outputType: updatedCovenantData.outputType,
        quantity: updatedCovenantData.quantity,
        observeSabbath: updatedCovenantData.observeSabbath
      }
    });

    // Also update Spirit's covenant CID
    await prisma.spirit.update({
      where: { id: spiritId },
      data: { covenantCid: newCovenantCid }
    });

    return updatedPractice;
  }

  /**
   * Check if Spirit can run practice today
   */
  async canRunPracticeToday(spiritId: string): Promise<boolean> {
    const spirit = await this.findById(spiritId);
    if (!spirit || !spirit.practices.length) {
      return false;
    }

    const practice = spirit.practices[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already executed today
    if (practice.lastExecutionDate) {
      const lastExecution = new Date(practice.lastExecutionDate);
      lastExecution.setHours(0, 0, 0, 0);
      
      if (lastExecution.getTime() === today.getTime()) {
        return false; // Already executed today
      }
    }

    // Check sabbath
    if (practice.observeSabbath && today.getDay() === 0) { // Sunday = 0
      return false;
    }

    return true;
  }

  /**
   * Execute daily practice
   */
  async executePractice(spiritId: string, params: PracticeExecutionParams) {
    const canRun = await this.canRunPracticeToday(spiritId);
    if (!canRun) {
      throw new AppError('Cannot execute practice today', 400);
    }

    const spirit = await this.findById(spiritId);
    if (!spirit || !spirit.practices.length) {
      throw new AppError('Spirit or practice not found', 404);
    }

    const practice = spirit.practices[0];
    const workId = `${spiritId}-${Date.now()}`;

    // Create output metadata
    const outputData = {
      workId,
      spiritId,
      title: params.outputDescription || `${practice.outputType} #${practice.totalExecutions + 1}`,
      description: params.outputDescription,
      mediaUrl: params.mediaUrl,
      practiceType: practice.practiceType,
      outputType: practice.outputType,
      quantity: practice.quantity,
      executionDate: new Date().toISOString(),
      trainerAddress: params.trainerAddress
    };

    // Upload output metadata to IPFS
    const outputCid = await ipfsService.uploadJson(outputData);

    // Create drop record
    const drop = await prisma.drop.create({
      data: {
        spiritId,
        workId,
        txHash: '', // Will be set by indexer when recorded onchain
        outputCid,
        title: outputData.title,
        description: outputData.description,
        mediaType: 'application/json', // Default for now
        mediaUrl: params.mediaUrl,
        executionDate: new Date(),
        practiceType: practice.practiceType,
        blockNumber: BigInt(0) // Will be set by indexer
      }
    });

    // Update practice execution count and date
    await prisma.practice.update({
      where: { id: practice.id },
      data: {
        lastExecutionDate: new Date(),
        totalExecutions: practice.totalExecutions + 1
      }
    });

    // Update treasury practice count
    if (spirit.treasury) {
      await prisma.treasury.update({
        where: { spiritId },
        data: {
          totalPracticeRuns: spirit.treasury.totalPracticeRuns + 1,
          lastPracticeDate: new Date()
        }
      });
    }

    logger.info('Practice executed', {
      spiritId,
      workId,
      dropId: drop.id,
      outputCid
    });

    return drop;
  }

  /**
   * Get full Spirit data with related records
   */
  async getFullSpiritData(id: string) {
    return prisma.spirit.findUnique({
      where: { id },
      include: {
        practices: {
          orderBy: { createdAt: 'desc' }
        },
        treasury: true,
        drops: {
          take: 5, // Last 5 drops
          orderBy: { executionDate: 'desc' }
        }
      }
    });
  }

  /**
   * Get treasury data
   */
  async getTreasuryData(spiritId: string) {
    return prisma.treasury.findUnique({
      where: { spiritId }
    });
  }

  /**
   * Get drop history with pagination
   */
  async getDropHistory(spiritId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.drop.findMany({
        where: { spiritId },
        orderBy: { executionDate: 'desc' },
        skip,
        take: limit
      }),
      prisma.drop.count({ where: { spiritId } })
    ]);

    return { items, total };
  }

  /**
   * List Spirits with filters and pagination
   */
  async listSpirits(
    filters: {
      graduated?: boolean;
      active?: boolean;
      archetype?: string;
      trainerAddress?: string;
    },
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters.graduated !== undefined) {
      where.tokenId = filters.graduated ? { not: null } : null;
    }

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.archetype) {
      where.archetype = filters.archetype;
    }

    if (filters.trainerAddress) {
      where.trainerAddress = filters.trainerAddress;
    }

    const [items, total] = await Promise.all([
      prisma.spirit.findMany({
        where,
        include: {
          practices: { take: 1 },
          treasury: true,
          _count: { select: { drops: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.spirit.count({ where })
    ]);

    return { items, total };
  }

  /**
   * Update Spirit with graduation data (called by orchestrator)
   */
  async markAsGraduated(spiritId: string, graduationData: {
    tokenId: bigint;
    walletAddress: string;
    tokenAddress?: string;
    metadataCid: string;
    graduationTxHash: string;
    blockNumber: bigint;
  }) {
    return prisma.spirit.update({
      where: { id: spiritId },
      data: {
        tokenId: graduationData.tokenId,
        walletAddress: graduationData.walletAddress,
        tokenAddress: graduationData.tokenAddress || null,
        metadataCid: graduationData.metadataCid,
        graduationTxHash: graduationData.graduationTxHash,
        blockNumber: graduationData.blockNumber,
        active: true,
        graduationDate: new Date(),
        // Create treasury record
        treasury: {
          create: {
            treasuryAddress: graduationData.walletAddress,
            ethBalance: BigInt(0),
            tokenBalance: BigInt(0),
            totalRevenue: BigInt(0),
            totalCosts: BigInt(0),
            totalPracticeRuns: 0
          }
        }
      }
    });
  }
}

export const spiritService = new SpiritService();