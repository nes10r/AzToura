'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import { formatDate, formatPrice } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  PENDING:   'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('ALL');
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '100' };
    if (status !== 'ALL') params['status'] = status;
    adminService.getBookings(params).then(r => setBookings(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status]);

  const changeStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await adminService.updateBookingStatus(id, newStatus);
      load();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = bookings.filter(b =>
    b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Bookings</h1>
        <p className="text-slate-500 text-sm mt-0.5">Manage all reservations</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 flex-1 sm:w-56 sm:flex-none">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search user or ID..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatus(s)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${status === s ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-slate-100">
                {['ID', 'User', 'Item', 'Guests', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-medium text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No bookings found</td></tr>
              ) : (
                filtered.map(b => (
                  <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{b.id.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 text-sm">{b.user?.name}</p>
                      <p className="text-xs text-slate-400">{b.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{b.tour?.name ?? b.hotel?.name ?? b.event?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{b.guests}</td>
                    <td className="px-4 py-3 font-semibold">${b.totalPrice}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status] ?? ''}`}>{b.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">{formatDate(b.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={e => changeStatus(b.id, e.target.value)}
                        disabled={updating === b.id}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-emerald-400 bg-white disabled:opacity-50"
                      >
                        {STATUSES.filter(s => s !== 'ALL').map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
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
