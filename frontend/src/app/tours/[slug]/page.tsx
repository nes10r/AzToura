'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Clock, Users, MapPin, ArrowLeft, Star, Tag,
  CheckCircle2, XCircle, ChevronDown, ChevronUp,
  MessageCircle, Heart, Share2, Mountain, Shield,
  Globe, Award, Zap, Backpack, Camera, Coffee,
  Utensils, CalendarDays, ThumbsUp, ChevronRight,
  Navigation2, Sunset, TreePine, Bus,
} from 'lucide-react';
import { Tour } from '@/types';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatDate } from '@/lib/utils';

// ─── Activity category config (matches admin) ─────────────────────────────────
const ACTIVITY_CATEGORIES: Record<string, { emoji: string; color: string }> = {
  Hotel:      { emoji: '🏨', color: 'bg-blue-50 text-blue-700' },
  Museum:     { emoji: '🏛️', color: 'bg-purple-50 text-purple-700' },
  History:    { emoji: '⚔️',  color: 'bg-amber-50 text-amber-700' },
  Heritage:   { emoji: '🏰', color: 'bg-orange-50 text-orange-700' },
  Restaurant: { emoji: '🍽️', color: 'bg-rose-50 text-rose-700' },
  Food:       { emoji: '🍵', color: 'bg-yellow-50 text-yellow-700' },
  Culture:    { emoji: '🎨', color: 'bg-pink-50 text-pink-700' },
  Nature:     { emoji: '🌿', color: 'bg-emerald-50 text-emerald-700' },
  Viewpoint:  { emoji: '📸', color: 'bg-cyan-50 text-cyan-700' },
  Transport:  { emoji: '🚌', color: 'bg-slate-100 text-slate-600' },
  Leisure:    { emoji: '🌃', color: 'bg-indigo-50 text-indigo-700' },
  Shopping:   { emoji: '🛍️', color: 'bg-fuchsia-50 text-fuchsia-700' },
  Sport:      { emoji: '🥾', color: 'bg-lime-50 text-lime-700' },
};

// ─── Icon map for itinerary activity icons ────────────────────────────────────
const ICON_MAP: Record<string, any> = {
  bus: Bus, coffee: Coffee, utensils: Utensils, mountain: Mountain,
  camera: Camera, tree: TreePine, hotel: CalendarDays, map: MapPin,
  sunset: Sunset, award: Award, hike: Navigation2, boat: Navigation2,
};

// ─── Default static content (used when no admin data exists) ─────────────────

const DEFAULT_HIGHLIGHTS = [
  { icon: Mountain, label: 'Mountain Landscapes' },
  { icon: Globe, label: 'Expert Local Guide' },
  { icon: Shield, label: 'Free Cancellation' },
  { icon: Zap, label: 'Instant Confirmation' },
  { icon: Award, label: 'Small Groups Only' },
  { icon: Users, label: 'Family Friendly' },
  { icon: Camera, label: 'Photo Stops' },
  { icon: Coffee, label: 'Refreshments Included' },
];

