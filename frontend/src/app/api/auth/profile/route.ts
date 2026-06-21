import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAuth } from '@/lib/api-helpers';
import bcrypt from 'bcryptjs';

const select = { id: true, name: true, email: true, avatar: true, phone: true, role: true, createdAt: true };

export async function GET(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const u = await prisma.user.findUnique({ where: { id: user!.id }, select });
    if (!u) return err('User not found', 404);
    return ok(u);
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function PATCH(req: NextRequest) {
  const { user, response } = requireAuth(req);
  if (response) return response;
  try {
    const { name, email, phone, avatar, currentPassword, newPassword } = await req.json();
    const data: Record<string, unknown> = {};
    if (name)   data.name   = name;
    if (email)  data.email  = email;
    if (phone !== undefined) data.phone = phone || null;
    if (avatar !== undefined) data.avatar = avatar || null;

    if (newPassword) {
      if (!currentPassword) return err('Current password required', 400);
      const existing = await prisma.user.findUnique({ where: { id: user!.id } });
      const valid = await bcrypt.compare(currentPassword, existing!.password);
      if (!valid) return err('Current password is incorrect', 400);
      data.password = await bcrypt.hash(newPassword, 12);
    }

    const updated = await prisma.user.update({ where: { id: user!.id }, data, select });
    return ok(updated, 'Profile updated');
  } catch (e: any) {
    if (e?.code === 'P2002') return err('Email already in use', 409);
    console.error(e); return err('Server error', 500);
  }
}
