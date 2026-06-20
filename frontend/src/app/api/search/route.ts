import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || '';
    if (!q || q.length < 2) return ok({ destinations: [], tours: [], hotels: [], restaurants: [], events: [] });

    const filter = { contains: q, mode: 'insensitive' as const };
    const [destinations, tours, hotels, restaurants, events] = await Promise.all([
      prisma.destination.findMany({ where: { OR: [{ name: filter }, { description: filter }] }, take: 5 }),
      prisma.tour.findMany({ where: { OR: [{ name: filter }, { description: filter }] }, take: 5, include: { destination: true } }),
      prisma.hotel.findMany({ where: { OR: [{ name: filter }, { description: filter }] }, take: 5, include: { destination: true } }),
      prisma.restaurant.findMany({ where: { OR: [{ name: filter }, { description: filter }] }, take: 5, include: { destination: true } }),
      prisma.event.findMany({ where: { OR: [{ name: filter }, { description: filter }] }, take: 5, include: { destination: true } }),
    ]);
    return ok({ destinations, tours, hotels, restaurants, events });
  } catch (e) { console.error(e); return err('Server error', 500); }
}
