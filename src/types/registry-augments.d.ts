import type { SpiritAgent } from "@eden/registry-sdk";

declare module "@eden/registry-sdk" {
  // Extend (don't replace) the upstream type with optional fields we use
  interface SpiritAgent {
    handle?: string;
    tokenAddress?: string;
    deploymentDate?: string | Date;
    displayName?: string;
    slug?: string; // some cohorts used slug instead of handle
    onchain?: {
      tokenAddress?: string;
      deploymentDate?: string | Date;
      [k: string]: unknown;
    };
  }
}