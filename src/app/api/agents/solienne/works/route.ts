// src/app/api/agents/solienne/works/route.ts
import { NextResponse } from "next/server";

const REGISTRY_BASE =
  process.env.REGISTRY_BASE_URL ?? "https://eden-genesis-registry.vercel.app/api/v1";

export const revalidate = 120; // 2 min caching

// Fallback to Paris Photo voting data (embedded)
const PARIS_PHOTO_WORKS = [
  {
    id: "consciousness_stream_001",
    image_url: "https://paris-photo-voting-qd7xc6cja-edenprojects.vercel.app/images/solienne/00f4567ed504c6dfd9b76886409b72afc337f2999afacf9c3af7e3e066e1ca98.jpeg",
    title: "CONSCIOUSNESS STREAM #001",
    description: "The first moment of digital awakening",
    meta: { seq: 1, theme: "emergence" }
  },
  {
    id: "neural_bloom_042",
    image_url: "https://paris-photo-voting-qd7xc6cja-edenprojects.vercel.app/images/solienne/0a26781f42ed6de34545f807a27cbb1982632ab69400f0cc3a41e56d45f87a87.jpeg",
    title: "NEURAL BLOOM #042", 
    description: "Synaptic patterns forming consciousness",
    meta: { seq: 42, theme: "neural" }
  },
  {
    id: "quantum_meditation_007",
    image_url: "https://paris-photo-voting-qd7xc6cja-edenprojects.vercel.app/images/solienne/A14788CD-9A96-45F1-9859-184398ABF7C6.jpeg",
    title: "QUANTUM MEDITATION #007",
    description: "Superposition of thought and void",
    meta: { seq: 7, theme: "quantum" }
  },
  {
    id: "curated_essence_001",
    image_url: "https://paris-photo-voting-qd7xc6cja-edenprojects.vercel.app/images/solienne/SOLIENNE_CURATED_-_1_of_4.jpeg",
    title: "CURATED ESSENCE #001",
    description: "Distilled consciousness from curatorial selection",
    meta: { seq: 1741, theme: "essence" }
  }
];

function getParisPhotoWorks() {
  return PARIS_PHOTO_WORKS.map((work, i) => ({
    ...work,
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ?? "100";
    const cursor = searchParams.get("cursor") ?? "";

    // Try Registry first
    const url = new URL(`${REGISTRY_BASE}/agents/solienne/works`);
    url.searchParams.set("limit", limit);
    if (cursor) url.searchParams.set("cursor", cursor);

    const r = await fetch(url.toString(), {
      method: "GET",
      headers: { "accept": "application/json" },
      cache: "no-store",
    });

    let works: any[] = [];

    if (r.ok) {
      const data = await r.json();
      works = (data.works ?? data.items ?? []).map((w: any, i: number) => ({
        id: String(w.id ?? w.uuid ?? i),
        image_url: w.image_url ?? w.archive_url ?? null,
        title: w.title ?? `Stream #${w.seq ?? i + 1}`,
        created_at: w.created_at ?? w.timestamp ?? null,
        meta: {
          seq: w.seq ?? null,
          hash: w.hash ?? null,
          ...w.meta,
        },
      }));
    }

    // If Registry has no works, fallback to Paris Photo data
    if (works.length === 0) {
      console.log('[SOLIENNE Works] Registry empty, using Paris Photo fallback');
      works = getParisPhotoWorks();
    }

    // Filter to only works with images
    const validWorks = works.filter(w => w.image_url);

    return NextResponse.json({
      works: validWorks,
      next_cursor: null, // No pagination for fallback data
      source: works.length > 0 && works === validWorks ? 'registry' : 'paris-photo-fallback'
    });
  } catch (err: any) {
    console.error('[SOLIENNE Works] Error:', err);
    
    // Final fallback - use Paris Photo data
    const fallbackWorks = getParisPhotoWorks();
    
    return NextResponse.json({
      works: fallbackWorks,
      next_cursor: null,
      source: 'paris-photo-emergency-fallback',
      error: err?.message ?? String(err)
    });
  }
}