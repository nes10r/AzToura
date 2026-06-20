import { NextRequest } from 'next/server';
import { put } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function POST(req: NextRequest) {
  const { user, response } = requireAdmin(req);
  if (response) return response;
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) return err('No file provided', 400);

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowed.includes(file.type)) return err('Only image files are allowed', 400);
    if (file.size > 10 * 1024 * 1024) return err('File too large (max 10 MB)', 400);

    const ext = file.name.split('.').pop();
    const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const blob = await put(safeName, file, { access: 'public' });

    const media = await prisma.mediaFile.create({
      data: {
        url: blob.url,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        folder,
        uploadedBy: user!.id,
      },
    });

    return ok(media, 'File uploaded', 201);
  } catch (e) {
    console.error(e);
    if ((e as Error).message?.includes('BLOB_READ_WRITE_TOKEN')) {
      return err('Storage not configured. Please enable Vercel Blob in your project settings.', 503);
    }
    return err('Upload failed', 500);
  }
}