const DEFAULT_ITINERARY: { day: number; title: string; summary: string; activities: { time: string; icon: any; title: string; desc: string }[] }[] = [
  {
    day: 1, title: 'Baku → Gabala → Sheki', summary: 'Depart Baku, cross the Caucasus foothills and arrive in Sheki',
    activities: [
      { time: '07:30', icon: Bus, title: 'Departure from Baku', desc: 'Meet at Nizami Street. Comfortable Mercedes Sprinter departs.' },
      { time: '10:00', icon: Coffee, title: 'Coffee Break in Shamakhi', desc: 'Short stop in the historic wine region town.' },
      { time: '12:30', icon: Mountain, title: 'Nohur Lake', desc: 'Scenic alpine lake surrounded by ancient forests. Photo opportunity.' },
      { time: '14:00', icon: Utensils, title: 'Lunch in Gabala', desc: 'Traditional Azerbaijani cuisine at a local restaurant.' },
      { time: '16:30', icon: TreePine, title: 'Tufandag Cable Car', desc: 'Ascend to 1,500m for panoramic Caucasus views.' },
      { time: '19:00', icon: CalendarDays, title: 'Hotel Check-in — Sheki', desc: 'Check in to Sheki Palace Hotel. Dinner at leisure.' },
    ],
  },
  {
    day: 2, title: 'Sheki — History & Culture', summary: 'Explore the UNESCO-listed Khan Palace and ancient caravanserais',
    activities: [
      { time: '08:00', icon: Coffee, title: 'Breakfast at Hotel', desc: 'Traditional Azerbaijani breakfast with local honey and cheeses.' },
      { time: '09:30', icon: Award, title: 'Sheki Khan Palace', desc: 'UNESCO World Heritage site — masterpiece of Eastern architecture.' },
      { time: '11:00', icon: Globe, title: 'Kish Albanian Church', desc: 'One of the oldest churches in the Caucasus (1st century AD).' },
      { time: '13:00', icon: Utensils, title: 'Lunch — Sheki Piti', desc: 'Famous Sheki piti (lamb stew) and pakhlava dessert.' },
      { time: '15:00', icon: Camera, title: 'Old Caravanserai & Bazaar', desc: 'Stroll through the 18th-century covered bazaar, local silk crafts.' },
      { time: '18:00', icon: Sunset, title: 'Free Time & Dinner', desc: 'Explore the old town at your own pace. Dinner included.' },
    ],
  },
  {
    day: 3, title: 'Zagatala — Nature Reserve', summary: 'Trek through UNESCO-nominated Zagatala Nature Reserve',
    activities: [
      { time: '08:00', icon: Coffee, title: 'Breakfast & Departure', desc: 'Early breakfast, depart for Zagatala (1.5 hr drive).' },
      { time: '10:00', icon: TreePine, title: 'Zagatala Nature Reserve', desc: 'Guided hike through ancient beech and hornbeam forests. Wildlife spotting.' },
      { time: '13:00', icon: Utensils, title: 'Picnic Lunch in Forest', desc: 'Freshly prepared local food in a forest clearing.' },
      { time: '15:00', icon: Mountain, title: 'Balakan Village Visit', desc: 'Traditional Lezgin village, local craft demonstrations.' },
      { time: '17:00', icon: Globe, title: 'Ilisu Waterfall', desc: 'Stunning 30m waterfall hidden in dense forest. Short 20 min trail.' },
      { time: '19:30', icon: CalendarDays, title: 'Hotel — Zagatala', desc: 'Check in to eco-lodge. Bonfire and local music evening.' },
    ],
  },
  {
    day: 4, title: 'Ismayilli → Baku', summary: 'Morning vineyard visit, scenic Caucasus drive back to Baku',
    activities: [
      { time: '08:30', icon: Coffee, title: 'Farewell Breakfast', desc: 'Final breakfast with the group at the eco-lodge.' },
      { time: '10:00', icon: Sunset, title: 'Ismayilli Wine Valley', desc: 'Visit a family winery — wine tasting and vineyard walk.' },
      { time: '12:30', icon: Utensils, title: 'Lunch at Lahij', desc: 'Copper artisan village. Lunch at a local guesthouse.' },
      { time: '14:30', icon: Bus, title: 'Scenic Drive to Baku', desc: 'Return journey through the dramatic Caucasus mountain passes.' },
      { time: '18:00', icon: MapPin, title: 'Arrival in Baku', desc: 'Drop-off at Nizami Street. Tour ends.' },
    ],
  },
];

const DEFAULT_INCLUSIONS = {
  included: [
    'Hotel (3 nights, double room)',
    'Daily breakfast',
    'Professional bilingual guide',
    'All transportation (Mercedes Sprinter)',
    'Entrance tickets to all sites',
    'Cable car tickets',
    'Bottled water throughout',
  ],
  excluded: [
    'Lunch & dinner (except Day 3 picnic)',
    'Travel insurance',
    'Personal expenses & souvenirs',
    'Tips (optional, appreciated)',
    'Single room supplement (+$85)',
  ],
};

