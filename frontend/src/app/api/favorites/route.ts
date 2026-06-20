import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAuth } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: user!.id },
      include: { tour: { include: { destination: true, category: true } } },
    });
    return ok(favorites);
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const { tourId } = await req.json();
    const existing = await prisma.favorite.findFirst({ where: { userId: user!.id, tourId } });
    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return ok(null, 'Removed from favorites');
    }
    const fav = await prisma.favorite.create({ data: { userId: user!.id, tourId } });
    return ok(fav, 'Added to favorites', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
