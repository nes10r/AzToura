'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';
import { Destination } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface Props {
  destination: Destination;
  className?: string;
}

export default function DestinationCard({ destination, className }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={cn('group', className)}
    >
      <Link href={`/destinations/${destination.slug}`}>
        <article className="bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-hover transition-shadow duration-300">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <Image
              src={destination.coverImage || '/placeholder.jpg'}
              alt={destination.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {destination.featured && (
              <div className="absolute top-3 left-3">
                <Badge variant="accent">Featured</Badge>
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 text-white text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination.region}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-lg text-text group-hover:text-primary transition-colors">
              {destination.name}
            </h3>
            <p className="text-sm text-text-muted mt-1 line-clamp-2">{destination.description}</p>

            {destination._count && (
              <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
                <span>{(destination._count.tours || 0) + ((destination._count as any).tourStops || 0)} tours</span>
                <span>{destination._count.hotels} hotels</span>
                <div className="flex items-center gap-1 ml-auto">
                  <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                  <span className="font-medium">{destination._count.reviews} reviews</span>
                </div>
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
