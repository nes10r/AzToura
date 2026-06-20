import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAdmin } from '@/lib/api-helpers';

const include = {
  category: true,
  images: true,
  _count: { select: { tours: true, tourStops: true, hotels: true, restaurants: true, reviews: true } },
};

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const region = s.get('region'); const category = s.get('category');
    const featured = s.get('featured'); const search = s.get('search');

    const where: Record<string, unknown> = {};
    if (region) where.region = { contains: region, mode: 'insensitive' };
    if (category) where.category = { slug: category };
    if (featured === 'true') where.featured = true;
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];

    const [total, data] = await Promise.all([
      prisma.destination.count({ where }),
      prisma.destination.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);
    return ok(data, 'Destinations retrieved', 200, paginate(page, limit, total), 60);
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { user, response } = requireAdmin(req);
  if (response) return response;
  void user;
  try {
    const body = await req.json();
    const existing = await prisma.destination.findUnique({ where: { slug: body.slug } });
    if (existing) return err('Slug already in use', 409);
    const destination = await prisma.destination.create({ data: body, include });
    return ok(destination, 'Destination created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
