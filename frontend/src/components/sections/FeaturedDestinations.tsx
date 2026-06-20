'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Destination } from '@/types';
import { destinationsService } from '@/services/destinations';
import DestinationCard from '@/components/cards/DestinationCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    destinationsService
      .getAll({ featured: true, limit: 6 })
      .then((res) => { if (res.data) setDestinations(res.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-10 lg:mb-12">
          <div>
            <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider">Explore Azerbaijan</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mt-1">Featured Destinations</h2>
            <p className="text-text-secondary mt-1.5 sm:mt-2 text-sm sm:text-base max-w-lg">
              Discover the most breathtaking places Azerbaijan has to offer.
            </p>
          </div>
          <Link href="/destinations" className="self-start sm:self-auto shrink-0">
            <Button variant="outline" size="sm" className="sm:text-base sm:px-4 sm:py-2">
              View All
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {destinations.map((d) => (
              <motion.div key={d.id} variants={fadeUp}>
                <DestinationCard destination={d} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
