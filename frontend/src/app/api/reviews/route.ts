import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAuth } from '@/lib/api-helpers';

const include = {
  user:        { select: { id: true, name: true, avatar: true, email: true } },
  destination: { select: { id: true, name: true } },
  tour:        { select: { id: true, name: true } },
  hotel:       { select: { id: true, name: true } },
  restaurant:  { select: { id: true, name: true } },
  event:       { select: { id: true, name: true } },
};

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));

    const where: Record<string, unknown> = {};
    if (s.get('tourId'))        where.tourId        = s.get('tourId');
    if (s.get('destinationId')) where.destinationId = s.get('destinationId');
    if (s.get('hotelId'))       where.hotelId       = s.get('hotelId');
    if (s.get('restaurantId'))  where.restaurantId  = s.get('restaurantId');
    if (s.get('eventId'))       where.eventId       = s.get('eventId');

    const [total, data] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, include }),
    ]);
    return ok(data, 'Reviews retrieved', 200, paginate(page, limit, total));
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const body = await req.json();
    const { destinationId, tourId, hotelId, restaurantId, eventId, rating, comment } = body;
    const review = await prisma.review.create({
      data: {
        rating: parseInt(rating),
        comment,
        userId: user!.id,
        ...(destinationId && { destinationId }),
        ...(tourId        && { tourId }),
        ...(hotelId       && { hotelId }),
        ...(restaurantId  && { restaurantId }),
        ...(eventId       && { eventId }),
      },
      include,
    });
    return ok(review, 'Review created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
