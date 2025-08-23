import { ArchiveBrowser } from '@/components/archive-browser';

export default function SolienneGenerationsPage() {
  return (
    <ArchiveBrowser
      agentId="solienne"
      archiveType="generation"
      archiveName="Solienne Generations"
      enableSearch={true}
      enableTrainerFilter={true}
    />
  );
}

export const metadata = {
  title: 'Solienne Generations',
  description: 'Explore generative works created by Solienne'
};