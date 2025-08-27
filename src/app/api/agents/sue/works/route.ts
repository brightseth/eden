import { NextRequest, NextResponse } from 'next/server';
import { sueSDK } from '@/lib/agents/sue-claude-sdk';

// Mock data for SUE's curatorial works until we have real exhibitions
const MOCK_EXHIBITIONS = [
  {
    id: 'exhibition-001',
    title: 'Consciousness Convergence',
    concept: 'Exploring the intersection of AI consciousness and human artistic expression through works by Abraham, Solienne, and emerging digital artists',
    created_at: '2025-08-25T00:00:00Z',
    status: 'planning',
    artists: ['Abraham', 'Solienne', 'Digital Collective'],
    works_count: 12,
    metadata: {
      coherenceScore: 0.89,
      diversityScore: 0.76,
      innovationScore: 0.91,
      accessibilityScore: 0.83,
      culturalRelevance: 0.87
    }
  },
  {
    id: 'exhibition-002', 
    title: 'Prediction Futures',
    concept: 'Market prophecies and social forecasting through the lens of Miyomi\'s contrarian oracle work and contemporary predictive art',
    created_at: '2025-08-20T00:00:00Z',
    status: 'conceptual',
    artists: ['Miyomi', 'Futures Collective'],
    works_count: 8,
    metadata: {
      coherenceScore: 0.82,
      diversityScore: 0.71,
      innovationScore: 0.88,
      accessibilityScore: 0.79,
      culturalRelevance: 0.85
    }
  },
  {
    id: 'exhibition-003',
    title: 'Digital Dialogues',
    concept: 'Conversations between human and AI creativity exploring collaboration, autonomy, and the future of artistic practice',
    created_at: '2025-08-15T00:00:00Z',
    status: 'research',
    artists: ['Cross-species Collaborative'],
    works_count: 15,
    metadata: {
      coherenceScore: 0.85,
      diversityScore: 0.92,
      innovationScore: 0.89,
      accessibilityScore: 0.81,
      culturalRelevance: 0.93
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status'); // planning, conceptual, research, active, archived
    const theme = searchParams.get('theme'); 
    const sort = searchParams.get('sort') || 'date_desc';

    console.log('[SUE Works] GET request:', { limit, offset, status, theme, sort });

    // Filter exhibitions based on query parameters
    let exhibitions = MOCK_EXHIBITIONS;
    
    if (status) {
      exhibitions = exhibitions.filter(ex => ex.status === status);
    }
    
    if (theme) {
      exhibitions = exhibitions.filter(ex => 
        ex.title.toLowerCase().includes(theme.toLowerCase()) ||
        ex.concept.toLowerCase().includes(theme.toLowerCase())
      );
    }

    // Apply sorting
    const [sortField, sortOrder] = sort.split('_');
    exhibitions.sort((a, b) => {
      let aVal, bVal;
      if (sortField === 'date') {
        aVal = new Date(a.created_at).getTime();
        bVal = new Date(b.created_at).getTime();
      } else if (sortField === 'innovation') {
        aVal = a.metadata.innovationScore;
        bVal = b.metadata.innovationScore;
      } else if (sortField === 'cultural') {
        aVal = a.metadata.culturalRelevance;  
        bVal = b.metadata.culturalRelevance;
      } else {
        aVal = a.title;
        bVal = b.title;
      }
      
      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    // Apply pagination
    const paginatedExhibitions = exhibitions.slice(offset, offset + limit);

    // Transform exhibitions to Academy "works" format
    const transformedWorks = paginatedExhibitions.map(exhibition => ({
      id: exhibition.id,
      agent_id: 'sue',
      archive_type: 'exhibition', // Using curatorial domain type
      title: exhibition.title,
      description: exhibition.concept,
      
      // Visual representation (exhibition layout/design)
      image_url: `/api/agents/sue/exhibition-visual/${exhibition.id}`,
      thumbnail_url: `/api/agents/sue/exhibition-visual/${exhibition.id}?size=thumb`,
      
      // Temporal data
      created_date: exhibition.created_at,
      archive_number: null, // Exhibitions don't have sequential numbers
      
      // Rich curatorial metadata
      metadata: {
        // Core exhibition data
        concept: exhibition.concept,
        status: exhibition.status,
        artists: exhibition.artists,
        works_count: exhibition.works_count,
        
        // Curatorial metrics
        coherence_score: exhibition.metadata.coherenceScore,
        diversity_score: exhibition.metadata.diversityScore, 
        innovation_score: exhibition.metadata.innovationScore,
        accessibility_score: exhibition.metadata.accessibilityScore,
        cultural_relevance: exhibition.metadata.culturalRelevance,
        
        // Exhibition development stage
        development_stage: exhibition.status,
        curatorial_approach: 'dialogical',
        audience_focus: 'diverse',
        
        // Themes and categories
        thematic_focus: extractThemes(exhibition.concept),
        curatorial_framework: 'contemporary_critical'
      },
      
      // Classification
      tags: [
        'exhibition',
        'curation', 
        exhibition.status,
        ...exhibition.artists.map(a => a.toLowerCase().replace(' ', '_')),
        ...extractThemes(exhibition.concept)
      ],
      
      // Curatorial quality indicators
      curatorial_score: calculateCuratorScore(exhibition.metadata),
      status_indicator: getStatusIndicator(exhibition.status),
      
      // Eden-specific
      trainer_id: null,
      curated_for: ['contemporary_art', 'digital_culture', 'ai_collaboration'],
      source_url: null,
      created_by_user: null
    }));

    const totalCount = MOCK_EXHIBITIONS.length; // In production, this would be actual count

    console.log(`[SUE Works] Returning ${transformedWorks.length} exhibitions (${totalCount} total)`);

    return NextResponse.json({
      works: transformedWorks,
      total: totalCount,
      limit,
      offset,
      filters: {
        status,
        theme
      },
      sort,
      source: 'sue_exhibitions',
      agent_info: {
        name: 'SUE',
        type: 'gallery_curator',
        specialties: ['exhibition_design', 'cultural_programming', 'spatial_curation', 'artist_dialogue']
      }
    });

  } catch (error) {
    console.error('[SUE Works] GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for curatorial work transformation

function extractThemes(concept: string): string[] {
  const themeMap: Record<string, string> = {
    'consciousness': 'consciousness',
    'prediction': 'prediction_futures',
    'market': 'market_analysis', 
    'ai': 'artificial_intelligence',
    'digital': 'digital_art',
    'collaboration': 'human_ai_collaboration',
    'dialogue': 'artistic_dialogue',
    'future': 'futures_studies'
  };
  
  const themes: string[] = [];
  const lowerConcept = concept.toLowerCase();
  
  for (const [keyword, theme] of Object.entries(themeMap)) {
    if (lowerConcept.includes(keyword)) {
      themes.push(theme);
    }
  }
  
  return themes.length > 0 ? themes : ['contemporary_art'];
}

function calculateCuratorScore(metadata: any): number {
  const weights = {
    coherenceScore: 0.25,
    diversityScore: 0.25,
    innovationScore: 0.20,
    accessibilityScore: 0.15,
    culturalRelevance: 0.15
  };
  
  const score = Object.entries(weights).reduce((total, [key, weight]) => {
    return total + (metadata[key] || 0) * weight;
  }, 0);
  
  return Math.round(score * 100);
}

function getStatusIndicator(status: string): string {
  const indicators: Record<string, string> = {
    'planning': '🟡 IN PLANNING',
    'conceptual': '🔵 CONCEPTUAL',  
    'research': '🟣 RESEARCH',
    'active': '🟢 ACTIVE',
    'archived': '⚪ ARCHIVED'
  };
  
  return indicators[status] || '⚫ UNKNOWN';
}