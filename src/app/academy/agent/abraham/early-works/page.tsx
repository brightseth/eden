import { EnhancedArchiveBrowser } from '@/components/EnhancedArchiveBrowser';

export default function AbrahamEarlyWorksPage() {
  return (
    <EnhancedArchiveBrowser
      agentId="abraham"
      archiveType="early-work"
      archiveName="Abraham Early Works - Summer 2021"
    />
  );
}

export const metadata = {
  title: 'Abraham Early Works',
  description: 'Community-generated works from summer 2021'
};