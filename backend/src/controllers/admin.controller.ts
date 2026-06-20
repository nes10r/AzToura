import { Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/response';

export const getStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const [users, destinations, tours, hotels, restaurants, events, bookings, reviews] = await Promise.all([
      prisma.user.count(),
      prisma.destination.count(),
      prisma.tour.count(),
      prisma.hotel.count(),
      prisma.restaurant.count(),
      prisma.event.count(),
      prisma.booking.count(),
      prisma.review.count(),
    ]);

    sendSuccess(res, { users, destinations, tours, hotels, restaurants, events, bookings, reviews }, 'Stats retrieved');
  } catch (err) {
    next(err);
  }
};

export const getRecentBookings = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        tour: { select: { id: true, name: true } },
        hotel: { select: { id: true, name: true } },
      },
    });
    sendSuccess(res, bookings, 'Recent bookings retrieved');
  } catch (err) {
    next(err);
  }
};

export const getPopularDestinations = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const destinations = await prisma.destination.findMany({
      take: 5,
      orderBy: { tours: { _count: 'desc' } },
      include: { _count: { select: { tours: true, hotels: true, reviews: true } } },
    });
    sendSuccess(res, destinations, 'Popular destinations retrieved');
  } catch (err) {
    next(err);
  }
};

export const getRevenue = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await prisma.booking.aggregate({ _sum: { totalPrice: true } });
    const total = result._sum.totalPrice ?? 0;
    sendSuccess(res, { total }, 'Revenue retrieved');
  } catch (err) {
    next(err);
  }
};
