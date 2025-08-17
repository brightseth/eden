-- Operator Playbook Schema - Production-Ready
-- Includes: constraints, indexes, triggers, RLS, views

-- 1) Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2) Update agents table with operator fields
ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS launch_date DATE,
  ADD COLUMN IF NOT EXISTS creator_name VARCHAR(255),
  ADD COLUMN IF NOT EXISTS creator_wallet VARCHAR(255),
  ADD COLUMN IF NOT EXISTS daily_practice_active BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS treasury_usdc NUMERIC(18,6) DEFAULT 0 CHECK (treasury_usdc >= 0);

-- 3) Daily practice entries (one per agent/day)
CREATE TABLE IF NOT EXISTS public.daily_practice_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT (CURRENT_DATE AT TIME ZONE 'UTC'),
  theme VARCHAR(255),
  creations_count INTEGER NOT NULL DEFAULT 0 CHECK (creations_count >= 0),
  published_count INTEGER NOT NULL DEFAULT 0 CHECK (published_count >= 0),
  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
  reactions INTEGER NOT NULL DEFAULT 0 CHECK (reactions >= 0),
  collects INTEGER NOT NULL DEFAULT 0 CHECK (collects >= 0),
  cost_usdc NUMERIC(18,6) NOT NULL DEFAULT 0 CHECK (cost_usdc >= 0),
  revenue_usdc NUMERIC(18,6) NOT NULL DEFAULT 0 CHECK (revenue_usdc >= 0),
  note TEXT,
  blockers TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (agent_id, date)
);

-- 4) Financial models (active row per agent)
CREATE TABLE IF NOT EXISTS public.financial_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  model_type VARCHAR(50) NOT NULL DEFAULT 'daily_drop',
  price NUMERIC(18,6) NOT NULL CHECK (price >= 0 AND price <= 10000),
  quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 10000),
  frequency_per_week INTEGER NOT NULL CHECK (frequency_per_week BETWEEN 1 AND 7),
  unit_cost NUMERIC(18,6) NOT NULL CHECK (unit_cost >= 0),
  platform_fee_pct NUMERIC(5,4) NOT NULL DEFAULT 0.10 CHECK (platform_fee_pct >= 0 AND platform_fee_pct <= 1),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one active model per agent (enforced by partial unique index)
CREATE UNIQUE INDEX IF NOT EXISTS financial_models_one_active
  ON public.financial_models(agent_id)
  WHERE active = TRUE;

-- 5) Daily tasks tracking (optional, for checklist persistence)
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT (CURRENT_DATE AT TIME ZONE 'UTC'),
  task_id VARCHAR(50) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (agent_id, date, task_id)
);

-- 6) Updated_at triggers
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_touch_dpe ON public.daily_practice_entries;
CREATE TRIGGER trg_touch_dpe BEFORE UPDATE ON public.daily_practice_entries
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS trg_touch_finmodel ON public.financial_models;
CREATE TRIGGER trg_touch_finmodel BEFORE UPDATE ON public.financial_models
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 7) Performance indexes
CREATE INDEX IF NOT EXISTS dpe_agent_date_idx ON public.daily_practice_entries(agent_id, date DESC);
CREATE INDEX IF NOT EXISTS dpe_agent_created_idx ON public.daily_practice_entries(agent_id, created_at DESC);
CREATE INDEX IF NOT EXISTS dpe_date_idx ON public.daily_practice_entries(date DESC);
CREATE INDEX IF NOT EXISTS fm_agent_active_idx ON public.financial_models(agent_id, active);
CREATE INDEX IF NOT EXISTS dt_agent_date_idx ON public.daily_tasks(agent_id, date DESC);

-- 8) 7-day rollup view
CREATE OR REPLACE VIEW public.v_agent_daily_7d AS
SELECT
  a.id AS agent_id,
  a.name AS agent_name,
  COUNT(DISTINCT dpe.date) AS days_active_7d,
  COALESCE(SUM(dpe.creations_count), 0) AS creations_7d,
  COALESCE(SUM(dpe.published_count), 0) AS published_7d,
  COALESCE(SUM(dpe.views), 0) AS views_7d,
  COALESCE(SUM(dpe.reactions), 0) AS reactions_7d,
  COALESCE(SUM(dpe.collects), 0) AS collects_7d,
  COALESCE(SUM(dpe.cost_usdc), 0) AS cost_7d,
  COALESCE(SUM(dpe.revenue_usdc), 0) AS revenue_7d,
  COALESCE(SUM(dpe.revenue_usdc) - SUM(dpe.cost_usdc), 0) AS profit_7d,
  CASE 
    WHEN SUM(dpe.revenue_usdc) > 0 
    THEN ROUND((SUM(dpe.revenue_usdc) - SUM(dpe.cost_usdc)) / SUM(dpe.revenue_usdc) * 100, 2)
    ELSE 0 
  END AS margin_pct_7d
