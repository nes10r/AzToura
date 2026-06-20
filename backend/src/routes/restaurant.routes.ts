import { Router } from 'express';
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} from '../controllers/restaurant.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getRestaurants);
router.get('/:slug', getRestaurant);
router.post('/', authenticate, authorize('ADMIN'), createRestaurant);
router.patch('/:id', authenticate, authorize('ADMIN'), updateRestaurant);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteRestaurant);

export default router;
