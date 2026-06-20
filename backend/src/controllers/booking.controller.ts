import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { BookingStatus, Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const bookingSchema = z.object({
  tourId: z.string().uuid().optional(),
  hotelId: z.string().uuid().optional(),
  restaurantId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  guests: z.number().int().positive().optional(),
  totalPrice: z.number().positive(),
  notes: z.string().optional(),
});

const include = {
  tour: true,
  hotel: true,
  restaurant: true,
  event: true,
  user: { select: { id: true, name: true, email: true } },
};

export const getBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const isAdmin = req.user!.role === Role.ADMIN;

    const where = isAdmin ? {} : { userId: req.user!.userId };

    const [total, data] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    sendSuccess(res, data, 'Bookings retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const getBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id }, include });
    if (!booking) return next(new AppError('Booking not found', 404));

    if (req.user!.role !== Role.ADMIN && booking.userId !== req.user!.userId) {
      return next(new AppError('Forbidden', 403));
    }

    sendSuccess(res, booking, 'Booking retrieved');
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const raw = bookingSchema.parse(req.body);
    const data = {
      ...raw,
      userId: req.user!.userId,
      startDate: new Date(raw.startDate),
      ...(raw.endDate && { endDate: new Date(raw.endDate) }),
    };

    const booking = await prisma.booking.create({ data, include });
    sendSuccess(res, booking, 'Booking created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body as { status: BookingStatus };
    if (!Object.values(BookingStatus).includes(status)) {
      return next(new AppError('Invalid booking status', 400));
    }

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
      include,
    });

    sendSuccess(res, booking, 'Booking status updated');
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return next(new AppError('Booking not found', 404));

    if (req.user!.role !== Role.ADMIN && booking.userId !== req.user!.userId) {
      return next(new AppError('Forbidden', 403));
    }

    await prisma.booking.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Booking deleted');
  } catch (err) {
    next(err);
  }
};
