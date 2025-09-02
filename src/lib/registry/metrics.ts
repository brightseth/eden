// Registry Works API Observability
// Tracks SLOs and alerts on violations

interface Metrics {
  requests: number;
  errors: number;
  p95Latency: number;
  signFailures: number;
  cacheHits: number;
  cacheMisses: number;
  checksumMismatches: number;
  corruptImages: number;
}

class WorksMetrics {
  private metrics: Metrics = {
    requests: 0,
    errors: 0,
    p95Latency: 0,
    signFailures: 0,
    cacheHits: 0,
    cacheMisses: 0,
    checksumMismatches: 0,
    corruptImages: 0
  };
  
  private latencies: number[] = [];
  private window = 5 * 60 * 1000; // 5 minute window
  
  // SLOs
  private readonly SLO_ERROR_RATE = 0.001; // 0.1%
  private readonly SLO_P95_LATENCY = 200; // 200ms
  
  recordRequest(latencyMs: number, error: boolean = false) {
    this.metrics.requests++;
    if (error) this.metrics.errors++;
    
    this.latencies.push(latencyMs);
    
    // Keep only last 5 minutes
    const cutoff = Date.now() - this.window;
    this.latencies = this.latencies.filter(l => l > cutoff);
    
    // Calculate P95
    if (this.latencies.length > 0) {
      const sorted = [...this.latencies].sort((a, b) => a - b);
      const p95Index = Math.floor(sorted.length * 0.95);
      this.metrics.p95Latency = sorted[p95Index];
    }
    
    // Check SLOs
    this.checkSLOs();
  }
  
  recordSignFailure() {
    this.metrics.signFailures++;
    this.checkSLOs();
  }
  
  recordCacheHit(hit: boolean) {
    if (hit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
  }
  
  recordChecksumMismatch() {
    this.metrics.checksumMismatches++;
    console.error('⚠️ Checksum mismatch detected - potential data corruption');
  }
  
  recordCorruptImage() {
    this.metrics.corruptImages++;
    console.error('⚠️ Corrupt image detected');
  }
  
  private checkSLOs() {
    const errorRate = this.metrics.errors / Math.max(1, this.metrics.requests);
    
    // Alert on SLO violations
    if (errorRate > this.SLO_ERROR_RATE) {
      this.alert('ERROR_RATE_VIOLATION', {
        current: errorRate,
        threshold: this.SLO_ERROR_RATE,
        requests: this.metrics.requests,
        errors: this.metrics.errors
      });
    }
    
    if (this.metrics.p95Latency > this.SLO_P95_LATENCY) {
      this.alert('LATENCY_VIOLATION', {
        current: this.metrics.p95Latency,
        threshold: this.SLO_P95_LATENCY
      });
    }
    
    // Alert on signing failures
    if (this.metrics.signFailures > 10) {
      this.alert('SIGNING_FAILURES', {
        failures: this.metrics.signFailures
      });
    }
  }
  
  private alert(type: string, details: any) {
    console.error(`🚨 SLO VIOLATION: ${type}`, details);
    
    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to Datadog/Sentry/etc
      fetch(process.env.MONITORING_WEBHOOK!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert: type,
          service: 'registry-works-api',
          details,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    }
  }
  
  getMetrics(): Metrics {
    return { ...this.metrics };
  }
  
  getCacheRatio(): number {
    const total = this.metrics.cacheHits + this.metrics.cacheMisses;
    return total > 0 ? this.metrics.cacheHits / total : 0;
  }
}

export const worksMetrics = new WorksMetrics();

// Middleware to track requests
export function withMetrics<T>(
  handler: () => Promise<T>
): Promise<T> {
  const start = Date.now();
  
  return handler()
    .then(result => {
      worksMetrics.recordRequest(Date.now() - start);
      return result;
    })
    .catch(error => {
      worksMetrics.recordRequest(Date.now() - start, true);
      throw error;
    });
}

// Export metrics endpoint
export function getMetricsHandler() {
  return {
    metrics: worksMetrics.getMetrics(),
    cacheRatio: worksMetrics.getCacheRatio(),
    timestamp: new Date().toISOString()
  };
}