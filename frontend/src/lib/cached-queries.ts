import { unstable_cache } from 'next/cache';
import { prisma } from './prisma';

const destInclude = {
  category: true,
  images: true,
  _count: { select: { tours: true, tourStops: true, hotels: true, restaurants: true, reviews: true } },
};

export const getFeaturedDestinations = unstable_cache(
  () => prisma.destination.findMany({
    where: { featured: true },
    take: 6,
    include: destInclude,
    orderBy: { createdAt: 'desc' },
  }),
  ['featured-destinations'],
  { revalidate: 120, tags: ['destinations'] }
);

export const getFeaturedTours = unstable_cache(
  () => prisma.tour.findMany({
    where: { featured: true },
    take: 6,
    include: { destination: true, category: true, _count: { select: { reviews: true } } },
    orderBy: { createdAt: 'desc' },
  }),
  ['featured-tours'],
  { revalidate: 120, tags: ['tours'] }
);

export const getCounts = unstable_cache(
  async () => {
    const [destinations, tours, hotels, restaurants, events, blogs] = await Promise.all([
      prisma.destination.count(),
      prisma.tour.count(),
      prisma.hotel.count(),
      prisma.restaurant.count(),
      prisma.event.count(),
      prisma.blogPost.count(),
    ]);
    return { destinations, tours, hotels, restaurants, events, blogs };
  },
  ['site-counts'],
  { revalidate: 300, tags: ['counts'] }
);

export const getCategories = unstable_cache(
  () => prisma.category.findMany({
    include: { _count: { select: { destinations: true, tours: true } } },
    orderBy: { name: 'asc' },
  }),
  ['categories'],
  { revalidate: 300, tags: ['categories'] }
);
