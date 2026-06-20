import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, parsePagination, paginate, requireAdmin } from '@/lib/api-helpers';

export async function GET(req: NextRequest) {
  try {
    const s = req.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(s.get('page'), s.get('limit'));
    const search = s.get('search');

    const where: Record<string, unknown> = {};
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ];

    const [total, data] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { author: { select: { id: true, name: true, avatar: true } } },
      }),
    ]);
    return ok(data, 'Blog posts retrieved', 200, paginate(page, limit, total));
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function POST(req: NextRequest) {
  const { user, response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    const post = await prisma.blogPost.create({
      data: { ...body, authorId: user!.id },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
    return ok(post, 'Blog post created', 201);
  } catch (e) { console.error(e); return err('Server error', 500); }
}
