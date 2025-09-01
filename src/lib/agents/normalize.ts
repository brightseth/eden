// Stub type to replace missing @eden/registry-sdk import
type SpiritAgent = {
  displayName?: string;
  [key: string]: any;
};

export type NormalizedAgent = {
  handle?: string;
  displayName?: string;
  tokenAddress?: string;
  deploymentDate?: string | Date;
};

export function normalizeAgent(a: SpiritAgent): NormalizedAgent {
  const handle =
    (a as any).handle ?? (a as any).slug ?? (a as any).id ?? undefined;
  const tokenAddress =
    (a as any).tokenAddress ?? (a as any).onchain?.tokenAddress ?? undefined;
  const deploymentDate =
    (a as any).deploymentDate ?? (a as any).onchain?.deploymentDate ?? undefined;

  return {
    handle,
    displayName: a.displayName ?? (typeof handle === "string" ? handle.toUpperCase() : undefined),
    tokenAddress,
    deploymentDate,
  };
}