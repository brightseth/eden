import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { spiritService } from '../services/spiritService';
import { orchestrator } from '../orchestrator/orchestrator';
import { logger } from '../config/logger';

const router = Router();

// Validation schemas
const CreateSpiritSchema = z.object({
  name: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/),
  archetype: z.enum(['CREATOR', 'CURATOR', 'TRADER']),
  practice: z.object({
    timeOfDay: z.number().min(0).max(86399), // seconds since midnight
    outputType: z.string(),
    quantity: z.number().min(1).max(10),
    observeSabbath: z.boolean().default(false)
  }),
  graduationMode: z.enum(['ID_ONLY', 'ID_PLUS_TOKEN', 'FULL_STACK']).default('ID_ONLY')
});

const UpdatePracticeSchema = z.object({
  timeOfDay: z.number().min(0).max(86399).optional(),
  outputType: z.string().optional(),
  quantity: z.number().min(1).max(10).optional(),
  observeSabbath: z.boolean().optional()
});

const RunPracticeSchema = z.object({
  outputDescription: z.string().optional(),
  mediaUrl: z.string().url().optional()
});

// Idempotency middleware
const requireIdempotencyKey = (req: any, res: any, next: any) => {
  const key = req.get('Idempotency-Key');
  if (!key) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Idempotency-Key header is required'
    });
  }
  req.idempotencyKey = key;
  next();
};

/**
 * POST /api/v1/spirits
 * Create draft Spirit (not yet graduated)
 */
router.post('/', requireIdempotencyKey, asyncHandler(async (req, res) => {
  const validation = CreateSpiritSchema.safeParse(req.body);
  if (!validation.success) {
    throw new AppError('Invalid request data', 400);
  }

  const { name, archetype, practice, graduationMode } = validation.data;
  const trainerAddress = req.trainer!.address;

  // Check for existing draft
  const existing = await spiritService.findDraftByName(name);
  if (existing) {
    throw new AppError(`Spirit with name '${name}' already exists`, 409);
  }

  // Create draft Spirit
  const draft = await spiritService.createDraft({
    name,
    archetype,
    practice,
    graduationMode,
    trainerAddress,
    idempotencyKey: req.idempotencyKey
  });

  logger.info('Draft Spirit created', {
    spiritId: draft.id,
    name,
    trainerAddress
  });

  res.status(201).json({
    spirit: draft,
    status: 'DRAFT',
    message: 'Draft Spirit created successfully'
  });
}));

/**
 * POST /api/v1/spirits/:id/practice
 * Update practice configuration (returns new CID)
 */
router.post('/:id/practice', requireIdempotencyKey, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validation = UpdatePracticeSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new AppError('Invalid practice data', 400);
  }

  const spirit = await spiritService.findById(id);
  if (!spirit) {
    throw new AppError('Spirit not found', 404);
  }

  // Check ownership or admin
  if (spirit.trainerAddress !== req.trainer!.address && req.trainer!.role !== 'admin') {
    throw new AppError('Unauthorized to modify this Spirit', 403);
  }

  // Update practice configuration
  const updatedPractice = await spiritService.updatePractice(id, validation.data);

  res.json({
    practice: updatedPractice,
    covenantCid: updatedPractice.configurationCid,
    message: 'Practice configuration updated'
  });
}));

/**
 * POST /api/v1/spirits/:id/graduation
 * Orchestrate multicall deployment (graduate Spirit to onchain)
 */
router.post('/:id/graduation', requireIdempotencyKey, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const spirit = await spiritService.findById(id);
  if (!spirit) {
    throw new AppError('Spirit not found', 404);
  }

  // Check ownership or admin
  if (spirit.trainerAddress !== req.trainer!.address && req.trainer!.role !== 'admin') {
    throw new AppError('Unauthorized to graduate this Spirit', 403);
  }

  // Check if already graduated
  if (spirit.tokenId) {
    throw new AppError('Spirit already graduated', 400);
  }

  // Start graduation orchestration
  const graduation = await orchestrator.graduateSpirit({
    spiritId: id,
    trainerAddress: req.trainer!.address,
    idempotencyKey: req.idempotencyKey
  });

  logger.info('Graduation orchestration started', {
    spiritId: id,
    graduationId: graduation.id,
    trainerAddress: req.trainer!.address
  });

  res.status(202).json({
    graduation,
    message: 'Graduation process initiated',
    estimatedCompletion: '2-5 minutes'
  });
}));

/**
 * POST /api/v1/spirits/:id/run
 * Execute daily practice (rate-limited)
 */
