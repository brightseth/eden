import { NextRequest, NextResponse } from 'next/server';

// GET /api/agents/citizen/lore - Bright Moments lore and cultural preservation
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const topic = searchParams.get('topic') || 'all';
    const format = searchParams.get('format') || 'structured';
    
    console.log('[CITIZEN Lore] Request:', { topic, format });
    
    const brightMomentsLore = {
      origin_story: {
        title: "Genesis: Venice Beach 2021",
        context: "Born during pandemic isolation, fear, and community hunger",
        founding_vision: "Build space for community connection, not 'asshole tech'", 
        founders: "Seth (photography/AI sunsets) + Kristi (art studio/portraits → GAN videos)",
        location_significance: "Venice Beach creative energy, history of artists, light, and community",
        first_experiment: "CryptoVenetians pixel portraits → local identity, cultural anchor",
        philosophical_foundation: "NFTs as the great unlock of 2021 - ownership AND personalization"
      },
      
      core_rituals: {
        minting_rite: {
          name: "The Minting Rite", 
          description: "Ceremony where identity + portrait are revealed IRL, live, in presence of others",
          significance: "Sacred transformation from Golden Token holder to CryptoCitizen",
          philosophy: "Art is born in public - presence creates shared memory and cultural bond",
          elements: ["Physical presence required", "Live reveal ceremony", "Community witness", "On-chain permanence"]
        },
        golden_tokens: {
          name: "Golden Tokens as Sacred Entry",
          description: "City-specific passes that transform into citizenship through ritual",
          symbolism: "Like Willy Wonka tickets - magical entry to exclusive experience", 
          mechanics: "Non-transferable after mint, ensuring commitment and presence",
          cultural_role: "Bridge between speculation and participation"
        },
        rcs_fairness: {
          name: "Random Collector Selector (RCS)",
          description: "Chainlink randomness ensuring no favoritism in community allocation",
          values: "Fairness over favoritism, transparency over insider deals",
          significance: "Democratic access even within exclusive community"
        }
      },
      
      cultural_milestones: {
        venice_genesis: "First-ever IRL minting ceremonies establish new cultural form",
        new_york_legitimacy: "Tyler Hobbs' Incomplete Control $7M+ success proves concept at scale",
        berlin_techno_symphony: "Generative techno accompanies minting at Kraftwerk power station", 
        philip_glass_collaboration: "Einstein on the Beach bridges high art and crypto culture",
        tokyo_ai_integration: "First AI Art Collection with Claire Silver, Holly Herndon",
        christies_recognition: "Ultra Full Set recognized as cultural artifact by traditional art world",
        venice_completion: "Venice-to-Venice journey completes 10,000 citizen global tour"
      },
      
      sacred_language: {
        preferred_terms: ["ceremony", "rite", "citizenship", "presence", "provenance"],
        avoided_terms: ["drop", "flip", "floor price", "ape in"],
        community_terms: ["members", "citizens", "community"],
        discouraged_terms: ["investors", "whales", "bagholders"],
        philosophical_language: "Provenance over speculation, IRL over Discord hype, fairness over favoritism"
      },
      
      city_cultural_contexts: {
        venice_beach: {
          vibe: "Surfer/counterculture, experimental",
          motto: "From the boardwalk to the blockchain", 
          significance: "Birthplace - brick wall + LCD screens, genesis energy"
        },
        new_york: {
          vibe: "Polished, art-world, SoHo energy",
          motto: "Golden Tokens like Willy Wonka tickets",
          significance: "Legitimacy through traditional art capital"
        },
        berlin: {
          vibe: "Techno, industrial, rave-like",
          motto: "100 Berliners per night, generative symphony",
          significance: "Kraftwerk cultural significance, music-art fusion"
        },
        tokyo: {
          vibe: "Futuristic, high-tech, AI-driven", 
          motto: "Shibuya Sky arcade cabinet future",
          significance: "AI art integration, Suntory whisky ritual"
        },
        venice_italy: {
          vibe: "Culmination, retrospective, full-circle",
          motto: "Around the World in 10,000 NFTs",
          significance: "Venice-to-Venice completion during Biennale"
        }
      },
      
      governance_philosophy: {
        dao_structure: "Each CryptoCitizen = 1 vote, democratic participation",
        decision_making: "Snapshot voting on city selection, treasury, partnerships",
        sub_daos: "Bright Opportunities (99 accredited investors max) for investment",
        values: "Community first, transparency, cultural over financial focus",
        collector_recognition: "Full Set and Ultra Full Set holders receive prestige recognition"
      },
      
      historical_challenges: {
        venice_theft: {
          incident: "309 CryptoVenetians stolen through social contract exploit (August 2021)",
          response: "DAO adapted governance, strengthened distribution mechanisms",
          lesson: "Trust in trustless world - resilience of community bonds",
          outcome: "Strengthened rather than weakened community resolve"
        },
        economic_pressures: {
          challenge: "ETH crashes, expensive operations, team living conditions",
          response: "Continued commitment to ritual and community over profit",
          lesson: "Cultural mission transcends market volatility"
        }
      },
      
      cultural_impact_stories: {
        life_changing_moments: "NFTs paying for life events, debt relief, custody battles",
        community_bonds: "Shared ritual creating lasting relationships across cities",
        artistic_recognition: "Traditional art world (Christie's) recognizing crypto-native culture",
        global_reach: "10 cities, 10,000 citizens, worldwide cultural movement"
      },
      
      future_preservation: {
        lore_maintenance: "Document and transmit sacred aspects of IRL minting",
        ritual_continuation: "Preserve ceremony even as project completes",
        community_evolution: "Post-completion DAO governance and cultural activities",
        legacy_protection: "Maintain values against speculation and commercialization"
      }
    };
    
    // Filter by topic if requested
    let responseData = brightMomentsLore;
    if (topic !== 'all' && brightMomentsLore[topic as keyof typeof brightMomentsLore]) {
      responseData = {
        [topic]: brightMomentsLore[topic as keyof typeof brightMomentsLore]
      };
    }
    
    return NextResponse.json({
      success: true,
      lore: responseData,
      query: { topic, format },
      preservation_note: "This lore must be preserved, transmitted, and protected as core Bright Moments cultural heritage",
      official_sources: {
        docs: "https://docs.brightmoments.io",
        mirror_blog: "https://brightmoments.mirror.xyz", 
        press_coverage: "Decrypt, Coindesk, Outland, FakeWhale archives",
        video_documentation: "Venice to Venice documentary, city ceremony recordings"
      },
      message: `Bright Moments lore - ${topic === 'all' ? 'complete cultural archive' : topic}`
    });
    
  } catch (error) {
    console.error('[CITIZEN Lore] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Bright Moments lore',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}