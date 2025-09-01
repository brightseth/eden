import { toNum, toStr, toDate } from './coerce';

export type CreationMeta = Record<string, unknown>;

export function normalizeCreation(c: { id: string; metadata?: CreationMeta }) {
  const m = c.metadata ?? {};
  return {
    id: c.id,
    title: toStr((m as any).title),
    imageUrl: toStr((m as any).imageUrl),
    archiveUrl: toStr((m as any).archiveUrl),
    archiveNumber: toNum((m as any).archiveNumber),
    views: toNum((m as any).views),
    collectors: toNum((m as any).collectors),
    createdAt: toDate((m as any).createdAt),
    dayNumber: toNum((m as any).dayNumber),
  };
}

export function normalizeWork(w: { id: string; metadata?: CreationMeta; [key: string]: any }) {
  const m = w.metadata ?? {};
  return {
    ...w,
    title: toStr(m.title || w.title),
    artist: toStr(m.artist || w.artist),
    currentPrice: toNum(m.currentPrice || w.currentPrice),
    medium: toStr(m.medium || w.medium),
  };
}