const DEFAULT_FAQ = [
  { q: 'Can children join the tour?', a: 'Yes! Children 6+ are welcome. Child price applies for ages 6–12. The tour involves light walking — no strenuous hiking required.' },
  { q: 'What is the cancellation policy?', a: 'Free cancellation up to 48 hours before departure. 50% refund within 24–48 hours. No refund within 24 hours of departure.' },
  { q: 'Is the tour available in Azerbaijani / Russian?', a: 'Yes. Our guides speak Azerbaijani, Russian and English. Please specify your preferred language when booking.' },
  { q: 'What should I wear?', a: 'Comfortable walking shoes are essential. Bring a light jacket — mountain areas can be cool even in summer. Modest clothing for religious sites.' },
  { q: 'Is internet available during the tour?', a: 'Most hotels have WiFi. We also carry a mobile hotspot for emergencies. Mountain areas may have limited signal.' },
  { q: 'Are vegetarian/halal meals available?', a: 'Absolutely. Just let us know at booking. Most Azerbaijani cuisine is naturally halal and vegetarian-friendly.' },
];

const DEFAULT_PACKING = [
  { icon: '👟', item: 'Comfortable hiking shoes' },
  { icon: '🧥', item: 'Light jacket / fleece' },
  { icon: '🕶️', item: 'Sunglasses' },
  { icon: '🧴', item: 'Sunscreen SPF 30+' },
  { icon: '📷', item: 'Camera / phone' },
  { icon: '🔋', item: 'Power bank' },
  { icon: '💊', item: 'Personal medication' },
  { icon: '💵', item: 'Cash (AZN)' },
  { icon: '🪪', item: 'ID / Passport' },
  { icon: '🎒', item: 'Small daypack' },
  { icon: '💧', item: 'Reusable water bottle' },
  { icon: '🧢', item: 'Hat / cap' },
];

// ─── Component helpers ────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold text-text mb-5">{children}</h2>;
}

