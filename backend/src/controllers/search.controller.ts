import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

export const globalSearch = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string)?.trim();
    if (!q || q.length < 2) return next(new AppError('Search query must be at least 2 characters', 400));

    const contains = { contains: q, mode: 'insensitive' as const };

    const [destinations, tours, hotels, restaurants, events, posts] = await Promise.all([
      prisma.destination.findMany({
        where: { OR: [{ name: contains }, { description: contains }, { region: contains }] },
        take: 5,
        select: { id: true, name: true, slug: true, coverImage: true, region: true },
      }),
      prisma.tour.findMany({
        where: { OR: [{ name: contains }, { description: contains }] },
        take: 5,
        select: { id: true, name: true, slug: true, coverImage: true, price: true },
      }),
      prisma.hotel.findMany({
        where: { OR: [{ name: contains }, { description: contains }, { city: contains }] },
        take: 5,
        select: { id: true, name: true, slug: true, coverImage: true, city: true, stars: true },
      }),
      prisma.restaurant.findMany({
        where: { OR: [{ name: contains }, { description: contains }, { city: contains }] },
        take: 5,
        select: { id: true, name: true, slug: true, coverImage: true, city: true, cuisine: true },
      }),
      prisma.event.findMany({
        where: { OR: [{ name: contains }, { description: contains }] },
        take: 5,
        select: { id: true, name: true, slug: true, coverImage: true, startDate: true },
      }),
      prisma.blogPost.findMany({
        where: { published: true, OR: [{ title: contains }, { excerpt: contains }] },
        take: 5,
        select: { id: true, title: true, slug: true, coverImage: true, excerpt: true },
      }),
    ]);

    sendSuccess(res, { destinations, tours, hotels, restaurants, events, posts }, 'Search results');
  } catch (err) {
    next(err);
  }
};
