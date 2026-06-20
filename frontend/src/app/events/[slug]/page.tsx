'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, ArrowLeft, Ticket, Clock } from 'lucide-react';
import { Event } from '@/types';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatPrice } from '@/lib/utils';

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/events/${slug}`)
      .then(({ data }) => { if (data.data) setEvent(data.data); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-16"><Skeleton className="h-[50vh] w-full rounded-none" /></div>;
  if (!event) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Event not found</h1>
      <Link href="/events"><Button>Back to Events</Button></Link>
    </div>
  );

  const isPast = new Date(event.endDate) < new Date();
  const isFree = event.price === 0;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
          <Image src={event.coverImage || '/placeholder.jpg'} alt={event.name} fill className="object-cover object-center" priority sizes="(max-width: 1024px) 100vw, 1024px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-5">
            <div className="flex gap-2 mb-1.5">
              {event.featured && <Badge variant="accent">Featured</Badge>}
              {isPast && <Badge variant="muted">Past Event</Badge>}
              {event.category && <Badge variant="secondary">{event.category.name}</Badge>}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{event.name}</h1>
            <div className="flex items-center gap-1.5 text-white/80 mt-1">
              <MapPin className="w-3.5 h-3.5" /><span className="text-sm">{event.address}, {event.city}</span>
            </div>
          </div>
        </div>
        <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mt-3 mb-1">
          <ArrowLeft className="w-4 h-4" /> All Events
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-muted">Starts</p>
                  <p className="font-medium text-text text-sm">{formatDate(event.startDate)}</p>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-muted">Ends</p>
                  <p className="font-medium text-text text-sm">{formatDate(event.endDate)}</p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-bold text-text mb-3">About This Event</h2>
              <p className="text-text-secondary leading-relaxed">{event.description}</p>
            </section>
          </div>

          <aside>
            <div className="sticky top-24 bg-surface border border-border rounded-2xl p-6 shadow-card">
              <div className="text-center mb-6">
                <Ticket className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-text-muted text-sm">Ticket price</p>
                <p className="text-3xl font-bold text-primary mt-1">
                  {isFree ? 'Free' : formatPrice(event.price)}
                </p>
              </div>

              <div className="text-sm space-y-2 mb-6">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-secondary">Date</span>
                  <span className="font-medium text-text">{formatDate(event.startDate)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-text-secondary">Location</span>
                  <span className="font-medium text-text text-right max-w-[140px]">{event.city}</span>
                </div>
              </div>

              <Link href="/auth/login">
                <Button size="lg" className="w-full" disabled={isPast}>
                  {isPast ? 'Event Ended' : isFree ? 'Register Free' : 'Get Tickets'}
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
