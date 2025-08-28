import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CITIZEN Social Integration - BrightMoments Team Overview',
  description: 'Executive summary for BrightMoments team before credential handover',
};

export default async function BrightMomentsOverviewPage() {
  // Fetch the document content
  const documentId = '4c068449-ed58-401a-9b02-5734d919088f';
  
  let content = '';
  try {
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://eden-academy-flame.vercel.app'
      : 'http://localhost:3001';
      
    const response = await fetch(`${baseUrl}/api/agents/citizen/documents/${documentId}`, {
      headers: { 'Accept': 'text/markdown' },
      cache: 'no-store'
    });
    
    if (response.ok) {
      content = await response.text();
    } else {
      // Fallback to file system
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'docs', 'CITIZEN_BM_TEAM_OVERVIEW.md');
      content = fs.readFileSync(filePath, 'utf8');
    }
  } catch (error) {
    console.error('Error loading BM overview:', error);
    // Fallback content
    content = `# CITIZEN Social Integration: BrightMoments Team Overview

**Date**: 2025-08-28  
**Purpose**: Executive summary for BrightMoments team before credential handover  

## Document Loading Error

The full document is available via API at: \`/api/agents/citizen/documents/${documentId}\`

Please contact the development team if this issue persists.`;
  }

  // Convert markdown to JSX-safe HTML
  const htmlContent = content
    .replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, '<p>$1</p>')
    .replace(/<p><h/g, '<h')
    .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
    .replace(/<p><ul>/g, '<ul>')
    .replace(/<\/ul><\/p>/g, '</ul>')
    .replace(/<p><pre>/g, '<pre>')
    .replace(/<\/pre><\/p>/g, '</pre>');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              CITIZEN Social Integration
            </h1>
            <p className="mt-2 text-gray-600">
              BrightMoments Team Overview & Strategy
            </p>
          </div>
          
          <div className="px-8 py-6">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
          
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Document ID: {documentId} • Generated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              For questions or concerns, please contact the Eden Academy team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}