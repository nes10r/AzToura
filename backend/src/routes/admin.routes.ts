import { Router } from 'express';
import { getStats, getRecentBookings, getPopularDestinations, getRevenue } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/stats', getStats);
router.get('/recent-bookings', getRecentBookings);
router.get('/popular-destinations', getPopularDestinations);
router.get('/revenue', getRevenue);

export default router;
