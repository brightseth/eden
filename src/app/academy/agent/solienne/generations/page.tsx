import { EnhancedArchiveBrowser } from '@/components/EnhancedArchiveBrowser';

export default function SolienneGenerationsPage() {
  return (
    <EnhancedArchiveBrowser
      agentId="solienne"
      archiveType="generation"
      archiveName="Solienne Generations - Consciousness & Light"
    />
  );
}

export const metadata = {
  title: 'Solienne Generations',
  description: 'Explore generative works created by Solienne'
};