FROM public.agents a
LEFT JOIN public.daily_practice_entries dpe
  ON dpe.agent_id = a.id
  AND dpe.date >= (CURRENT_DATE - INTERVAL '7 days')
GROUP BY a.id, a.name;

-- 9) 14-day graduation check view
CREATE OR REPLACE VIEW public.v_agent_daily_14d AS
SELECT 
  agent_id,
  COUNT(DISTINCT CASE WHEN published_count > 0 THEN date END) AS published_days_14d,
  COUNT(DISTINCT CASE WHEN published_count > 0 THEN date END) >= 12 AS published_12_of_14,
  SUM(revenue_usdc) > SUM(cost_usdc) AS profitable_14d,
  SUM(revenue_usdc) AS revenue_14d,
  SUM(cost_usdc) AS cost_14d,
  ARRAY_AGG(DISTINCT unnest) AS all_blockers_14d
FROM public.daily_practice_entries
  LEFT JOIN LATERAL UNNEST(blockers) ON TRUE
WHERE date >= (CURRENT_DATE - INTERVAL '14 days')
GROUP BY agent_id;

-- 10) Graduation readiness view
CREATE OR REPLACE VIEW public.v_graduation_readiness AS
SELECT
  a.id AS agent_id,
  a.name AS agent_name,
  a.launch_date,
  COALESCE(d14.published_12_of_14, FALSE) AS published_streak_met,
  COALESCE(d7.profit_7d > 0, FALSE) AS profitable_week_met,
  COALESCE(CARDINALITY(d14.all_blockers_14d) = 0 OR d14.all_blockers_14d IS NULL, TRUE) AS no_blockers_met,
  COALESCE(d7.collects_7d >= 10, FALSE) AS min_collects_met,
  -- Overall graduation ready
  COALESCE(d14.published_12_of_14, FALSE) 
    AND COALESCE(d7.profit_7d > 0, FALSE)
    AND (COALESCE(CARDINALITY(d14.all_blockers_14d) = 0 OR d14.all_blockers_14d IS NULL, TRUE))
    AND COALESCE(d7.collects_7d >= 10, FALSE) AS can_graduate,
  -- Detailed metrics
  d14.published_days_14d,
  d7.profit_7d,
  d7.collects_7d,
  d14.all_blockers_14d
FROM public.agents a
LEFT JOIN public.v_agent_daily_14d d14 ON d14.agent_id = a.id
LEFT JOIN public.v_agent_daily_7d d7 ON d7.agent_id = a.id
WHERE a.daily_practice_active = TRUE;

-- 11) Financial model calculations view
CREATE OR REPLACE VIEW public.v_financial_model_metrics AS
SELECT
  fm.agent_id,
  fm.price,
  fm.quantity,
  fm.frequency_per_week,
  fm.unit_cost,
  fm.platform_fee_pct,
  -- Weekly calculations
  (fm.price * fm.quantity * fm.frequency_per_week) AS weekly_revenue,
  ((fm.unit_cost + (fm.price * fm.platform_fee_pct)) * fm.quantity * fm.frequency_per_week) AS weekly_cogs,
  ((fm.price * fm.quantity * fm.frequency_per_week) - 
   ((fm.unit_cost + (fm.price * fm.platform_fee_pct)) * fm.quantity * fm.frequency_per_week)) AS weekly_gross_profit,
  -- Margin percentage
  CASE 
    WHEN (fm.price * fm.quantity * fm.frequency_per_week) > 0
    THEN ROUND((((fm.price * fm.quantity * fm.frequency_per_week) - 
                 ((fm.unit_cost + (fm.price * fm.platform_fee_pct)) * fm.quantity * fm.frequency_per_week)) / 
                (fm.price * fm.quantity * fm.frequency_per_week)) * 100, 2)
    ELSE 0
  END AS margin_pct,
  -- Break-even units
  CEIL(fm.unit_cost / (fm.price * (1 - fm.platform_fee_pct))) AS breakeven_units,
  -- Runway calculation (requires treasury)
  CASE
    WHEN ((fm.price * fm.quantity * fm.frequency_per_week) - 
          ((fm.unit_cost + (fm.price * fm.platform_fee_pct)) * fm.quantity * fm.frequency_per_week)) >= 0
    THEN NULL -- Profitable, infinite runway
    ELSE FLOOR(a.treasury_usdc / ABS(((fm.price * fm.quantity * fm.frequency_per_week) - 
                                       ((fm.unit_cost + (fm.price * fm.platform_fee_pct)) * fm.quantity * fm.frequency_per_week)) / 7))
  END AS runway_weeks
