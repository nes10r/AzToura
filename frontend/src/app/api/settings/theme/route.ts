import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ok, err, requireAdmin } from '@/lib/api-helpers';

export async function GET() {
  try {
    let settings = await prisma.themeSettings.findFirst();
    if (!settings) {
      settings = await prisma.themeSettings.create({ data: {} });
    }
    return ok(settings);
  } catch (e) { console.error(e); return err('Server error', 500); }
}

export async function PUT(req: NextRequest) {
  const { response } = requireAdmin(req);
  if (response) return response;
  try {
    const body = await req.json();
    let settings = await prisma.themeSettings.findFirst();
    if (settings) {
      settings = await prisma.themeSettings.update({ where: { id: settings.id }, data: body });
    } else {
      settings = await prisma.themeSettings.create({ data: body });
    }
    return ok(settings, 'Theme settings updated');
  } catch (e) { console.error(e); return err('Server error', 500); }
}
