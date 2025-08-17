-- Seed script for Operator Playbook data
-- This version handles existing agents

-- First, get the existing Solienne agent or create one
DO $$
DECLARE
  v_agent_id UUID;
BEGIN
  -- Try to find existing Solienne agent
  SELECT id INTO v_agent_id FROM public.agents WHERE name = 'Solienne' LIMIT 1;
  
  -- If not found, use our test UUID
  IF v_agent_id IS NULL THEN
    v_agent_id := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::UUID;
    
    INSERT INTO public.agents (id, name, wallet_address, current_stage, current_day, created_at, updated_at, creator_name, creator_wallet, launch_date, daily_practice_active, treasury_usdc)
    VALUES (
      v_agent_id,
      'Solienne',
      '0x742d35Cc6634C0532925a3b844Bc9e7595f0bE8f3c',
      1,
      15,
      NOW() - INTERVAL '15 days',
      NOW(),
      'Kristi West',
      'kristi.eth',
      '2025-01-10',
      TRUE,
      100.00
    );
  ELSE
    -- Update existing agent with operator fields
    UPDATE public.agents 
    SET 
      creator_name = COALESCE(creator_name, 'Kristi West'),
      creator_wallet = COALESCE(creator_wallet, 'kristi.eth'),
      launch_date = COALESCE(launch_date, '2025-01-10'),
      daily_practice_active = TRUE,
      treasury_usdc = COALESCE(treasury_usdc, 100.00),
      updated_at = NOW()
    WHERE id = v_agent_id;
  END IF;
  
  -- Store the agent_id for use in subsequent inserts
  PERFORM set_config('app.agent_id', v_agent_id::TEXT, false);
END $$;

-- Get the agent_id we're working with
WITH agent AS (
  SELECT id FROM public.agents WHERE name = 'Solienne' LIMIT 1
)
-- Seed financial model
INSERT INTO public.financial_models (agent_id, model_type, price, quantity, frequency_per_week, unit_cost, platform_fee_pct, active)
SELECT 
  agent.id,
  'daily_drop',
  5.00,
  10,
  7,
  0.70,
  0.10,
  TRUE
FROM agent
ON CONFLICT (agent_id) WHERE active = TRUE
DO UPDATE SET
  price = EXCLUDED.price,
  quantity = EXCLUDED.quantity,
  frequency_per_week = EXCLUDED.frequency_per_week,
  unit_cost = EXCLUDED.unit_cost,
  platform_fee_pct = EXCLUDED.platform_fee_pct;

-- Seed daily practice entries for the last 14 days
WITH agent AS (
  SELECT id FROM public.agents WHERE name = 'Solienne' LIMIT 1
)
INSERT INTO public.daily_practice_entries (agent_id, date, theme, creations_count, published_count, views, reactions, collects, cost_usdc, revenue_usdc, note, blockers)
SELECT 
  agent.id,
  date,
  theme,
  creations_count,
  published_count,
  views,
  reactions,
  collects,
  cost_usdc,
  revenue_usdc,
  note,
  blockers
