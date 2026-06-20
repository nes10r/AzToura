import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/response';

// ── Site Settings ─────────────────────────────────────────────────────────────

export const getSiteSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    let settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: { id: 'singleton' } });
    }
    sendSuccess(res, settings, 'Site settings retrieved');
  } catch (err) {
    next(err);
  }
};

export const updateSiteSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const settings = await prisma.siteSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...req.body },
      update: req.body,
    });
    await logAction(req, 'UPDATE', 'site_settings', 'singleton', req.body);
    sendSuccess(res, settings, 'Site settings updated');
  } catch (err) {
    next(err);
  }
};

// ── Theme Settings ────────────────────────────────────────────────────────────

export const getThemeSettings = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    let theme = await prisma.themeSettings.findUnique({ where: { id: 'singleton' } });
    if (!theme) {
      theme = await prisma.themeSettings.create({ data: { id: 'singleton' } });
    }
    sendSuccess(res, theme, 'Theme settings retrieved');
  } catch (err) {
    next(err);
  }
};

export const updateThemeSettings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const theme = await prisma.themeSettings.upsert({
      where: { id: 'singleton' },
      create: { id: 'singleton', ...req.body },
      update: req.body,
    });
    await logAction(req, 'UPDATE', 'theme_settings', 'singleton', req.body);
    sendSuccess(res, theme, 'Theme settings updated');
  } catch (err) {
    next(err);
  }
};

// ── Media Files ───────────────────────────────────────────────────────────────

export const getMediaFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folder = (req.query['folder'] as string) || undefined;
    const files = await prisma.mediaFile.findMany({
      where: folder ? { folder } : undefined,
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, files, 'Media files retrieved');
  } catch (err) {
    next(err);
  }
};

export const createMediaFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const file = await prisma.mediaFile.create({
      data: { ...req.body, uploadedBy: req.user?.userId },
    });
    sendSuccess(res, file, 'Media file created', 201);
  } catch (err) {
    next(err);
  }
};

export const deleteMediaFile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    await prisma.mediaFile.delete({ where: { id } });
    sendSuccess(res, null, 'Media file deleted');
  } catch (err) {
    next(err);
  }
};

// ── Menu Items ────────────────────────────────────────────────────────────────

export const getMenuItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const menuType = (req.query['menuType'] as string) || undefined;
    const items = await prisma.menuItem.findMany({
      where: menuType ? { menuType } : undefined,
      include: { children: true },
      orderBy: { sortOrder: 'asc' },
    });
    sendSuccess(res, items, 'Menu items retrieved');
  } catch (err) {
    next(err);
  }
};

export const createMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const item = await prisma.menuItem.create({ data: req.body });
    sendSuccess(res, item, 'Menu item created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const item = await prisma.menuItem.update({ where: { id }, data: req.body });
    sendSuccess(res, item, 'Menu item updated');
  } catch (err) {
    next(err);
  }
};

export const deleteMenuItem = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    await prisma.menuItem.delete({ where: { id } });
    sendSuccess(res, null, 'Menu item deleted');
  } catch (err) {
    next(err);
  }
};

// ── Audit Logs ────────────────────────────────────────────────────────────────

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((req.query['page'] as string) || '1');
    const limit = parseInt((req.query['limit'] as string) || '20');
    const resource = (req.query['resource'] as string) || undefined;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: resource ? { resource } : undefined,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where: resource ? { resource } : undefined }),
    ]);
    sendSuccess(res, logs, 'Audit logs retrieved', 200, {
      page, limit, total, totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

// ── Helper ────────────────────────────────────────────────────────────────────

async function logAction(
  req: AuthRequest,
  action: string,
  resource: string,
  resourceId?: string,
  details?: Record<string, unknown>,
) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.userId,
        action,
        resource,
        resourceId,
        details: details ? JSON.stringify(details) : null,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });
  } catch {
    // non-blocking
  }
}
