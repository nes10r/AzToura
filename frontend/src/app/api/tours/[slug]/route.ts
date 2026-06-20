import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const include = {
  destination: true, category: true, images: true,
  additionalDestinations: { include: { destination: true } },
  _count: { select: { reviews: true, bookings: true } },
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const tour = await prisma.tour.findUnique({
      where: isUUID(slug) ? { id: slug } : { slug },
      include: {
        ...include,
        additionalDestinations: { include: { destination: true }, orderBy: { order: 'asc' } },
        reviews: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!tour) return err('Tour not found', 404);
    return ok(tour, 'Tour retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

async function updateTour(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    const body = await req.json();
    const { id: _id, createdAt: _ca, updatedAt: _ua, destination: _d, category: _cat, images: _img, additionalDestinations: _ad, reviews: _r, _count: _c, ...data } = body;
    const tour = await prisma.tour.update({ where: { id: slug }, data, include });
    return ok(tour, 'Tour updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
export { updateTour as PUT, updateTour as PATCH };

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    await prisma.tour.delete({ where: { id: slug } });
    return ok(null, 'Tour deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
