/**
 * Creative Pipeline Database Schema Extensions
 * 
 * Extends Eden Academy's existing database schema to support
 * the creative onboarding and assessment pipeline.
 * 
 * Designed to integrate seamlessly with existing Academy architecture
 * while maintaining cultural alignment with the mission.
 */

import { Database } from './database';

/**
 * Extended Database Schema for Creative Pipeline
 */
export interface CreativePipelineDatabase extends Database {
  public: Database['public'] & {
    Tables: Database['public']['Tables'] & {
      creator_profiles: {
        Row: {
          id: string;
          user_id: string;
          creative_role: 'visual-artist' | 'musician' | 'writer' | 'mixed-media' | 'curator' | 'undefined';
          onboarding_stage: 'portfolio-submission' | 'cultural-alignment-check' | 'skill-assessment' | 'agent-potential-mapping' | 'academy-integration' | 'training-path-selection' | 'completed';
          cultural_alignment: number; // 0-100
          readiness_score: number; // 0-100
          ai_experience_level: 'none' | 'basic' | 'intermediate' | 'advanced';
          community_interest: number; // 0-100
          preferred_learning_style: 'project-based' | 'structured' | 'peer-learning' | 'self-directed';
          referral_source: string | null;
          cultural_motivation: string | null;
          collaboration_experience: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          creative_role?: 'visual-artist' | 'musician' | 'writer' | 'mixed-media' | 'curator' | 'undefined';
          onboarding_stage?: 'portfolio-submission' | 'cultural-alignment-check' | 'skill-assessment' | 'agent-potential-mapping' | 'academy-integration' | 'training-path-selection' | 'completed';
          cultural_alignment?: number;
          readiness_score?: number;
          ai_experience_level?: 'none' | 'basic' | 'intermediate' | 'advanced';
          community_interest?: number;
          preferred_learning_style?: 'project-based' | 'structured' | 'peer-learning' | 'self-directed';
          referral_source?: string | null;
          cultural_motivation?: string | null;
          collaboration_experience?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          creative_role?: 'visual-artist' | 'musician' | 'writer' | 'mixed-media' | 'curator' | 'undefined';
          onboarding_stage?: 'portfolio-submission' | 'cultural-alignment-check' | 'skill-assessment' | 'agent-potential-mapping' | 'academy-integration' | 'training-path-selection' | 'completed';
          cultural_alignment?: number;
          readiness_score?: number;
          ai_experience_level?: 'none' | 'basic' | 'intermediate' | 'advanced';
          community_interest?: number;
          preferred_learning_style?: 'project-based' | 'structured' | 'peer-learning' | 'self-directed';
          referral_source?: string | null;
          cultural_motivation?: string | null;
          collaboration_experience?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      assessment_scores: {
        Row: {
          id: string;
          creator_profile_id: string;
          dimension: string; // e.g., 'Creative Expression Authenticity', 'Collaboration Openness'
          score: number; // 0-100
          max_score: number; // Usually 100
          evidence: any; // JSON data with evidence for score
          assessed_at: string;
          assessor_type: 'ai' | 'human' | 'peer';
          cultural_notes: string | null;
          growth_potential: 'high' | 'medium' | 'low';
          collaboration_readiness: number; // 0-100
          created_at: string;
        };
        Insert: {
          id?: string;
          creator_profile_id: string;
          dimension: string;
          score: number;
          max_score?: number;
          evidence: any;
          assessed_at?: string;
          assessor_type: 'ai' | 'human' | 'peer';
          cultural_notes?: string | null;
          growth_potential?: 'high' | 'medium' | 'low';
          collaboration_readiness?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          creator_profile_id?: string;
          dimension?: string;
          score?: number;
          max_score?: number;
          evidence?: any;
          assessed_at?: string;
          assessor_type?: 'ai' | 'human' | 'peer';
          cultural_notes?: string | null;
          growth_potential?: 'high' | 'medium' | 'low';
          collaboration_readiness?: number;
          created_at?: string;
        };
      };
      
      pipeline_sessions: {
        Row: {
          id: string;
          creator_profile_id: string;
          stage: 'portfolio-submission' | 'cultural-alignment-check' | 'skill-assessment' | 'agent-potential-mapping' | 'academy-integration' | 'training-path-selection' | 'completed';
          started_at: string;
          completed_at: string | null;
          feedback: string[]; // Array of feedback messages
          next_steps: string[]; // Array of recommended next steps
          cultural_mentor_notes: string | null;
          session_data: any; // JSON data specific to the session
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_profile_id: string;
          stage: 'portfolio-submission' | 'cultural-alignment-check' | 'skill-assessment' | 'agent-potential-mapping' | 'academy-integration' | 'training-path-selection' | 'completed';
          started_at?: string;
          completed_at?: string | null;
          feedback?: string[];
          next_steps?: string[];
          cultural_mentor_notes?: string | null;
          session_data?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_profile_id?: string;
          stage?: 'portfolio-submission' | 'cultural-alignment-check' | 'skill-assessment' | 'agent-potential-mapping' | 'academy-integration' | 'training-path-selection' | 'completed';
          started_at?: string;
          completed_at?: string | null;
          feedback?: string[];
          next_steps?: string[];
          cultural_mentor_notes?: string | null;
          session_data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      
      agent_potential_mappings: {
        Row: {
          id: string;
          creator_profile_id: string;
          agent_role: 'image-generation' | 'audio-creation' | 'text-story-generation' | 'multi-modal-creative' | 'curation-assistant' | 'exploration-needed';
          confidence: number; // 0-100
          cultural_fit: number; // 0-100
          reasoning: string[]; // Array of reasoning points
          training_path_suggestion: string;
          expected_growth_areas: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_profile_id: string;
          agent_role: 'image-generation' | 'audio-creation' | 'text-story-generation' | 'multi-modal-creative' | 'curation-assistant' | 'exploration-needed';
          confidence: number;
          cultural_fit: number;
          reasoning: string[];
          training_path_suggestion: string;
          expected_growth_areas: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          creator_profile_id?: string;
          agent_role?: 'image-generation' | 'audio-creation' | 'text-story-generation' | 'multi-modal-creative' | 'curation-assistant' | 'exploration-needed';
          confidence?: number;
          cultural_fit?: number;
          reasoning?: string[];
          training_path_suggestion?: string;
          expected_growth_areas?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

/**
 * Database Migration SQL for Creative Pipeline
 * To be executed to add creative pipeline tables to existing schema
 */
export const CREATIVE_PIPELINE_MIGRATION_SQL = `
-- Creator Profiles Table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Assessment Scores Table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Pipeline Sessions Table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Agent Potential Mappings Table
CREATE TABLE IF NOT EXISTS agent_potential_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
  agent_role TEXT CHECK (agent_role IN ('image-generation', 'audio-creation', 'text-story-generation', 'multi-modal-creative', 'curation-assistant', 'exploration-needed')) NOT NULL,
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100) NOT NULL,
  cultural_fit INTEGER CHECK (cultural_fit >= 0 AND cultural_fit <= 100) NOT NULL,
  reasoning TEXT[] DEFAULT '{}',
  training_path_suggestion TEXT NOT NULL,
  expected_growth_areas TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS creator_profiles_user_id_idx ON creator_profiles(user_id);
CREATE INDEX IF NOT EXISTS creator_profiles_onboarding_stage_idx ON creator_profiles(onboarding_stage);
CREATE INDEX IF NOT EXISTS assessment_scores_creator_profile_id_idx ON assessment_scores(creator_profile_id);
CREATE INDEX IF NOT EXISTS pipeline_sessions_creator_profile_id_idx ON pipeline_sessions(creator_profile_id);
CREATE INDEX IF NOT EXISTS agent_potential_mappings_creator_profile_id_idx ON agent_potential_mappings(creator_profile_id);

-- Row Level Security (RLS)
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_potential_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Users can only access their own data)
CREATE POLICY "Users can view own creator profile" ON creator_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creator profile" ON creator_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creator profile" ON creator_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Similar policies for other tables...
-- (Full RLS policies would be implemented for production)
`;

/**
 * Feature Flag Configuration
 */
export const CREATIVE_PIPELINE_FEATURE_FLAGS = {
  ENABLE_CREATIVE_PIPELINE: {
    key: 'ENABLE_CREATIVE_PIPELINE',
    description: 'Enable creator onboarding and assessment pipeline',
    defaultValue: false,
    rolloutStrategy: 'gradual',
    culturalImpact: 'Introduces new creator pathway while maintaining Academy cultural values'
  },
  CREATIVE_PIPELINE_ASSESSMENT: {
    key: 'CREATIVE_PIPELINE_ASSESSMENT', 
    description: 'Enable AI-assisted creative assessment',
    defaultValue: false,
    rolloutStrategy: 'beta',
    culturalImpact: 'Provides supportive growth-oriented assessment aligned with Academy mission'
  },
  CREATIVE_PIPELINE_MATCHING: {
    key: 'CREATIVE_PIPELINE_MATCHING',
    description: 'Enable creator-to-agent role matching',
    defaultValue: false,
    rolloutStrategy: 'beta', 
    culturalImpact: 'Facilitates AI collaboration partnerships that amplify authentic creative voice'
  }
} as const;