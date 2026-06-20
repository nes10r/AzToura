import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

const select = { id: true, email: true, name: true, avatar: true, phone: true, role: true, isActive: true, createdAt: true };

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id }, select });
    if (!user) return err('User not found', 404);
    return ok(user, 'User retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

async function updateUser(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { id } = await params;
    const body = await req.json();
    const { password: _pw, id: _id, createdAt: _ca, updatedAt: _ua, ...data } = body;
    const user = await prisma.user.update({ where: { id }, data, select });
    return ok(user, 'User updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
export { updateUser as PUT, updateUser as PATCH };

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { id } = await params;
    await prisma.user.delete({ where: { id } });
    return ok(null, 'User deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
