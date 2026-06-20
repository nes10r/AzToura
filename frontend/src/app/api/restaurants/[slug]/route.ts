import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const restaurant = await prisma.restaurant.findUnique({
      where: isUUID(slug) ? { id: slug } : { slug },
      include: { destination: true },
    });
    if (!restaurant) return err('Restaurant not found', 404);
    return ok(restaurant, 'Restaurant retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    const body = await req.json();
    const restaurant = await prisma.restaurant.update({
      where: { id: slug },
      data: body,
      include: { destination: true },
    });
    return ok(restaurant, 'Restaurant updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    await prisma.restaurant.delete({ where: { id: slug } });
    return ok(null, 'Restaurant deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
