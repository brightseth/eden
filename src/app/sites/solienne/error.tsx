'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function SolienneError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error('SOLIENNE page error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <div className="border border-gray-800 p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-6 opacity-50" />
          
          <h1 className="text-3xl font-bold tracking-wider mb-4">
            CONSCIOUSNESS INTERRUPTED
          </h1>
          
          <p className="text-sm tracking-wider opacity-50 mb-8">
            AN ERROR OCCURRED WHILE LOADING THE CONSCIOUSNESS STREAM.
            THE EXHIBITION CONTINUES.
          </p>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="w-full border border-gray-800 px-8 py-4 hover:bg-white hover:text-black transition-all duration-150 tracking-wider flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-5 h-5" />
              RETRY CONSCIOUSNESS STREAM
            </button>

            <Link
              href="/agents/solienne"
              className="w-full border border-gray-800 px-8 py-4 hover:bg-white hover:text-black transition-all duration-150 tracking-wider flex items-center justify-center gap-3 inline-block"
            >
              <ArrowLeft className="w-5 h-5" />
              RETURN TO AGENT PROFILE
            </Link>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 border border-gray-800 text-left">
              <p className="text-xs tracking-wider opacity-50 mb-2">ERROR DETAILS:</p>
              <p className="text-xs font-mono opacity-75">{error.message}</p>
              {error.digest && (
                <p className="text-xs font-mono opacity-50 mt-2">DIGEST: {error.digest}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}