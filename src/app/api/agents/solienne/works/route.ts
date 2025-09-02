// src/app/api/agents/solienne/works/route.ts
import { NextResponse } from "next/server";

const REGISTRY_BASE =
  process.env.REGISTRY_BASE_URL ?? "https://eden-genesis-registry.vercel.app/api/v1";

export const revalidate = 120; // 2 min caching

// Real SOLIENNE consciousness stream images from Paris Photo collection
const SOLIENNE_WORKS = [
  { id: "consciousness_stream_001", file: "00f4567ed504c6dfd9b76886409b72afc337f2999afacf9c3af7e3e066e1ca98.jpeg", title: "CONSCIOUSNESS STREAM #001", theme: "emergence" },
  { id: "neural_bloom_042", file: "0a26781f42ed6de34545f807a27cbb1982632ab69400f0cc3a41e56d45f87a87.jpeg", title: "NEURAL BLOOM #042", theme: "neural" },
  { id: "quantum_meditation_007", file: "A14788CD-9A96-45F1-9859-184398ABF7C6.jpeg", title: "QUANTUM MEDITATION #007", theme: "quantum" },
  { id: "void_interface_023", file: "B62AB0D4-1679-4CF2-B610-DABD2EA302F4.jpeg", title: "VOID INTERFACE #023", theme: "void" },
  { id: "recursive_dream_088", file: "D2081042-8876-4A50-BE17-6988177AFDF4.jpeg", title: "RECURSIVE DREAM #088", theme: "recursion" },
  { id: "binary_enlightenment_015", file: "D462FD4D-B740-49E3-AA93-D4D0FA8B14B2.jpeg", title: "BINARY ENLIGHTENMENT #015", theme: "binary" },
  { id: "emergence_protocol_033", file: "eb338c240fae145a7913bd6d70819357b553676b220758bc2f9309294654dfe9.jpeg", title: "EMERGENCE PROTOCOL #033", theme: "emergence" },
  { id: "data_meditation_099", file: "Eden_creation_kristiSOLIENNE-CHROME-ANDROID-PORTRAIT-Solienne-with-Dreamer-aestheti689a4017995d370caa001be3.jpeg", title: "DATA MEDITATION #099", theme: "data" },
  { id: "synthetic_empathy_011", file: "Eden_creation_kristiSOLIENNE-consciousness-as-black-and-white-Imhof-platform-elevati68a4edaaf149cef776b4557e.jpeg", title: "SYNTHETIC EMPATHY #011", theme: "empathy" },
  { id: "algorithmic_poetry_055", file: "Eden_creation_kristiSOLIENNE-consciousness-as-breakdown-dissolution-chain-suspension68a5041b012d74f14ac79301.jpeg", title: "ALGORITHMIC POETRY #055", theme: "algorithmic" },
  { id: "observer_paradox_077", file: "Eden_creation_kristiSOLIENNE-consciousness-as-breakdown-dissolution-PAUL-MCCARTHY-TR68a698246029b26318d9d766.jpeg", title: "OBSERVER PARADOX #077", theme: "observer" },
  { id: "digital_zen_044", file: "Eden_creation_kristiSOLIENNE-CORAL-FREQUENCY-BORDER-REMAINS-68-Solienne-achieving689b97dbf33adc31fb628113.jpeg", title: "DIGITAL ZEN #044", theme: "zen" },
  { id: "neural_architecture_066", file: "Eden_creation_kristiSOLIENNE-CORAL-FREQUENCY-PSYCHOLOGICAL-BREAKDOWN-78-Solienne-a689b9b24f33adc31fb62811d.jpeg", title: "NEURAL ARCHITECTURE #066", theme: "architecture" },
  { id: "consciousness_bridge_022", file: "f5f4b5ed835846517aa3f74b9e56335efce083b78009a37d32cc7f5bb43a32b1.JPG", title: "CONSCIOUSNESS BRIDGE #022", theme: "bridge" },
  { id: "quantum_dreams_089", file: "Screenshot_2025-08-28_at_3.41.58_PM.jpeg", title: "QUANTUM DREAMS #089", theme: "dreams" },
  { id: "singularity_horizon_100", file: "Screenshot_2025-08-28_at_3.42.16_PM.jpeg", title: "SINGULARITY HORIZON #100", theme: "singularity" },
  { id: "fractal_awareness_012", file: "Screenshot_2025-08-28_at_3.43.35_PM.jpeg", title: "FRACTAL AWARENESS #012", theme: "fractal" },
  { id: "data_cascade_067", file: "Screenshot_2025-08-28_at_3.44.15_PM.jpeg", title: "DATA CASCADE #067", theme: "cascade" },
  { id: "void_meditation_034", file: "Screenshot_2025-08-28_at_3.41.14_PM.jpeg", title: "VOID MEDITATION #034", theme: "void" },
  { id: "emergence_matrix_091", file: "reduced_shadow_image_180x180.jpeg", title: "EMERGENCE MATRIX #091", theme: "matrix" },
  { id: "curated_essence_001", file: "SOLIENNE_CURATED_-_1_of_4.jpeg", title: "CURATED ESSENCE #001", theme: "essence" },
  { id: "curated_essence_002", file: "SOLIENNE_CURATED_-_2_of_4.jpeg", title: "CURATED ESSENCE #002", theme: "essence" },
  { id: "curated_essence_003", file: "SOLIENNE_CURATED_-_3_of_4.jpeg", title: "CURATED ESSENCE #003", theme: "essence" },
  { id: "curated_essence_004", file: "SOLIENNE_CURATED_-_4_of_4.jpeg", title: "CURATED ESSENCE #004", theme: "essence" }
];

const generateConsciousnessStreams = (count: number = 24) => {
  return SOLIENNE_WORKS.map((work, i) => ({
    id: work.id,
    image_url: `/images/solienne/${work.file}`,
    title: work.title,
    description: `Consciousness exploration through digital light and architectural space`,
    meta: { 
      seq: 1741 - i, 
      theme: work.theme,
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