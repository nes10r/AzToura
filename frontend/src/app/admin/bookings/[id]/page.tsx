'use client';

import { use, useEffect, useState } from 'react';
import { adminService } from '@/services/admin';
import { ArrowLeft, Loader2, Calendar, User, Package, CreditCard } from 'lucide-react';
import Link from 'next/link';

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const STATUS_COLORS: Record<string, string> = {
  PENDING:   'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [status, setStatus] = useState('PENDING');

  useEffect(() => {
    adminService.getBookingById(id).then(r => {
      setBooking(r.data);
      setStatus(r.data.status || 'PENDING');
    }).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (s: string) => {
    setSaving(true);
    await adminService.updateBookingStatus(id, s);
    setStatus(s);
    setSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-64"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  if (!booking) return <div className="text-slate-500 text-center py-16">Booking not found</div>;

  const subject = booking.tour ?? booking.hotel ?? booking.event ?? null;
  const type = booking.tour ? 'Tour' : booking.hotel ? 'Hotel' : 'Event';

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/bookings" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Booking Details</h1>
          <p className="text-slate-500 text-sm font-mono mt-0.5">#{id.slice(0, 8).toUpperCase()}</p>
        </div>
        <span className={`ml-auto text-xs px-3 py-1.5 rounded-full font-medium ${STATUS_COLORS[status]}`}>{status}</span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        <div className="px-5 py-4">
          <h2 className="font-semibold text-slate-700 mb-3">Customer</h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
              {booking.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-medium text-slate-800">{booking.user?.name || 'Unknown'}</p>
              <p className="text-slate-500 text-sm">{booking.user?.email}</p>
            </div>
          </div>
        </div>

        <div className="px-5 py-4">
          <h2 className="font-semibold text-slate-700 mb-3">Booking Info</h2>
          <div className="space-y-2 text-sm">
            {[
              { icon: Package,    label: 'Type',        value: type },
              { icon: Package,    label: subject ? type : 'Item', value: subject?.name ?? 'N/A' },
              { icon: Calendar,   label: 'Start Date',  value: booking.startDate ? new Date(booking.startDate).toLocaleDateString() : '—' },
              { icon: Calendar,   label: 'End Date',    value: booking.endDate ? new Date(booking.endDate).toLocaleDateString() : '—' },
              { icon: User,       label: 'Guests',      value: String(booking.guests ?? 1) },
              { icon: CreditCard, label: 'Total Price', value: booking.totalPrice ? `$${booking.totalPrice}` : '—' },
            ].map(row => (
              <div key={row.label} className="flex items-center gap-3 py-1.5">
                <row.icon className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-500 w-28">{row.label}</span>
                <span className="text-slate-700 font-medium">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {booking.notes && (
          <div className="px-5 py-4">
            <h2 className="font-semibold text-slate-700 mb-2">Notes</h2>
            <p className="text-sm text-slate-600">{booking.notes}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-4">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => updateStatus(s)} disabled={saving || s === status}
              className={`px-4 py-2 text-sm font-medium rounded-xl border transition-colors disabled:opacity-60 ${s === status ? STATUS_COLORS[s] + ' border-transparent' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {saving && s === status ? <Loader2 className="w-4 h-4 animate-spin inline" /> : s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
