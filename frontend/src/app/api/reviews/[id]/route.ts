import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id } });
    return ok(null, 'Review deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
