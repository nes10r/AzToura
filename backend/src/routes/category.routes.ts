import { Router } from 'express';
import { prisma } from '../config/prisma';
import { sendSuccess } from '../utils/response';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    sendSuccess(res, categories, 'Categories retrieved');
  } catch (err) { next(err); }
});

router.post('/', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    const { name, slug, description, icon } = req.body;
    const category = await prisma.category.create({ data: { name, slug, description, icon } });
    sendSuccess(res, category, 'Category created', 201);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, authorize('ADMIN'), async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    sendSuccess(res, null, 'Category deleted');
  } catch (err) { next(err); }
});

export default router;
