'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { BlogPost } from '@/types';
import api from '@/services/api';
import BlogCard from '@/components/cards/BlogCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 9 };
    if (search) params.search = search;

    api.get('/blog', { params })
      .then(({ data }) => {
        if (data.data) setPosts(data.data);
        if (data.pagination) setTotal(data.pagination.total);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div className="pt-20 min-h-screen bg-background">
      <div className="bg-secondary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold">Travel Blog</h1>
          <p className="mt-3 text-white/70 text-lg max-w-xl mx-auto">
            Stories, guides, and insights from across Azerbaijan
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search */}
        <div className="max-w-xl mb-8">
          <div className="flex items-center gap-2 border border-border rounded-2xl px-4 py-3 bg-surface">
            <Search className="w-4 h-4 text-text-muted shrink-0" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search articles…"
              className="bg-transparent outline-none flex-1 text-sm text-text placeholder:text-text-muted"
            />
            {search && (
              <button onClick={() => { setSearch(''); setPage(1); }} className="text-text-muted hover:text-text">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {!loading && <p className="text-sm text-text-secondary mb-6">{total} articles</p>}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-text-muted">
            <p className="text-lg font-medium mb-4">No articles found</p>
            <Button variant="outline" onClick={() => { setSearch(''); setPage(1); }}>Clear search</Button>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden" animate="show"
            variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          >
            {posts.map((p) => (
              <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                <BlogCard post={p} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {total > 9 && (
          <div className="flex justify-center gap-2 mt-12">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="flex items-center px-4 text-sm text-text-secondary">Page {page} of {Math.ceil(total / 9)}</span>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 9)} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}
      </div>
    </div>
  );
}
