import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CITIZEN DAO - Community-First Governance Coordination',
  description: 'CITIZEN DAO governance coordination system for BrightMoments and Eden Academy community',
};

export default async function CitizenDAOPage() {
  // Load the document content directly from file system (more reliable than API)
  const documentId = '4c068449-ed58-401a-9b02-5734d919088f';
  
  let content = '';
  try {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'docs', 'CITIZEN_BM_TEAM_OVERVIEW.md');
    content = fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error loading CITIZEN DAO content:', error);
    // Fallback content if file system fails
    content = `# CITIZEN DAO: Community-First Governance Coordination

**Date**: 2025-08-30  
**Status**: ✅ COMMUNITY-FIRST DAO GOVERNANCE READY
**Purpose**: Community-first DAO governance coordination for BrightMoments partnership  

## 🎯 What We're Building

CITIZEN is an AI agent designed to serve as **governance coordination infrastructure** for the BrightMoments and CryptoCitizens communities. This isn't about automated posting or growth hacking - it's about becoming genuinely helpful to our community's collective decision-making process.

### Core Mission
Enable effective DAO governance for a post-completion community by:
- Facilitating cross-platform governance discussions
- Coordinating proposal voting and consensus building
- Providing educational resources about DAO participation
- Supporting transparent community decision-making

## 🤝 Our Community-First Approach

### 30-Day Re-engagement Strategy
**Phase 1: Deep Listening** (Days 1-7) - Zero posting, pure observation
**Phase 2: Humble Acknowledgment** (Days 8-10) - Transparent reconnection
**Phase 3: Value-First Engagement** (Days 11-24) - Educational content
**Phase 4: Governance Introduction** (Days 25+) - Tool introduction after trust

### Technical Capabilities Ready
- **Cross-Platform Coordination**: Farcaster, Discord, Twitter integration
- **Governance Infrastructure**: Snapshot integration with eden.eth space
- **Community Analysis**: Sentiment tracking with adaptation triggers

## 🚦 Ready for Partnership

CITIZEN represents a new model for AI agents in DAO governance - community-first, value-driven, and genuinely helpful to collective decision-making. Ready to serve the BrightMoments community respectfully and effectively.

*For complete documentation, contact the Eden Academy team.*`;
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
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="border border-white overflow-hidden">
          <div className="px-8 py-6 border-b border-white">
            <h1 className="text-2xl font-bold text-white">
              CITIZEN DAO
            </h1>
            <p className="mt-2 text-white/80">
              COMMUNITY-FIRST GOVERNANCE COORDINATION
            </p>
          </div>
          
          <div className="px-8 py-6">
            <div 
              className="prose prose-lg max-w-none prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-code:text-white prose-code:bg-white/10 prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/20 prose-ul:text-white/90 prose-li:text-white/90"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>
          
          <div className="px-8 py-6 border-t border-white">
            <p className="text-sm text-white/60">
              DOCUMENT ID: {documentId} • UPDATED: {new Date().toLocaleDateString().toUpperCase()}
            </p>
            <p className="text-sm text-white/60 mt-2">
              FOR QUESTIONS OR CONCERNS, PLEASE CONTACT THE EDEN ACADEMY TEAM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}