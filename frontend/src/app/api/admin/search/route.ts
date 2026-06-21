import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const q = req.nextUrl.searchParams.get('q') || '';
    if (!q || q.length < 2) return ok([]);

    const f = { contains: q, mode: 'insensitive' as const };

    const [destinations, tours, hotels, restaurants, events, blogs, users] = await Promise.all([
      prisma.destination.findMany({ where: { OR: [{ name: f }, { description: f }] }, take: 4, select: { id: true, name: true, slug: true } }),
      prisma.tour.findMany({ where: { OR: [{ name: f }, { description: f }] }, take: 4, select: { id: true, name: true, slug: true } }),
      prisma.hotel.findMany({ where: { OR: [{ name: f }, { description: f }] }, take: 3, select: { id: true, name: true, slug: true } }),
      prisma.restaurant.findMany({ where: { OR: [{ name: f }, { description: f }] }, take: 3, select: { id: true, name: true, slug: true } }),
      prisma.event.findMany({ where: { OR: [{ name: f }, { description: f }] }, take: 3, select: { id: true, name: true, slug: true } }),
      prisma.blogPost.findMany({ where: { OR: [{ title: f }, { content: f }] }, take: 3, select: { id: true, title: true, slug: true } }),
      prisma.user.findMany({ where: { OR: [{ name: f }, { email: f }] }, take: 3, select: { id: true, name: true, email: true } }),
    ]);

    const results = [
      ...destinations.map(i => ({ type: 'Destination', label: i.name, href: `/admin/content/destinations/${i.id}` })),
      ...tours.map(i => ({ type: 'Tour', label: i.name, href: `/admin/content/tours/${i.id}` })),
      ...hotels.map(i => ({ type: 'Hotel', label: i.name, href: `/admin/content/hotels/${i.id}` })),
      ...restaurants.map(i => ({ type: 'Restaurant', label: i.name, href: `/admin/content/restaurants/${i.id}` })),
      ...events.map(i => ({ type: 'Event', label: i.name, href: `/admin/content/events/${i.id}` })),
      ...blogs.map(i => ({ type: 'Blog', label: i.title, href: `/admin/content/blog/${i.id}` })),
      ...users.map(i => ({ type: 'User', label: `${i.name} (${i.email})`, href: `/admin/users/${i.id}` })),
    ];

    return ok(results);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
