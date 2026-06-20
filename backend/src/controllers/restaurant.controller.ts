import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { PriceRange } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, sendError, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const restaurantSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  city: z.string(),
  address: z.string(),
  cuisine: z.string(),
  priceRange: z.nativeEnum(PriceRange).optional(),
  coverImage: z.string().url().optional().nullable(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  destinationId: z.string().uuid(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
});

const include = {
  destination: true,
  images: true,
  _count: { select: { reviews: true } },
};

export const getRestaurants = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const { city, cuisine, priceRange, featured, search } = req.query as Record<string, string>;

    const where = {
      ...(city && { city: { contains: city, mode: 'insensitive' as const } }),
      ...(cuisine && { cuisine: { contains: cuisine, mode: 'insensitive' as const } }),
      ...(priceRange && { priceRange: priceRange as PriceRange }),
      ...(featured === 'true' && { featured: true }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.restaurant.count({ where }),
      prisma.restaurant.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    sendSuccess(res, data, 'Restaurants retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const getRestaurant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const param = req.params.slug;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
    const restaurant = await prisma.restaurant.findUnique({
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

    if (!restaurant) return next(new AppError('Restaurant not found', 404));
    sendSuccess(res, restaurant, 'Restaurant retrieved');
  } catch (err) {
    next(err);
  }
};

export const createRestaurant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = restaurantSchema.parse(req.body);
    const existing = await prisma.restaurant.findUnique({ where: { slug: data.slug } });
    if (existing) return sendError(res, 'Slug already in use', 409);

    const restaurant = await prisma.restaurant.create({ data, include });
    sendSuccess(res, restaurant, 'Restaurant created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateRestaurant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = restaurantSchema.partial().parse(req.body);
    const restaurant = await prisma.restaurant.update({ where: { id: req.params.id }, data, include });
    sendSuccess(res, restaurant, 'Restaurant updated');
  } catch (err) {
    next(err);
  }
};

export const deleteRestaurant = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.restaurant.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Restaurant deleted');
  } catch (err) {
    next(err);
  }
};
