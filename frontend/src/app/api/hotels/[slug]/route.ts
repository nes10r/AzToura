import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const hotel = await prisma.hotel.findUnique({
      where: isUUID(slug) ? { id: slug } : { slug },
      include: { destination: true },
    });
    if (!hotel) return err('Hotel not found', 404);
    return ok(hotel, 'Hotel retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    const body = await req.json();
    const hotel = await prisma.hotel.update({
      where: { id: slug },
      data: body,
      include: { destination: true },
    });
    return ok(hotel, 'Hotel updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    await prisma.hotel.delete({ where: { id: slug } });
    return ok(null, 'Hotel deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
