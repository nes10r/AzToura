'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, MapPin, Wifi } from 'lucide-react';
import { Hotel } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatPrice, cn } from '@/lib/utils';

interface Props { hotel: Hotel; className?: string }

export default function HotelCard({ hotel, className }: Props) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={cn('group', className)}>
      <article className="bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-hover transition-shadow duration-300 h-full flex flex-col">
        <div className="relative h-52 overflow-hidden shrink-0">
          <Image
            src={hotel.coverImage || '/placeholder.jpg'}
            alt={hotel.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          {hotel.featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="accent">Top Pick</Badge>
            </div>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-0.5 bg-black/50 rounded-full px-2 py-1">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-accent text-accent" />
            ))}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
            <MapPin className="w-3 h-3" />
            <span>{hotel.city}</span>
          </div>
          <h3 className="font-bold text-text group-hover:text-primary transition-colors">{hotel.name}</h3>
          <p className="text-sm text-text-muted mt-1.5 line-clamp-2 flex-1">{hotel.description}</p>

          {hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {hotel.amenities.slice(0, 3).map((a) => (
                <span key={a} className="text-xs bg-border/60 text-text-secondary px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5" />
                  {a}
                </span>
              ))}
              {hotel.amenities.length > 3 && (
                <span className="text-xs text-text-muted">+{hotel.amenities.length - 3} more</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div>
              <span className="text-xs text-text-muted">Per night</span>
              <p className="font-bold text-primary text-lg">{formatPrice(hotel.pricePerNight)}</p>
            </div>
            <Link href={`/hotels/${hotel.slug}`}>
              <Button size="sm">View</Button>
            </Link>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
