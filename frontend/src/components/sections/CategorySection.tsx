import Link from 'next/link';
import { MapPin, Map, Building2, Utensils, CalendarDays, BookOpen } from 'lucide-react';
import { getCounts } from '@/lib/cached-queries';

export default async function CategorySection() {
  const counts = await getCounts();

  const CATEGORIES = [
    { label: 'Destinations', desc: `${counts.destinations} places`,      icon: MapPin,        href: '/destinations', bg: 'bg-blue-50',   text: 'text-blue-600'   },
    { label: 'Tours',        desc: `${counts.tours} guided tours`,        icon: Map,           href: '/tours',        bg: 'bg-green-50',  text: 'text-green-600'  },
    { label: 'Hotels',       desc: `${counts.hotels} hotels`,             icon: Building2,     href: '/hotels',       bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: 'Restaurants',  desc: `${counts.restaurants} restaurants`,   icon: Utensils,      href: '/restaurants',  bg: 'bg-orange-50', text: 'text-orange-600' },
    { label: 'Events',       desc: `${counts.events} events`,             icon: CalendarDays,  href: '/events',       bg: 'bg-rose-50',   text: 'text-rose-600'   },
    { label: 'Blog',         desc: `${counts.blogs} articles`,            icon: BookOpen,      href: '/blog',         bg: 'bg-teal-50',   text: 'text-teal-600'   },
  ];

  return (
    <section className="py-8 sm:py-10 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-lg sm:text-xl font-bold text-text mb-4 sm:mb-6">Browse by category</h2>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-xl border border-border bg-surface hover:border-secondary hover:shadow-sm transition-all group text-center"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center ${cat.bg} ${cat.text}`}>
                <cat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-text group-hover:text-secondary transition-colors leading-tight">
                {cat.label}
              </span>
              <span className="text-[10px] sm:text-xs text-text-muted leading-tight">{cat.desc}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
