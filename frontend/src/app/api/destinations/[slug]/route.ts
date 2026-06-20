import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

const include = {
  category: true, images: true,
  _count: { select: { tours: true, tourStops: true, hotels: true, restaurants: true, reviews: true } },
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const destination = await prisma.destination.findUnique({
      where: isUUID(slug) ? { id: slug } : { slug },
      include: {
        ...include,
        tours: { take: 6, orderBy: { createdAt: 'desc' }, include: { destination: true, category: true, _count: { select: { reviews: true } } } },
        tourStops: { include: { tour: { include: { destination: true, category: true, _count: { select: { reviews: true } } } } }, orderBy: { order: 'asc' }, take: 6 },
        hotels: { take: 6, orderBy: { createdAt: 'desc' } },
        restaurants: { take: 6, orderBy: { createdAt: 'desc' } },
        events: { where: { startDate: { gte: new Date() } }, take: 6 },
        reviews: { include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
    if (!destination) return err('Destination not found', 404);

    const primaryTours = (destination as unknown as Record<string, unknown[]>).tours || [];
    const stopTours = ((destination as unknown as Record<string, { tour: unknown }[]>).tourStops || []).map(s => s.tour);
    const ids = new Set(primaryTours.map((t: unknown) => (t as { id: string }).id));
    (destination as unknown as Record<string, unknown>).tours = [...primaryTours, ...stopTours.filter((t: unknown) => !ids.has((t as { id: string }).id))];

    return ok(destination, 'Destination retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

async function updateDestination(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    const body = await req.json();
    const { id: _id, createdAt: _ca, updatedAt: _ua, category: _cat, images: _img, _count: _c, ...data } = body;
    const destination = await prisma.destination.update({ where: { id: slug }, data, include });
    return ok(destination, 'Destination updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
export { updateDestination as PUT, updateDestination as PATCH };

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    await prisma.destination.delete({ where: { id: slug } });
    return ok(null, 'Destination deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
