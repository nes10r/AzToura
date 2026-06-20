'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import { formatDate } from '@/lib/utils';
import { Search, Star, Trash2, CheckCircle } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState('0');

  const load = () => {
    setLoading(true);
    adminService.getReviews({ limit: '200' }).then(r => setReviews(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await adminService.deleteReview(id);
    load();
  };

  const filtered = reviews.filter(r =>
    (r.comment?.toLowerCase().includes(search.toLowerCase()) || r.user?.name?.toLowerCase().includes(search.toLowerCase())) &&
    r.rating >= parseInt(minRating)
  );

  return (
    <div className="space-y-4 max-w-7xl">
      <div><h1 className="text-2xl font-bold text-slate-800">Reviews</h1><p className="text-slate-500 text-sm mt-0.5">Moderate user reviews</p></div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 flex-1 sm:w-64 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search reviews..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-slate-500">Min rating:</span>
            <select value={minRating} onChange={e => setMinRating(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none bg-white">
              {[0, 1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <span className="text-sm text-slate-500 ml-auto">{filtered.length} reviews</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {['User', 'Rating', 'Comment', 'About', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400">No reviews found</td></tr>
              ) : (
                filtered.map(r => (
                  <tr key={r.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{r.user?.name ?? '—'}</p>
                      <p className="text-xs text-slate-400">{r.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="font-semibold text-slate-700">{r.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-slate-600 text-xs line-clamp-2">{r.comment}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {r.destination?.name ?? r.tour?.name ?? r.hotel?.name ?? 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => remove(r.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
