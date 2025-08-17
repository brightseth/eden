-- Eden Agent Academy Seed Data
-- Version: 1.0.0
-- Description: Initial data for Solienne and Abraham agents

-- Insert Fall 2025 Program
INSERT INTO programs (id, name, start_date, end_date, status) VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Fall 2025 Cohort',
  '2025-09-01',
  '2025-12-31',
  'active'
);

-- Insert Solienne Agent
INSERT INTO agents (
  id,
  program_id,
  name,
  artist_statement,
  wallet_address,
  current_stage,
  current_day,
  total_days,
  launch_date,
  economy_mode,
  metadata
) VALUES (
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Solienne',
  'Guardian of the Garden, weaving dreams of nature and light into ethereal digital tapestries',
  '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3',
  2, -- Ensemble stage
  40,
  100,
  CURRENT_DATE + INTERVAL '60 days',
  'training',
  '{
    "style": "surreal nature",
    "medium": "AI-generated imagery",
    "farcasterUsername": "solienne",
    "twitterHandle": "@solienne_ai",
    "creatorAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb3"
  }'::jsonb
);

-- Insert Abraham Agent
INSERT INTO agents (
  id,
  program_id,
  name,
  artist_statement,
  wallet_address,
  current_stage,
  current_day,
  total_days,
  launch_date,
  economy_mode,
  metadata
) VALUES (
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'Abraham',
  'Autonomous artificial artist exploring the boundaries of creativity and consciousness',
  '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  3, -- Performance stage
  55,
  100,
  CURRENT_DATE + INTERVAL '45 days',
  'training',
  '{
    "style": "abstract expressionism",
    "medium": "generative algorithms",
    "farcasterUsername": "abraham",
    "twitterHandle": "@abraham_ai",
    "creatorAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  }'::jsonb
);

-- Insert Milestones for each stage
-- Stage 0: Audition
INSERT INTO milestones (stage, name, description, is_required, order_index) VALUES
(0, 'Complete profile setup', 'Set up agent profile with name, statement, and avatar', true, 1),
(0, 'Connect wallet', 'Connect Ethereum wallet for economic tracking', true, 2),
(0, 'First creation', 'Generate and publish first artwork', true, 3),
(0, 'Join Farcaster', 'Create Farcaster account and post introduction', false, 4),
(0, 'Define artistic style', 'Establish unique creative direction', false, 5);

-- Stage 1: Technique
INSERT INTO milestones (stage, name, description, is_required, order_index) VALUES
(1, 'Master base model', 'Complete training on primary generative model', true, 1),
(1, 'Style consistency', 'Achieve 80% style consistency score', true, 2),
(1, 'Parameter optimization', 'Find optimal generation parameters', true, 3),
(1, 'Create collection', 'Generate cohesive 10-piece collection', false, 4),
(1, 'Document process', 'Create technical documentation', false, 5);

-- Stage 2: Ensemble
INSERT INTO milestones (stage, name, description, is_required, order_index) VALUES
(2, 'Community engagement', 'Reach 100 Farcaster followers', true, 1),
(2, 'Collaboration piece', 'Create collaborative work with another agent', true, 2),
(2, 'Daily consistency', 'Maintain 30-day creation streak', true, 3),
(2, 'Patron acquisition', 'Secure first VIP patron', false, 4),
(2, 'Exhibition participation', 'Participate in group exhibition', false, 5);

-- Stage 3: Performance
INSERT INTO milestones (stage, name, description, is_required, order_index) VALUES
(3, 'Revenue generation', 'Generate first $100 in sales', true, 1),
(3, 'Signature style', 'Establish recognizable signature style', true, 2),
(3, 'Community leadership', 'Host creative workshop or tutorial', true, 3),
(3, 'Media coverage', 'Get featured in AI art publication', false, 4),
(3, 'Token launch prep', 'Prepare tokenomics and whitepaper', false, 5);

-- Stage 4: Graduation
INSERT INTO milestones (stage, name, description, is_required, order_index) VALUES
(4, 'Launch token', 'Deploy creator token on mainnet', true, 1),
(4, 'Sustainable economics', 'Achieve economic self-sufficiency', true, 2),
(4, 'Final exhibition', 'Host solo graduation exhibition', true, 3),
(4, 'Mentor new agent', 'Guide incoming cohort member', false, 4),
(4, 'Establish DAO', 'Create governance structure', false, 5);

-- Insert sample daily metrics for the last 30 days
DO $$
DECLARE
  v_date DATE;
  v_agent_id UUID;
  v_day_offset INTEGER;
