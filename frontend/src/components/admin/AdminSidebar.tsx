'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, MapPin, Map, Building2, Utensils, CalendarDays,
  BookOpen, Users, CalendarCheck, Star, ImageIcon, Settings,
  Layout, Globe, Shield, FileText, ChevronDown,
  ChevronRight, PanelLeftClose, PanelLeftOpen, Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_NAME } from '@/constants';

interface NavItem {
  label: string;
  href?: string;
  icon: React.ElementType;
  badge?: number;
  children?: { label: string; href: string }[];
}

const NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  {
    label: 'Content', icon: FileText,
    children: [
      { label: 'Destinations', href: '/admin/content/destinations' },
      { label: 'Tours',        href: '/admin/content/tours'        },
      { label: 'Hotels',       href: '/admin/content/hotels'       },
      { label: 'Restaurants',  href: '/admin/content/restaurants'  },
      { label: 'Events',       href: '/admin/content/events'       },
      { label: 'Blog Posts',   href: '/admin/content/blog'         },
      { label: 'Categories',   href: '/admin/content/categories'   },
    ],
  },
  { label: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
  { label: 'Users',    href: '/admin/users',    icon: Users         },
  { label: 'Reviews',  href: '/admin/reviews',  icon: Star          },
  { label: 'Media',    href: '/admin/media',    icon: ImageIcon     },
  {
    label: 'Build', icon: Layout,
    children: [
      { label: 'Home Builder', href: '/admin/home-builder' },
      { label: 'Menus',        href: '/admin/menus'        },
    ],
  },
  {
    label: 'Settings', icon: Settings,
    children: [
      { label: 'Site Settings',   href: '/admin/settings/site'   },
      { label: 'Theme Settings',  href: '/admin/settings/theme'  },
      { label: 'Layout Settings', href: '/admin/settings/layout' },
      { label: 'SEO',             href: '/admin/settings/seo'    },
      { label: 'Notifications',   href: '/admin/settings/notifications' },
      { label: 'System',          href: '/admin/settings/system' },
    ],
  },
  {
    label: 'Access', icon: Shield,
    children: [
      { label: 'Roles & Permissions', href: '/admin/roles' },
      { label: 'Audit Logs',          href: '/admin/logs'  },
    ],
  },
];

const ICONS_MAP: Record<string, React.ElementType> = {
  Destinations: MapPin, Tours: Map, Hotels: Building2,
  Restaurants: Utensils, Events: CalendarDays, 'Blog Posts': BookOpen,
  Categories: Globe,
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(['Content', 'Settings']));

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  };

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        'flex flex-col bg-slate-900 text-slate-100 transition-all duration-300 shrink-0',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center px-2 h-20 border-b border-slate-700/60">
        {collapsed
          ? <Image src="/logo.png" alt={SITE_NAME} width={40} height={40} className="w-10 h-10 object-contain brightness-0 invert" />
          : <Image src="/logo.png" alt={SITE_NAME} width={220} height={64} className="h-16 w-auto object-contain brightness-0 invert" />
        }
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {NAV.map((item) => {
          if (item.href) {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800',
                  collapsed && 'justify-center px-2',
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="ml-auto bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          }

          // Group
          const open = openGroups.has(item.label);
          const anyChildActive = item.children?.some(c => pathname.startsWith(c.href));

          return (
            <div key={item.label}>
              <button
                onClick={() => !collapsed && toggleGroup(item.label)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  anyChildActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800',
                  collapsed && 'justify-center px-2',
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span>{item.label}</span>
                    <span className="ml-auto">
                      {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                  </>
                )}
              </button>
              {!collapsed && open && (
                <div className="ml-3 mt-0.5 space-y-0.5 border-l border-slate-700/60 pl-3">
                  {item.children?.map((child) => {
                    const Icon = ICONS_MAP[child.label];
                    const active = pathname.startsWith(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs font-medium transition-colors',
                          active ? 'text-emerald-400 bg-emerald-900/30' : 'text-slate-400 hover:text-white hover:bg-slate-800',
                        )}
                      >
                        {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-slate-700/60 p-2 space-y-1">
        <Link
          href="/"
          target="_blank"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors',
            collapsed && 'justify-center',
          )}
          title="View Site"
        >
          <Home className="w-4 h-4 shrink-0" />
          {!collapsed && 'View Site'}
        </Link>
        <button
          onClick={() => setCollapsed(v => !v)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors',
            collapsed && 'justify-center',
          )}
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <><PanelLeftClose className="w-4 h-4 shrink-0" /><span>Collapse</span></>
          }
        </button>
      </div>
    </aside>
  );
}
