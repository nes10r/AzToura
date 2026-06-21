'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell, Search, ChevronRight, LogOut, User, Settings,
  ExternalLink, CalendarCheck, Star, X, Loader2,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

const LABELS: Record<string, string> = {
  admin: 'Dashboard', content: 'Content', destinations: 'Destinations',
  tours: 'Tours', hotels: 'Hotels', restaurants: 'Restaurants',
  events: 'Events', blog: 'Blog', categories: 'Categories',
  bookings: 'Bookings', users: 'Users', reviews: 'Reviews', media: 'Media',
  settings: 'Settings', site: 'Site Settings', theme: 'Theme Settings',
  layout: 'Layout Settings', seo: 'SEO', notifications: 'Notifications',
  system: 'System', 'home-builder': 'Home Builder', menus: 'Menus',
  roles: 'Roles', logs: 'Audit Logs', new: 'New', profile: 'Profile',
};

function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);
  return (
    <nav className="flex items-center gap-1 text-sm">
      {parts.map((part, i) => {
        const href = '/' + parts.slice(0, i + 1).join('/');
        const label = LABELS[part] || part;
        const isLast = i === parts.length - 1;
        const isUUID = /^[0-9a-f-]{36}$/.test(part);
        return (
          <span key={href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            {isLast || isUUID
              ? <span className="text-slate-700 font-medium">{isUUID ? 'Edit' : label}</span>
              : <Link href={href} className="text-slate-500 hover:text-slate-700 transition-colors">{label}</Link>
            }
          </span>
        );
      })}
    </nav>
  );
}

// ─── Search ───────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  Destination: 'bg-emerald-100 text-emerald-700',
  Tour:        'bg-blue-100 text-blue-700',
  Hotel:       'bg-purple-100 text-purple-700',
  Restaurant:  'bg-orange-100 text-orange-700',
  Event:       'bg-pink-100 text-pink-700',
  Blog:        'bg-slate-100 text-slate-600',
  User:        'bg-amber-100 text-amber-700',
};

function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [results, setResults] = useState<{ type: string; label: string; href: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const search = useCallback((val: string) => {
    clearTimeout(timer.current);
    if (!val || val.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const r = await fetch(`/api/admin/search?q=${encodeURIComponent(val)}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d = await r.json();
        setResults(d.data || []);
        setOpen(true);
      } finally { setLoading(false); }
    }, 300);
  }, []);

  const go = (href: string) => { router.push(href); setOpen(false); setQ(''); setResults([]); };

  return (
    <div ref={ref} className="relative hidden md:block">
      <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-56 focus-within:ring-2 focus-within:ring-emerald-400/30 transition-all">
        {loading ? <Loader2 className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" /> : <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
        <input
          type="text"
          value={q}
          onChange={e => { setQ(e.target.value); search(e.target.value); }}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={e => { if (e.key === 'Escape') { setOpen(false); setQ(''); } }}
          placeholder="Search..."
          className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
        />
        {q && (
          <button onClick={() => { setQ(''); setResults([]); setOpen(false); }}>
            <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-10 left-0 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <button
              key={i}
              onClick={() => go(r.href)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors text-left"
            >
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${TYPE_COLORS[r.type] || 'bg-slate-100 text-slate-600'}`}>
                {r.type}
              </span>
              <span className="text-sm text-slate-700 truncate">{r.label}</span>
            </button>
          ))}
        </div>
      )}
      {open && q.length >= 2 && !loading && results.length === 0 && (
        <div className="absolute top-10 left-0 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-4 text-center">
          <p className="text-sm text-slate-400">No results for "{q}"</p>
        </div>
      )}
    </div>
  );
}

// ─── Notifications ────────────────────────────────────────────────────────────

interface Notification {
  id: string;
  type: 'booking' | 'review';
  title: string;
  body: string;
  href: string;
  createdAt: string;
}

function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [read, setRead] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('notif_read');
    if (stored) setRead(new Set(JSON.parse(stored)));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const load = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const r = await fetch('/api/admin/notifications', { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setItems(d.data || []);
    } catch {}
  };

  const toggle = () => {
    if (!open) load();
    setOpen(v => !v);
  };

  const markAllRead = () => {
    const ids = items.map(i => i.id);
    setRead(new Set(ids));
    localStorage.setItem('notif_read', JSON.stringify(ids));
  };

  const goTo = (item: Notification) => {
    const newRead = new Set([...read, item.id]);
    setRead(newRead);
    localStorage.setItem('notif_read', JSON.stringify([...newRead]));
    setOpen(false);
    router.push(item.href);
  };

  const unread = items.filter(i => !read.has(i.id)).length;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={toggle}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-80 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <span className="font-semibold text-slate-800 text-sm">Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} className="text-xs text-emerald-600 hover:underline">Mark all read</button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {items.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-sm">No notifications</div>
              ) : (
                items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => goTo(item)}
                    className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-50 last:border-0 ${!read.has(item.id) ? 'bg-emerald-50/40' : ''}`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${item.type === 'booking' ? 'bg-blue-100' : 'bg-amber-100'}`}>
                      {item.type === 'booking'
                        ? <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
                        : <Star className="w-3.5 h-3.5 text-amber-600" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.body}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(item.createdAt)}</p>
                    </div>
                    {!read.has(item.id) && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────

function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string; role: string } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    fetch('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.data) setUser(d.data); })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/auth/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'A';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 pl-3 border-l border-slate-200"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
        ) : (
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-20 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-sm">
            {user && (
              <div className="px-3 py-2.5 border-b border-slate-100">
                <p className="font-semibold text-slate-800 text-sm truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                <span className="inline-block mt-1 text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded font-medium">{user.role}</span>
              </div>
            )}
            <Link
              href="/admin/profile"
              className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <User className="w-4 h-4 text-slate-400" /> My Profile
            </Link>
            <Link
              href="/admin/settings/site"
              className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              <Settings className="w-4 h-4 text-slate-400" /> Settings
            </Link>
            <hr className="my-1 border-slate-100" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function AdminHeader() {
  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <Breadcrumb />
      <div className="flex items-center gap-3">
        <SearchBar />
        <NotificationBell />
        <Link
          href="/"
          target="_blank"
          className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" /> View Site
        </Link>
        <UserMenu />
      </div>
    </header>
  );
}
