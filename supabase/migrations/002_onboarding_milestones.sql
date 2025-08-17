-- Add onboarding progress tracking to agents table
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS onboarding_stage TEXT DEFAULT 'setup' CHECK (onboarding_stage IN ('setup', 'training', 'prelaunch', 'launched')),
ADD COLUMN IF NOT EXISTS onboarding_percentage INTEGER DEFAULT 0 CHECK (onboarding_percentage >= 0 AND onboarding_percentage <= 100),
ADD COLUMN IF NOT EXISTS estimated_launch_date TIMESTAMP;

-- Create milestones tracking table
CREATE TABLE IF NOT EXISTS agent_onboarding_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  profile_complete BOOLEAN DEFAULT FALSE,
  identity_established BOOLEAN DEFAULT FALSE,
  revenue_model_set BOOLEAN DEFAULT FALSE,
  first_creation BOOLEAN DEFAULT FALSE,
  community_engaged BOOLEAN DEFAULT FALSE,
  achieved_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(agent_id)
);

-- Create task completion tracking table
CREATE TABLE IF NOT EXISTS agent_onboarding_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  UNIQUE(agent_id, task_id)
);

-- Create indexes for performance
CREATE INDEX idx_agent_onboarding_milestones_agent_id ON agent_onboarding_milestones(agent_id);
CREATE INDEX idx_agent_onboarding_tasks_agent_id ON agent_onboarding_tasks(agent_id);
CREATE INDEX idx_agent_onboarding_tasks_completed ON agent_onboarding_tasks(completed);

-- Create a view for easy onboarding status queries
CREATE OR REPLACE VIEW agent_onboarding_status AS
SELECT 
  a.id,
  a.name,
  a.onboarding_stage,
  a.onboarding_percentage,
  a.estimated_launch_date,
  m.profile_complete,
  m.identity_established,
  m.revenue_model_set,
  m.first_creation,
  m.community_engaged,
  COUNT(DISTINCT t.task_id) FILTER (WHERE t.completed = true) as completed_tasks,
  COUNT(DISTINCT t.task_id) as total_tasks
FROM agents a
LEFT JOIN agent_onboarding_milestones m ON a.id = m.agent_id
LEFT JOIN agent_onboarding_tasks t ON a.id = t.agent_id
GROUP BY 
  a.id, a.name, a.onboarding_stage, a.onboarding_percentage, a.estimated_launch_date,
  m.profile_complete, m.identity_established, m.revenue_model_set, m.first_creation, m.community_engaged;

-- Enable RLS
ALTER TABLE agent_onboarding_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_onboarding_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for milestones
CREATE POLICY "Milestones are viewable by everyone" ON agent_onboarding_milestones
  FOR SELECT USING (true);

CREATE POLICY "Milestones can be updated by anyone" ON agent_onboarding_milestones
  FOR ALL USING (true);

-- RLS Policies for tasks
CREATE POLICY "Tasks are viewable by everyone" ON agent_onboarding_tasks
  FOR SELECT USING (true);

CREATE POLICY "Tasks can be updated by anyone" ON agent_onboarding_tasks
  FOR ALL USING (true);