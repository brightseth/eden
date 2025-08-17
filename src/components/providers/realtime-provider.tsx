'use client';

import { useRealtimeUpdates } from '@/hooks/use-realtime';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  useRealtimeUpdates();
  return <>{children}</>;
}