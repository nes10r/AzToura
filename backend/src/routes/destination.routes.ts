import { Router } from 'express';
import {
  getDestinations,
  getDestination,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destination.controller';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getDestinations);
router.get('/:slug', getDestination);
router.post('/', authenticate, authorize('ADMIN'), createDestination);
router.patch('/:id', authenticate, authorize('ADMIN'), updateDestination);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteDestination);

export default router;
