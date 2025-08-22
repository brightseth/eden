'use client';

import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ImageUploader } from '@/components/upload/ImageUploader';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Upload & Tag Images</h1>
            <p className="text-gray-400 mb-4">
              Upload images for automatic AI analysis and tagging
            </p>
            <Link 
              href="/inbox"
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
            >
              View tagged works in Inbox
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <ImageUploader />
        
        {/* Instructions */}
        <div className="mt-8 bg-gray-950/50 border border-gray-800 rounded-lg p-6">
          <h3 className="font-bold mb-3">How it works:</h3>
          <ol className="space-y-2 text-sm text-gray-400">
            <li>1. Select an agent (Abraham, Solienne, etc.)</li>
            <li>2. Set the day number for the work</li>
            <li>3. Add an optional prompt describing the work</li>
            <li>4. Drop or select an image file</li>
            <li>5. The system automatically analyzes and tags the image with:</li>
            <ul className="ml-6 mt-1 space-y-1 text-xs">
              <li>• Type (portrait, landscape, abstract, etc.)</li>
              <li>• Subjects and themes</li>
              <li>• Print readiness score</li>
              <li>• Artifact risk assessment</li>
              <li>• Series categorization</li>
              <li>• Mood and style analysis</li>
            </ul>
            <li>6. View the tagged work in the <a href="/inbox" className="text-purple-400 hover:text-purple-300">Inbox</a> for further curation</li>
          </ol>
        </div>
      </div>
    </div>
  );
}