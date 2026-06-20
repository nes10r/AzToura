import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAdmin } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const destination = s.get('destination'); const featured = s.get('featured');
    const search = s.get('search'); const active = s.get('active');
    const cuisine = s.get('cuisine');

    const where: Record<string, unknown> = {};
    if (destination) where.destination = { slug: destination };
    if (featured === 'true') where.featured = true;
    if (active === 'true') where.active = true;
    if (cuisine) where.cuisine = { contains: cuisine, mode: 'insensitive' };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];

    const [total, data] = await Promise.all([
      prisma.restaurant.count({ where }),
      prisma.restaurant.findMany({ where, include: { destination: true }, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);
    return ok(data, 'Restaurants retrieved', 200, paginate(page, limit, total));
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    const restaurant = await prisma.restaurant.create({ data: body, include: { destination: true } });
    return ok(restaurant, 'Restaurant created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
