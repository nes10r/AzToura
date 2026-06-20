import { Router } from 'express';
import {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotel.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getHotels);
router.get('/:slug', getHotel);
router.post('/', authenticate, authorize('ADMIN'), createHotel);
router.patch('/:id', authenticate, authorize('ADMIN'), updateHotel);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteHotel);

export default router;
