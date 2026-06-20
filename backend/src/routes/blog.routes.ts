import { Router } from 'express';
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blog.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', authenticate, authorize('ADMIN'), createPost);
router.patch('/:id', authenticate, authorize('ADMIN'), updatePost);
router.delete('/:id', authenticate, authorize('ADMIN'), deletePost);

export default router;
