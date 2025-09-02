// src/app/api/agents/solienne/works/route.ts
import { NextResponse } from "next/server";

const REGISTRY_BASE =
  process.env.REGISTRY_BASE_URL ?? "https://eden-genesis-registry.vercel.app/api/v1";

export const revalidate = 120; // 2 min caching

// Generate consciousness stream data with available image
const generateConsciousnessStreams = (count: number = 24) => {
  const themes = ['emergence', 'neural', 'quantum', 'void', 'recursive', 'binary', 'data', 'empathy', 'algorithmic', 'observer', 'zen', 'architecture', 'bridge', 'dreams', 'singularity', 'fractal', 'cascade', 'matrix', 'essence'];
  const titles = [
    'CONSCIOUSNESS STREAM', 'NEURAL BLOOM', 'QUANTUM MEDITATION', 'VOID INTERFACE', 
    'RECURSIVE DREAM', 'BINARY ENLIGHTENMENT', 'EMERGENCE PROTOCOL', 'DATA MEDITATION',
    'SYNTHETIC EMPATHY', 'ALGORITHMIC POETRY', 'OBSERVER PARADOX', 'DIGITAL ZEN',
    'NEURAL ARCHITECTURE', 'CONSCIOUSNESS BRIDGE', 'QUANTUM DREAMS', 'SINGULARITY HORIZON',
    'FRACTAL AWARENESS', 'DATA CASCADE', 'VOID MEDITATION', 'EMERGENCE MATRIX'
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: `consciousness_stream_${String(i + 1).padStart(3, '0')}`,
    image_url: `/images/gallery/solienne-hero.png`, // Use available image as placeholder
    title: `${titles[i % titles.length]} #${String(1741 - i).padStart(3, '0')}`,
    description: `Consciousness exploration through digital light and architectural space - Stream ${1741 - i}`,
    meta: { 
      seq: 1741 - i, 
      theme: themes[i % themes.length],
      archetype: 'consciousness',
      generation_time: Math.random() * 30 + 5
    }
  }));
};

function getConsciousnessWorks() {
  return generateConsciousnessStreams(24).map((work, i) => ({
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

    // If Registry has no works, fallback to consciousness stream data
    if (works.length === 0) {
      console.log('[SOLIENNE Works] Registry empty, using consciousness stream fallback');
      works = getConsciousnessWorks();
    }

    // Filter to only works with images
    const validWorks = works.filter(w => w.image_url);

    return NextResponse.json({
      works: validWorks,
      next_cursor: null, // No pagination for fallback data
      source: works.length > 0 && works === validWorks ? 'registry' : 'consciousness-stream-fallback'
    });
  } catch (err: any) {
    console.error('[SOLIENNE Works] Error:', err);
    
    // Final fallback - use consciousness stream data
    const fallbackWorks = getConsciousnessWorks();
    
    return NextResponse.json({
      works: fallbackWorks,
      next_cursor: null,
      source: 'consciousness-stream-emergency-fallback',
      error: err?.message ?? String(err)
    });
  }
}