import type { Metadata } from 'next';
import { Suspense } from 'react';
import DestinationsClient from './DestinationsClient';
import { CardSkeleton } from '@/components/ui/Skeleton';

export const metadata: Metadata = {
  title: 'Destinations',
  description: "Explore Azerbaijan's most beautiful destinations — from Baku to the Caucasus mountains.",
};

export default function DestinationsPage() {
  return (
    <Suspense fallback={
      <div className="pt-20 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    }>
      <DestinationsClient />
    </Suspense>
  );
}
