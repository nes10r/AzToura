'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { Event } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatPrice, cn } from '@/lib/utils';

interface Props { event: Event; className?: string }

export default function EventCard({ event, className }: Props) {
  const isFree = event.price === 0;
  const isPast = new Date(event.endDate) < new Date();

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className={cn('group', className)}>
      <article className={cn(
        'bg-surface rounded-2xl overflow-hidden border border-border hover:shadow-hover transition-shadow duration-300 h-full flex flex-col',
        isPast && 'opacity-70',
      )}>
        <div className="relative h-48 overflow-hidden shrink-0">
          <Image
            src={event.coverImage || '/placeholder.jpg'}
            alt={event.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            {event.featured && <Badge variant="accent">Featured</Badge>}
            {isPast && <Badge variant="muted">Past</Badge>}
          </div>
          {event.category && (
            <div className="absolute top-3 right-3">
              <Badge variant="secondary">{event.category.name}</Badge>
            </div>
          )}
          {/* Date badge */}
          <div className="absolute bottom-3 left-3 bg-white rounded-xl px-3 py-1.5 text-center min-w-[52px]">
            <p className="text-xs font-bold text-primary uppercase">
              {new Date(event.startDate).toLocaleString('en', { month: 'short' })}
            </p>
            <p className="text-lg font-bold text-text leading-tight">
              {new Date(event.startDate).getDate()}
            </p>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-1 text-xs text-text-muted mb-1">
            <MapPin className="w-3 h-3" />
            <span>{event.city}</span>
          </div>

          <h3 className="font-bold text-text group-hover:text-primary transition-colors line-clamp-2">{event.name}</h3>
          <p className="text-sm text-text-muted mt-1.5 line-clamp-2 flex-1">{event.description}</p>

          <div className="flex items-center gap-1 mt-3 text-xs text-text-secondary">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(event.startDate)} – {formatDate(event.endDate)}</span>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1">
              <Ticket className="w-3.5 h-3.5 text-primary" />
              <span className="font-bold text-primary text-sm">
                {isFree ? 'Free' : `From ${formatPrice(event.price)}`}
              </span>
            </div>
            <Link href={`/events/${event.slug}`}>
              <Button size="sm" disabled={isPast}>
                {isPast ? 'Ended' : 'Get Tickets'}
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
