'use client';

import { useState } from 'react';
import { Search, MapPin, Map, Building2, Utensils, CalendarDays, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

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

        {/* ── Search card ── */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-accent">

          {/* ── Category pills (scrollable on mobile, tab bar on desktop) ── */}
          <div className="relative">
            {/* right fade hint */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 sm:hidden" />
            <div className="flex overflow-x-auto scrollbar-none gap-1.5 px-3 pt-3 pb-2 sm:px-0 sm:pt-0 sm:pb-0 sm:gap-0 sm:border-b sm:border-gray-100">
              {TABS.map((tab, i) => {
                const Icon = tab.icon;
                const active = activeTab === i;
                return (
                  /* Mobile: pill chip | Desktop: underline tab */
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      /* shared */
                      'flex items-center gap-1.5 whitespace-nowrap font-medium transition-all shrink-0',
                      /* mobile pill style */
                      'rounded-full px-3 py-1.5 text-sm sm:rounded-none sm:px-4 sm:py-3 sm:border-b-2',
                      active
                        ? 'bg-secondary text-white sm:bg-secondary/5 sm:text-secondary sm:border-secondary'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 sm:bg-transparent sm:text-gray-500 sm:border-transparent sm:hover:text-gray-700 sm:hover:bg-gray-50',
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Search input row ── */}
          <form onSubmit={handleSearch} className="p-3 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 bg-gray-50 focus-within:border-secondary focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${TABS[activeTab].label.toLowerCase()}...`}
                className="flex-1 py-3 text-gray-800 placeholder:text-gray-400 bg-transparent outline-none text-sm"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="w-5 h-5 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center text-white text-xs shrink-0 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-amber-500 active:scale-95 text-white font-semibold rounded-xl text-sm transition-all shrink-0"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>
        </div>

        {/* ── Popular chips ── */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none">
          <span className="text-white/50 text-xs shrink-0">Popular:</span>
          {QUICK.map((place) => (
            <button
              key={place}
              onClick={() => router.push(`/destinations/${place.toLowerCase()}`)}
              className="shrink-0 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full px-3 py-1 transition-colors whitespace-nowrap active:scale-95"
            >
              {place}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
