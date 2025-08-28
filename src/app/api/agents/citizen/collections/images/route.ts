import { NextRequest, NextResponse } from 'next/server';
import { citizenMarketData } from '@/lib/agents/citizen-market-data';

// GET /api/agents/citizen/collections/images - Get collection images and sample NFTs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const collection = searchParams.get('collection');
    const samples = searchParams.get('samples') === 'true';
    const limit = parseInt(searchParams.get('limit') || '6');
    
    console.log('[CITIZEN Collections Images] Request:', { city, collection, samples, limit });
    
    // Collection mappings for images
    const collections = [
      { city: "Venice Beach", opensea_slug: "cryptovenetians", collection_name: "CryptoVenetians" },
      { city: "New York", opensea_slug: "cryptonewyorkers", collection_name: "CryptoNewYorkers" },
      { city: "Berlin", opensea_slug: "cryptoberliners", collection_name: "CryptoBerliners" },
      { city: "London", opensea_slug: "cryptolondoners", collection_name: "CryptoLondoners" },
      { city: "Mexico City", opensea_slug: "cryptomexas", collection_name: "CryptoMexas" },
      { city: "Tokyo", opensea_slug: "cryptotokyoites", collection_name: "CryptoTokyoites" },
      { city: "Buenos Aires", opensea_slug: "cryptobuenosaires", collection_name: "CryptoBuenosAires" },
      { city: "Paris", opensea_slug: "cryptoparisians", collection_name: "CryptoParisians" },
      { city: "Venice, Italy", opensea_slug: "cryptoveneziani", collection_name: "CryptoVeneziani" },
      { city: "Metaverse", opensea_slug: "cryptogalacticans", collection_name: "CryptoGalacticans" }
    ];
    
    // Filter collections if specific city/collection requested
    let targetCollections = collections;
    if (city) {
      targetCollections = collections.filter(c => 
        c.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    if (collection) {
      targetCollections = collections.filter(c => 
        c.opensea_slug === collection || c.collection_name.toLowerCase().includes(collection.toLowerCase())
      );
    }
    
    if (targetCollections.length === 0) {
      return NextResponse.json({
        error: 'Collection not found',
        available_cities: collections.map(c => c.city),
        available_slugs: collections.map(c => c.opensea_slug)
      }, { status: 404 });
    }
    
    // Fetch images for target collections
    const imagePromises = targetCollections.map(async (coll) => {
      const [collectionImages, sampleNFTs] = await Promise.all([
        citizenMarketData.fetchCollectionImages(coll.opensea_slug),
        samples ? citizenMarketData.fetchSampleNFTs(coll.opensea_slug, limit) : Promise.resolve([])
      ]);
      
      return {
        city: coll.city,
        collection_name: coll.collection_name,
        opensea_slug: coll.opensea_slug,
        images: collectionImages || {
          banner_image_url: null,
          featured_image_url: null,
          large_image_url: null,
          sample_images: []
        },
        sample_nfts: sampleNFTs,
        opensea_url: `https://opensea.io/collection/${coll.opensea_slug}`
      };
    });
    
    const results = await Promise.all(imagePromises);
    
    // If no API key configured, provide fallback structure
    const hasApiKey = process.env.OPENSEA_API_KEY !== undefined;
    if (!hasApiKey) {
      return NextResponse.json({
        success: true,
        collections: results.map(result => ({
          ...result,
          images: {
            banner_image_url: null,
            featured_image_url: null,
            large_image_url: null,
            sample_images: []
          },
          sample_nfts: [],
          note: "Configure OPENSEA_API_KEY environment variable to fetch actual images"
        })),
        query: { city, collection, samples, limit },
        api_status: "OpenSea API key not configured - using fallback structure",
        setup_instructions: [
          "1. Get API key from https://opensea.io/account#/api",
          "2. Add OPENSEA_API_KEY to your .env.local file",
          "3. Restart the development server",
          "4. Images will be fetched automatically from OpenSea"
        ]
      });
    }
    
    return NextResponse.json({
      success: true,
      collections: results,
      query: { city, collection, samples, limit },
      api_status: "OpenSea API connected",
      total_collections: results.length,
      bright_moments_info: {
        overview: "CryptoCitizens are generative portraits by Qian Qian, minted IRL across 10 global cities",
        journey: "Venice Beach (2021) → Venice, Italy (2024)",
        significance: "Each CryptoCitizen = 1 vote in Bright Moments DAO governance",
        prestigious_sets: {
          full_set: "1 CryptoCitizen from each of the 10 cities",
          ultra_full_set: "40 carefully curated CryptoCitizens (Christie's recognized)"
        }
      }
    });
    
  } catch (error) {
    console.error('[CITIZEN Collections Images] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch collection images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}