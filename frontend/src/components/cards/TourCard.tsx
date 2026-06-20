'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, Users, MapPin } from 'lucide-react';
import { Tour } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface Props { tour: Tour; className?: string }

export default function TourCard({ tour, className }: Props) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={cn('group', className)}>
      <article className="bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-hover transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-52 overflow-hidden shrink-0">
          <Image
            src={tour.coverImage || '/placeholder.jpg'}
            alt={tour.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {tour.featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="accent">Popular</Badge>
            </div>
          )}
          {tour.category && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary">{tour.category.name}</Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          {tour.destination && (
            <div className="flex items-center gap-1 text-xs text-text-muted mb-2">
              <MapPin className="w-3 h-3" />
              <span>{tour.destination.name}</span>
            </div>
          )}
          <h3 className="font-bold text-text group-hover:text-primary transition-colors line-clamp-2">
            {tour.name}
          </h3>
          <p className="text-sm text-text-muted mt-2 line-clamp-2 flex-1">{tour.description}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{tour.duration} day{tour.duration > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>Max {tour.maxGroupSize}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div>
              <span className="text-xs text-text-muted">From</span>
              <p className="font-bold text-primary text-lg">{formatPrice(tour.price)}</p>
            </div>
            <Link href={`/tours/${tour.slug}`}>
              <Button size="sm">Book Now</Button>
            </Link>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
