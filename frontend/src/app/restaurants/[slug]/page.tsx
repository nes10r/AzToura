'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowLeft, Phone, Globe, Utensils } from 'lucide-react';
import { Restaurant } from '@/types';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { Skeleton } from '@/components/ui/Skeleton';
import { PRICE_RANGE_LABELS } from '@/constants';
import { formatDate } from '@/lib/utils';

export default function RestaurantDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/restaurants/${slug}`)
      .then(({ data }) => { if (data.data) setRestaurant(data.data); })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="pt-16"><Skeleton className="h-[50vh] w-full rounded-none" /></div>;
  if (!restaurant) return (
    <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Restaurant not found</h1>
      <Link href="/restaurants"><Button>Back to Restaurants</Button></Link>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
          <Image src={restaurant.coverImage || '/placeholder.jpg'} alt={restaurant.name} fill className="object-cover object-center" priority sizes="(max-width: 1024px) 100vw, 1024px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end px-6 pb-5">
            <div className="flex gap-2 mb-1.5">
              <Badge variant="primary">{restaurant.cuisine}</Badge>
              <Badge variant="muted">{PRICE_RANGE_LABELS[restaurant.priceRange]}</Badge>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white">{restaurant.name}</h1>
            <div className="flex items-center gap-1.5 text-white/80 mt-1">
              <MapPin className="w-3.5 h-3.5" /><span className="text-sm">{restaurant.address}, {restaurant.city}</span>
            </div>
          </div>
        </div>
        <Link href="/restaurants" className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mt-3 mb-1">
          <ArrowLeft className="w-4 h-4" /> All Restaurants
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {restaurant.phone && (
            <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-text-muted">Phone</p>
                <p className="font-medium text-text text-sm">{restaurant.phone}</p>
              </div>
            </div>
          )}
          {restaurant.website && (
            <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-text-muted">Website</p>
                <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary text-sm hover:underline">Visit Website</a>
              </div>
            </div>
          )}
          <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
            <Utensils className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-text-muted">Cuisine</p>
              <p className="font-medium text-text text-sm">{restaurant.cuisine}</p>
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-bold text-text mb-3">About</h2>
          <p className="text-text-secondary leading-relaxed">{restaurant.description}</p>
        </section>

        {restaurant.reviews && restaurant.reviews.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-text mb-4">Reviews</h2>
            <div className="space-y-4">
              {restaurant.reviews.map((r) => (
                <div key={r.id} className="bg-surface border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {r.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-text">{r.user?.name || 'Anonymous'}</p>
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
    </div>
  );
}
