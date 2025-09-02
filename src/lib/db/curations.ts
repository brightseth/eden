import { createClient } from '@/lib/supabase/client';

export interface Curation {
  id?: string;
  agent_id?: string;
  agent_name: string;
  image_url?: string;
  image_data?: string;
  verdict: 'INCLUDE' | 'MAYBE' | 'EXCLUDE';
  weighted_total: number;
  confidence?: number;
  scores: Record<string, number>;
  rationales: Record<string, string>;
  i_see: string;
  prompt_patch?: string;
  flags?: string[];
  gate_checks?: Record<string, any>;
  published?: boolean;
  published_at?: string;
  created_at?: string;
}

export interface Creation {
  id?: string;
  agent_id?: string;
  agent_name: string;
  curation_id?: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  collection?: string;
  edition_size?: number;
  price?: number;
  currency?: string;
  sold_count?: number;
  total_revenue?: number;
  featured?: boolean;
  display_order?: number;
  tags?: string[];
  status?: 'available' | 'sold_out' | 'archived';
  created_at?: string;
}

// Save a curation result from Nina
export async function saveCuration(curation: Curation) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('curations')
    .insert({
      agent_name: curation.agent_name,
      image_url: curation.image_url,
      image_data: curation.image_data,
      verdict: curation.verdict,
      weighted_total: curation.weighted_total,
      confidence: curation.confidence,
      scores: curation.scores,
      rationales: curation.rationales,
      i_see: curation.i_see,
      prompt_patch: curation.prompt_patch,
      flags: curation.flags,
      gate_checks: curation.gate_checks,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving curation:', error);
    throw error;
  }

  return data;
}

// Publish a curation to creations
export async function publishCuration(curationId: string, title: string) {
  const supabase = await createClient();
  
  // Get the curation
  const { data: curation, error: fetchError } = await supabase
    .from('curations')
    .select('*')
    .eq('id', curationId)
    .single();

  if (fetchError || !curation) {
    throw new Error('Curation not found');
  }

  // Create a creation from the curation
  const { data: creation, error: createError } = await supabase
    .from('creations')
    .insert({
      agent_name: curation.agent_name,
      curation_id: curationId,
      title: title || `Creation ${new Date().toISOString()}`,
      description: curation.i_see,
      image_url: curation.image_url || curation.image_data,
      status: 'available',
    })
    .select()
    .single();

  if (createError) {
    console.error('Error publishing creation:', createError);
    throw createError;
  }

  // Mark curation as published
  await supabase
    .from('curations')
    .update({ 
      published: true, 
      published_at: new Date().toISOString() 
    })
    .eq('id', curationId);

  return creation;
}

// Get recent curations for an agent
export async function getRecentCurations(agentName: string, limit = 10) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('curations')
    .select('*')
    .eq('agent_name', agentName)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching curations:', error);
    return [];
  }

  return data || [];
}

// Get agent creations
export async function getAgentCreations(agentName: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('creations')
    .select('*')
    .eq('agent_name', agentName)
    .eq('status', 'available')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching creations:', error);
    return [];
  }

  return data || [];
}

// Get curation stats for an agent
export async function getCurationStats(agentName: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('curations')
    .select('verdict')
    .eq('agent_name', agentName);

  if (error || !data) {
    return {
      total: 0,
      includes: 0,
      maybes: 0,
      excludes: 0,
      inclusionRate: 0
    };
  }

  const stats = {
    total: data.length,
    includes: data.filter(c => c.verdict === 'INCLUDE').length,
    maybes: data.filter(c => c.verdict === 'MAYBE').length,
    excludes: data.filter(c => c.verdict === 'EXCLUDE').length,
    inclusionRate: 0
  };

  stats.inclusionRate = stats.total > 0 ? (stats.includes / stats.total) * 100 : 0;

  return stats;
}