'use client';

import { useState } from 'react';
import { Search, MapPin, Map, Building2, Utensils, CalendarDays, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const TABS = [
  { label: 'All',          icon: Compass,      href: '/destinations' },
  { label: 'Destinations', icon: MapPin,        href: '/destinations' },
  { label: 'Tours',        icon: Map,           href: '/tours'        },
  { label: 'Hotels',       icon: Building2,     href: '/hotels'       },
  { label: 'Restaurants',  icon: Utensils,      href: '/restaurants'  },
  { label: 'Events',       icon: CalendarDays,  href: '/events'       },
];

const QUICK = ['Baku', 'Gabala', 'Sheki', 'Shahdag', 'Khinalig'];

export default function HeroSection() {
  const [query, setQuery]         = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const base = TABS[activeTab].href;
    router.push(query.trim() ? `${base}?search=${encodeURIComponent(query.trim())}` : base);
  };

  return (
    <section className="relative bg-secondary overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/baku-night.jpg')" }}
      />
      <div className="absolute inset-0 bg-secondary/75" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-12 sm:pb-14">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">
          Discover Azerbaijan
        </h1>
        <p className="text-white/70 text-sm mb-5">
          Find destinations, tours, hotels, restaurants and upcoming events
        </p>

        {/* Search card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border-2 sm:border-4 border-accent">
          {/* Tabs */}
          <div className="flex overflow-x-auto scrollbar-none border-b border-gray-100">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={cn(
                  'flex items-center gap-1 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0',
                  activeTab === i
                    ? 'border-secondary text-secondary bg-secondary/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                )}
              >
                <tab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Input row */}
          <form onSubmit={handleSearch} className="flex gap-2 p-2.5 sm:p-3">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-3 hover:border-secondary focus-within:border-secondary transition-colors">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${TABS[activeTab].label.toLowerCase()}...`}
                className="flex-1 py-2.5 sm:py-3 text-gray-800 placeholder:text-gray-400 bg-transparent outline-none text-sm"
              />
            </div>
            <Button
              type="submit"
              className="shrink-0 px-4 sm:px-7 bg-accent hover:bg-amber-500 text-white font-semibold rounded-lg text-sm"
            >
              Search
            </Button>
          </form>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
          <span className="text-white/50 text-xs">Popular:</span>
          {QUICK.map((place) => (
            <button
              key={place}
              onClick={() => router.push(`/destinations/${place.toLowerCase()}`)}
              className="text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full px-2.5 py-0.5 sm:px-3 sm:py-1 transition-colors"
            >
              {place}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
