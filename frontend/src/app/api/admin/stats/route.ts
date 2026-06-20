import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const [destinations, tours, hotels, restaurants, events, users, bookings, reviews] = await Promise.all([
      prisma.destination.count(),
      prisma.tour.count(),
      prisma.hotel.count(),
      prisma.restaurant.count(),
      prisma.event.count(),
      prisma.user.count(),
      prisma.booking.count(),
      prisma.review.count(),
    ]);

    const recentBookings = await prisma.booking.findMany({
      take: 8, orderBy: { createdAt: 'desc' },
      include: {
        user:  { select: { name: true, email: true } },
        tour:  { select: { name: true } },
        hotel: { select: { name: true } },
      },
    });

    const now = new Date();
    const monthlyRevenue = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        return prisma.booking.aggregate({
          where: { createdAt: { gte: d, lte: end }, status: 'CONFIRMED' },
          _sum: { totalPrice: true },
        }).then(r => ({ month: d.toLocaleString('default', { month: 'short', year: 'numeric' }), revenue: r._sum.totalPrice || 0 }));
      })
    );

    return ok({
      counts: { destinations, tours, hotels, restaurants, events, users, bookings, reviews },
      recentBookings,
      monthlyRevenue: monthlyRevenue.reverse(),
    });
  } catch (e) { console.error(e); return err('Server error', 500); }
}
