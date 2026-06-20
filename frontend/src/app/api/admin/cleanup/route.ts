import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

// One-time cleanup: deletes bookings/reviews/favorites belonging to seed/fake users
export async function DELETE(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    // Find fake users (example.com emails from seed data)
    const fakeUsers = await prisma.user.findMany({
      where: { email: { contains: '@example.com' } },
      select: { id: true, email: true },
    });
    const fakeIds = fakeUsers.map(u => u.id);

    if (fakeIds.length === 0) return ok({ deleted: 0 }, 'No fake data found');

    const [bookings, reviews, favorites] = await Promise.all([
      prisma.booking.deleteMany({ where: { userId: { in: fakeIds } } }),
      prisma.review.deleteMany({ where: { userId: { in: fakeIds } } }),
      prisma.favorite.deleteMany({ where: { userId: { in: fakeIds } } }),
    ]);

    // Optionally delete the fake users themselves
    await prisma.user.deleteMany({ where: { id: { in: fakeIds } } });

    return ok(
      { users: fakeIds.length, bookings: bookings.count, reviews: reviews.count, favorites: favorites.count },
      'Fake data cleaned up'
    );
  } catch (e) { console.error(e); return err('Server error', 500); }
}
