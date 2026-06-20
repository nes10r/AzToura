import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <MapPin className="w-10 h-10 text-primary" />
      </div>
      <h1 className="text-6xl font-bold text-text mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-text mb-4">Page Not Found</h2>
      <p className="text-text-secondary max-w-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button size="lg">Go Home</Button>
        </Link>
        <Link href="/destinations">
          <Button variant="outline" size="lg">Explore Destinations</Button>
        </Link>
      </div>
    </div>
  );
}
