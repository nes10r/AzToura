import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAuth } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const u = await prisma.user.findUnique({
      where: { id: user!.id },
      select: { id: true, email: true, name: true, avatar: true, phone: true, role: true, isActive: true, createdAt: true },
    });
    if (!u) return err('User not found', 404);
    return ok(u);
  } catch (e) {
    console.error(e);
    return err('Server error', 500);
  }
}
