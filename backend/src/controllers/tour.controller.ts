import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, sendError, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const activitySchema = z.object({
  time: z.string(),
  title: z.string(),
  desc: z.string(),
  icon: z.string().optional(),
  category: z.string().optional(),
});

const itineraryDaySchema = z.object({
  day: z.number(),
  title: z.string(),
  summary: z.string(),
  activities: z.array(activitySchema),
});

const tourSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  price: z.number().positive(),
  duration: z.number().int().positive(),
  maxGroupSize: z.number().int().positive(),
  coverImage: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  destinationId: z.string().uuid(),
  categoryId: z.string().uuid().optional().nullable(),
  additionalDestinationIds: z.array(z.string().uuid()).optional(),
  // Rich content
  highlights:   z.array(z.string()).optional().nullable(),
  itinerary:    z.array(itineraryDaySchema).optional().nullable(),
  inclusions:   z.object({ included: z.array(z.string()), excluded: z.array(z.string()) }).optional().nullable(),
  faq:          z.array(z.object({ q: z.string(), a: z.string() })).optional().nullable(),
  packingList:  z.array(z.string()).optional().nullable(),
  meetingPoint: z.string().optional().nullable(),
  languages:    z.string().optional().nullable(),
});

const include = {
  destination: true,
  category: true,
  images: true,
  additionalDestinations: { include: { destination: true }, orderBy: { order: 'asc' as const } },
  _count: { select: { bookings: true, reviews: true } },
};

export const getTours = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const { destination, category, minPrice, maxPrice, duration, featured, search } = req.query as Record<string, string>;

    const where = {
      ...(destination && { destination: { slug: destination } }),
      ...(category && { category: { slug: category } }),
      ...(featured === 'true' && { featured: true }),
      ...(minPrice && { price: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      ...(duration && { duration: parseInt(duration) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.tour.count({ where }),
      prisma.tour.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    sendSuccess(res, data, 'Tours retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const getTour = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const param = req.params.slug;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
    const tour = await prisma.tour.findUnique({
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

    if (!tour) return next(new AppError('Tour not found', 404));
    sendSuccess(res, tour, 'Tour retrieved');
  } catch (err) {
    next(err);
  }
};

export const createTour = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { additionalDestinationIds, ...rest } = tourSchema.parse(req.body);
    const existing = await prisma.tour.findUnique({ where: { slug: rest.slug } });
    if (existing) return sendError(res, 'Slug already in use', 409);

    const tour = await prisma.tour.create({
      data: {
        ...rest,
        ...(additionalDestinationIds?.length && {
          additionalDestinations: {
            create: additionalDestinationIds.map((destinationId, order) => ({ destinationId, order })),
          },
        }),
      },
      include,
    });
    sendSuccess(res, tour, 'Tour created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateTour = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { additionalDestinationIds, ...rest } = tourSchema.partial().parse(req.body);
    const tourId = req.params.id;

    const tour = await prisma.tour.update({
      where: { id: tourId },
      data: {
        ...rest,
        ...(additionalDestinationIds !== undefined && {
          additionalDestinations: {
            deleteMany: {},
            create: additionalDestinationIds.map((destinationId, order) => ({ destinationId, order })),
          },
        }),
      },
      include,
    });
    sendSuccess(res, tour, 'Tour updated');
  } catch (err) {
    next(err);
  }
};

export const deleteTour = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.tour.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Tour deleted');
  } catch (err) {
    next(err);
  }
};
