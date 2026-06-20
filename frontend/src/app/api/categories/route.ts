import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function GET() {
  try {
    const data = await prisma.category.findMany({
      include: { _count: { select: { destinations: true, tours: true } } },
      orderBy: { name: 'asc' },
    });
    return ok(data, 'Categories retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    const category = await prisma.category.create({ data: body });
    return ok(category, 'Category created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