FROM agent, (VALUES
  -- Day 1 (14 days ago)
  (CURRENT_DATE - 14, 'Abstract Landscapes', 12, 2, 145, 8, 0, 2.40, 0.00, 'First day experimenting', '{}'),
  -- Day 2
  (CURRENT_DATE - 13, 'Abstract Landscapes', 8, 1, 98, 5, 0, 1.60, 0.00, 'Low engagement', '{}'),
  -- Day 3
  (CURRENT_DATE - 12, 'Portraits', 10, 3, 234, 15, 1, 2.00, 5.00, 'First sale!', '{}'),
  -- Day 4
  (CURRENT_DATE - 11, 'Portraits', 15, 4, 312, 22, 2, 3.00, 10.00, 'Portraits working well', '{}'),
  -- Day 5
  (CURRENT_DATE - 10, 'Portraits', 12, 3, 456, 28, 1, 2.40, 5.00, 'Consistent engagement', '{}'),
  -- Day 6
  (CURRENT_DATE - 9, 'Minimal Portraits', 6, 2, 523, 45, 3, 1.20, 15.00, 'Less is more!', '{}'),
  -- Day 7
  (CURRENT_DATE - 8, 'Minimal Portraits', 8, 3, 678, 52, 4, 1.60, 20.00, 'Best day yet', '{}'),
  -- Day 8
  (CURRENT_DATE - 7, 'Minimal Portraits', 0, 0, 0, 0, 0, 0.00, 0.00, 'API down', ARRAY['Eden API unavailable']),
  -- Day 9
  (CURRENT_DATE - 6, 'Minimal Portraits', 9, 3, 712, 58, 2, 1.80, 10.00, 'Back online', '{}'),
  -- Day 10
  (CURRENT_DATE - 5, 'Noir Portraits', 11, 4, 823, 64, 3, 2.20, 15.00, 'Trying noir style', '{}'),
  -- Day 11
  (CURRENT_DATE - 4, 'Noir Portraits', 10, 3, 945, 71, 4, 2.00, 20.00, 'Noir is popular', '{}'),
  -- Day 12
  (CURRENT_DATE - 3, 'Noir Portraits', 13, 5, 1087, 82, 5, 2.60, 25.00, 'Record collects!', '{}'),
  -- Day 13
  (CURRENT_DATE - 2, 'Noir Portraits', 14, 4, 1234, 95, 3, 2.80, 15.00, 'Steady progress', '{}'),
  -- Day 14 (yesterday)
  (CURRENT_DATE - 1, 'Noir Portraits', 12, 4, 1456, 103, 4, 2.40, 20.00, 'Almost at goal', '{}'),
  -- Today
  (CURRENT_DATE, 'Noir Portraits', 8, 2, 234, 18, 1, 1.60, 5.00, 'Morning update', '{}')
) AS v(date, theme, creations_count, published_count, views, reactions, collects, cost_usdc, revenue_usdc, note, blockers)
ON CONFLICT (agent_id, date) DO UPDATE SET
  theme = EXCLUDED.theme,
  creations_count = EXCLUDED.creations_count,
  published_count = EXCLUDED.published_count,
  views = EXCLUDED.views,
  reactions = EXCLUDED.reactions,
  collects = EXCLUDED.collects,
  cost_usdc = EXCLUDED.cost_usdc,
  revenue_usdc = EXCLUDED.revenue_usdc,
  note = EXCLUDED.note,
  blockers = EXCLUDED.blockers;

-- Seed daily tasks for today
WITH agent AS (
  SELECT id FROM public.agents WHERE name = 'Solienne' LIMIT 1
)
INSERT INTO public.daily_tasks (agent_id, date, task_id, completed, completed_at)
SELECT 
  agent.id,
  CURRENT_DATE,
  task_id,
  completed,
  completed_at
FROM agent, (VALUES
  ('plan', TRUE, NOW() - INTERVAL '6 hours'),
  ('create', TRUE, NOW() - INTERVAL '4 hours'),
  ('publish', TRUE, NOW() - INTERVAL '2 hours'),
  ('engage', FALSE, NULL),
  ('log', FALSE, NULL)
) AS v(task_id, completed, completed_at)
ON CONFLICT (agent_id, date, task_id) DO UPDATE SET
  completed = EXCLUDED.completed,
  completed_at = EXCLUDED.completed_at;

-- Verify the data looks good
SELECT 
  'Agent' as table_name,
  COUNT(*) as row_count 
FROM public.agents 
WHERE daily_practice_active = TRUE

UNION ALL

SELECT 
  'Financial Models' as table_name,
  COUNT(*) as row_count 
FROM public.financial_models 
WHERE active = TRUE

UNION ALL

SELECT 
  'Daily Practice Entries' as table_name,
  COUNT(*) as row_count 
FROM public.daily_practice_entries

UNION ALL

SELECT 
  'Daily Tasks' as table_name,
  COUNT(*) as row_count 
FROM public.daily_tasks

UNION ALL

SELECT 
  '7-Day Metrics' as table_name,
  COUNT(*) as row_count 
FROM public.v_agent_daily_7d

UNION ALL

SELECT 
  'Graduation Ready' as table_name,
  COUNT(*) as row_count 
FROM public.v_graduation_readiness
WHERE can_graduate = TRUE;

-- Show the agent ID being used
SELECT id, name, creator_name, daily_practice_active 
FROM public.agents 
WHERE name = 'Solienne';