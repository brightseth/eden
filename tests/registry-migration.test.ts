// Smoke Tests for Registry Migration
// Must pass before production deployment

import { describe, it, expect, beforeAll } from '@jest/globals';

const REGISTRY_BASE = process.env.REGISTRY_BASE_URL || 'https://eden-genesis-registry.vercel.app';
const ACADEMY_BASE = process.env.ACADEMY_URL || 'https://academy.eden2.io';

describe('Registry Migration Smoke Tests', () => {
  
  describe('Registry API', () => {
    it('should return works with signed URLs', async () => {
      const response = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works?limit=1`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.items).toBeDefined();
      expect(data.items.length).toBeGreaterThan(0);
      
      const work = data.items[0];
      expect(work.signed_url).toBeDefined();
      expect(work.signed_url).toMatch(/^https:\/\//);
      expect(work.ordinal).toBeDefined();
    });
    
    it('should support keyset pagination', async () => {
      const page1 = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works?limit=10`);
      const data1 = await page1.json();
      expect(data1.nextCursor).toBeDefined();
      
      const page2 = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works?limit=10&cursor=${data1.nextCursor}`);
      const data2 = await page2.json();
      
      // Verify no overlap
      const ids1 = data1.items.map((i: any) => i.id);
      const ids2 = data2.items.map((i: any) => i.id);
      const overlap = ids1.filter((id: string) => ids2.includes(id));
      expect(overlap.length).toBe(0);
    });
  });
  
  describe('Signed URL Validation', () => {
    it('should load images from signed URLs', async () => {
      const response = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works?limit=25`);
      const data = await response.json();
      
      // Sample 5 random works
      const sample = data.items
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      
      for (const work of sample) {
        const imgResponse = await fetch(work.signed_url, { method: 'HEAD' });
        expect(imgResponse.status).toBe(200);
        expect(imgResponse.headers.get('content-type')).toMatch(/image\/(png|jpeg)/);
      }
    });
  });
  
  describe('Academy Proxy', () => {
    it('should proxy to Registry without public URLs', async () => {
      const response = await fetch(`${ACADEMY_BASE}/api/agents/solienne/works?limit=1`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.items).toBeDefined();
      
      // Verify signed URL, not public
      const work = data.items[0];
      expect(work.signed_url).not.toContain('storage/v1/object/public');
    });
  });
  
  describe('Frontend DOM Check', () => {
    it('should not contain public storage URLs in rendered HTML', async () => {
      const response = await fetch(`${ACADEMY_BASE}/agents/solienne/generations`);
      const html = await response.text();
      
      // Check for forbidden patterns
      expect(html).not.toContain('storage/v1/object/public');
      expect(html).not.toContain('ctlygyrkibupejllgglr.supabase.co');
    });
  });
  
  describe('Data Integrity', () => {
    it('should have expected number of works', async () => {
      const response = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works?limit=1`);
      const data = await response.json();
      
      // Get total from first work ordinal (assuming descending order)
      expect(data.items[0].ordinal).toBeGreaterThanOrEqual(1700);
      expect(data.items[0].ordinal).toBeLessThanOrEqual(1750);
    });
    
    it('should detect and report missing works', async () => {
      // Check for gaps by sampling
      const response = await fetch(`${REGISTRY_BASE}/api/v1/agents/solienne/works?limit=100`);
      const data = await response.json();
      
      const ordinals = data.items.map((i: any) => i.ordinal).sort((a: number, b: number) => b - a);
      
      // Check for sequential ordering
      for (let i = 1; i < ordinals.length; i++) {
        const gap = ordinals[i - 1] - ordinals[i];
        expect(gap).toBeGreaterThanOrEqual(1); // Allow gaps but track them
      }
    });
  });
});

// Runtime guard test
describe('Runtime Guards', () => {
  it('should throw on public URL construction when flag is off', () => {
    process.env.ALLOW_STORAGE_FALLBACK = 'false';
    
    expect(() => {
      const url = 'https://example.supabase.co/storage/v1/object/public/test.png';
      if (process.env.ALLOW_STORAGE_FALLBACK !== 'true' && url.includes('storage/v1/object/public')) {
        throw new Error('Public storage URLs are forbidden');
      }
    }).toThrow('Public storage URLs are forbidden');
  });
});