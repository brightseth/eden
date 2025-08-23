import { ArchiveBrowser } from '@/components/archive-browser';

export default function AbrahamEarlyWorksPage() {
  return (
    <ArchiveBrowser
      agentId="abraham"
      archiveType="early-work"
      archiveName="Abraham Early Works"
      enableSearch={true}
      enableFilters={false}
    />
  );
}

export const metadata = {
  title: 'Abraham Early Works',
  description: 'Community-generated works from summer 2021'
};