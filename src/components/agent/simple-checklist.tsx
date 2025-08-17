'use client';

import { useState } from 'react';
import { Check, Square } from 'lucide-react';
import { safeToInt } from '@/lib/utils/number';

interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  category: 'identity' | 'infrastructure' | 'training' | 'launch';
}

const SETUP_CHECKLIST: ChecklistItem[] = [
  // PROFILE SETUP
  { id: '1', label: 'Set username', completed: false, category: 'identity' },
  { id: '2', label: 'Set display name', completed: false, category: 'identity' },
  { id: '3', label: 'Upload profile image', completed: false, category: 'identity' },
  { id: '4', label: 'Write description/bio', completed: false, category: 'identity' },
  { id: '5', label: 'Write creative instructions', completed: false, category: 'identity' },
  { id: '6', label: 'Set greeting message', completed: false, category: 'identity' },
  { id: '7', label: 'Make agent public', completed: false, category: 'identity' },
  
  // TOOLS & CAPABILITIES
  { id: '8', label: 'Select voice (TTS)', completed: false, category: 'training' },
  { id: '9', label: 'Train custom LoRA models', completed: false, category: 'training' },
  { id: '10', label: 'Enable image creation', completed: false, category: 'training' },
  { id: '11', label: 'Enable audio creation', completed: false, category: 'training' },
  { id: '12', label: 'Enable VJ tools', completed: false, category: 'training' },
  { id: '13', label: 'Enable collections', completed: false, category: 'training' },
  { id: '14', label: 'Enable social media tools', completed: false, category: 'training' },
  
  // INTEGRATIONS
  { id: '15', label: 'Connect Discord', completed: false, category: 'infrastructure' },
  { id: '16', label: 'Connect Twitter/X', completed: false, category: 'infrastructure' },
  { id: '17', label: 'Connect TikTok', completed: false, category: 'infrastructure' },
  { id: '18', label: 'Connect Farcaster', completed: false, category: 'infrastructure' },
  { id: '19', label: 'Connect Shopify', completed: false, category: 'infrastructure' },
  { id: '20', label: 'Connect Printify', completed: false, category: 'infrastructure' },
  { id: '21', label: 'Connect Captions AI', completed: false, category: 'infrastructure' },
  { id: '22', label: 'Set usage cost coverage', completed: false, category: 'infrastructure' },
  
  // MEMORY & KNOWLEDGE
  { id: '23', label: 'Set extraction prompt', completed: false, category: 'launch' },
  { id: '24', label: 'Add memory/context', completed: false, category: 'launch' },
  { id: '25', label: 'Add facts/knowledge', completed: false, category: 'launch' },
  { id: '26', label: 'Enable collective memory', completed: false, category: 'launch' },
  
  // PERMISSIONS
  { id: '27', label: 'Set owner permissions', completed: false, category: 'launch' },
  { id: '28', label: 'Add editors/collaborators', completed: false, category: 'launch' },
];

export function SimpleChecklist() {
  const [items, setItems] = useState(SETUP_CHECKLIST);
  
  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };
  
  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;
  
  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-mono mb-2">AGENT SETUP</h1>
        <p className="text-sm text-eden-gray">Get your agent from zero to functional</p>
      </div>
      
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span>{completedCount}/{items.length} COMPLETE</span>
          <span>{safeToInt(progress)}%</span>
        </div>
        <div className="w-full bg-eden-white/10 rounded-full h-2">
          <div 
            className="bg-eden-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      {/* Checklist */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-eden-gray mb-3">IDENTITY</h3>
          {items.filter(i => i.category === 'identity').map(item => (
            <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} />
          ))}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-eden-gray mb-3">INFRASTRUCTURE</h3>
          {items.filter(i => i.category === 'infrastructure').map(item => (
            <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} />
          ))}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-eden-gray mb-3">TRAINING</h3>
          {items.filter(i => i.category === 'training').map(item => (
            <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} />
          ))}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xs font-mono text-eden-gray mb-3">LAUNCH</h3>
          {items.filter(i => i.category === 'launch').map(item => (
            <ChecklistItemRow key={item.id} item={item} onToggle={toggleItem} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChecklistItemRow({ 
  item, 
  onToggle 
}: { 
  item: ChecklistItem; 
  onToggle: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      className="w-full flex items-center gap-3 p-3 rounded-lg bg-eden-white/5 hover:bg-eden-white/10 transition-colors text-left"
    >
      {item.completed ? (
        <Check className="w-4 h-4 text-eden-white" />
      ) : (
        <Square className="w-4 h-4 text-eden-gray" />
      )}
      <span className={item.completed ? 'line-through text-eden-gray' : ''}>
        {item.label}
      </span>
    </button>
  );
}