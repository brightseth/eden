'use client';

import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UploadedWork {
  id: string;
  agent_id: string;
  day: number;
  media_url: string;
  tags?: any;
}

export function ImageUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedWorks, setUploadedWorks] = useState<UploadedWork[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [agentId, setAgentId] = useState('abraham');
  const [day, setDay] = useState(1);
  const [prompt, setPrompt] = useState('');

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      // Convert file to base64 for storage (simple approach)
      const base64 = await fileToBase64(file);
      
      // For demo, we'll use a data URL as the media_url
      // In production, you'd upload to proper storage
      const mediaUrl = base64;
      
      // Create the work with retry logic for day conflicts
      let currentDay = day;
      let workResponse;
      
      while (true) {
        workResponse = await fetch('/api/works', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            agent_id: agentId,
            day: currentDay,
            media_url: mediaUrl,
            prompt: prompt || 'Uploaded image',
            filename: file.name
          })
        });

        if (workResponse.ok) {
          // Update form day to next available
          setDay(currentDay + 1);
          break;
        } else if (workResponse.status === 409) {
          // Day conflict, try next day
          currentDay++;
          if (currentDay > day + 10) {
            // Prevent infinite loop
            throw new Error('Unable to find available day slot');
          }
        } else {
          throw new Error('Failed to create work');
        }
      }

      const work = await workResponse.json();
      
      // Queue for tagging
      const taggerResponse = await fetch('/api/tagger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          work_id: work.id,
          media_url: base64, // Use base64 for tagging
          agent_id: agentId,
          filename: file.name
        })
      });

      let tags = null;
      if (taggerResponse.ok) {
        const taggerResult = await taggerResponse.json();
        tags = taggerResult.tags;
      }

      // Add to uploaded works list
      setUploadedWorks(prev => [{
        ...work,
        tags
      }, ...prev]);

      // Reset form (day already updated in retry loop)
      setPrompt('');

    } catch (err: any) {
      setError(err.message || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      uploadImage(imageFile);
    }
  }, [agentId, day, prompt]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadImage(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Upload & Tag Images</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Agent</label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            >
              <option value="abraham">Abraham</option>
              <option value="solienne">Solienne</option>
              <option value="geppetto">Geppetto</option>
              <option value="koru">Koru</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Day</label>
            <input
              type="number"
              min="1"
              value={day}
              onChange={(e) => setDay(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Prompt (optional)</label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the work..."
              className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragging 
              ? 'border-purple-500 bg-purple-950/20' 
              : 'border-gray-700 hover:border-gray-500'
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          
          <label htmlFor="file-upload" className="cursor-pointer">
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <div>
                  <p className="text-gray-400">Uploading & Tagging...</p>
                  <p className="text-xs text-gray-500">This may take a few seconds</p>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400 mb-2">Drop image here or click to browse</p>
                <p className="text-xs text-gray-500">Supports JPG, PNG, WebP</p>
                <p className="text-xs text-gray-600 mt-2">Will auto-tag with AI analysis</p>
              </div>
            )}
          </label>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-950/50 border border-red-800 rounded flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}
      </div>

      {/* Uploaded Works */}
      {uploadedWorks.length > 0 && (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Recently Uploaded & Tagged</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {uploadedWorks.map((work) => (
              <div key={work.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-800 rounded overflow-hidden">
                    <Image
                      src={work.media_url}
                      alt="Uploaded work"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold capitalize">{work.agent_id}</span>
                      <span className="text-sm text-gray-400">Day {work.day}</span>
                      {work.tags && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    
                    {work.tags && (
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded">
                            {work.tags.taxonomy.type}
                          </span>
                          {work.tags.taxonomy.series && (
                            <span className="px-2 py-1 bg-purple-900 text-purple-300 text-xs rounded">
                              {work.tags.taxonomy.series}
                            </span>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          Print: {(work.tags.quality.print_readiness * 100).toFixed(0)}% • 
                          Risk: {work.tags.quality.artifact_risk}
                        </div>
                        
                        {work.tags.taxonomy.subject && work.tags.taxonomy.subject.length > 0 && (
                          <div className="text-xs text-gray-500">
                            {work.tags.taxonomy.subject.slice(0, 3).map((subj: string) => `#${subj}`).join(' ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}