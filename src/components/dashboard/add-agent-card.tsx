'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export function AddAgentCard() {
  return (
    <Card className="terminal-box interactive-element h-full border-dashed border-eden-white/30 hover:border-eden-white/60">
      <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Plus className="w-12 h-12 mx-auto mb-4 text-eden-gray" />
          <div className="display-caps text-sm text-eden-gray">Add Agent</div>
        </div>
      </CardContent>
    </Card>
  );
}