import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAdmin } from '@/lib/api-helpers';

const include = {
  destination: true, category: true, images: true,
  additionalDestinations: { include: { destination: true } },
  _count: { select: { reviews: true, bookings: true } },
};

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const destination = s.get('destination'); const category = s.get('category');
    const featured = s.get('featured'); const search = s.get('search');
    const minPrice = s.get('minPrice'); const maxPrice = s.get('maxPrice');

    const where: Record<string, unknown> = {};
    if (destination) where.destination = { slug: destination };
    if (category) where.category = { slug: category };
    if (featured === 'true') where.featured = true;
    if (minPrice) where.price = { gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...((where.price as Record<string,unknown>) || {}), lte: parseFloat(maxPrice) };
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];

    const [total, data] = await Promise.all([
      prisma.tour.count({ where }),
      prisma.tour.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);
    return ok(data, 'Tours retrieved', 200, paginate(page, limit, total), 60);
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    const existing = await prisma.tour.findUnique({ where: { slug: body.slug } });
    if (existing) return err('Slug already in use', 409);
    const { additionalDestinations: _ad, additionalDestinationIds: _adi, ...data } = body;
    const tour = await prisma.tour.create({ data, include });
    return ok(tour, 'Tour created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