function Card({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`bg-surface border border-border rounded-2xl ${className}`}>{children}</div>;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TourDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [tour, setTour] = useState<Tour | null>(null);
  const [related, setRelated] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDay, setOpenDay] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    api.get(`/tours/${slug}`)
      .then(({ data }) => {
        if (data.data) {
          setTour(data.data);
          api.get(`/tours?limit=4`).then(r => {
            setRelated((r.data.data || []).filter((t: Tour) => t.id !== data.data.id).slice(0, 3));
          }).catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="pt-16 min-h-screen">
      <Skeleton className="h-80 w-full" />
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  );

  if (!tour) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Tour not found</h1>
      <Link href="/tours"><Button>Back to Tours</Button></Link>
    </div>
  );

  // Resolve real data or fall back to defaults
  const tourHighlights: { icon: any; label: string }[] =
    (tour as any).highlights?.length
      ? (tour as any).highlights.map((h: string) => ({ icon: Mountain, label: h }))
      : DEFAULT_HIGHLIGHTS;

  const tourItinerary: typeof DEFAULT_ITINERARY =
    (tour as any).itinerary?.length
      ? (tour as any).itinerary.map((d: any) => ({
          ...d,
          activities: d.activities.map((a: any) => ({ ...a, icon: ICON_MAP[a.icon] || MapPin })),
        }))
      : DEFAULT_ITINERARY;

  const tourInclusions: typeof DEFAULT_INCLUSIONS =
    (tour as any).inclusions || DEFAULT_INCLUSIONS;

  const tourFaq: typeof DEFAULT_FAQ =
    (tour as any).faq?.length ? (tour as any).faq : DEFAULT_FAQ;

  const tourPacking: typeof DEFAULT_PACKING =
    (tour as any).packingList?.length
      ? (tour as any).packingList.map((p: string) => ({ icon: '✓', item: p }))
      : DEFAULT_PACKING;

  const avgRating = tour.reviews?.length
    ? tour.reviews.reduce((s, r) => s + r.rating, 0) / tour.reviews.length
    : 0;

  const ratingDist = [5,4,3,2,1].map(star => ({
    star,
    count: tour.reviews?.filter(r => r.rating === star).length || 0,
  }));

  // Route: primary destination + additional stops
  const routeStops = [
    ...(tour.destination ? [tour.destination] : []),
    ...(tour.additionalDestinations?.sort((a,b) => a.order - b.order).map(s => s.destination) || []),
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">

      {/* ── Hero ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Back link */}
        <Link href="/tours" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> All Tours
        </Link>

        <div className="relative h-72 sm:h-[420px] rounded-3xl overflow-hidden shadow-xl">
          <Image
            src={tour.coverImage || '/placeholder.jpg'}
            alt={tour.name}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/5" />

          {/* Top row: badges + heart */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <div className="flex gap-2 flex-wrap">
              {tour.featured && (
                <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  ⭐ Popular
                </span>
              )}
              {tour.category && (
                <span className="inline-flex items-center bg-white/20 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/25">
                  {tour.category.name}
                </span>
              )}
            </div>
            <button
              onClick={() => setLiked(l => !l)}
              className="w-9 h-9 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
            </button>
          </div>

          {/* Bottom: title + meta */}
          <div className="absolute inset-x-0 bottom-0 px-6 pb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight drop-shadow-md">{tour.name}</h1>
            <div className="flex items-center gap-4 mt-2.5 flex-wrap">
              {tour.destination && (
                <div className="flex items-center gap-1.5 text-white/80">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-sm">{tour.destination.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-white/80">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-sm">{tour.duration} days</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <Users className="w-3.5 h-3.5" />
                <span className="text-sm">Max {tour.maxGroupSize} people</span>
              </div>
              {tour.reviews && tour.reviews.length > 0 && (
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-white">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-white/70">({tour.reviews.length})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Highlights strip ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="flex flex-wrap gap-2.5">
          {tourHighlights.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-white border border-slate-200 shadow-sm rounded-full px-4 py-2">
              <Icon className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-text-secondary whitespace-nowrap">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ────── Left column ────── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Key facts */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Clock, label: 'Duration', value: `${tour.duration} day${tour.duration > 1 ? 's' : ''}` },
                { icon: Users, label: 'Max Group', value: `${tour.maxGroupSize} people` },
                { icon: Tag, label: 'From', value: formatPrice(tour.price) },
              ].map(f => (
                <Card key={f.label} className="p-4">
                  <f.icon className="w-5 h-5 text-primary mb-2" />
                  <p className="text-xs text-text-muted">{f.label}</p>
                  <p className="font-bold text-text mt-0.5">{f.value}</p>
                </Card>
              ))}
            </div>

            {/* Overview */}
            <section>
              <SectionTitle>About This Tour</SectionTitle>
              <p className="text-text-secondary leading-relaxed">{tour.description}</p>
            </section>

            {/* ── Itinerary ── */}
            <section>
              <SectionTitle>Day-by-Day Itinerary</SectionTitle>
              <div className="space-y-3">
                {tourItinerary.slice(0, tour.duration).map((day, idx) => (
                  <div key={day.day} className="border border-border rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenDay(openDay === idx ? null : idx)}
                      className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-primary font-bold text-sm">{day.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text text-sm">{day.title}</p>
                        <p className="text-xs text-text-muted mt-0.5 truncate">{day.summary}</p>
                      </div>
                      {openDay === idx
                        ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {openDay === idx && (
                      <div className="px-5 pb-5 border-t border-border">
                        <div className="relative mt-4 ml-4 pl-6 border-l-2 border-dashed border-primary/25 space-y-5">
                          {day.activities.map((act, i) => (
                            <div key={i} className="relative">
                              <div className="absolute -left-[29px] w-5 h-5 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                                <act.icon className="w-2.5 h-2.5 text-primary" />
                              </div>
                              <div className="flex items-start gap-3 flex-1">
                                <span className="text-xs font-mono text-text-muted mt-0.5 w-10 shrink-0">{act.time}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="text-sm font-semibold text-text">{act.title}</p>
                                    {(act as any).category && (() => {
                                      const cat = ACTIVITY_CATEGORIES[(act as any).category];
                                      return cat ? (
                                        <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${cat.color}`}>
                                          {cat.emoji} {(act as any).category}
                                        </span>
                                      ) : null;
                                    })()}
                                  </div>
                                  <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{act.desc}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Route ── */}
            {routeStops.length > 1 && (
              <section>
                <SectionTitle>Tour Route</SectionTitle>
                <Card className="p-5">
                  <div className="flex items-start gap-0">
                    {routeStops.map((dest, i) => (
                      <div key={dest.id} className="flex items-center flex-1 min-w-0">
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 || i === routeStops.length - 1 ? 'bg-primary text-white' : 'bg-primary/10 text-primary border-2 border-primary/30'}`}>
                            {i === 0 ? <Navigation2 className="w-4 h-4" /> : i + 1}
                          </div>
                          <p className="text-[11px] font-medium text-text mt-1.5 text-center max-w-[64px] leading-tight">{dest.name}</p>
                          <p className="text-[10px] text-text-muted text-center">{dest.region}</p>
                        </div>
                        {i < routeStops.length - 1 && (
                          <div className="flex-1 h-0.5 bg-dashed mt-[-24px] mx-1 border-t-2 border-dashed border-primary/25" />
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            )}

            {/* ── Places to Visit ── */}
            {routeStops.length > 0 && (
              <section>
                <SectionTitle>Places You'll Visit</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {routeStops.map(dest => (
                    <Link key={dest.id} href={`/destinations/${dest.slug}`}>
                      <Card className="overflow-hidden hover:shadow-card transition-shadow group">
                        <div className="relative h-36 bg-slate-100">
                          {dest.coverImage ? (
                            <Image src={dest.coverImage} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <MapPin className="w-8 h-8 text-slate-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="font-semibold text-white text-sm">{dest.name}</p>
                            <p className="text-white/70 text-xs">{dest.region}</p>
                          </div>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between">
                          <p className="text-xs text-text-secondary line-clamp-2 flex-1">{dest.description?.slice(0, 80)}…</p>
                          <ChevronRight className="w-4 h-4 text-text-muted shrink-0 ml-2 group-hover:text-primary transition-colors" />
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Included / Not Included ── */}
            <section>
              <SectionTitle>What's Included</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-5">
                  <p className="text-sm font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Included
                  </p>
                  <ul className="space-y-2">
                    {tourInclusions.included.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card className="p-5">
                  <p className="text-sm font-semibold text-rose-500 mb-3 flex items-center gap-2">
                    <XCircle className="w-4 h-4" /> Not Included
                  </p>
                  <ul className="space-y-2">
                    {tourInclusions.excluded.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                        <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </section>

            {/* ── Packing List ── */}
            <section>
              <SectionTitle>Packing List</SectionTitle>
              <Card className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {tourPacking.map(({ icon, item }) => (
                    <div key={item} className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
                      {icon === '✓'
                        ? <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[11px] font-bold shrink-0">✓</span>
                        : <span className="text-lg leading-none shrink-0">{icon}</span>
                      }
                      <span className="text-xs text-text-secondary font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            {/* ── FAQ ── */}
            <section>
              <SectionTitle>Frequently Asked Questions</SectionTitle>
              <div className="space-y-2">
                {tourFaq.map((item, i) => (
                  <div key={i} className="border border-border rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-text pr-4">{item.q}</span>
                      {openFaq === i
                        ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-4 border-t border-border">
                        <p className="text-sm text-text-secondary leading-relaxed pt-3">{item.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* ── Reviews ── */}
            <section>
              <SectionTitle>Reviews</SectionTitle>
              {tour.reviews && tour.reviews.length > 0 ? (
                <>
                  {/* Rating summary */}
                  <Card className="p-5 mb-5">
                    <div className="flex items-start gap-6 flex-wrap">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-text">{avgRating.toFixed(1)}</p>
                        <div className="flex justify-center mt-1 mb-1">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? 'fill-accent text-accent' : 'text-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-text-muted">{tour.reviews.length} reviews</p>
                      </div>
                      <div className="flex-1 min-w-[160px] space-y-1.5">
                        {ratingDist.map(({ star, count }) => (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs text-text-muted w-3">{star}</span>
                            <Star className="w-3 h-3 fill-accent text-accent" />
                            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full transition-all"
                                style={{ width: `${tour.reviews!.length ? (count / tour.reviews!.length) * 100 : 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-text-muted w-4">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  {/* Review cards */}
                  <div className="space-y-4">
                    {tour.reviews.map(r => (
                      <Card key={r.id} className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {r.user?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-text">{r.user?.name || 'Anonymous'}</p>
                            <p className="text-xs text-text-muted">{formatDate(r.createdAt)}</p>
                          </div>
                          <div className="flex">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? 'fill-accent text-accent' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{r.comment}</p>
                        <div className="flex items-center gap-1 mt-3 text-xs text-text-muted">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful</span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="p-10 text-center">
                  <Star className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-text-muted text-sm">No reviews yet. Be the first!</p>
                </Card>
              )}
            </section>

          </div>

          {/* ────── Sticky Sidebar ────── */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card className="p-6 shadow-card">
                <div className="text-center mb-5">
                  <p className="text-text-muted text-xs uppercase tracking-wide">Price per person</p>
                  <p className="text-4xl font-bold text-primary mt-1">{formatPrice(tour.price)}</p>
                  {tour.reviews && tour.reviews.length > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                      <span className="text-sm font-medium text-text">{avgRating.toFixed(1)}</span>
                      <span className="text-xs text-text-muted">({tour.reviews.length})</span>
                    </div>
                  )}
                </div>

                {/* Date picker placeholder */}
                <div className="border border-border rounded-xl p-3 mb-3 flex items-center gap-2 cursor-pointer hover:border-primary transition-colors">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-text-muted">Date</p>
                    <p className="text-sm font-medium text-text">Select departure date</p>
                  </div>
                </div>

                {/* Guests */}
                <div className="border border-border rounded-xl p-3 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <div className="flex-1">
                    <p className="text-xs text-text-muted">Guests</p>
                    <p className="text-sm font-medium text-text">{guests} traveler{guests > 1 ? 's' : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setGuests(g => Math.max(1, g - 1))}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors text-sm font-bold">
                      −
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{guests}</span>
                    <button onClick={() => setGuests(g => Math.min(tour.maxGroupSize, g + 1))}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary transition-colors text-sm font-bold">
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-slate-50 rounded-xl p-3 mb-4 text-sm">
                  <div className="flex justify-between text-text-secondary mb-1">
                    <span>{formatPrice(tour.price)} × {guests}</span>
                    <span>{formatPrice(tour.price * guests)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-text border-t border-border pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(tour.price * guests)}</span>
                  </div>
                </div>

                <Link href="/auth/login">
                  <Button size="lg" className="w-full mb-2">Book This Tour</Button>
                </Link>
                <p className="text-xs text-center text-text-muted mb-4">Free cancellation · No payment now</p>

                {/* Contact options */}
                <div className="grid grid-cols-2 gap-2">
                  <a href="https://wa.me/994702828201" target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-xs font-medium text-text hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                  <a href="tel:+994702828201"
                    className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-xs font-medium text-text hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" /></svg>
                    Call Us
                  </a>
                </div>
              </Card>

              {/* Tour details summary */}
              <Card className="p-5">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Tour Details</p>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Duration', value: `${tour.duration} days` },
                    { label: 'Group size', value: `Max ${tour.maxGroupSize} people` },
                    { label: 'Language', value: (tour as any).languages || 'AZ / EN / RU' },
                    { label: 'Departure', value: (tour as any).meetingPoint || '—' },
                    { label: 'Type', value: tour.category?.name || (tour as any).tourType || 'Tour' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                      <span className="text-text-secondary">{label}</span>
                      <span className="font-medium text-text text-right">{value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Share */}
              <button
                onClick={() => navigator.share?.({ title: tour.name, url: window.location.href }).catch(() => navigator.clipboard.writeText(window.location.href))}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm text-text-secondary hover:text-text hover:border-slate-300 transition-colors"
              >
                <Share2 className="w-4 h-4" /> Share this tour
              </button>
            </div>
          </aside>

        </div>
      </div>

      {/* ── Related Tours ── */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-text">You Might Also Like</h2>
            <Link href="/tours" className="text-sm text-primary hover:underline">View all tours →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {related.map(t => (
              <Link key={t.id} href={`/tours/${t.slug}`}>
                <Card className="overflow-hidden hover:shadow-card transition-shadow group">
                  <div className="relative h-44 bg-slate-100">
                    {t.coverImage && (
                      <Image src={t.coverImage} alt={t.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    {t.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge variant="accent">Popular</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-semibold text-text text-sm line-clamp-1">{t.name}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                      <Clock className="w-3.5 h-3.5" /> {t.duration} days
                      <span>·</span>
                      <Users className="w-3.5 h-3.5" /> {t.maxGroupSize} pax
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-primary">{formatPrice(t.price)}</span>
                      <span className="text-xs text-text-muted">per person</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
