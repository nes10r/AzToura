import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const authorSelect = { author: { select: { id: true, name: true, avatar: true } } };

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await prisma.blogPost.findUnique({
      where: isUUID(slug) ? { id: slug } : { slug },
      include: authorSelect,
    });
    if (!post) return err('Post not found', 404);
    return ok(post, 'Post retrieved');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    const body = await req.json();
    const post = await prisma.blogPost.update({ where: { id: slug }, data: body, include: authorSelect });
    return ok(post, 'Post updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    const body = await req.json();
    const { id: _id, authorId: _aid, createdAt: _ca, updatedAt: _ua, author: _au, category: _cat, featured: _f, tags: _t, metaTitle: _mt, metaDescription: _md, ...data } = body;
    const post = await prisma.blogPost.update({ where: { id: slug }, data, include: authorSelect });
    return ok(post, 'Post updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { slug } = await params;
    await prisma.blogPost.delete({ where: { id: slug } });
    return ok(null, 'Post deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
