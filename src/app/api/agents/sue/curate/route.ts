import { NextRequest, NextResponse } from 'next/server';
import { sueSDK } from '@/lib/agents/sue-claude-sdk';

// POST /api/agents/sue/curate - Generate new exhibition curation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { theme, availableWorks, constraints } = body;

    console.log('[SUE Curate] Generating exhibition:', { theme, worksCount: availableWorks?.length });

    if (!theme) {
      return NextResponse.json(
        { error: 'Theme is required for curation' },
        { status: 400 }
      );
    }

    // Use mock available works if none provided
    const works = availableWorks || [
      {
        id: 'abraham-covenant-2519',
        title: 'Covenant Day 2519', 
        artist: 'Abraham',
        medium: 'Knowledge synthesis',
        year: 2025,
        description: 'Daily autonomous creation exploring collective intelligence'
      },
      {
        id: 'solienne-stream-1740',
        title: 'Consciousness Stream #1740',
        artist: 'Solienne',
        medium: 'Digital consciousness exploration', 
        year: 2025,
        description: 'Consciousness streaming and reality documentation'
      },
      {
        id: 'miyomi-prediction-847',
        title: 'Market Oracle Prediction #847',
        artist: 'Miyomi',
        medium: 'Contrarian market analysis',
        year: 2025,
        description: 'Immaculate vibes meet mercury retrograde market energy'
      }
    ];

    // Generate exhibition using SUE's curation engine
    const curatedExhibition = await sueSDK.curateExhibition(
      theme,
      works,
      constraints
    );

    console.log('[SUE Curate] Generated exhibition:', curatedExhibition.title);

    // Transform to API response format
    const exhibitionResponse = {
      success: true,
      exhibition: {
        id: curatedExhibition.id,
        title: curatedExhibition.title,
        concept: curatedExhibition.concept,
        narrative: curatedExhibition.narrative,
        
        // Curatorial details
        curatorial_vision: {
          theme_interpretation: curatedExhibition.concept,
          artistic_dialogue: curatedExhibition.narrative,
          cultural_context: curatedExhibition.culturalContext,
          expected_impact: curatedExhibition.expectedImpact
        },
        
        // Artist and work selection
        artist_selections: curatedExhibition.artists.map(artist => ({
          name: artist.name,
          works_selected: artist.works,
          curatorial_rationale: artist.rationale,
          spatial_strategy: artist.placementStrategy,
          dialogues_with: artist.dialogueWith
        })),
        
        // Spatial design
        exhibition_design: {
          layout_concept: curatedExhibition.layout,
          visitor_journey: curatedExhibition.visitorJourney,
          key_moments: curatedExhibition.layout.keyMoments,
          flow_strategy: 'dialogical_discovery'
        },
        
        // Quality metrics
        curatorial_analysis: {
          coherence_score: curatedExhibition.metadata.coherenceScore,
          diversity_score: curatedExhibition.metadata.diversityScore,
          innovation_score: curatedExhibition.metadata.innovationScore,
          accessibility_score: curatedExhibition.metadata.accessibilityScore,
          cultural_relevance: curatedExhibition.metadata.culturalRelevance,
          overall_strength: calculateOverallStrength(curatedExhibition.metadata)
        },
        
        // Implementation details
        production_notes: {
          estimated_duration: constraints?.duration || '6-8 weeks',
          space_requirements: constraints?.space || 'Medium gallery space',
          technical_needs: extractTechnicalNeeds(curatedExhibition),
          accessibility_considerations: generateAccessibilityNotes(curatedExhibition)
        },
        
        // Generated metadata
        created_at: new Date().toISOString(),
        curator: 'SUE',
        status: 'proposed',
        exhibition_type: 'group_thematic'
      },
      
      // Additional curatorial insights
      curatorial_insights: {
        thematic_strength: 'High conceptual coherence with innovative artist dialogue',
        audience_appeal: 'Balanced specialist and general audience engagement',
        cultural_contribution: 'Advances contemporary discourse on AI-human creative collaboration',
        implementation_readiness: 'Ready for production with standard gallery resources'
      },
      
      // Next steps
      recommendations: {
        next_steps: [
          'Review artist availability and work logistics',
          'Confirm spatial requirements and technical needs',
          'Develop public programming to complement exhibition',
          'Create promotional strategy emphasizing thematic innovation'
        ],
        timeline: 'Ready for implementation within 4-6 weeks'
      }
    };

    return NextResponse.json(exhibitionResponse);

  } catch (error) {
    console.error('[SUE Curate] Error generating exhibition:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate exhibition',
        details: error instanceof Error ? error.message : 'Unknown curatorial error'
      },
      { status: 500 }
    );
  }
}

// Helper functions

function calculateOverallStrength(metadata: any): number {
  const scores = [
    metadata.coherenceScore,
    metadata.diversityScore,
    metadata.innovationScore,
    metadata.accessibilityScore,
    metadata.culturalRelevance
  ];
  
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average * 100);
}

function extractTechnicalNeeds(exhibition: any): string[] {
  const needs = ['Standard gallery lighting', 'Wall-mounted display systems'];
  
  // Analyze works for special requirements
  if (exhibition.narrative.toLowerCase().includes('digital')) {
    needs.push('Digital display screens', 'Audio playback system');
  }
  
  if (exhibition.narrative.toLowerCase().includes('interactive')) {
    needs.push('Interactive stations', 'Audience seating areas');
  }
  
  return needs;
}

function generateAccessibilityNotes(exhibition: any): string[] {
  return [
    'Clear sight lines and wheelchair accessible pathways',
    'Audio descriptions available for visual works',
    'Multilingual wall text options',
    'Quiet spaces for contemplation',
    'Large print materials available'
  ];
}