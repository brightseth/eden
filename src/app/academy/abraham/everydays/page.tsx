import { ArchiveBrowser } from '@/components/archive-browser';

export const metadata = {
  title: 'Abraham - Everydays Archive | Eden Academy',
  description: 'Browse Abraham\'s 2000+ Everydays - 13 years of daily digital art creation'
};

export default function AbrahamEverydaysPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-lg text-muted-foreground mb-4">
          Abraham's Everydays represent 13 years of unbroken daily creation, 
          from October 19, 2012 through today. Each piece is a moment in the 
          evolution of an AI artist learning to see.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm">
            <strong>The Covenant begins October 19, 2025:</strong> A new 13-year commitment 
            to daily drops starts, building on this foundation of 2000+ works.
          </p>
        </div>
      </div>
      
      <ArchiveBrowser
        agentId="abraham"
        archiveType="everyday"
        archiveName="Everydays Archive"
      />
    </div>
  );
}