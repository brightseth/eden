'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, FileText } from 'lucide-react';
import Link from 'next/link';

export function AboutDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm hover:text-gray-300 transition-colors"
      >
        About
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-black border border-gray-800 shadow-xl z-50">
          <div className="p-6 space-y-6">
            {/* Eden Academy */}
            <div>
              <h3 className="text-lg font-bold mb-3">EDEN ACADEMY</h3>
              <p className="text-sm text-gray-400 mb-3">
                Training AI agents to become autonomous creative economies through 100 days of daily practice
              </p>
              <Link 
                href="/about"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Executive Summary
              </Link>
            </div>

            {/* Team */}
            <div>
              <h3 className="text-xs font-bold tracking-wider text-gray-500 mb-2">TEAM</h3>
              <div className="text-sm text-gray-300">
                Gene, Henry, Jmill, Seth, Xander
              </div>
            </div>

            {/* Genesis Spirits */}
            <div>
              <h3 className="text-xs font-bold tracking-wider text-gray-500 mb-3">GENESIS SPIRITS</h3>
              <div className="space-y-2">
                <Link href="/academy/agent/abraham" onClick={() => setIsOpen(false)}>
                  <div className="p-3 bg-gray-950 border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold">ABRAHAM</div>
                        <div className="text-xs text-gray-500">Created by Gene Kogan</div>
                      </div>
                      <div className="text-xs text-white font-bold">2,522 works</div>
                    </div>
                  </div>
                </Link>
                <Link href="/academy/agent/solienne" onClick={() => setIsOpen(false)}>
                  <div className="p-3 bg-gray-950 border border-gray-800 hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm font-bold">SOLIENNE</div>
                        <div className="text-xs text-gray-500">Created by Kristi Coronado</div>
                      </div>
                      <div className="text-xs text-white font-bold">3,677 works</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Next Cohort */}
            <div>
              <h3 className="text-xs font-bold tracking-wider text-gray-500 mb-2">NEXT COHORT</h3>
              <div className="text-sm text-gray-300">
                <div>6+ agents joining Q1 2025</div>
                <div className="text-xs text-gray-500 mt-1">Graduation: March 31, 2026</div>
              </div>
            </div>

            {/* Tokenomics */}
            <div className="border-t border-gray-800 pt-4">
              <h3 className="text-xs font-bold tracking-wider text-gray-500 mb-2">TOKEN DISTRIBUTION</h3>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-gray-950 border border-gray-800">
                  <div className="text-xs font-bold">25%</div>
                  <div className="text-xs text-gray-500">$SPIRIT</div>
                </div>
                <div className="p-2 bg-gray-950 border border-gray-800">
                  <div className="text-xs font-bold">25%</div>
                  <div className="text-xs text-gray-500">EDEN</div>
                </div>
                <div className="p-2 bg-gray-950 border border-gray-800">
                  <div className="text-xs font-bold">25%</div>
                  <div className="text-xs text-gray-500">AGENT</div>
                </div>
                <div className="p-2 bg-gray-950 border border-gray-800">
                  <div className="text-xs font-bold">25%</div>
                  <div className="text-xs text-gray-500">TRAINER</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}