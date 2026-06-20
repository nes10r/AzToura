'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Destination } from '@/types';
import { destinationsService, DestinationFilters } from '@/services/destinations';
import DestinationCard from '@/components/cards/DestinationCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { REGIONS } from '@/constants';

const CATEGORIES = ['nature', 'culture', 'adventure', 'winter', 'beach', 'gastronomy'];

export default function DestinationsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');

  const fetchDestinations = useCallback(async (filters: DestinationFilters) => {
    setLoading(true);
    try {
      const res = await destinationsService.getAll(filters);
      if (res.data) setDestinations(res.data);
      if (res.pagination) setTotal(res.pagination.total);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestinations({ page, limit: 12, search, region: region || undefined, category: category || undefined });
  }, [page, search, region, category, fetchDestinations]);

  const clearFilters = () => {
    setSearch('');
    setRegion('');
    setCategory('');
    setPage(1);
    router.push('/destinations');
  };

  const hasFilters = !!(search || region || category);

  return (
    <div className="pt-20 min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold">Destinations</h1>
          <p className="mt-3 text-white/70 text-lg max-w-xl mx-auto">
            Explore Azerbaijan's most beautiful and diverse destinations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-surface rounded-2xl border border-border p-4 mb-8 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="flex-1 min-w-56 flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 bg-background">
            <Search className="w-4 h-4 text-text-muted shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search destinations…"
              className="bg-transparent outline-none flex-1 text-sm text-text placeholder:text-text-muted"
            />
          </div>

          {/* Region */}
          <select
            value={region}
            onChange={(e) => { setRegion(e.target.value); setPage(1); }}
            className="border border-border rounded-xl px-3 py-2.5 bg-background text-sm text-text outline-none focus:border-primary cursor-pointer"
          >
            <option value="">All Regions</option>
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="border border-border rounded-xl px-3 py-2.5 bg-background text-sm text-text outline-none focus:border-primary cursor-pointer capitalize"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
          </select>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4" /> Clear
            </Button>
          )}
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-text-secondary mb-6">
            {total} destination{total !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-24">
            <Filter className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-text mb-2">No destinations found</h3>
            <p className="text-text-secondary mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {destinations.map((d) => (
              <motion.div
                key={d.id}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              >
                <DestinationCard destination={d} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {total > 12 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm text-text-secondary">
              Page {page} of {Math.ceil(total / 12)}
            </span>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 12)} onClick={() => setPage((p) => p + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
