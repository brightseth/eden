'use client';

import { useState } from 'react';
import { Upload, Inbox, MessageSquare, Send, Package } from 'lucide-react';
import { ImageUploader } from '@/components/upload/ImageUploader';
import { FilteredInbox } from '@/components/inbox/FilteredInbox';
import { CritiquePanel } from './CritiquePanel';
import { PublishPanel } from './PublishPanel';
import { ProductsPanel } from './ProductsPanel';

interface StudioProps {
  agentId: string;
  agentName: string;
}

type TabId = 'upload' | 'inbox' | 'critique' | 'publish' | 'products';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export function Studio({ agentId, agentName }: StudioProps) {
  const [activeTab, setActiveTab] = useState<TabId>('upload');
  const [inboxCount, setInboxCount] = useState(0);
  const [critiqueCount, setCritiqueCount] = useState(0);

  const tabs: Tab[] = [
    { id: 'upload', label: 'Upload', icon: <Upload className="w-4 h-4" /> },
    { id: 'inbox', label: 'Inbox', icon: <Inbox className="w-4 h-4" />, badge: inboxCount },
    { id: 'critique', label: 'Critique', icon: <MessageSquare className="w-4 h-4" />, badge: critiqueCount },
    { id: 'publish', label: 'Publish', icon: <Send className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Studio Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                {agentName} Studio
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Create → Review → Critique → Publish → Monetize
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Agent #{agentId}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800 sticky top-0 bg-black z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all
                  border-b-2 -mb-[1px]
                  ${activeTab === tab.id 
                    ? 'text-white border-green-400 bg-gray-900/50' 
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-gray-900/30'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-purple-500 text-white rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'upload' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Upload & Tag</h2>
              <p className="text-gray-400">
                Upload new works for {agentName}. AI will automatically analyze and tag each image.
              </p>
            </div>
            <ImageUploader defaultAgent={agentId} />
          </div>
        )}

        {activeTab === 'inbox' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Content Inbox</h2>
              <p className="text-gray-400">
                Review AI-tagged works awaiting curation. Filter, preview, and send to critique.
              </p>
            </div>
            <FilteredInbox 
              agentFilter={agentId} 
              onCountChange={setInboxCount}
            />
          </div>
        )}

        {activeTab === 'critique' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Nina's Critique</h2>
              <p className="text-gray-400">
                Review Nina's verdicts on submitted works. INCLUDE works can be published to the collection.
              </p>
            </div>
            <CritiquePanel 
              agentId={agentId}
              onCountChange={setCritiqueCount}
            />
          </div>
        )}

        {activeTab === 'publish' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Publish Queue</h2>
              <p className="text-gray-400">
                Manage works ready for publication. Add to collections, set visibility, and push live.
              </p>
            </div>
            <PublishPanel agentId={agentId} />
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">Product Pipeline</h2>
              <p className="text-gray-400">
                Transform works into products. Preview on mockups, assign to merchandise, and push to Printify.
              </p>
            </div>
            <ProductsPanel agentId={agentId} />
          </div>
        )}
      </div>
    </div>
  );
}