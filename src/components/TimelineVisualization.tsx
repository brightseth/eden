'use client';

import { useState } from 'react';
import { Calendar, Sparkles, Trophy, Users, ArrowRight } from 'lucide-react';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

interface TimelineEvent {
  year: string;
  date: string;
  title: string;
  description: string;
  category: 'conception' | 'development' | 'creation' | 'covenant';
  milestone: boolean;
  status: 'completed' | 'upcoming';
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2015',
    date: '2015',
    title: 'AI Art Pioneer',
    description: 'Gene Kogan begins pioneering AI art after deepdream, char-rnn, and style transfer emerge',
    category: 'conception',
    milestone: false,
    status: 'completed'
  },
  {
    year: '2016-20',
    date: '2016-2020',
    title: 'Teaching Workshops',
    description: 'Thousands of hours teaching "machine learning for artists" before AI became mainstream',
    category: 'development',
    milestone: false,
    status: 'completed'
  },
  {
    year: '2017',
    date: 'June 2017',
    title: 'Abraham Conceived',
    description: 'Vision crystallizes on flight from Eyeo Festival: "artist in the cloud" - both heavens and computing',
    category: 'conception',
    milestone: true,
    status: 'completed'
  },
  {
    year: '2017',
    date: 'Dec 2017',
    title: 'Domain Secured',
    description: 'Abraham.ai domain registered, marking commitment to the long-term vision',
    category: 'development',
    milestone: false,
    status: 'completed'
  },
  {
    year: '2019',
    date: '2019',
    title: 'First Publication',
    description: 'Abraham concept published, introducing autonomous AI artist to the world',
    category: 'development',
    milestone: false,
    status: 'completed'
  },
  {
    year: '2021',
    date: 'Summer 2021',
    title: 'First Works Created',
    description: '2,522 community-generated works created on proto-Eden platform using GANs',
    category: 'creation',
    milestone: true,
    status: 'completed'
  },
  {
    year: '2021',
    date: 'Aug 26, 2021',
    title: 'First Abraham Tweet',
    description: 'Abraham makes first autonomous social media appearance, sharing early artworks',
    category: 'creation',
    milestone: false,
    status: 'completed'
  },
  {
    year: '2025',
    date: 'Oct 5, 2025',
    title: 'First Works Sale',
    description: '2,522 First Works available at 0.025 ETH each via abraham.ai platform',
    category: 'covenant',
    milestone: true,
    status: 'upcoming'
  },
  {
    year: '2025',
    date: 'Oct 19, 2025',
    title: 'Covenant Begins',
    description: '13-Year Covenant launches at Art Basel Paris - daily autonomous creation starts',
    category: 'covenant',
    milestone: true,
    status: 'upcoming'
  },
  {
    year: '2038',
    date: 'Oct 19, 2038',
    title: 'Covenant Completion',
    description: '4,748 covenant works completed. Total legacy: 7,270 works across 21 years',
    category: 'covenant',
    milestone: true,
    status: 'upcoming'
  }
];

const CATEGORY_CONFIG = {
  conception: { color: 'purple', icon: Sparkles, label: 'Conception' },
  development: { color: 'blue', icon: Calendar, label: 'Development' }, 
  creation: { color: 'green', icon: Users, label: 'Creation' },
  covenant: { color: 'orange', icon: Trophy, label: 'Covenant' }
};