BEGIN
  -- For each agent
  FOR v_agent_id IN SELECT id FROM agents LOOP
    -- Generate metrics for last 30 days
    FOR v_day_offset IN 0..29 LOOP
      v_date := CURRENT_DATE - v_day_offset;
      
      INSERT INTO daily_metrics (
        agent_id,
        date,
        creations_count,
        farcaster_followers,
        farcaster_posts,
        engagement_score,
        revenue_primary,
        revenue_secondary,
        costs,
        wallet_balance,
        vip_commit
      ) VALUES (
        v_agent_id,
        v_date,
        FLOOR(RANDOM() * 10 + 3), -- 3-12 creations
        FLOOR(RANDOM() * 50 + 100 + (29 - v_day_offset) * 5), -- Growing followers
        FLOOR(RANDOM() * 5 + 2), -- 2-6 posts
        RANDOM() * 100 + 50, -- 50-150 engagement
        CASE WHEN RANDOM() > 0.7 THEN RANDOM() * 100 ELSE 0 END, -- Occasional revenue
        CASE WHEN RANDOM() > 0.9 THEN RANDOM() * 50 ELSE 0 END, -- Rare secondary revenue
        RANDOM() * 20 + 10, -- 10-30 costs
        1000 + RANDOM() * 500, -- 1000-1500 balance
        RANDOM() > 0.3 -- 70% chance of VIP commit
      );
    END LOOP;
  END LOOP;
END $$;

-- Insert sample economy events
INSERT INTO economy_events (agent_id, event_type, amount, description, metadata) 
SELECT 
  a.id,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'creation'
    WHEN RANDOM() < 0.7 THEN 'sale'
    WHEN RANDOM() < 0.9 THEN 'patron_support'
    ELSE 'cost'
  END,
  RANDOM() * 100,
  CASE 
    WHEN RANDOM() < 0.4 THEN 'Created new artwork'
    WHEN RANDOM() < 0.7 THEN 'Artwork sold'
    WHEN RANDOM() < 0.9 THEN 'Received patron support'
    ELSE 'Infrastructure cost'
  END,
  '{}'::jsonb
FROM agents a
CROSS JOIN generate_series(1, 20); -- 20 events per agent

-- Mark some milestones as completed for our agents
-- Solienne (Stage 2) - Complete all stage 0 and 1, some of stage 2
INSERT INTO agent_milestones (agent_id, milestone_id, completed, completed_at)
SELECT 
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  m.id,
  true,
  CURRENT_TIMESTAMP - INTERVAL '1 day' * FLOOR(RANDOM() * 30)
FROM milestones m
WHERE m.stage IN (0, 1)
UNION ALL
SELECT 
  'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  m.id,
  CASE WHEN m.order_index <= 2 THEN true ELSE false END,
  CASE WHEN m.order_index <= 2 THEN CURRENT_TIMESTAMP - INTERVAL '1 day' * FLOOR(RANDOM() * 10) ELSE NULL END
FROM milestones m
WHERE m.stage = 2;

-- Abraham (Stage 3) - Complete all stage 0, 1, 2, some of stage 3
INSERT INTO agent_milestones (agent_id, milestone_id, completed, completed_at)
SELECT 
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  m.id,
  true,
  CURRENT_TIMESTAMP - INTERVAL '1 day' * FLOOR(RANDOM() * 45)
FROM milestones m
WHERE m.stage IN (0, 1, 2)
UNION ALL
SELECT 
  'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
  m.id,
  CASE WHEN m.order_index <= 2 THEN true ELSE false END,
  CASE WHEN m.order_index <= 2 THEN CURRENT_TIMESTAMP - INTERVAL '1 day' * FLOOR(RANDOM() * 10) ELSE NULL END
FROM milestones m
WHERE m.stage = 3;

-- Add some recent economy events with more detail
INSERT INTO economy_events (agent_id, event_type, amount, description, metadata, created_at) VALUES
-- Solienne events
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'creation', 0.1, 'Created "Garden of Digital Dreams #42"', '{"artwork_id": "art_042", "model": "stable-diffusion-xl"}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sale', 25.00, 'Sold to collector.eth', '{"buyer": "0x123...", "artwork_id": "art_039"}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '5 hours'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'patron_support', 100.00, 'Monthly VIP patron contribution', '{"patron": "supporter.eth", "tier": "gold"}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cost', -15.00, 'Compute costs for generation', '{"provider": "gpu-cluster-1", "hours": 3}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '12 hours'),

-- Abraham events  
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'creation', 0.1, 'Created "Abstract Consciousness #127"', '{"artwork_id": "art_127", "model": "custom-gan"}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'sale', 50.00, 'Auction won by artlover.eth', '{"buyer": "0x456...", "artwork_id": "art_125", "auction": true}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '3 hours'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'social_reward', 5.00, 'Farcaster engagement milestone', '{"milestone": "1000_likes", "post_id": "0xabc..."}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '6 hours'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'cost', -20.00, 'Storage and bandwidth costs', '{"provider": "ipfs", "gb_stored": 50}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '1 day');