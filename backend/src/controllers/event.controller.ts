import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, sendError, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const eventSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  city: z.string(),
  address: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  price: z.number().min(0).optional(),
  coverImage: z.string().url().optional(),
  featured: z.boolean().optional(),
  destinationId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const include = {
  destination: true,
  category: true,
  images: true,
  _count: { select: { bookings: true, reviews: true } },
};

export const getEvents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const { city, category, upcoming, featured, search } = req.query as Record<string, string>;

    const where = {
      ...(city && { city: { contains: city, mode: 'insensitive' as const } }),
      ...(category && { category: { slug: category } }),
      ...(upcoming === 'true' && { startDate: { gte: new Date() } }),
      ...(featured === 'true' && { featured: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.event.count({ where }),
      prisma.event.findMany({ where, include, skip, take: limit, orderBy: { startDate: 'asc' } }),
    ]);

    sendSuccess(res, data, 'Events retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const getEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const param = req.params.slug;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
    const event = await prisma.event.findUnique({
      where: isUUID ? { id: param } : { slug: param },
      include: {
        ...include,
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!event) return next(new AppError('Event not found', 404));
    sendSuccess(res, event, 'Event retrieved');
  } catch (err) {
    next(err);
  }
};

export const createEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const raw = eventSchema.parse(req.body);
    const data = { ...raw, startDate: new Date(raw.startDate), endDate: new Date(raw.endDate) };

    const existing = await prisma.event.findUnique({ where: { slug: data.slug } });
    if (existing) return sendError(res, 'Slug already in use', 409);

    const event = await prisma.event.create({ data, include });
    sendSuccess(res, event, 'Event created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const raw = eventSchema.partial().parse(req.body);
    const data = {
      ...raw,
      ...(raw.startDate && { startDate: new Date(raw.startDate) }),
      ...(raw.endDate && { endDate: new Date(raw.endDate) }),
    };

    const event = await prisma.event.update({ where: { id: req.params.id }, data, include });
    sendSuccess(res, event, 'Event updated');
  } catch (err) {
    next(err);
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.event.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Event deleted');
  } catch (err) {
    next(err);
  }
};
