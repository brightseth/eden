/**
 * Creative Pipeline Production Schema - Phase 4
 * 
 * Complete database schema for production-ready creator-to-agent pipeline.
 * Includes all tables from previous phases plus performance optimizations.
 */

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Creator Profiles Table (Enhanced from Phase 1)
CREATE TABLE IF NOT EXISTS creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creative_role TEXT CHECK (creative_role IN ('visual-artist', 'musician', 'writer', 'mixed-media', 'curator', 'undefined')) DEFAULT 'undefined',
  onboarding_stage TEXT CHECK (onboarding_stage IN ('portfolio-submission', 'cultural-alignment-check', 'skill-assessment', 'agent-potential-mapping', 'academy-integration', 'training-path-selection', 'completed')) DEFAULT 'portfolio-submission',
  cultural_alignment INTEGER CHECK (cultural_alignment >= 0 AND cultural_alignment <= 100) DEFAULT 0,
  readiness_score INTEGER CHECK (readiness_score >= 0 AND readiness_score <= 100) DEFAULT 0,
  ai_experience_level TEXT CHECK (ai_experience_level IN ('none', 'basic', 'intermediate', 'advanced')) DEFAULT 'none',
  community_interest INTEGER CHECK (community_interest >= 0 AND community_interest <= 100) DEFAULT 0,
  preferred_learning_style TEXT CHECK (preferred_learning_style IN ('project-based', 'structured', 'peer-learning', 'self-directed')) DEFAULT 'project-based',
  referral_source TEXT,
  cultural_motivation TEXT,
  collaboration_experience TEXT,
  -- Performance and production fields
  pipeline_version TEXT DEFAULT '1.0',
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assessment Scores Table (Enhanced)
CREATE TABLE IF NOT EXISTS assessment_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  dimension TEXT NOT NULL,
  score INTEGER CHECK (score >= 0 AND score <= 100) NOT NULL,
  max_score INTEGER DEFAULT 100,
  evidence JSONB DEFAULT '{}',
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  assessor_type TEXT CHECK (assessor_type IN ('ai', 'human', 'peer')) DEFAULT 'ai',
  cultural_notes TEXT,
  growth_potential TEXT CHECK (growth_potential IN ('high', 'medium', 'low')) DEFAULT 'medium',
  collaboration_readiness INTEGER CHECK (collaboration_readiness >= 0 AND collaboration_readiness <= 100) DEFAULT 50,
  -- Production enhancements
  assessment_version TEXT DEFAULT '1.0',
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100) DEFAULT 90,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pipeline Sessions Table (Enhanced)
CREATE TABLE IF NOT EXISTS pipeline_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  stage TEXT CHECK (stage IN ('portfolio-submission', 'cultural-alignment-check', 'skill-assessment', 'agent-potential-mapping', 'academy-integration', 'training-path-selection', 'completed')) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  feedback TEXT[] DEFAULT '{}',
  next_steps TEXT[] DEFAULT '{}',
  cultural_mentor_notes TEXT,
  session_data JSONB DEFAULT '{}',
  -- Production tracking
  processing_time_ms INTEGER DEFAULT 0,
  success_metrics JSONB DEFAULT '{}',
  error_logs JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Agent Potential Mappings Table (Enhanced)
CREATE TABLE IF NOT EXISTS agent_potential_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  agent_role TEXT CHECK (agent_role IN ('image-generation', 'audio-creation', 'text-story-generation', 'multi-modal-creative', 'curation-assistant', 'exploration-needed')) NOT NULL,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100) NOT NULL,
  cultural_fit INTEGER CHECK (cultural_fit >= 0 AND cultural_fit <= 100) NOT NULL,
  reasoning TEXT[] DEFAULT '{}',
  training_path_suggestion TEXT NOT NULL,
  expected_growth_areas TEXT[] DEFAULT '{}',
  -- Production enhancements
  market_analysis JSONB DEFAULT '{}',
  economic_viability JSONB DEFAULT '{}',
  launch_readiness INTEGER CHECK (launch_readiness >= 0 AND launch_readiness <= 100) DEFAULT 0,
  recommendation_rank INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator Economics Table (New for Phase 4)