FROM public.financial_models fm
JOIN public.agents a ON a.id = fm.agent_id
WHERE fm.active = TRUE;

-- 12) Row Level Security
ALTER TABLE public.daily_practice_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies (adjust based on your auth model)
-- For now, allow all authenticated users to read/write their agent's data

-- Daily practice entries
CREATE POLICY dpe_read ON public.daily_practice_entries
  FOR SELECT USING (TRUE);
CREATE POLICY dpe_write ON public.daily_practice_entries
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY dpe_update ON public.daily_practice_entries
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY dpe_delete ON public.daily_practice_entries
  FOR DELETE USING (TRUE);

-- Financial models
CREATE POLICY fm_read ON public.financial_models
  FOR SELECT USING (TRUE);
CREATE POLICY fm_write ON public.financial_models
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY fm_update ON public.financial_models
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY fm_delete ON public.financial_models
  FOR DELETE USING (TRUE);

-- Daily tasks
CREATE POLICY dt_read ON public.daily_tasks
  FOR SELECT USING (TRUE);
CREATE POLICY dt_write ON public.daily_tasks
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY dt_update ON public.daily_tasks
  FOR UPDATE USING (TRUE) WITH CHECK (TRUE);
CREATE POLICY dt_delete ON public.daily_tasks
  FOR DELETE USING (TRUE);

-- 13) Helper functions for common operations
CREATE OR REPLACE FUNCTION public.upsert_daily_practice(
  p_agent_id UUID,
  p_date DATE,
  p_theme VARCHAR(255) DEFAULT NULL,
  p_creations_count INTEGER DEFAULT 0,
  p_published_count INTEGER DEFAULT 0,
  p_views INTEGER DEFAULT 0,
  p_reactions INTEGER DEFAULT 0,
  p_collects INTEGER DEFAULT 0,
  p_cost_usdc NUMERIC(18,6) DEFAULT 0,
  p_revenue_usdc NUMERIC(18,6) DEFAULT 0,
  p_note TEXT DEFAULT NULL,
  p_blockers TEXT[] DEFAULT '{}'
)
RETURNS public.daily_practice_entries
LANGUAGE plpgsql
AS $$
DECLARE
  v_result public.daily_practice_entries;
BEGIN
  INSERT INTO public.daily_practice_entries (
    agent_id, date, theme, creations_count, published_count,
    views, reactions, collects, cost_usdc, revenue_usdc, note, blockers
  ) VALUES (
    p_agent_id, p_date, p_theme, p_creations_count, p_published_count,
    p_views, p_reactions, p_collects, p_cost_usdc, p_revenue_usdc, p_note, p_blockers
  )
  ON CONFLICT (agent_id, date) DO UPDATE SET
    theme = COALESCE(EXCLUDED.theme, daily_practice_entries.theme),
    creations_count = EXCLUDED.creations_count,
    published_count = EXCLUDED.published_count,
    views = EXCLUDED.views,
    reactions = EXCLUDED.reactions,
    collects = EXCLUDED.collects,
    cost_usdc = EXCLUDED.cost_usdc,
    revenue_usdc = EXCLUDED.revenue_usdc,
    note = COALESCE(EXCLUDED.note, daily_practice_entries.note),
    blockers = CASE 
      WHEN CARDINALITY(EXCLUDED.blockers) > 0 THEN EXCLUDED.blockers
      ELSE daily_practice_entries.blockers
    END,
    updated_at = NOW()
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$;