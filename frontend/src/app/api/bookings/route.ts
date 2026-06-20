import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAuth, requireAdmin } from '@/lib/api-helpers';

const include = { tour: true, user: { select: { id: true, name: true, email: true } } };

export async function GET(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const where = user!.role === 'ADMIN' ? {} : { userId: user!.id };

    const [total, data] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);
    return ok(data, 'Bookings retrieved', 200, paginate(page, limit, total));
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const body = await req.json();
    const booking = await prisma.booking.create({ data: { ...body, userId: user!.id }, include });
    return ok(booking, 'Booking created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