router.post('/:id/run', requireIdempotencyKey, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validation = RunPracticeSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new AppError('Invalid practice run data', 400);
  }

  const spirit = await spiritService.findById(id);
  if (!spirit) {
    throw new AppError('Spirit not found', 404);
  }

  // Check if Spirit is graduated and active
  if (!spirit.tokenId) {
    throw new AppError('Spirit must be graduated to run practices', 400);
  }

  if (!spirit.active) {
    throw new AppError('Spirit is not active', 400);
  }

  // Check if practice can run today
  const canRun = await spiritService.canRunPracticeToday(id);
  if (!canRun) {
    throw new AppError('Practice already executed today', 429);
  }

  // Execute practice
  const execution = await spiritService.executePractice(id, {
    outputDescription: validation.data.outputDescription,
    mediaUrl: validation.data.mediaUrl,
    trainerAddress: req.trainer!.address
  });

  logger.info('Practice executed', {
    spiritId: id,
    executionId: execution.id,
    trainerAddress: req.trainer!.address
  });

  res.json({
    execution,
    message: 'Daily practice executed successfully'
  });
}));

/**
 * GET /api/v1/spirits/:id
 * Get Spirit data (returns both onchain refs and offchain projections)
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const spirit = await spiritService.getFullSpiritData(id);
  if (!spirit) {
    throw new AppError('Spirit not found', 404);
  }

  // Include onchain references and offchain projections
  const response = {
    // Onchain references (source of truth)
    onchain: spirit.tokenId ? {
      tokenId: spirit.tokenId.toString(),
      walletAddress: spirit.walletAddress,
      tokenAddress: spirit.tokenAddress,
      covenantCid: spirit.covenantCid,
      metadataCid: spirit.metadataCid,
      graduationTxHash: spirit.graduationTxHash,
      blockNumber: spirit.blockNumber?.toString()
    } : null,

    // Offchain projections (cached/computed data)
    projections: {
      id: spirit.id,
      name: spirit.name || 'Unknown Spirit',
      archetype: spirit.archetype,
      mode: spirit.mode,
      active: spirit.active,
      graduationDate: spirit.graduationDate,
      trainerAddress: spirit.trainerAddress,
      practices: spirit.practices,
      totalDrops: spirit.drops?.length || 0,
      treasury: spirit.treasury
    }
  };

  res.json(response);
}));

/**
 * GET /api/v1/spirits/:id/treasury
 * Get treasury balances (cached from blockchain)
 */
router.get('/:id/treasury', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const treasury = await spiritService.getTreasuryData(id);
  if (!treasury) {
    throw new AppError('Treasury not found or Spirit not graduated', 404);
  }

  res.json({
    treasury: {
      ethBalance: treasury.ethBalance.toString(),
      tokenBalance: treasury.tokenBalance.toString(),
      totalRevenue: treasury.totalRevenue.toString(),
      totalCosts: treasury.totalCosts.toString(),
      totalPracticeRuns: treasury.totalPracticeRuns,
      lastPracticeDate: treasury.lastPracticeDate,
      nextPracticeDate: treasury.nextPracticeDate,
      lastUpdated: treasury.lastUpdated
    }
  });
}));

/**
 * GET /api/v1/spirits/:id/drops
 * Get creation history (practice outputs)
 */
router.get('/:id/drops', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

  const drops = await spiritService.getDropHistory(id, page, limit);

  res.json({
    drops: drops.items.map(drop => ({
      id: drop.id,
      workId: drop.workId,
      title: drop.title,
      description: drop.description,
      mediaType: drop.mediaType,
      mediaUrl: drop.mediaUrl,
      outputCid: drop.outputCid,
      executionDate: drop.executionDate,
      practiceType: drop.practiceType,
      txHash: drop.txHash,
      gasUsed: drop.gasUsed?.toString(),
      gasCost: drop.gasCost?.toString(),
      revenueGenerated: drop.revenueGenerated?.toString()
    })),
    pagination: {
      page,
      limit,
      total: drops.total,
      pages: Math.ceil(drops.total / limit)
    }
  });
}));

/**
 * GET /api/v1/spirits
 * List Spirits (with optional filters)
 */
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const filters = {
    graduated: req.query.graduated === 'true',
    active: req.query.active === 'true',
    archetype: req.query.archetype as string,
    trainerAddress: req.query.trainer as string
  };

  const spirits = await spiritService.listSpirits(filters, page, limit);

  res.json({
    spirits: spirits.items,
    pagination: {
      page,
      limit,
      total: spirits.total,
      pages: Math.ceil(spirits.total / limit)
    }
  });
}));

export { router as spiritsRouter };