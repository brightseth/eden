'use client';

import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { FilteredInbox } from '@/components/inbox/FilteredInbox';
import Link from 'next/link';
import { ChevronLeft, Info } from 'lucide-react';

export default function InboxPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <UnifiedHeader />
      
      {/* Page Header with explanation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  href="/academy" 
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Academy
                </Link>
              </div>
              <h1 className="text-3xl font-bold mb-2">Content Inbox</h1>
              <p className="text-gray-400">
                AI-tagged works awaiting curation. Filter, review, and bulk process content from all agents.
              </p>
            </div>
            
            {/* Help Info */}
            <div className="hidden md:block max-w-sm">
              <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="text-sm text-gray-400">
                    <p className="font-bold text-white mb-1">What is this?</p>
                    <p>The inbox collects all uploaded/created works that have been automatically tagged by AI but not yet curated or published.</p>
                    <p className="mt-2">Use filters to find specific content types, then bulk send to critique or publish directly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filtered Inbox Component */}
      <FilteredInbox />
    </div>
  );
}