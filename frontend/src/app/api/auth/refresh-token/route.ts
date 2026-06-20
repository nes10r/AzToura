import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signAccess, signRefresh, verifyRefresh } from '@/lib/jwt';
import { ok, err } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    if (!refreshToken) return err('Refresh token required');

    const payload = verifyRefresh(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: payload.id as string } });
    if (!user || !user.isActive) return err('Invalid token', 401);

    const newPayload = { id: user.id, email: user.email, role: user.role };
    return ok({
      accessToken: signAccess(newPayload),
      refreshToken: signRefresh(newPayload),
    });
  } catch {
    return err('Invalid or expired token', 401);
  }
}
