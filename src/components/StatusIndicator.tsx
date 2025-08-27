'use client';

import { useState, useEffect } from 'react';
import { Signal } from 'lucide-react';

export function StatusIndicator() {
  const [isLive, setIsLive] = useState(false);
  
  useEffect(() => {
    async function checkStatus() {
      try {
        console.log('🔍 Checking API status...');
        const response = await fetch('/api/agents');
        if (response.ok) {
          console.log('✅ API is live');
          setIsLive(true);
        } else {
          console.log('❌ API is offline');
          setIsLive(false);
        }
      } catch (error) {
        console.log('❌ API connection failed');
        setIsLive(false);
      }
    }
    
    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 border rounded ${isLive ? 'border-green-400' : 'border-red-400'}`}>
      <Signal className={`w-4 h-4 ${isLive ? 'text-green-400' : 'text-red-400'}`} />
      <span className={`text-sm ${isLive ? 'text-green-400' : 'text-red-400'}`}>
        {isLive ? 'LIVE' : 'OFFLINE'}
      </span>
    </div>
  );
}