CREATE TABLE IF NOT EXISTS creator_economics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  revenue_model TEXT CHECK (revenue_model IN ('agent-originator', 'ongoing-trainer', 'agent-collaborator', 'creator-mentor')) NOT NULL,
  projected_monthly_revenue INTEGER DEFAULT 0,
  revenue_share_percentage DECIMAL(5,2) CHECK (revenue_share_percentage >= 0 AND revenue_share_percentage <= 100) DEFAULT 25.00,
  economic_validation_score INTEGER CHECK (economic_validation_score >= 0 AND economic_validation_score <= 100) DEFAULT 0,
  market_demand_score INTEGER CHECK (market_demand_score >= 0 AND market_demand_score <= 100) DEFAULT 70,
  competitive_advantage_score INTEGER CHECK (competitive_advantage_score >= 0 AND competitive_advantage_score <= 100) DEFAULT 50,
  contract_terms JSONB DEFAULT '{}',
  validation_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  validated_by TEXT DEFAULT 'system',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pipeline Metrics Table (New for Production Monitoring)
CREATE TABLE IF NOT EXISTS pipeline_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  metric_unit TEXT DEFAULT 'count',
  stage TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Feature Flag Overrides Table (New for Production Control)
CREATE TABLE IF NOT EXISTS creator_feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  flag_name TEXT NOT NULL,
  flag_value BOOLEAN NOT NULL,
  override_reason TEXT,
  set_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS creator_profiles_user_id_idx ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS creator_profiles_onboarding_stage_idx ON creator_profiles(onboarding_stage);
CREATE INDEX IF NOT EXISTS creator_profiles_cultural_alignment_idx ON creator_profiles(cultural_alignment);
CREATE INDEX IF NOT EXISTS creator_profiles_last_activity_idx ON creator_profiles(last_activity_at);

CREATE INDEX IF NOT EXISTS assessment_scores_creator_profile_id_idx ON assessment_scores(creator_profile_id);
CREATE INDEX IF NOT EXISTS assessment_scores_dimension_idx ON assessment_scores(dimension);
CREATE INDEX IF NOT EXISTS assessment_scores_assessed_at_idx ON assessment_scores(assessed_at);

CREATE INDEX IF NOT EXISTS pipeline_sessions_creator_profile_id_idx ON pipeline_sessions(creator_profile_id);
CREATE INDEX IF NOT EXISTS pipeline_sessions_stage_idx ON pipeline_sessions(stage);
CREATE INDEX IF NOT EXISTS pipeline_sessions_started_at_idx ON pipeline_sessions(started_at);

CREATE INDEX IF NOT EXISTS agent_potential_mappings_creator_profile_id_idx ON agent_potential_mappings(creator_profile_id);
CREATE INDEX IF NOT EXISTS agent_potential_mappings_agent_role_idx ON agent_potential_mappings(agent_role);
CREATE INDEX IF NOT EXISTS agent_potential_mappings_confidence_idx ON agent_potential_mappings(confidence DESC);

CREATE INDEX IF NOT EXISTS creator_economics_creator_profile_id_idx ON creator_economics(creator_profile_id);
CREATE INDEX IF NOT EXISTS creator_economics_revenue_model_idx ON creator_economics(revenue_model);
CREATE INDEX IF NOT EXISTS creator_economics_validation_score_idx ON creator_economics(economic_validation_score DESC);

CREATE INDEX IF NOT EXISTS pipeline_metrics_creator_profile_id_idx ON pipeline_metrics(creator_profile_id);
CREATE INDEX IF NOT EXISTS pipeline_metrics_type_name_idx ON pipeline_metrics(metric_type, metric_name);
CREATE INDEX IF NOT EXISTS pipeline_metrics_recorded_at_idx ON pipeline_metrics(recorded_at);

CREATE INDEX IF NOT EXISTS creator_feature_flags_creator_profile_id_idx ON creator_feature_flags(creator_profile_id);
CREATE INDEX IF NOT EXISTS creator_feature_flags_flag_name_idx ON creator_feature_flags(flag_name);

-- Row Level Security (RLS) Policies
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_potential_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_economics ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_feature_flags ENABLE ROW LEVEL SECURITY;

