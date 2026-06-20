import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';
import { del } from '@vercel/blob';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const { id } = await params;
    const file = await prisma.mediaFile.findUnique({ where: { id } });
    if (!file) return err('File not found', 404);

    // Delete from Vercel Blob if it's a blob URL
    if (file.url && file.url.includes('blob.vercel-storage.com')) {
      try { await del(file.url); } catch {}
    }

    await prisma.mediaFile.delete({ where: { id } });
    return ok(null, 'File deleted');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
