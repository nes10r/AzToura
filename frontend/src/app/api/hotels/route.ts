import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAdmin } from '@/lib/api-helpers';

const include = { destination: true };

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const destination = s.get('destination'); const featured = s.get('featured');
    const search = s.get('search'); const active = s.get('active');
    const minPrice = s.get('minPrice'); const maxPrice = s.get('maxPrice');
    const stars = s.get('stars');

    const where: Record<string, unknown> = {};
    if (destination) where.destination = { slug: destination };
    if (featured === 'true') where.featured = true;
    if (active === 'true') where.active = true;
    if (stars) where.stars = parseInt(stars);
    if (minPrice || maxPrice) {
      where.pricePerNight = {};
      if (minPrice) (where.pricePerNight as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.pricePerNight as Record<string, unknown>).lte = parseFloat(maxPrice);
    }
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];

    const [total, data] = await Promise.all([
      prisma.hotel.count({ where }),
      prisma.hotel.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);
    return ok(data, 'Hotels retrieved', 200, paginate(page, limit, total));
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    const hotel = await prisma.hotel.create({ data: body, include });
    return ok(hotel, 'Hotel created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
