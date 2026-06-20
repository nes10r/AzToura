import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  destinationId: z.string().uuid().optional(),
  tourId: z.string().uuid().optional(),
  hotelId: z.string().uuid().optional(),
  restaurantId: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  blogPostId: z.string().uuid().optional(),
});

export const uploadImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = imageSchema.parse(req.body);
    const image = await prisma.image.create({ data });
    sendSuccess(res, image, 'Image uploaded', 201);
  } catch (err) {
    next(err);
  }
};

export const deleteImage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const image = await prisma.image.findUnique({ where: { id: req.params.id } });
    if (!image) return next(new AppError('Image not found', 404));

    await prisma.image.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Image deleted');
  } catch (err) {
    next(err);
  }
};
