import { Router } from 'express';
import { getReviews, createReview, updateReview, deleteReview } from '../controllers/review.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/', getReviews);
router.post('/', authenticate, createReview);
router.patch('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;
