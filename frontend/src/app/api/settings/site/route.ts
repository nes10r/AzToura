import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { siteName: 'Azerbaijan Tourism', metaDescription: 'Discover Azerbaijan' },
      });
    }
    return ok(settings);
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function PUT(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      settings = await prisma.siteSettings.update({ where: { id: settings.id }, data: body });
    } else {
      settings = await prisma.siteSettings.create({ data: body });
    }
    return ok(settings, 'Settings updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
