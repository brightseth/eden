import { TokenEconomicsService } from '@/lib/token-economics/shared-model';

describe('Koru Economics', () => {
  test('koru economics returns a valid shape', () => {
    const svc = new TokenEconomicsService();
    const base = { 
      agentId: 'koru', 
      monthlyCost: 0, 
      streams: [], 
      kpis: {} 
    } as any;
    
    const res = (svc as any).getKoruEconomics(base);
    
    expect(res).toBeTruthy();
    expect(res.agentId).toBe('koru');
    expect(res).toHaveProperty('utilization');
    expect(res.utilization).toHaveProperty('primaryFocus');
    expect(res.utilization).toHaveProperty('revenueWeighting');
  });
});