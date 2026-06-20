import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const folder = req.nextUrl.searchParams.get('folder') || 'general';
    const search = req.nextUrl.searchParams.get('search') || '';
    const where: Record<string, unknown> = { folder };
    if (search) where.name = { contains: search, mode: 'insensitive' };
    const files = await prisma.mediaFile.findMany({ where, orderBy: { createdAt: 'desc' } });
    return ok(files, 'Media files retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { user, response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    const file = await prisma.mediaFile.create({
      data: { ...body, uploadedBy: user!.id },
    });
    return ok(file, 'File added', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
