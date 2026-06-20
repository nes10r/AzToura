'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, ArrowLeft, Building2, Utensils, Calendar, Thermometer } from 'lucide-react';
import { Destination } from '@/types';
import { destinationsService } from '@/services/destinations';
import TourCard from '@/components/cards/TourCard';
import HotelCard from '@/components/cards/HotelCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { formatDate } from '@/lib/utils';
import { useSeasonalImage } from '@/hooks/useSeasonalImage';

export default function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { weather, activeImage } = useSeasonalImage(destination);

  useEffect(() => {
    destinationsService.getBySlug(slug)
      .then((res) => { if (res.data) setDestination(res.data); else setNotFound(true); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Skeleton className="h-64 sm:h-80 w-full rounded-2xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (notFound || !destination) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-3xl font-bold text-text">Destination not found</h1>
        <Link href="/destinations"><Button>Back to Destinations</Button></Link>
      </div>
    );
  }

  const displayImage = activeImage || destination.coverImage || '/placeholder.jpg';

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image
                src={displayImage}
                alt={`${destination.name} — ${weather?.label || ''}`}
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

          {/* Weather / season badge */}
          {weather && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm text-white text-xs rounded-full px-3 py-1.5">
              <span>{weather.emoji}</span>
              <span>{weather.label}</span>
              {weather.temperature !== null && (
                <>
                  <span className="w-px h-3 bg-white/30 mx-0.5" />
                  <Thermometer className="w-3 h-3" />
                  <span>{Math.round(weather.temperature)}°C</span>
                </>
              )}
            </div>
          )}


          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-5">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {destination.featured && <Badge variant="accent">Featured</Badge>}
              {destination.category && <Badge variant="secondary">{destination.category.name}</Badge>}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{destination.name}</h1>
            <div className="flex items-center gap-2 text-white/80 mt-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="text-sm">{destination.region}{destination.city ? `, ${destination.city}` : ''}</span>
            </div>
          </div>
        </div>
        <Link href="/destinations" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mt-3 mb-1">
          <ArrowLeft className="w-4 h-4" /> All Destinations
        </Link>
      </div>

      {/* Stats bar */}
      {destination._count && (
        <div className="bg-surface border-b border-border mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-6 text-sm">
            {[
              { icon: MapPin, label: `${(destination._count.tours || 0) + ((destination._count as any).tourStops || 0)} Tours` },
              { icon: Building2, label: `${destination._count.hotels} Hotels` },
              { icon: Utensils, label: `${destination._count.restaurants} Restaurants` },
              { icon: Star, label: `${destination._count.reviews} Reviews` },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-text-secondary">
                <s.icon className="w-4 h-4 text-primary" />
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {/* Overview */}
        <section>
          <h2 className="text-2xl font-bold text-text mb-4">About {destination.name}</h2>
          <p className="text-text-secondary leading-relaxed max-w-3xl">{destination.description}</p>
        </section>

        {/* Tours */}
        {destination.tours && destination.tours.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">Available Tours</h2>
              <Link href={`/tours?destination=${slug}`}>
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              {destination.tours.map((t) => (
                <motion.div key={t.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <TourCard tour={t} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Hotels */}
        {destination.hotels && destination.hotels.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text">Hotels in {destination.name}</h2>
              <Link href={`/hotels?destination=${slug}`}>
                <Button variant="outline" size="sm">View All</Button>
              </Link>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden" whileInView="show" viewport={{ once: true }}
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            >
              {destination.hotels.map((h) => (
                <motion.div key={h.id} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <HotelCard hotel={h} />
                </motion.div>
              ))}
            </motion.div>
          </section>
        )}

        {/* Events */}
        {destination.events && destination.events.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.events.map((e) => (
                <Link key={e.id} href={`/events/${e.slug}`}>
                  <div className="flex items-center gap-4 bg-surface border border-border rounded-2xl p-4 hover:shadow-card transition-shadow">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-primary uppercase">
                        {new Date(e.startDate).toLocaleString('en', { month: 'short' })}
                      </span>
                      <span className="text-xl font-bold text-primary">{new Date(e.startDate).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text text-sm">{e.name}</h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        <Calendar className="inline w-3 h-3 mr-1" />
                        {formatDate(e.startDate)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        {destination.reviews && destination.reviews.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-text mb-6">Traveller Reviews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.reviews.map((r) => (
                <div key={r.id} className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {r.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-text text-sm">{r.user?.name || 'Anonymous'}</p>
                      <p className="text-xs text-text-muted">{formatDate(r.createdAt)}</p>
                    </div>
                    <div className="ml-auto">
                      <Rating value={r.rating} size="sm" />
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary">{r.comment}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
