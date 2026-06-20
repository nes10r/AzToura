import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, sendError, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const destinationSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  region: z.string(),
  city: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  coverImage: z.string().optional().nullable(),
  imageSpring: z.string().optional().nullable(),
  imageSummer: z.string().optional().nullable(),
  imageAutumn: z.string().optional().nullable(),
  imageWinter: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  categoryId: z.string().uuid().optional().nullable(),
});

const include = {
  category: true,
  images: true,
  _count: { select: { tours: true, tourStops: true, hotels: true, restaurants: true, reviews: true } },
};

export const getDestinations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const { region, category, featured, search } = req.query as Record<string, string>;

    const where = {
      ...(region && { region: { contains: region, mode: 'insensitive' as const } }),
      ...(category && { category: { slug: category } }),
      ...(featured === 'true' && { featured: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.destination.count({ where }),
      prisma.destination.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    sendSuccess(res, data, 'Destinations retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const getDestination = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const param = req.params.slug;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
    const destination = await prisma.destination.findUnique({
      where: isUUID ? { id: param } : { slug: param },
      include: {
        ...include,
        tours: { take: 6, orderBy: { createdAt: 'desc' }, include: { destination: true, category: true, _count: { select: { reviews: true } } } },
        tourStops: {
          include: {
            tour: { include: { destination: true, category: true, _count: { select: { reviews: true } } } },
          },
          orderBy: { order: 'asc' },
          take: 6,
        },
        hotels: { take: 6, orderBy: { createdAt: 'desc' } },
        restaurants: { take: 6, orderBy: { createdAt: 'desc' } },
        events: { where: { startDate: { gte: new Date() } }, take: 6 },
        reviews: {
          include: { user: { select: { id: true, name: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!destination) return next(new AppError('Destination not found', 404));

    // Merge primary tours + additional stop tours (deduplicated)
    const primaryTours = (destination as any).tours || [];
    const stopTours = ((destination as any).tourStops || []).map((s: any) => s.tour);
    const allTourIds = new Set(primaryTours.map((t: any) => t.id));
    const merged = [...primaryTours, ...stopTours.filter((t: any) => !allTourIds.has(t.id))];
    (destination as any).tours = merged;

    sendSuccess(res, destination, 'Destination retrieved');
  } catch (err) {
    next(err);
  }
};

export const createDestination = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = destinationSchema.parse(req.body);
    const existing = await prisma.destination.findUnique({ where: { slug: data.slug } });
    if (existing) return sendError(res, 'Slug already in use', 409);

    const destination = await prisma.destination.create({ data, include });
    sendSuccess(res, destination, 'Destination created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateDestination = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = destinationSchema.partial().parse(req.body);
    const destination = await prisma.destination.update({ where: { id: req.params.id }, data, include });
    sendSuccess(res, destination, 'Destination updated');
  } catch (err) {
    next(err);
  }
};

export const deleteDestination = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.destination.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Destination deleted');
  } catch (err) {
    next(err);
  }
};
