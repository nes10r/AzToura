'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Event } from '@/types';
import api from '@/services/api';
import EventCard from '@/components/cards/EventCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export default function EventsPage() {
  const [items, setItems] = useState<Event[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [upcoming, setUpcoming] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number | boolean> = { page, limit: 12 };
    if (search) params.search = search;
    if (city) params.city = city;
    if (upcoming) params.upcoming = true;

    api.get('/events', { params })
      .then(({ data }) => {
        if (data.data) setItems(data.data);
        if (data.pagination) setTotal(data.pagination.total);
      })
      .finally(() => setLoading(false));
  }, [page, search, city, upcoming]);

  const clearFilters = () => { setSearch(''); setCity(''); setUpcoming(true); setPage(1); };
  const hasFilters = !!(search || city || !upcoming);

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold">Events</h1>
          <p className="mt-3 text-white/80 text-lg max-w-xl mx-auto">
            Festivals, concerts, and cultural experiences across Azerbaijan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-surface rounded-2xl border border-border p-4 mb-8 flex flex-wrap gap-3 items-center">
          <div className="flex-1 min-w-56 flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 bg-background">
            <Search className="w-4 h-4 text-text-muted" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search events…"
              className="bg-transparent outline-none flex-1 text-sm text-text placeholder:text-text-muted"
            />
          </div>
          <input
            value={city}
            onChange={(e) => { setCity(e.target.value); setPage(1); }}
            placeholder="City"
            className="border border-border rounded-xl px-3 py-2.5 bg-background text-sm text-text outline-none focus:border-primary w-32"
          />
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer select-none">
            <input
              type="checkbox"
              checked={upcoming}
              onChange={(e) => { setUpcoming(e.target.checked); setPage(1); }}
              className="w-4 h-4 accent-primary rounded"
            />
            Upcoming only
          </label>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}><X className="w-4 h-4" /> Clear</Button>
          )}
        </div>

        {!loading && <p className="text-sm text-text-secondary mb-6">{total} events found</p>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 text-text-muted">
            <p className="text-lg font-medium mb-4">No events found</p>
            <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {items.map((e) => (
              <motion.div key={e.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                <EventCard event={e} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {total > 12 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="flex items-center px-4 text-sm text-text-secondary">Page {page} of {Math.ceil(total / 12)}</span>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 12)} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
