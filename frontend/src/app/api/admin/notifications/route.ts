import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // last 7 days

    const [pendingBookings, newReviews] = await Promise.all([
      prisma.booking.findMany({
        where: { status: 'PENDING', createdAt: { gte: since } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } },
          tour: { select: { name: true } },
          hotel: { select: { name: true } },
        },
      }),
      prisma.review.findMany({
        where: { createdAt: { gte: since } },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } },
          destination: { select: { name: true } },
          tour: { select: { name: true } },
        },
      }),
    ]);

    const notifications = [
      ...pendingBookings.map(b => ({
        id: `booking-${b.id}`,
        type: 'booking' as const,
        title: 'New Booking',
        body: `${b.user.name} booked ${b.tour?.name || b.hotel?.name || 'an item'} — $${b.totalPrice}`,
        href: '/admin/bookings',
        createdAt: b.createdAt,
      })),
      ...newReviews.map(r => ({
        id: `review-${r.id}`,
        type: 'review' as const,
        title: 'New Review',
        body: `${r.user.name} left a ${r.rating}★ review on ${r.destination?.name || r.tour?.name || 'an item'}`,
        href: '/admin/reviews',
        createdAt: r.createdAt,
      })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 15);

    return ok(notifications);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
