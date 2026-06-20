import { Router } from 'express';
import {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} from '../controllers/booking.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/', getBookings);
router.get('/:id', getBooking);
router.post('/', createBooking);
router.patch('/:id/status', authorize('ADMIN'), updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;
