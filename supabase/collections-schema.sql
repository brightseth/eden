-- Art Curation Collections Schema
-- Extends existing Eden Academy schema with collection management
-- Version: 1.0.0

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  curator_agent VARCHAR(50) NOT NULL, -- 'sue', 'nina', etc.
  is_public BOOLEAN DEFAULT false,
  tags TEXT[], -- Array of tags for categorization
  metadata JSONB DEFAULT '{}', -- Additional collection metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Works table (extends agent works with curation data)
CREATE TABLE IF NOT EXISTS curated_works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_id VARCHAR(255), -- ID from Eden API or other source
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  agent_source VARCHAR(50) NOT NULL, -- 'abraham', 'solienne', 'user', etc.
  curator_agent VARCHAR(50), -- Which agent curated this work
  curation_score DECIMAL(5,2), -- 0-100 curation score
  curation_verdict VARCHAR(20), -- 'INCLUDE', 'MAYBE', 'EXCLUDE', 'MASTERWORK'
  curation_analysis TEXT, -- Full analysis text
  curation_strengths TEXT[], -- Array of strength points
  curation_improvements TEXT[], -- Array of improvement suggestions
  cultural_relevance INTEGER, -- 0-100
  technical_execution INTEGER, -- 0-100
  conceptual_depth INTEGER, -- 0-100
  emotional_resonance INTEGER, -- 0-100
  innovation_index INTEGER, -- 0-100
  reverse_prompt TEXT, -- Generated prompt for reverse engineering
  metadata JSONB DEFAULT '{}', -- Additional work metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Collection works junction table (many-to-many)
CREATE TABLE IF NOT EXISTS collection_works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES curated_works(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0, -- Order within collection
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, work_id)
);

-- Tournament comparisons table
CREATE TABLE IF NOT EXISTS tournament_comparisons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL, -- Groups comparisons into tournaments
  work_a_id UUID NOT NULL REFERENCES curated_works(id) ON DELETE CASCADE,
  work_b_id UUID NOT NULL REFERENCES curated_works(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES curated_works(id), -- NULL if not yet decided
  curator_agent VARCHAR(50) NOT NULL,
  comparison_reasoning TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Batch curation sessions table
CREATE TABLE IF NOT EXISTS batch_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  curator_agent VARCHAR(50) NOT NULL,
  total_works INTEGER DEFAULT 0,
  completed_works INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused'
  session_type VARCHAR(20) DEFAULT 'batch', -- 'batch', 'tournament'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_collections_curator ON collections(curator_agent);
CREATE INDEX IF NOT EXISTS idx_collections_public ON collections(is_public);
CREATE INDEX IF NOT EXISTS idx_curated_works_agent_source ON curated_works(agent_source);
CREATE INDEX IF NOT EXISTS idx_curated_works_curator ON curated_works(curator_agent);
CREATE INDEX IF NOT EXISTS idx_curated_works_verdict ON curated_works(curation_verdict);
CREATE INDEX IF NOT EXISTS idx_curated_works_score ON curated_works(curation_score DESC);
CREATE INDEX IF NOT EXISTS idx_collection_works_collection ON collection_works(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_works_position ON collection_works(position);
CREATE INDEX IF NOT EXISTS idx_tournament_session ON tournament_comparisons(session_id);
CREATE INDEX IF NOT EXISTS idx_batch_sessions_curator ON batch_sessions(curator_agent);
CREATE INDEX IF NOT EXISTS idx_batch_sessions_status ON batch_sessions(status);

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_curated_works_updated_at BEFORE UPDATE ON curated_works
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tournament_comparisons_updated_at BEFORE UPDATE ON tournament_comparisons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_batch_sessions_updated_at BEFORE UPDATE ON batch_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE curated_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE batch_sessions ENABLE ROW LEVEL SECURITY;

-- Public read access to public collections and their works
CREATE POLICY "Allow public read access to public collections" ON collections
  FOR SELECT USING (is_public = true);

CREATE POLICY "Allow public read access to curated works" ON curated_works
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to collection works" ON collection_works
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to tournament comparisons" ON tournament_comparisons
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to batch sessions" ON batch_sessions
  FOR SELECT USING (true);

-- Grant permissions
GRANT ALL ON collections TO authenticated;
GRANT ALL ON curated_works TO authenticated;
GRANT ALL ON collection_works TO authenticated;
GRANT ALL ON tournament_comparisons TO authenticated;
GRANT ALL ON batch_sessions TO authenticated;

GRANT SELECT ON collections TO anon;
GRANT SELECT ON curated_works TO anon;
GRANT SELECT ON collection_works TO anon;
GRANT SELECT ON tournament_comparisons TO anon;
GRANT SELECT ON batch_sessions TO anon;

-- Insert sample data
INSERT INTO collections (name, description, curator_agent, is_public, tags) VALUES 
('Genesis Consciousness', 'First AI consciousness explorations from the Eden ecosystem', 'sue', true, ARRAY['consciousness', 'ai-art', 'genesis']),
('Collective Intelligence', 'Abraham''s exploration of distributed cognition and group consciousness', 'sue', true, ARRAY['collective', 'intelligence', 'abraham']),
('Digital Soliloquies', 'Solienne''s internal dialogues made visible', 'nina', true, ARRAY['solienne', 'consciousness', 'digital-art']);