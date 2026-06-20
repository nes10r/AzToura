import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { Role } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

const safeSelect = {
  id: true, name: true, email: true, role: true,
  avatar: true, phone: true, isActive: true, createdAt: true,
};

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const [total, data] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({ select: safeSelect, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);
    sendSuccess(res, data, 'Users retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const isOwner = req.user!.userId === id;
    const isAdmin = req.user!.role === Role.ADMIN;
    if (!isOwner && !isAdmin) return next(new AppError('Forbidden', 403));

    const user = await prisma.user.findUnique({ where: { id }, select: safeSelect });
    if (!user) return next(new AppError('User not found', 404));
    sendSuccess(res, user, 'User retrieved');
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const isOwner = req.user!.userId === id;
    const isAdmin = req.user!.role === Role.ADMIN;
    if (!isOwner && !isAdmin) return next(new AppError('Forbidden', 403));

    const data = updateSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id }, data, select: safeSelect });
    sendSuccess(res, user, 'User updated');
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const isOwner = req.user!.userId === id;
    const isAdmin = req.user!.role === Role.ADMIN;
    if (!isOwner && !isAdmin) return next(new AppError('Forbidden', 403));

    await prisma.user.delete({ where: { id } });
    sendSuccess(res, null, 'User deleted');
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params['id'] as string;
    const { role } = req.body as { role: Role };
    if (!Object.values(Role).includes(role)) return next(new AppError('Invalid role', 400));

    const user = await prisma.user.update({ where: { id }, data: { role }, select: safeSelect });
    sendSuccess(res, user, 'User role updated');
  } catch (err) {
    next(err);
  }
};
