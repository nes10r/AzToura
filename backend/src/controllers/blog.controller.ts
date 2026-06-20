import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../types';
import { sendSuccess, sendError, parsePagination, paginate } from '../utils/response';
import { AppError } from '../middlewares/errorHandler';

const postSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(5),
  content: z.string().min(50),
  excerpt: z.string().optional(),
  coverImage: z.string().url().optional(),
  published: z.boolean().optional(),
});

const include = {
  author: { select: { id: true, name: true, avatar: true } },
  images: true,
};

export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page, limit, skip } = parsePagination(req.query.page as string, req.query.limit as string);
    const { search, published } = req.query as Record<string, string>;

    const where = {
      ...(published !== 'false' && { published: true }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { excerpt: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [total, data] = await Promise.all([
      prisma.blogPost.count({ where }),
      prisma.blogPost.findMany({ where, include, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    ]);

    sendSuccess(res, data, 'Posts retrieved', 200, paginate(page, limit, total));
  } catch (err) {
    next(err);
  }
};

export const getPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const param = req.params.slug;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(param);
    const post = await prisma.blogPost.findUnique({ where: isUUID ? { id: param } : { slug: param }, include });
    if (!post || !post.published) return next(new AppError('Post not found', 404));
    sendSuccess(res, post, 'Post retrieved');
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = postSchema.parse(req.body);
    const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
    if (existing) return sendError(res, 'Slug already in use', 409);

    const post = await prisma.blogPost.create({ data: { ...data, authorId: req.user!.userId }, include });
    sendSuccess(res, post, 'Post created', 201);
  } catch (err) {
    next(err);
  }
};

export const updatePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = postSchema.partial().parse(req.body);
    const post = await prisma.blogPost.update({ where: { id: req.params.id }, data, include });
    sendSuccess(res, post, 'Post updated');
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Post deleted');
  } catch (err) {
    next(err);
  }
};
