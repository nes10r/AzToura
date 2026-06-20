'use client';

import { useState } from 'react';
import { Search, MapPin, Map, Building2, Utensils, CalendarDays, Compass, ChevronDown } from 'lucide-react';
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

  const ActiveIcon = TABS[activeTab].icon;

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

          {/* ── Tabs: desktop horizontal scroll ── */}
          <div className="hidden sm:flex overflow-x-auto scrollbar-none border-b border-gray-100 relative">
            {TABS.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors shrink-0',
                  activeTab === i
                    ? 'border-secondary text-secondary bg-secondary/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50',
                )}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Category selector: mobile dropdown ── */}
          <div className="sm:hidden border-b border-gray-100">
            <div className="relative">
              <ActiveIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(Number(e.target.value))}
                className="w-full appearance-none pl-9 pr-8 py-3 text-sm font-medium text-secondary bg-secondary/5 border-0 outline-none"
              >
                {TABS.map((tab, i) => (
                  <option key={tab.label} value={i}>{tab.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* ── Search input row ── */}
          <form onSubmit={handleSearch} className="p-3 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 bg-gray-50 hover:border-secondary focus-within:border-secondary focus-within:bg-white transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${TABS[activeTab].label.toLowerCase()}...`}
                className="flex-1 py-3 text-gray-800 placeholder:text-gray-400 bg-transparent outline-none text-sm"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 text-xs px-1">✕</button>
              )}
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-amber-500 active:bg-amber-600 text-white font-semibold rounded-xl text-sm transition-colors shrink-0"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </form>
        </div>

        {/* ── Popular chips: single-row horizontal scroll ── */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto scrollbar-none pb-1">
          <span className="text-white/50 text-xs shrink-0">Popular:</span>
          {QUICK.map((place) => (
            <button
              key={place}
              onClick={() => router.push(`/destinations/${place.toLowerCase()}`)}
              className="shrink-0 text-xs text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 rounded-full px-3 py-1 transition-colors whitespace-nowrap"
            >
              {place}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
