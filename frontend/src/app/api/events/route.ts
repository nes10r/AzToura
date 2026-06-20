import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAdmin } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const destination = s.get('destination'); const featured = s.get('featured');
    const search = s.get('search'); const upcoming = s.get('upcoming');

    const where: Record<string, unknown> = {};
    if (destination) where.destination = { slug: destination };
    if (featured === 'true') where.featured = true;
    if (upcoming === 'true') where.startDate = { gte: new Date() };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];

    const [total, data] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({ where, include: { destination: true }, skip, take: limit, orderBy: { startDate: 'asc' } }),
    ]);
    return ok(data, 'Events retrieved', 200, paginate(page, limit, total), 60);
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    const event = await prisma.event.create({ data: body, include: { destination: true } });
    return ok(event, 'Event created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
