'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, MapPin, CalendarCheck, DollarSign, Building2,
  Utensils, CalendarDays, Star, TrendingUp, Clock,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { adminService } from '@/services/admin';
import { formatPrice, formatDate } from '@/lib/utils';

interface Counts {
  users: number; destinations: number; tours: number;
  hotels: number; restaurants: number; events: number;
  bookings: number; reviews: number;
}
interface Stats {
  counts: Counts;
  recentBookings: Array<Record<string, unknown>>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
}

const BOOKING_CHART = [
  { day: 'Mon', bookings: 12 }, { day: 'Tue', bookings: 19 },
  { day: 'Wed', bookings: 8 },  { day: 'Thu', bookings: 25 },
  { day: 'Fri', bookings: 31 }, { day: 'Sat', bookings: 28 },
  { day: 'Sun', bookings: 17 },
];

const REVENUE_CHART = [
  { month: 'Jan', revenue: 4200 }, { month: 'Feb', revenue: 5800 },
  { month: 'Mar', revenue: 7200 }, { month: 'Apr', revenue: 9100 },
  { month: 'May', revenue: 11300 }, { month: 'Jun', revenue: 13500 },
];

const PIE_DATA = [
  { name: 'Tours', value: 45, color: '#0A8F6A' },
  { name: 'Hotels', value: 35, color: '#0F4C81' },
  { name: 'Events', value: 20, color: '#F6B73C' },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const revenueFormatter = (v: any) => [`$${v}`, 'Revenue'] as [string, string];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-emerald-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((s) => {
        setStats(s.data);
        setBookings(s.data?.recentBookings || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-0.5">Welcome back, Admin</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}        label="Total Users"        value={stats?.counts?.users ?? '—'}        color="bg-blue-50 text-blue-600"    />
        <StatCard icon={MapPin}       label="Destinations"       value={stats?.counts?.destinations ?? '—'} color="bg-emerald-50 text-emerald-600" />
        <StatCard icon={CalendarCheck}label="Bookings"           value={stats?.counts?.bookings ?? '—'}     color="bg-violet-50 text-violet-600" />
        <StatCard icon={Star}         label="Reviews"            value={stats?.counts?.reviews ?? '—'}      color="bg-amber-50 text-amber-600"  />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Building2}    label="Hotels"             value={stats?.counts?.hotels ?? '—'}       color="bg-sky-50 text-sky-600"      />
        <StatCard icon={Utensils}     label="Restaurants"        value={stats?.counts?.restaurants ?? '—'}  color="bg-orange-50 text-orange-600"/>
        <StatCard icon={CalendarDays} label="Events"             value={stats?.counts?.events ?? '—'}       color="bg-rose-50 text-rose-600"    />
        <StatCard icon={MapPin}       label="Active Tours"       value={stats?.counts?.tours ?? '—'}        color="bg-teal-50 text-teal-600"    />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly bookings bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Weekly Bookings
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={BOOKING_CHART} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="bookings" fill="#0A8F6A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking types pie */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-semibold text-slate-700 mb-4">Booking Types</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {PIE_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1.5 mt-2">
            {PIE_DATA.map(d => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  {d.name}
                </span>
                <span className="font-medium text-slate-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue line chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          Revenue (6 months)
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={stats?.monthlyRevenue ?? REVENUE_CHART}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={revenueFormatter}
            />
            <Line type="monotone" dataKey="revenue" stroke="#0A8F6A" strokeWidth={2.5} dot={{ fill: '#0A8F6A', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent bookings table */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            Recent Bookings
          </h2>
          <Link href="/admin/bookings" className="text-xs text-emerald-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 border-b border-slate-100">
                <th className="px-5 py-3 font-medium">User</th>
                <th className="px-5 py-3 font-medium">Item</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-5 py-3">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-slate-400 text-sm">No bookings yet</td>
                </tr>
              ) : (
                bookings.slice(0, 8).map((b: any) => (
                  <tr key={b.id as string} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-slate-700">{b.user?.name ?? '—'}</td>
                    <td className="px-5 py-3 text-slate-500">{b.tour?.name ?? b.hotel?.name ?? 'N/A'}</td>
                    <td className="px-5 py-3 font-medium">${b.totalPrice}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[b.status as string] ?? 'bg-slate-100 text-slate-600'}`}>
                        {b.status as string}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-slate-400 text-xs">{formatDate(b.createdAt as string)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Add Destination', href: '/admin/content/destinations/new', color: 'bg-emerald-600 hover:bg-emerald-700' },
          { label: 'Add Tour',        href: '/admin/content/tours/new',        color: 'bg-blue-600 hover:bg-blue-700'    },
          { label: 'Add Hotel',       href: '/admin/content/hotels/new',       color: 'bg-violet-600 hover:bg-violet-700'},
          { label: 'Add Blog Post',   href: '/admin/content/blog/new',         color: 'bg-amber-600 hover:bg-amber-700'  },
        ].map(q => (
          <Link
            key={q.href}
            href={q.href}
            className={`text-center py-3 px-4 rounded-xl text-white text-sm font-medium transition-colors ${q.color}`}
          >
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
