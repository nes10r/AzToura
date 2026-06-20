'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, ArrowLeft, Check, BedDouble } from 'lucide-react';
import { Hotel } from '@/types';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatDate } from '@/lib/utils';

export default function HotelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/hotels/${slug}`)
      .then(({ data }) => { if (data.data) setHotel(data.data); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen">
        <Skeleton className="h-[50vh] w-full rounded-none" />
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Hotel not found</h1>
        <Link href="/hotels"><Button>Back to Hotels</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
          <Image src={hotel.coverImage || '/placeholder.jpg'} alt={hotel.name} fill className="object-cover object-center" priority sizes="(max-width: 1024px) 100vw, 1024px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-5">
            <div className="flex items-center gap-1 mb-1.5">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{hotel.name}</h1>
            <div className="flex items-center gap-1.5 text-white/80 mt-1">
              <MapPin className="w-3.5 h-3.5" /><span className="text-sm">{hotel.address}, {hotel.city}</span>
            </div>
          </div>
        </div>
        <Link href="/hotels" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mt-3 mb-1">
          <ArrowLeft className="w-4 h-4" /> All Hotels
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-text mb-3">About This Hotel</h2>
              <p className="text-text-secondary leading-relaxed">{hotel.description}</p>
            </section>

            {/* Amenities */}
            {hotel.amenities.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-text mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hotel.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-text-secondary">
                      <Check className="w-4 h-4 text-primary shrink-0" />{a}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews */}
            {hotel.reviews && hotel.reviews.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-text mb-4">Guest Reviews</h2>
                <div className="space-y-4">
                  {hotel.reviews.map((r) => (
                    <div key={r.id} className="bg-surface border border-border rounded-2xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {r.user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-text">{r.user?.name || 'Guest'}</p>
                          <p className="text-xs text-text-muted">{formatDate(r.createdAt)}</p>
                        </div>
                        <div className="ml-auto"><Rating value={r.rating} size="sm" /></div>
                      </div>
                      <p className="text-sm text-text-secondary">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Booking sidebar */}
          <aside>
            <div className="sticky top-24 bg-surface border border-border rounded-2xl p-6 shadow-card">
              <div className="text-center mb-6">
                <p className="text-text-muted text-sm">Starting from</p>
                <p className="text-4xl font-bold text-primary mt-1">{formatPrice(hotel.pricePerNight)}</p>
                <p className="text-text-muted text-xs mt-1">per night</p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-secondary">Stars</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: hotel.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-text-secondary">City</span>
                  <span className="font-medium text-text">{hotel.city}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-text-secondary">Amenities</span>
                  <span className="font-medium text-text">{hotel.amenities.length}</span>
                </div>
              </div>

              <Link href="/auth/login">
                <Button size="lg" className="w-full">
                  <BedDouble className="w-4 h-4" /> Book Now
                </Button>
              </Link>
              <p className="text-xs text-center text-text-muted mt-3">Free cancellation available</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
