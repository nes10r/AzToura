export const SITE_NAME = 'Aztoura';
export const SITE_DESCRIPTION = 'Discover the beauty of Azerbaijan — destinations, tours, hotels, restaurants, and unforgettable experiences.';
export const SITE_PHONE = '+994 70 282 82 01';
export const SITE_EMAIL = 'hello@aztoura.az';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const NAV_LINKS = [
  { label: 'Destinations', href: '/destinations' },
  { label: 'Tours', href: '/tours' },
  { label: 'Hotels', href: '/hotels' },
  { label: 'Restaurants', href: '/restaurants' },
  { label: 'Events', href: '/events' },
  { label: 'Blog', href: '/blog' },
] as const;

export const REGIONS = [
  'Absheron',
  'Guba-Khachmaz',
  'Sheki-Zagatala',
  'Ganja-Dashkasan',
  'Aran',
  'Lankaran-Astara',
  'Mountain Shirvan',
  'Karabakh',
  'East Zangazur',
  'Nakhchivan',
] as const;

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed',
};

export const BOOKING_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
};

export const PRICE_RANGE_LABELS: Record<string, string> = {
  BUDGET: '$',
  MODERATE: '$$',
  EXPENSIVE: '$$$',
  LUXURY: '$$$$',
};

export const STARS = [1, 2, 3, 4, 5];
