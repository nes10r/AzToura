import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { id } = await params;
    const body = await req.json();
    const category = await prisma.category.update({ where: { id }, data: body });
    return ok(category, 'Category updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return ok(null, 'Category deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
