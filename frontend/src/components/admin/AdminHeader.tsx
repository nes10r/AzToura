'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Search, ChevronRight, LogOut, User, Settings, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const BREADCRUMB_LABELS: Record<string, string> = {
  admin: 'Dashboard', content: 'Content', destinations: 'Destinations',
  tours: 'Tours', hotels: 'Hotels', restaurants: 'Restaurants',
  events: 'Events', blog: 'Blog', categories: 'Categories',
  bookings: 'Bookings', users: 'Users', reviews: 'Reviews', media: 'Media',
  settings: 'Settings', site: 'Site Settings', theme: 'Theme Settings',
  layout: 'Layout Settings', seo: 'SEO', notifications: 'Notifications',
  system: 'System', 'home-builder': 'Home Builder', menus: 'Menus',
  roles: 'Roles', logs: 'Audit Logs', new: 'New',
};

function Breadcrumb() {
  const pathname = usePathname();
  const parts = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm">
      {parts.map((part, i) => {
        const href = '/' + parts.slice(0, i + 1).join('/');
        const label = BREADCRUMB_LABELS[part] || part;
        const isLast = i === parts.length - 1;
        const isUUID = /^[0-9a-f-]{36}$/.test(part);

        return (
          <span key={href} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            {isLast || isUUID ? (
              <span className="text-slate-700 font-medium">{isUUID ? 'Edit' : label}</span>
            ) : (
              <Link href={href} className="text-slate-500 hover:text-slate-700 transition-colors">
                {label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export default function AdminHeader() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/auth/login');
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      <Breadcrumb />

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-56">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full" />
        </button>

        {/* View site */}
        <Link
          href="/"
          target="_blank"
          className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View Site
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2 pl-3 border-l border-slate-200"
          >
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-11 z-20 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1 text-sm">
                <Link href="/admin/settings/site" className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                  <Settings className="w-4 h-4" /> Settings
                </Link>
                <hr className="my-1 border-slate-100" />
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
