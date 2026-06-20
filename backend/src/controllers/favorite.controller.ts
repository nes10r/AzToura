import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const favoriteSchema = z.object({
  destinationId: z.string().uuid().optional(),
  tourId: z.string().uuid().optional(),
  hotelId: z.string().uuid().optional(),
  restaurantId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
});

const include = {
  destination: true,
  tour: true,
  hotel: true,
  restaurant: true,
  event: true,
};

export const getFavorites = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      include,
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, favorites, 'Favorites retrieved');
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = favoriteSchema.parse(req.body);
    const favorite = await prisma.favorite.create({
      data: { ...data, userId: req.user!.userId },
      include,
    });
    sendSuccess(res, favorite, 'Added to favorites', 201);
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const favorite = await prisma.favorite.findUnique({ where: { id: req.params.id } });
    if (!favorite) return next(new AppError('Favorite not found', 404));
    if (favorite.userId !== req.user!.userId) return next(new AppError('Forbidden', 403));

    await prisma.favorite.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Removed from favorites');
  } catch (err) {
    next(err);
  }
};
