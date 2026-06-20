import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const event = await prisma.event.findUnique({
      where: isUUID(slug) ? { id: slug } : { slug },
      include: { destination: true },
    });
    if (!event) return err('Event not found', 404);
    return ok(event, 'Event retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

async function updateEvent(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    const body = await req.json();
    const { id: _id, createdAt: _ca, updatedAt: _ua, destination: _d, ...data } = body;
    const event = await prisma.event.update({ where: { id: slug }, data, include: { destination: true } });
    return ok(event, 'Event updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
export { updateEvent as PUT, updateEvent as PATCH };

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    await prisma.event.delete({ where: { id: slug } });
    return ok(null, 'Event deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
