import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AuthRequest, AuthPayload } from '../types';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const generateTokens = (payload: AuthPayload) => ({
  accessToken: jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as object),
  refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as object),
});

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      return sendError(res, 'Email already in use', 409);
    }

    const password = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: { ...data, password },
      select: { id: true, name: true, email: true, role: true, avatar: true, createdAt: true },
    });

    const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });

    sendSuccess(res, { user, ...tokens }, 'Registered successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.isActive) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });
    const { password: _p, ...safeUser } = user;

    sendSuccess(res, { user: safeUser, ...tokens }, 'Logged in successfully');
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken: token } = req.body as { refreshToken?: string };
    if (!token) return next(new AppError('Refresh token required', 400));

    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) return next(new AppError('User not found', 401));

    const tokens = generateTokens({ userId: user.id, email: user.email, role: user.role });
    sendSuccess(res, tokens, 'Token refreshed');
  } catch {
    next(new AppError('Invalid refresh token', 401));
  }
};

export const logout = async (_req: AuthRequest, res: Response) => {
  sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, name: true, email: true, role: true, avatar: true, phone: true, createdAt: true },
    });
    if (!user) return next(new AppError('User not found', 404));
    sendSuccess(res, user, 'User retrieved');
  } catch (err) {
    next(err);
  }
};
