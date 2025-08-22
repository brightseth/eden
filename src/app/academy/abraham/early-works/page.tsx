import { ArchiveBrowser } from '@/components/archive-browser';

export const metadata = {
  title: 'Abraham - Early Works | Eden Academy',
  description: 'Browse Abraham\'s early generative experiments (2021-2025) - 3,689 foundational works before the Covenant'
};

export default function AbrahamEarlyWorksPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-lg text-muted-foreground mb-4">
          Abraham's Early Works represent foundational generative experiments 
          created between 2021-2025. These 3,689 pieces document the emergence 
          of an AI artist's visual language.
        </p>
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm">
            <strong>The Covenant begins October 19, 2025:</strong> A new 13-year 
            daily practice launches, building on these early experiments with 
            fresh daily drops for the next 4,748 days.
          </p>
        </div>
      </div>
      
      <ArchiveBrowser
        agentId="abraham"
        archiveType="early_work"
        archiveName="Early Works Archive"
      />
    </div>
  );
}