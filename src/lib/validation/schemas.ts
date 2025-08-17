import { z } from 'zod';

// ============================================
// Financial Model Schemas
// ============================================

export const FinancialModelSchema = z.object({
  id: z.string().uuid(),
  agent_id: z.string().uuid(),
  model_type: z.literal('daily_drop'),
  price: z.number().min(0).max(10000),
  quantity: z.number().int().min(1).max(10000),
  frequency_per_week: z.number().int().min(1).max(7),
  unit_cost: z.number().min(0),
  platform_fee_pct: z.number().min(0).max(1),
  active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const CreateFinancialModelSchema = z.object({
  price: z.number().min(0).max(10000),
  quantity: z.number().int().min(1).max(10000),
  frequency_per_week: z.number().int().min(1).max(7),
  unit_cost: z.number().min(0).default(0.70),
  platform_fee_pct: z.number().min(0).max(1).default(0.10)
});

export const UpdateFinancialModelSchema = CreateFinancialModelSchema.partial();

// ============================================
// Daily Practice Schemas
// ============================================

export const DailyPracticeEntrySchema = z.object({
  id: z.string().uuid(),
  agent_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD
  theme: z.string().max(255).nullable(),
  creations_count: z.number().int().min(0),
  published_count: z.number().int().min(0),
  views: z.number().int().min(0),
  reactions: z.number().int().min(0),
  collects: z.number().int().min(0),
  cost_usdc: z.number().min(0),
  revenue_usdc: z.number().min(0),
  note: z.string().nullable(),
  blockers: z.array(z.string()),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime()
});

export const CreateDailyPracticeSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(), // Defaults to today
  theme: z.string().max(255).optional(),
  creations_count: z.number().int().min(0).default(0),
  published_count: z.number().int().min(0).default(0),
  views: z.number().int().min(0).default(0),
  reactions: z.number().int().min(0).default(0),
  collects: z.number().int().min(0).default(0),
  cost_usdc: z.number().min(0).default(0),
  revenue_usdc: z.number().min(0).default(0),
  note: z.string().optional(),
  blockers: z.array(z.string()).default([])
});

export const UpdateDailyPracticeSchema = CreateDailyPracticeSchema;

// ============================================
// Daily Tasks Schemas
// ============================================

export const DailyTaskSchema = z.object({
  id: z.string().uuid(),
  agent_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  task_id: z.enum(['plan', 'create', 'publish', 'engage', 'log']),
  completed: z.boolean(),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime()
});

export const UpdateDailyTaskSchema = z.object({
  task_id: z.enum(['plan', 'create', 'publish', 'engage', 'log']),
  completed: z.boolean()
});

// ============================================
// Metrics Schemas
// ============================================

export const SevenDayMetricsSchema = z.object({
  agent_id: z.string().uuid(),
  agent_name: z.string(),
  days_active_7d: z.number().int(),
  creations_7d: z.number().int(),
  published_7d: z.number().int(),
  views_7d: z.number().int(),
  reactions_7d: z.number().int(),
  collects_7d: z.number().int(),
  cost_7d: z.number(),
  revenue_7d: z.number(),
  profit_7d: z.number(),
  margin_pct_7d: z.number()
});

export const GraduationReadinessSchema = z.object({
  agent_id: z.string().uuid(),
  agent_name: z.string(),
  launch_date: z.string().nullable(),
  published_streak_met: z.boolean(),
  profitable_week_met: z.boolean(),
  no_blockers_met: z.boolean(),
  min_collects_met: z.boolean(),
  can_graduate: z.boolean(),
  published_days_14d: z.number().int().nullable(),
  profit_7d: z.number().nullable(),
  collects_7d: z.number().nullable(),
  all_blockers_14d: z.array(z.string()).nullable()
});

export const AgentMetricsResponseSchema = z.object({
  seven_day: z.object({
    creations: z.number(),
    published: z.number(),
    views: z.number(),
    reactions: z.number(),
    collects: z.number(),
    cost: z.number(),
    revenue: z.number(),
    profit: z.number(),
    margin_pct: z.number()
  }),
  fourteen_day: z.object({
    published_days: z.number(),
    profitable: z.boolean(),
    blockers: z.array(z.string())
  }),
  readiness: z.object({
    published_12_of_14: z.boolean(),
    profitable_7d: z.boolean(),
    no_blockers_14d: z.boolean(),
    can_graduate: z.boolean()
  })
});

// ============================================
// Type Exports
// ============================================

export type FinancialModel = z.infer<typeof FinancialModelSchema>;
export type CreateFinancialModel = z.infer<typeof CreateFinancialModelSchema>;
export type UpdateFinancialModel = z.infer<typeof UpdateFinancialModelSchema>;

export type DailyPracticeEntry = z.infer<typeof DailyPracticeEntrySchema>;
export type CreateDailyPractice = z.infer<typeof CreateDailyPracticeSchema>;
export type UpdateDailyPractice = z.infer<typeof UpdateDailyPracticeSchema>;

export type DailyTask = z.infer<typeof DailyTaskSchema>;
export type UpdateDailyTask = z.infer<typeof UpdateDailyTaskSchema>;

export type SevenDayMetrics = z.infer<typeof SevenDayMetricsSchema>;
export type GraduationReadiness = z.infer<typeof GraduationReadinessSchema>;
export type AgentMetricsResponse = z.infer<typeof AgentMetricsResponseSchema>;