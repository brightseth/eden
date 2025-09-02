// src/app/api/agents/solienne/works/route.ts
import { NextResponse } from "next/server";

const REGISTRY_BASE =
  process.env.REGISTRY_BASE_URL ?? "https://eden-genesis-registry.vercel.app/api/v1";

export const revalidate = 120; // 2 min caching

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit") ?? "100";
    const cursor = searchParams.get("cursor") ?? "";

    // Registry endpoint: adjust if your path differs
    const url = new URL(`${REGISTRY_BASE}/agents/solienne/works`);
    url.searchParams.set("limit", limit);
    if (cursor) url.searchParams.set("cursor", cursor);

    const r = await fetch(url.toString(), {
      method: "GET",
      headers: { "accept": "application/json" },
      cache: "no-store",
    });

    if (!r.ok) {
      const text = await r.text();
      return NextResponse.json(
        { error: "registry_error", status: r.status, body: text },
        { status: 502 }
      );
    }

    const data = await r.json();

    // Normalize to UI contract
    const works = (data.works ?? data.items ?? []).map((w: any, i: number) => ({
      id: String(w.id ?? w.uuid ?? i),
      // prefer canonical image; fall back to archive
      image_url: w.image_url ?? w.archive_url ?? null,
      title: w.title ?? `Stream #${w.seq ?? i + 1}`,
      created_at: w.created_at ?? w.timestamp ?? null,
      meta: {
        seq: w.seq ?? null,
        hash: w.hash ?? null,
        ...w.meta,
      },
    }));

    return NextResponse.json({
      works,
      next_cursor: data.next_cursor ?? data.cursor ?? null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "proxy_exception", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}