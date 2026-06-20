import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAdmin } from '@/lib/api-helpers';

const select = { id: true, email: true, name: true, avatar: true, phone: true, role: true, isActive: true, createdAt: true };

export async function GET(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const search = s.get('search');

    const where: Record<string, unknown> = {};
    if (search) where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];

    const [total, data] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({ where, select, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);
    return ok(data, 'Users retrieved', 200, paginate(page, limit, total));
  } catch (e) { console.error(e); return err('Server error', 500); }
}
