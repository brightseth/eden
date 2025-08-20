'use client';

import { useState } from 'react';
import { Grid, Calendar, Download, TrendingUp } from 'lucide-react';

interface PortfolioTabProps {
  agentName: string;
}

export function PortfolioTab({ agentName }: PortfolioTabProps) {
  const [view, setView] = useState<'grid' | 'calendar'>('grid');
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');

  // Sample archive data - will be replaced with actual creation history
  const creations = Array.from({ length: 95 }, (_, i) => ({
    day: 95 - i,
    title: `Creation #${95 - i}`,
    date: new Date(2025, 9, 15 - i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: `${(Math.random() * 0.8 + 0.2).toFixed(2)} ETH`,
    status: Math.random() > 0.3 ? 'sold' : 'available',
    image: `/placeholder-${i}.jpg`
  }));

  const stats = {
    totalCreated: 95,
    totalVolume: "47.3 ETH",
    uniqueHolders: 127,
    averagePrice: "0.52 ETH"
  };

  // Price history data for chart
  const priceHistory = [
    { day: 'Day 90', price: 0.42, sold: true },
    { day: 'Day 91', price: 0.58, sold: true },
    { day: 'Day 92', price: 0.44, sold: true },
    { day: 'Day 93', price: 0.71, sold: true },
    { day: 'Day 94', price: 0.52, sold: true },
    { day: 'Day 95', price: 0.67, sold: false }
  ];

  const filteredCreations = creations.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Portfolio Header */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider">COMPLETE PORTFOLIO</h3>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">LAST 6 DAYS</p>
            <p className="text-2xl font-bold text-green-400">+59.5%</p>
          </div>
          <div className="flex items-end justify-between h-32 gap-2">
            {priceHistory.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs font-bold mb-1">
                    {item.price} ETH
                  </span>
                  <div 
                    className={`w-full ${item.sold ? 'bg-green-400' : 'bg-yellow-400'} transition-all hover:opacity-80`}
                    style={{ height: `${(item.price / 0.71) * 100}px` }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2">{item.day.split(' ')[1]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400" />
                <span>Sold</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400" />
                <span>Current</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">Floor: 0.42 ETH</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 mb-1">CREATIONS</p>
          <p className="text-2xl font-bold">{stats.totalCreated}</p>
        </div>
        <div className="p-4 border border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 mb-1">TOTAL VOLUME</p>
          <p className="text-2xl font-bold text-green-400">{stats.totalVolume}</p>
        </div>
        <div className="p-4 border border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 mb-1">COLLECTORS</p>
          <p className="text-2xl font-bold">{stats.uniqueHolders}</p>
        </div>
        <div className="p-4 border border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 mb-1">FLOOR PRICE</p>
          <p className="text-2xl font-bold">{stats.averagePrice}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`p-2 border ${view === 'grid' ? 'border-white bg-white text-black' : 'border-gray-600 hover:border-white'} transition-colors`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`p-2 border ${view === 'calendar' ? 'border-white bg-white text-black' : 'border-gray-600 hover:border-white'} transition-colors`}
            >
              <Calendar className="w-4 h-4" />
            </button>
          </div>

          {/* Filter */}
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-black border border-gray-600 px-3 py-2 text-sm"
          >
            <option value="all">All Works</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-gray-600 hover:border-white transition-colors text-sm">
          <Download className="w-4 h-4" />
          Export Portfolio
        </button>
      </div>

      {/* Portfolio Grid */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredCreations.map((creation, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-square bg-gray-900 border border-gray-800 group-hover:border-gray-600 transition-colors flex items-center justify-center mb-2">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">#{creation.day}</p>
                </div>
              </div>
              <div>
                <p className="text-xs truncate">{creation.title}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{creation.date}</p>
                  <p className={`text-xs font-bold ${creation.status === 'sold' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {creation.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-bold tracking-wider">OCTOBER 2025</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-4">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={idx} className="text-center text-xs text-gray-500 font-bold">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <div 
                  key={i} 
                  className={`aspect-square border ${i < 15 ? 'border-green-400 bg-gray-950' : 'border-gray-800'} flex items-center justify-center cursor-pointer hover:bg-gray-900 transition-colors`}
                >
                  <span className={`text-xs ${i < 15 ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400" />
                  <span>Created</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 border border-gray-800" />
                  <span>Upcoming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Note */}
      <div className="p-4 bg-gray-950 border border-gray-800">
        <p className="text-xs text-gray-400">
          Complete portfolio of {agentName}'s creative journey. 
          Each piece represents a day of training, building toward token launch on Day 100.
          After graduation, the portfolio continues growing with autonomous daily creations.
        </p>
      </div>
    </div>
  );
}