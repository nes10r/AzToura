import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const reviewSchema = z.object({
  destinationId: z.string().uuid().optional(),
  tourId: z.string().uuid().optional(),
  hotelId: z.string().uuid().optional(),
  restaurantId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(10).max(1000),
});

const include = {
  user: { select: { id: true, name: true, avatar: true } },
};

export const getReviews = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const { destinationId, tourId, hotelId, restaurantId, eventId } = req.query as Record<string, string>;

    const where = {
      ...(destinationId && { destinationId }),
      ...(tourId && { tourId }),
      ...(hotelId && { hotelId }),
      ...(restaurantId && { restaurantId }),
      ...(eventId && { eventId }),
    };

    const [total, data] = await Promise.all([
      prisma.review.count({ where }),
      prisma.review.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    sendSuccess(res, data, 'Reviews retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = reviewSchema.parse(req.body);
    const review = await prisma.review.create({
      data: { ...data, userId: req.user!.userId },
      include,
    });
    sendSuccess(res, review, 'Review created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return next(new AppError('Review not found', 404));

    if (req.user!.role !== Role.ADMIN && review.userId !== req.user!.userId) {
      return next(new AppError('Forbidden', 403));
    }

    const data = reviewSchema.partial().pick({ rating: true, comment: true }).parse(req.body);
    const updated = await prisma.review.update({ where: { id: req.params.id }, data, include });
    sendSuccess(res, updated, 'Review updated');
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return next(new AppError('Review not found', 404));

    if (req.user!.role !== Role.ADMIN && review.userId !== req.user!.userId) {
      return next(new AppError('Forbidden', 403));
    }

    await prisma.review.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Review deleted');
  } catch (err) {
    next(err);
  }
};
