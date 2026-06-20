import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAuth } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const tourId = s.get('tourId'); const destinationId = s.get('destinationId');

    const where: Record<string, unknown> = {};
    if (tourId) where.tourId = tourId;
    if (destinationId) where.destinationId = destinationId;

    const [total, data] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, avatar: true } }, tour: { select: { id: true, name: true } } },
      }),
    ]);
    return ok(data, 'Reviews retrieved', 200, paginate(page, limit, total));
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const body = await req.json();
    const review = await prisma.review.create({
      data: { ...body, userId: user!.id },
      include: { user: { select: { id: true, name: true, avatar: true } }, tour: { select: { id: true, name: true } } },
    });
    return ok(review, 'Review created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
