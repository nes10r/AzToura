'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Phone, ExternalLink } from 'lucide-react';
import { Restaurant } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PRICE_RANGE_LABELS } from '@/constants';
import { cn } from '@/lib/utils';

interface Props { restaurant: Restaurant; className?: string }

export default function RestaurantCard({ restaurant, className }: Props) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={cn('group', className)}>
      <article className="bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-hover transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden shrink-0">
          <Image
            src={restaurant.coverImage || '/placeholder.jpg'}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {restaurant.featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="accent">Featured</Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <span className="bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full">
              {PRICE_RANGE_LABELS[restaurant.priceRange]}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
            <MapPin className="w-3 h-3" />
            <span>{restaurant.city}</span>
            <span className="mx-1">·</span>
            <span className="text-primary font-medium">{restaurant.cuisine}</span>
          </div>

          <h3 className="font-bold text-text group-hover:text-primary transition-colors">{restaurant.name}</h3>
          <p className="text-sm text-text-muted mt-1.5 line-clamp-2 flex-1">{restaurant.description}</p>

          <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
            {restaurant.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>{restaurant.phone}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-text-muted">{restaurant.address}</span>
            <Link href={`/restaurants/${restaurant.slug}`}>
              <Button size="sm">
                View <ExternalLink className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
