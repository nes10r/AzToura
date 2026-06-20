import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedDestinations } from '@/lib/cached-queries';
import DestinationGrid from '@/components/cards/DestinationGrid';
import { Button } from '@/components/ui/Button';

export default async function FeaturedDestinations() {
  const destinations = await getFeaturedDestinations();

  return (
    <section className="py-10 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-10 lg:mb-12">
          <div>
            <span className="text-primary font-semibold text-xs sm:text-sm uppercase tracking-wider">Explore Azerbaijan</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text mt-1">Featured Destinations</h2>
            <p className="text-text-secondary mt-1.5 sm:mt-2 text-sm sm:text-base max-w-lg">
              Discover the most breathtaking places Azerbaijan has to offer.
            </p>
          </div>
          <Link href="/destinations" className="self-start sm:self-auto shrink-0">
            <Button variant="outline" size="sm">
              View All <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </Link>
        </div>

        <DestinationGrid destinations={destinations as never} />
      </div>
    </section>
  );
}
