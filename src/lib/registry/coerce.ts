export const toNum = (v: unknown, d = 0) => {
  const n = typeof v === 'number' ? v : typeof v === 'string' ? Number(v) : NaN;
  return Number.isFinite(n) ? n : d;
};

export const toStr = (v: unknown, d = '') => (typeof v === 'string' ? v : d);

export const toDate = (v: unknown) => new Date(toStr(v) || Date.now());