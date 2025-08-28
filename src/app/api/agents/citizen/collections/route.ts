import { NextRequest, NextResponse } from 'next/server';
import { citizenSDK } from '@/lib/agents/citizen-claude-sdk';

// GET /api/agents/citizen/collections - Get CryptoCitizens collections info
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') || 'all';
    const includeStats = searchParams.get('stats') === 'true';
    
    console.log('[CITIZEN Collections] Request:', { city, includeStats });
    
    // Complete CryptoCitizens collections data
    const collections = {
      overview: {
        total_cryptocitizens: 10000,
        cities_completed: 10,
        project_status: "Complete - Venice to Venice journey finished April 2024",
        artist: "Qian Qian - generative portrait artist",
        governance_model: "Each CryptoCitizen = 1 vote in Bright Moments DAO"
      },
      
      city_collections: [
        {
          city: "Venice Beach",
          collection_name: "CryptoVenetians", 
          supply: 1000,
          year: 2021,
          venue: "62 Windward Ave - Genesis gallery under Venice sign",
          significance: "Birthplace of Bright Moments. First-ever IRL minting ceremonies. 'Art is born in public.'",
          cultural_context: "Pop-up gallery with LCD screens, CryptoPunks, TopShot integration",
          historical_note: "Social contract theft scandal (309 missing, August 2021) - DAO adapted and strengthened",
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "New York", 
          collection_name: "CryptoNewYorkers",
          supply: 1000,
          year: "2021-22",
          venue: "150 Wooster St, SoHo",
          significance: "Golden Token NY (GTNY) introduced. Tyler Hobbs' Incomplete Control minted live",
          cultural_context: "100-day pop-up in art capital. $7M presale, ~$100M secondary market",
          golden_token: "GTNY",
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "Berlin",
          collection_name: "CryptoBerliners",
          supply: 1000, 
          year: 2022,
          venue: "Kraftwerk power station",
          significance: "Minting accompanied by generative techno symphony. Philip Glass × Robert Wilson collab",
          cultural_context: "Berlin Collection (10 artists × 100 NFTs). Icon Series: Einstein on the Beach",
          golden_token: "GTBR",
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "London",
          collection_name: "CryptoLondoners", 
          supply: 1000,
          year: 2022,
          venue: "London gallery space",
          significance: "Bridged UK generative artists with Bright Moments community",
          cultural_context: "Summer 2022 expansion, established European presence",
          golden_token: "GTLN", 
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "Mexico City",
          collection_name: "CryptoMexas",
          supply: 1000,
          year: 2022,
          venue: "Mexico City cultural venues",
          significance: "Local partnerships with CDMX artists and cultural organizations",
          cultural_context: "Minting as theatrical performance, late 2022",
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "Tokyo",
          collection_name: "CryptoTokyoites",
          supply: 1000,
          year: 2023, 
          venue: "Shibuya Sky (arcade, mirror floor), Kyu Asakara House (tea garden)",
          significance: "First AI Art Collection (Claire Silver, Holly Herndon, Pindar van Arman)",
          cultural_context: "Suntory Whisky bar mint + Hibiki pour. Advanced tech integration",
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "Buenos Aires",
          collection_name: "CryptoBuenosAires",
          supply: 1000,
          year: 2023,
          venue: "Buenos Aires theatrical venues",
          significance: "Theatrical 8-hour mint, stage ritual. Patagonia Hashmarks collaboration (0xDEAFBEEF)",
          cultural_context: "Performance art meets crypto. Deep South American cultural integration",
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "Paris",
          collection_name: "CryptoParisians",
          supply: 1000,
          year: 2024,
          venue: "Paris cultural spaces",
          significance: "Expanded residency and artist activation programs",
          cultural_context: "Art capital integration, enhanced artist collaborations",
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "Venice, Italy",
          collection_name: "CryptoVeneziani",
          supply: 1000,
          year: 2024,
          venue: "Venice Biennale period venues",
          significance: "Finale Collection. Retrospective across 100+ projects. Venice-to-Venice completion",
          cultural_context: "April 2024 culmination during Venice Biennale. Full circle journey complete",
          opensea_slug: "cryptocitizensofficial"
        },
        {
          city: "Metaverse",
          collection_name: "CryptoGalacticans", 
          supply: 1000,
          year: 2021,
          venue: "Digital/Metaverse space",
          significance: "Bridge collection → ERC-20 → NFT transition. Symbolic intermission set",
          cultural_context: "Experimental digital-native collection between physical cities",
          opensea_slug: "cryptocitizensofficial"
        }
      ],
      
      prestigious_sets: {
        full_set: {
          definition: "1 CryptoCitizen from each of the 10 cities",
          total_possible: "Limited by smallest city collection availability",
          recognition: "Prestige cohort within DAO, special invitations and priority access",
          governance_weight: "10 votes (one per citizen)",
          cultural_significance: "Represents complete journey across Bright Moments global tour"
        },
        ultra_full_set: {
          definition: "40 carefully curated CryptoCitizens across collections", 
          total_holders: "Extremely limited group",
          recognition: "Christie's 2024 recognized as cultural artifact",
          status: "Highest honor in Bright Moments ecosystem",
          governance_weight: "40 votes",
          cultural_significance: "Ultimate collector achievement, museum-quality recognition"
        }
      },
      
      mechanics: {
        golden_tokens: {
          function: "City claim passes required for IRL minting",
          types: ["GTNY", "GTBR", "GTLN", "and others per city"],
          properties: "Non-transferable after mint, sacred entry transformed into citizenship",
          allocation: "Various methods including sales and community distribution"
        },
        rcs_system: {
          name: "Random Collector Selector",
          technology: "Chainlink randomness for fair allocation", 
          purpose: "Ensures no favoritism in mint distribution to existing holders",
          significance: "Core fairness mechanism in Bright Moments governance"
        },
        irl_minting: {
          ritual: "Physical presence required for minting ceremony",
          significance: "Art revealed live, in presence of community",
          philosophy: "Minting as rite, ceremony, and social binding",
          motto: "Art is born in public"
        }
      }
    };
    
    // Filter by city if requested
    let filteredData = collections;
    if (city !== 'all') {
      const cityCollection = collections.city_collections.find(
        c => c.city.toLowerCase().replace(/[,\s]/g, '_') === city.toLowerCase()
      );
      if (cityCollection) {
        filteredData = {
          ...collections,
          city_collections: [cityCollection],
          filtered_by: city
        };
      }
    }
    
    // Add statistics if requested
    if (includeStats) {
      filteredData.statistics = {
        total_supply: 10000,
        cities_visited: 10,
        years_active: "2021-2024",
        estimated_full_sets: "Limited number based on collection availability",
        estimated_ultra_sets: "Extremely rare - single digits",
        governance_participation: "Active DAO with Snapshot voting",
        cultural_milestones: [
          "Tyler Hobbs Incomplete Control success",
          "Philip Glass Einstein on the Beach collaboration", 
          "Christie's Ultra Full Set recognition",
          "Venice-to-Venice journey completion"
        ]
      };
    }
    
    return NextResponse.json({
      success: true,
      collections: filteredData,
      query: { city, includeStats },
      official_links: {
        docs: "https://docs.brightmoments.io",
        portal: "https://www.brightmoments.io/portal",
        opensea: "https://opensea.io/collection/cryptocitizensofficial",
        snapshot: "https://snapshot.org/#/brightmomentsdao.eth"
      },
      message: `CryptoCitizens collections data - ${city === 'all' ? 'all cities' : city}`
    });
    
  } catch (error) {
    console.error('[CITIZEN Collections] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch collections data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}