-- RLS Policies for creator_profiles
CREATE POLICY "Users can view own creator profile" ON creator_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creator profile" ON creator_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creator profile" ON creator_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for assessment_scores
CREATE POLICY "Users can view own assessment scores" ON assessment_scores
  FOR SELECT USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert assessment scores" ON assessment_scores
  FOR INSERT WITH CHECK (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for pipeline_sessions
CREATE POLICY "Users can view own pipeline sessions" ON pipeline_sessions
  FOR SELECT USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage pipeline sessions" ON pipeline_sessions
  FOR ALL USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for agent_potential_mappings
CREATE POLICY "Users can view own agent mappings" ON agent_potential_mappings
  FOR SELECT USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage agent mappings" ON agent_potential_mappings
  FOR ALL USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for creator_economics
CREATE POLICY "Users can view own economics data" ON creator_economics
  FOR SELECT USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can manage economics data" ON creator_economics
  FOR ALL USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for pipeline_metrics
CREATE POLICY "Users can view own metrics" ON pipeline_metrics
  FOR SELECT USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert metrics" ON pipeline_metrics
  FOR INSERT WITH CHECK (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for creator_feature_flags
CREATE POLICY "Users can view own feature flags" ON creator_feature_flags
  FOR SELECT USING (
    creator_profile_id IN (
      SELECT id FROM creator_profiles WHERE user_id = auth.uid()
    )
  );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_creator_profiles_updated_at BEFORE UPDATE ON creator_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pipeline_sessions_updated_at BEFORE UPDATE ON pipeline_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_potential_mappings_updated_at BEFORE UPDATE ON agent_potential_mappings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_creator_economics_updated_at BEFORE UPDATE ON creator_economics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_activity_at on creator_profiles
CREATE OR REPLACE FUNCTION update_creator_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE creator_profiles 
  SET last_activity_at = now() 
  WHERE id = COALESCE(NEW.creator_profile_id, OLD.creator_profile_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers to update activity timestamp
CREATE TRIGGER update_activity_on_assessment_scores 
  AFTER INSERT OR UPDATE OR DELETE ON assessment_scores
  FOR EACH ROW EXECUTE FUNCTION update_creator_activity();

CREATE TRIGGER update_activity_on_pipeline_sessions 
  AFTER INSERT OR UPDATE OR DELETE ON pipeline_sessions
  FOR EACH ROW EXECUTE FUNCTION update_creator_activity();

CREATE TRIGGER update_activity_on_agent_mappings 
  AFTER INSERT OR UPDATE OR DELETE ON agent_potential_mappings
  FOR EACH ROW EXECUTE FUNCTION update_creator_activity();

-- Views for common queries
CREATE OR REPLACE VIEW creator_pipeline_overview AS
SELECT 
  cp.id,
  cp.user_id,
  cp.creative_role,
  cp.onboarding_stage,
  cp.cultural_alignment,
  cp.readiness_score,
  cp.created_at,
  cp.updated_at,
  cp.last_activity_at,
  -- Latest pipeline session
  (SELECT stage FROM pipeline_sessions ps WHERE ps.creator_profile_id = cp.id ORDER BY ps.started_at DESC LIMIT 1) as latest_session_stage,
  (SELECT started_at FROM pipeline_sessions ps WHERE ps.creator_profile_id = cp.id ORDER BY ps.started_at DESC LIMIT 1) as latest_session_date,
  -- Assessment counts
  (SELECT COUNT(*) FROM assessment_scores ass WHERE ass.creator_profile_id = cp.id) as assessment_count,
  (SELECT AVG(score) FROM assessment_scores ass WHERE ass.creator_profile_id = cp.id) as average_assessment_score,
  -- Agent mapping count
  (SELECT COUNT(*) FROM agent_potential_mappings apm WHERE apm.creator_profile_id = cp.id) as agent_mappings_count,
  (SELECT MAX(confidence) FROM agent_potential_mappings apm WHERE apm.creator_profile_id = cp.id) as best_agent_match_confidence
FROM creator_profiles cp;

-- Grant appropriate permissions
GRANT SELECT ON creator_pipeline_overview TO authenticated;

-- Create a function to get creator pipeline status
CREATE OR REPLACE FUNCTION get_creator_pipeline_status(creator_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'profile', row_to_json(cp),
    'latest_session', (
      SELECT row_to_json(ps) FROM pipeline_sessions ps 
      WHERE ps.creator_profile_id = creator_id 
      ORDER BY ps.started_at DESC LIMIT 1
    ),
    'assessment_summary', (
      SELECT json_build_object(
        'count', COUNT(*),
        'average_score', AVG(score),
        'dimensions', json_agg(DISTINCT dimension)
      )
      FROM assessment_scores 
      WHERE creator_profile_id = creator_id
    ),
    'agent_mappings', (
      SELECT json_agg(row_to_json(apm))
      FROM agent_potential_mappings apm 
      WHERE apm.creator_profile_id = creator_id
      ORDER BY apm.confidence DESC
    )
  ) INTO result
  FROM creator_profiles cp
  WHERE cp.id = creator_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_creator_pipeline_status(UUID) TO authenticated;