import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, sendError, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const hotelSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  city: z.string(),
  address: z.string(),
  stars: z.number().int().min(1).max(5),
  pricePerNight: z.number().positive(),
  coverImage: z.string().url().optional().nullable(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  amenities: z.array(z.string()).optional(),
  destinationId: z.string().uuid(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const include = {
  destination: true,
  images: true,
  _count: { select: { bookings: true, reviews: true } },
};

export const getHotels = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const { city, stars, minPrice, maxPrice, featured, search } = req.query as Record<string, string>;

    const where = {
      ...(city && { city: { contains: city, mode: 'insensitive' as const } }),
      ...(stars && { stars: parseInt(stars) }),
      ...(featured === 'true' && { featured: true }),
      ...(minPrice && { pricePerNight: { gte: parseFloat(minPrice) } }),
      ...(maxPrice && { pricePerNight: { lte: parseFloat(maxPrice) } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.hotel.count({ where }),
      prisma.hotel.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    sendSuccess(res, data, 'Hotels retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const getHotel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const param = req.params.slug;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
    const hotel = await prisma.hotel.findUnique({
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

    if (!hotel) return next(new AppError('Hotel not found', 404));
    sendSuccess(res, hotel, 'Hotel retrieved');
  } catch (err) {
    next(err);
  }
};

export const createHotel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = hotelSchema.parse(req.body);
    const existing = await prisma.hotel.findUnique({ where: { slug: data.slug } });
    if (existing) return sendError(res, 'Slug already in use', 409);

    const hotel = await prisma.hotel.create({ data, include });
    sendSuccess(res, hotel, 'Hotel created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateHotel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = hotelSchema.partial().parse(req.body);
    const hotel = await prisma.hotel.update({ where: { id: req.params.id }, data, include });
    sendSuccess(res, hotel, 'Hotel updated');
  } catch (err) {
    next(err);
  }
};

export const deleteHotel = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.hotel.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Hotel deleted');
  } catch (err) {
    next(err);
  }
};