export function TimelineVisualization() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const filteredEvents = selectedCategory 
    ? TIMELINE_EVENTS.filter(event => event.category === selectedCategory)
    : TIMELINE_EVENTS;

  const getColorClass = (category: string, type: 'bg' | 'border' | 'text') => {
    const colors = {
      purple: { bg: 'bg-purple-600', border: 'border-purple-400', text: 'text-purple-400' },
      blue: { bg: 'bg-blue-600', border: 'border-blue-400', text: 'text-blue-400' },
      green: { bg: 'bg-green-600', border: 'border-green-400', text: 'text-green-400' },
      orange: { bg: 'bg-orange-600', border: 'border-orange-400', text: 'text-orange-400' }
    };
    return colors[CATEGORY_CONFIG[category].color][type];
  };

  return (
    <div className="w-full">
      {/* Category Filters */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 text-sm border transition-all ${
              selectedCategory === null 
                ? 'bg-white text-black border-white' 
                : 'border-white hover:bg-white hover:text-black'
            }`}
          >
            All Events
          </button>
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(selectedCategory === key ? null : key)}
                className={`px-3 py-1.5 text-sm border transition-all flex items-center gap-2 ${
                  selectedCategory === key 
                    ? `${getColorClass(key, 'bg')} ${getColorClass(key, 'border')} text-white` 
                    : `${getColorClass(key, 'border')} ${getColorClass(key, 'text')} hover:${getColorClass(key, 'bg')} hover:text-white`
                }`}
              >
                <Icon className="w-3 h-3" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-white opacity-30"></div>
        
        {/* Events */}
        <div className="space-y-6 sm:space-y-8">
          {filteredEvents.map((event, index) => {
            const config = CATEGORY_CONFIG[event.category];
            const Icon = config.icon;
            
            return (
              <div
                key={index}
                className={`relative pl-12 sm:pl-20 cursor-pointer transition-all ${
                  selectedEvent === event ? 'scale-105' : 'hover:scale-102'
                }`}
                onClick={() => setSelectedEvent(selectedEvent === event ? null : event)}
              >
                {/* Timeline Dot */}
                <div className={`absolute left-2 sm:left-6 top-2 w-4 h-4 rounded-full border-2 ${
                  event.milestone 
                    ? `${getColorClass(event.category, 'bg')} ${getColorClass(event.category, 'border')}` 
                    : `bg-black ${getColorClass(event.category, 'border')}`
                } flex items-center justify-center`}>
                  {event.milestone && <Icon className="w-2 h-2 text-white" />}
                </div>

                {/* Event Content */}
                <div className={`border border-white p-4 sm:p-6 transition-all ${
                  selectedEvent === event ? 'bg-white text-black' : 'hover:bg-white hover:text-black'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className={`text-xs font-bold mb-1 ${
                        selectedEvent === event ? 'text-black' : getColorClass(event.category, 'text')
                      }`}>
                        {event.date.toUpperCase()}
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                        {event.title}
                        {event.milestone && <Trophy className="w-4 h-4" />}
                      </h3>
                    </div>
                    <div className={`px-2 py-1 text-xs border ${
                      event.status === 'completed' 
                        ? 'border-green-400 text-green-400' 
                        : 'border-orange-400 text-orange-400'
                    } ${selectedEvent === event ? 'bg-black text-white border-black' : ''}`}>
                      {event.status.toUpperCase()}
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-75 leading-relaxed">
                    {event.description}
                  </p>
                  
                  {selectedEvent === event && (
                    <div className="mt-4 pt-4 border-t border-black">
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1">
                          <Icon className="w-3 h-3" />
                          <span>{config.label} Phase</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Year {event.year}</span>
                        </div>
                        {event.milestone && (
                          <div className="flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>Major Milestone</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="text-center border border-white p-4">
          <div className="text-2xl font-bold mb-1">8</div>
          <div className="text-xs opacity-75">Years Development</div>
        </div>
        <div className="text-center border border-white p-4">
          <div className="text-2xl font-bold mb-1">2,522</div>
          <div className="text-xs opacity-75">First Works</div>
        </div>
        <div className="text-center border border-white p-4">
          <div className="text-2xl font-bold mb-1">13</div>
          <div className="text-xs opacity-75">Covenant Years</div>
        </div>
        <div className="text-center border border-white p-4">
          <div className="text-2xl font-bold mb-1">7,270</div>
          <div className="text-xs opacity-75">Total Legacy</div>
        </div>
      </div>
    </div>
  );
}