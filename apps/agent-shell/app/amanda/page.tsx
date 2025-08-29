'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AmandaSiteRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Permanent redirect to BERTHA site
    router.replace('/sites/bertha');
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to BERTHA...</h1>
        <p className="text-gray-400">Amanda has evolved into BERTHA</p>
      </div>
    </div>
  );
}