'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronLeft, Upload, Eye, TrendingUp, Award, Home, ArrowLeft } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default function NinaCuratorPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [verdict, setVerdict] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setVerdict(null);
    }
  };

  const submitForCuration = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await fetch('/api/nina-curator', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setVerdict(data);
    } catch (error) {
      console.error('Curation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch(verdict) {
      case 'INCLUDE': return 'text-green-400 border-green-400';
      case 'MAYBE': return 'text-yellow-400 border-yellow-400';
      case 'EXCLUDE': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <UnifiedHeader />

      {/* Page Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/academy"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Academy
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-2">NINA ROEHRS</h1>
          <p className="text-gray-400">
            Paris Photo Digital Sector Curator - Submit work for rigorous evaluation
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Upload Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Submit for Curation</h2>
            
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-w-full h-64 object-contain mx-auto rounded"
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setImagePreview('');
                      setVerdict(null);
                    }}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Choose Different Image
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400 mb-2">Drop image here or click to upload</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {selectedImage && !verdict && (
              <button
                onClick={submitForCuration}
                disabled={loading}
                className="w-full mt-6 px-6 py-3 bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {loading ? 'Evaluating...' : 'Submit for Curation'}
              </button>
            )}
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Curatorial Verdict</h2>
            
            {verdict ? (
              <div className="space-y-6">
                {/* Verdict Badge */}
                <div className={`inline-block px-4 py-2 border-2 font-bold ${getVerdictColor(verdict.verdict)}`}>
                  {verdict.verdict}
                </div>

                {/* Scores */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Technical Assessment</h3>
                  {Object.entries(verdict.scores).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-gray-400 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 transition-all"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono w-12 text-right">
                          {value}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Critique */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">Critique</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {verdict.critique}
                  </p>
                </div>

                {/* Advice */}
                {verdict.advice && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">Curatorial Advice</h3>
                    <p className="text-gray-300 leading-relaxed">
                      {verdict.advice}
                    </p>
                  </div>
                )}

                {/* Reset Button */}
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview('');
                    setVerdict(null);
                  }}
                  className="w-full px-6 py-3 border border-gray-600 hover:border-white transition-colors"
                >
                  Submit Another Work
                </button>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-12">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No work submitted yet</p>
                <p className="text-sm mt-2">Upload an image to receive curatorial feedback</p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 pt-16 border-t border-gray-800">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Curation Standards
              </h3>
              <p className="text-sm text-gray-400">
                Only 15-25% of submissions receive INCLUDE verdicts. 
                Nina evaluates for Paris Photo readiness, not social media appeal.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Improvement Path
              </h3>
              <p className="text-sm text-gray-400">
                Each verdict includes specific technical feedback and actionable advice 
                to help artists reach museum-grade quality.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-yellow-400" />
                Curatorial Eye
              </h3>
              <p className="text-sm text-gray-400">
                Nina's assessments focus on formal qualities, conceptual rigor, 
                and exhibition readiness at 120cm print size.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}