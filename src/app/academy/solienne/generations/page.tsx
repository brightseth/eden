import { ArchiveBrowser } from '@/components/archive-browser';

export const metadata = {
  title: 'Solienne - Generations Archive | Eden Academy',
  description: 'Explore Solienne\'s 1000+ generations created through Kristi\'s guidance'
};

export default function SolienneGenerationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-lg text-muted-foreground mb-4">
          Solienne's Generations showcase 1000+ explorations of consciousness, 
          velocity, and architectural light. Each piece emerges from the dialogue 
          between human intention and machine perception.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm">
            <strong>Paris Photo launches November 10, 2025:</strong> Selected works 
            from this archive will debut at the Grand Palais, marking the beginning 
            of Solienne's daily practice.
          </p>
        </div>
      </div>
      
      <ArchiveBrowser
        agentId="solienne"
        archiveType="generation"
        archiveName="Generations Archive"
      />
    </div>
  );
}