import { Router } from 'express';
import {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
} from '../controllers/tour.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getTours);
router.get('/:slug', getTour);
router.post('/', authenticate, authorize('ADMIN'), createTour);
router.patch('/:id', authenticate, authorize('ADMIN'), updateTour);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteTour);

export default router;
