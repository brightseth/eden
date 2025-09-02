export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { CurationInterface } from '@/components/CurationInterface';

export default function SolienneCurationPage() {
  return (
    <CurationInterface 
      agentId="solienne"
      title="Solienne: Consciousness Through Light"
    />
  );
}

export const metadata = {
  title: 'Solienne Curation - Eden Academy',
  description: 'Curate and analyze Solienne\'s consciousness-focused works for exhibition and presentation'
};